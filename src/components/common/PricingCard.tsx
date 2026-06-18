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

import { updateSubscription } from '../../redux/slices/authSlice';
import { refreshProfile } from '../../utils/helper/refreshProfile';

const { width } = Dimensions.get('window');

const PricingCard = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const { user, subscription } = useSelector((state: any) => state.auth);

  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
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

  // ============================================================
  //  FIXED NAVIGATION FUNCTIONS
  // ============================================================

  // 1. Go to Register with selected plan
  const goToRegister = () => {
    navigation.navigate('Register', {
      selectedPlanId: selectedPlanId,
    });
  };

  // 2. Go to Dashboard after upgrade
  const goToDashboard = () => {
    navigation.navigate('Dashboard');
  };

  // ============================================================
  // SUBSCRIBE HANDLER
  // ============================================================

  const handleSubscribe = useCallback(async () => {
    try {
      if (!selectedPlan) return;

      if (!user) {
        //  FIXED - Direct navigate to Register
        goToRegister();
        return;
      }

      setLoading(true);

      const apiResponse = await upgradePlan(selectedPlan.id);

      const paymentData = apiResponse?.data?.payment;

      if (!paymentData?.order_id) {
        Alert.alert('Error', 'Unable to create payment order');
        return;
      }

      const options = {
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
      };

      const razorpayResponse = await RazorpayCheckout.open(options);

      const verifyPayload = {
        razorpay_payment_id: razorpayResponse?.razorpay_payment_id,
        razorpay_order_id: razorpayResponse?.razorpay_order_id,
        razorpay_signature: razorpayResponse?.razorpay_signature,
        membership_plan_id: selectedPlan.id,
        purchase_type: 'UPGRADE',
      };

      const verifyRes = await verifySubscriptionPayment(verifyPayload);

      if (!verifyRes?.status) {
        Alert.alert(
          'Error',
          verifyRes?.message || 'Payment verification failed',
        );
        return;
      }

      await refreshProfile(dispatch);

      Alert.alert('Success', 'Plan upgraded successfully');

      //  FIXED - Direct navigate to Dashboard
      goToDashboard();
    } catch (error: any) {
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
  }, [selectedPlan, selectedPlanId, navigation, user, dispatch]);

  if (!plans.length) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large" color="#c9060a" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 20,
      }}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Membership Plans</Text>

        <View style={styles.divider} />

        <Text style={styles.subtitle}>
          Choose the best plan for your access
        </Text>
      </View>

      {/* PLANS */}
      <View style={styles.plansGrid}>
        {plans.map(plan => {
          const isSelected = selectedPlanId === plan.id;

          const isFreePlanCard = Number(plan.price) === 0;

          const disableFreePlan = isFreePlanCard && isFreePlanDisabled;

          const features = parseFeatures(plan.feature);

          return (
            <TouchableOpacity
              key={plan.id}
              activeOpacity={0.92}
              disabled={disableFreePlan}
              onPress={() => setSelectedPlanId(plan.id)}
              style={[
                styles.card,

                isSelected && styles.activeCard,

                disableFreePlan && {
                  opacity: 0.55,
                },
              ]}
            >
              {plan.tag ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {disableFreePlan ? 'NOT AVAILABLE' : plan.tag}
                  </Text>
                </View>
              ) : null}

              <View style={styles.cardTop}>
                <Text style={styles.planName}>{plan.name}</Text>

                {subscription?.plan_id === plan.id && (
                  <Text style={styles.currentPlan}>Current Plan</Text>
                )}
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.currency}>₹</Text>

                <Text style={styles.price}>{plan.price}</Text>
              </View>

              <View style={styles.featuresContainer}>
                {features.slice(0, 4).map((item: string, index: number) => (
                  <View key={index} style={styles.featureRow}>
                    <Text style={styles.check}>✓</Text>

                    <Text style={styles.featureText}>{item}</Text>
                  </View>
                ))}
              </View>

              <View
                style={[
                  styles.selectButton,

                  isSelected && {
                    backgroundColor: '#c9060a',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.selectButtonText,

                    isSelected && {
                      color: '#fff',
                    },
                  ]}
                >
                  {isSelected ? 'Selected' : 'Select Plan'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={styles.subscribeBtn}
        activeOpacity={0.88}
        disabled={loading}
        onPress={handleSubscribe}
      >
        <LinearGradient
          colors={['#c9060a', '#9f0407']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.subscribeGradient}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <>
                <Text style={styles.subscribeText}>
                  {user ? 'Upgrade Now' : 'Subscribe Now'}
                </Text>

                <View style={styles.iconCircle}>
                  <Text style={styles.arrow}>→</Text>
                </View>
              </>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PricingCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 18,
  },

  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: 28,
  },

  title: {
    fontSize: width * 0.075,
    fontWeight: '800',
    color: '#111',
  },

  divider: {
    width: 70,
    height: 4,
    backgroundColor: '#c9060a',
    borderRadius: 10,
    marginTop: 10,
  },

  subtitle: {
    color: '#666',
    marginTop: 12,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },

  plansGrid: {
    gap: 18,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: '#ececec',

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 4,
  },

  activeCard: {
    borderColor: '#c9060a',
    borderWidth: 2,
  },

  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#c9060a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
    marginBottom: 18,
  },

  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },

  cardTop: {
    marginBottom: 10,
  },

  planName: {
    fontSize: width * 0.06,
    fontWeight: '800',
    color: '#111',
  },

  currentPlan: {
    marginTop: 8,
    color: '#18b76a',
    fontWeight: '700',
    fontSize: 13,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 10,
  },

  currency: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },

  price: {
    fontSize: width * 0.12,
    fontWeight: '900',
    color: '#111',
    lineHeight: width * 0.12,
  },

  featuresContainer: {
    marginTop: 26,
  },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },

  check: {
    color: '#18b76a',
    fontWeight: '900',
    marginRight: 12,
    marginTop: 1,
  },

  featureText: {
    flex: 1,
    color: '#444',
    fontWeight: '500',
    lineHeight: 22,
    fontSize: 14,
  },

  subscribeBtn: {
    marginTop: 18,
    borderRadius: 16,
    overflow: 'hidden',

    shadowColor: '#c9060a',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 5,
  },

  subscribeGradient: {
    height: 58,
    paddingHorizontal: 18,

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
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },

  iconCircle: {
    position: 'absolute',
    right: 14,

    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.16)',

    justifyContent: 'center',
    alignItems: 'center',
  },

  arrow: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  subscribeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  subscribeLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 4,
  },

  arrowContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },

  selectButton: {
    marginTop: 24,
    backgroundColor: '#f4f4f4',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },

  selectButtonText: {
    fontWeight: '700',
    color: '#555',
    fontSize: 14,
  },
});