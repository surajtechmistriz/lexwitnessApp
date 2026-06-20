import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  Modal,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import RazorpayCheckout from 'react-native-razorpay';

import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { getPlans } from '../../services/api/plans';
import {
  upgradePlan,
  verifySubscriptionPayment,
} from '../../services/api/subscription';
import { refreshProfile } from '../../utils/helper/refreshProfile';
import { useTheme } from '../../redux/hooks/useTheme';

const { width, height } = Dimensions.get('window');

const PricingCard = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();

  const { user, subscription } = useSelector((state: any) => state.auth);

  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number>(2);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await getPlans();
      const data = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : [];
      setPlans(data);
    } catch (error) {
      console.log('PLANS ERROR =>', error);
    }
  };

  const parseFeatures = (feature: string) => {
    if (!feature) return [];
    const matches = feature.match(/<li>(.*?)<\/li>/g);
    if (!matches) return [];
    return matches.map(item => item.replace(/<\/?li>/g, '').trim());
  };

  const selectedPlan = useMemo(() => {
    return plans.find(p => Number(p.id) === Number(selectedPlanId));
  }, [plans, selectedPlanId]);

  const isFreePlanDisabled = useMemo(() => {
    return !!user;
  }, [user]);

  const goToRegister = () => {
    navigation.navigate('Register', {
      selectedPlanId: selectedPlanId,
    });
  };

  const handlePaymentSuccess = async () => {
    await refreshProfile(dispatch);

    navigation.reset({
      index: 0,
      routes: [{ name: 'Dashboard' }],
    });
  };

  const handleSubscribe = useCallback(async () => {
    if (!selectedPlan) return;

    if (!user) {
      goToRegister();
      return;
    }

    try {
      setLoading(true);

      const orderRes = await upgradePlan(selectedPlan.id);
      const paymentData = orderRes?.data?.payment;

      if (!paymentData?.order_id) {
        Alert.alert('Error', 'Unable to create payment order');
        return;
      }

      const razorpayResponse = await RazorpayCheckout.open({
        key: paymentData.razorpay_key,
        amount: Number(paymentData.amount),
        currency: paymentData.currency || 'INR',
        order_id: paymentData.order_id,
        name: 'Lex Witness',
        description: 'Membership Upgrade',
        prefill: {
          name: `${user?.first_name || ''} ${user?.last_name || ''}`,
          email: user?.email || '',
          contact: user?.contact || '',
        },
        theme: {
          color: '#c9060a',
        },
      });

      // Show full screen loader after payment success
      setProcessingPayment(true);

      const verifyPayload = {
        razorpay_payment_id: razorpayResponse?.razorpay_payment_id,
        razorpay_order_id: razorpayResponse?.razorpay_order_id,
        razorpay_signature: razorpayResponse?.razorpay_signature,
        membership_plan_id: selectedPlan.id,
        purchase_type: 'UPGRADE',
      };

      try {
        await verifySubscriptionPayment(verifyPayload);
      } catch (verifyError) {
        console.log('VERIFY ERROR =>', verifyError);
        // Ignore because backend already updates subscription
      }

      await handlePaymentSuccess();
    } catch (error: any) {
      setProcessingPayment(false);

      if (error?.code === 0 || error?.description === 'Payment Cancelled') {
        Alert.alert('Cancelled', 'Payment cancelled');
        return;
      }

      Alert.alert(
        'Error',
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  }, [selectedPlan, user, dispatch, navigation]);

  if (!plans.length) {
    return (
      <View style={[styles.loaderWrap, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>Choose Your Plan</Text>
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            Premium Access
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Select the perfect plan for your needs
          </Text>
        </View>

        {/* Plans Grid */}
        <View style={styles.plansGrid}>
          {plans.map((plan, index) => {
            const isSelected = selectedPlanId === plan.id;
            const isFreePlanCard = Number(plan.price) === 0;
            const disableFreePlan = isFreePlanCard && isFreePlanDisabled;
            const features = parseFeatures(plan.feature);
            const isCurrentPlan = subscription?.plan_id === plan.id;

            return (
              <TouchableOpacity
                key={plan.id}
                activeOpacity={0.9}
                disabled={disableFreePlan}
                onPress={() => setSelectedPlanId(plan.id)}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card,
                    borderColor: isSelected ? '#c9060a' : colors.border,
                  },
                  isSelected && styles.activeCard,
                  disableFreePlan && styles.disabledCard,
                  isCurrentPlan && styles.currentPlanCard,
                ]}
              >
                {/* Badge */}
                {(plan.tag || isCurrentPlan) && (
                  <View style={styles.badgeContainer}>
                    {plan.tag && !disableFreePlan && (
                      <View
                        style={[styles.badge, { backgroundColor: '#c9060a' }]}
                      >
                        <Text style={styles.badgeText}>{plan.tag}</Text>
                      </View>
                    )}
                    {isCurrentPlan && (
                      <View
                        style={[styles.badge, { backgroundColor: '#10b981' }]}
                      >
                        <Text style={styles.badgeText}>Active</Text>
                      </View>
                    )}
                    {disableFreePlan && (
                      <View
                        style={[styles.badge, { backgroundColor: '#6b7280' }]}
                      >
                        <Text style={styles.badgeText}>Unavailable</Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Plan Name */}
                <Text style={[styles.planName, { color: colors.text }]}>
                  {plan.name}
                </Text>

                {/* Price */}
                <View style={styles.priceContainer}>
                  <Text style={[styles.currency, { color: colors.text }]}>
                    ₹
                  </Text>
                  <Text style={[styles.price, { color: colors.text }]}>
                    {plan.price}
                  </Text>
                  {Number(plan.price) > 0 && (
                    <Text
                      style={[styles.pricePeriod, { color: colors.textMuted }]}
                    >
                      /month
                    </Text>
                  )}
                </View>

                {/* Features */}
                <View style={styles.featuresContainer}>
                  {features.slice(0, 4).map((item: string, index: number) => (
                    <View key={index} style={styles.featureRow}>
                      <View style={styles.checkIcon}>
                        <Text style={[styles.check, { color: '#c9060a' }]}>
                          ✓
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.featureText,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {item}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Select Button */}
                <View
                  style={[
                    styles.selectButton,
                    isSelected && styles.selectButtonActive,
                    !isSelected && { backgroundColor: colors.background },
                  ]}
                >
                  <Text
                    style={[
                      styles.selectButtonText,
                      isSelected && styles.selectButtonTextActive,
                      !isSelected && { color: colors.textSecondary },
                    ]}
                  >
                    {isSelected ? 'Selected' : 'Select Plan'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* CTA Button */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity
            style={[styles.subscribeBtn]}
            activeOpacity={0.85}
            disabled={loading || processingPayment}
            onPress={handleSubscribe}
          >
            <LinearGradient
              colors={['#c9060a', '#a80508']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.subscribeGradient}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.subscribeText}>
                    {user ? 'Upgrade Now' : 'Get Started'}
                  </Text>
                  <View style={styles.iconCircle}>
                    <Text style={styles.arrow}>→</Text>
                  </View>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {!user && (
            <Text style={[styles.footerNote, { color: colors.textMuted }]}>
              No credit card required • Cancel anytime
            </Text>
          )}
        </View>
      </ScrollView>

    <Modal
  visible={processingPayment}
  transparent
  animationType="fade"
>
  <View style={styles.paymentOverlay}>
    <ActivityIndicator size="large" color="#fff" />

    <Text style={styles.paymentText}>
      Processing Payment...
    </Text>

    <Text style={styles.paymentSubText}>
      Please wait while we update your subscription
    </Text>
  </View>
</Modal>
    </>
  );
};

export default PricingCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    paddingTop: 10,
  },
  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Header Styles
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 8,
  },
  headerBadge: {
    backgroundColor: '#c9060a',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  headerBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },

  // Plans Grid
  plansGrid: {
    gap: 16,
  },

  // Card Styles
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 3,
    position: 'relative',
  },
  activeCard: {
    borderColor: '#c9060a',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 6,
  },
  currentPlanCard: {
    borderColor: '#10b981',
  },
  disabledCard: {
    opacity: 0.5,
  },

  // Badge Styles
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },

  // Plan Name
  planName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },

  // Price Styles
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  currency: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  price: {
    fontSize: 36,
    fontWeight: '900',
    lineHeight: 40,
  },
  pricePeriod: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
    marginBottom: 6,
  },

  // Features
  featuresContainer: {
    gap: 10,
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(201, 6, 10, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  check: {
    fontSize: 12,
    fontWeight: '700',
  },
  featureText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },

  // Select Button
  selectButton: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectButtonActive: {
    backgroundColor: '#c9060a',
    borderColor: '#c9060a',
  },
  selectButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  selectButtonTextActive: {
    color: '#fff',
  },

  // CTA Section
  ctaContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  subscribeBtn: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#c9060a',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  subscribeGradient: {
    height: 56,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  subscribeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  iconCircle: {
    position: 'absolute',
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  footerNote: {
    fontSize: 12,
    marginTop: 16,
    textAlign: 'center',
  },

paymentOverlay: {
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.75)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
  elevation: 9999,
},

  paymentText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 20,
  },

  paymentSubText: {
    color: '#ddd',
    fontSize: 14,
    marginTop: 8,
  },
});
