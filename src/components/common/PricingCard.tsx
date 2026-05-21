import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import RazorpayCheckout from 'react-native-razorpay';

import { useNavigation } from '@react-navigation/native';

import { useDispatch, useSelector } from 'react-redux';
import { getPlans } from '../../services/api/plans';
import { renewPlan, upgradePlan, verifySubscriptionPayment } from '../../services/api/subscription';
import { setSubscription } from '../../redux/slices/subscriptionSlice';

// import {
//   upgradePlan,
//   renewPlan,
//   verifySubscriptionPayment,
// } from '../../services/subscription';

// import { getPlans } from '../../services/plans';

// import { setSubscription } from '../../redux/slices/authSlice';

const PricingCard = () => {
  const navigation = useNavigation<any>();

  const dispatch = useDispatch();

  const { user, subscription, isAuthenticated } =
    useSelector((state: any) => state.auth);

  const [plans, setPlans] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const [selectedPlanId, setSelectedPlanId] =
    useState<number>(2);

  /* ---------------- FETCH PLANS ---------------- */

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

  /* ---------------- HELPERS ---------------- */

  const parseFeatures = (feature: string) => {
    if (!feature) return [];

    return feature
      .replace(/<[^>]*>/g, '')
      .split('\n')
      .filter(Boolean);
  };

  const activeSubscription = subscription;

  const selectedPlan = useMemo(() => {
    return plans.find(
      p => Number(p.id) === Number(selectedPlanId),
    );
  }, [plans, selectedPlanId]);

  const isFreePlanDisabled = useMemo(() => {
    return isAuthenticated === true;
  }, [isAuthenticated]);

  /* ---------------- SUBSCRIBE ---------------- */

const handleSubscribe = useCallback(async () => {
  try {
    const selectedPlan = plans.find(
      (p) => Number(p.id) === Number(selectedPlanId)
    );

    if (!selectedPlan) return;

    const isFreePlan = Number(selectedPlan.price) === 0;

    // ❌ free plan blocked for logged users
    if (isFreePlan && isAuthenticated) {
      Alert.alert("Free Plan", "Not available for existing users");
      return;
    }

    // 🔐 NOT LOGGED IN → REGISTER FLOW
    if (!isAuthenticated) {
      navigation.navigate("Register", {
        selectedPlanId,
      });
      return;
    }

    setLoading(true);

    const subscriptionId = activeSubscription?.id;
    const isExpired =
      activeSubscription?.status?.toUpperCase() === "EXPIRED" ||
      (activeSubscription?.end_date &&
        new Date(activeSubscription.end_date) < new Date());

    let apiResponse;
    let purchaseType: "NEW" | "UPGRADE" = "NEW";

    // ONLY TWO CASES NOW
    if (!subscriptionId) {
      purchaseType = "NEW";
      apiResponse = await upgradePlan(selectedPlan.id);
    } else {
      purchaseType = "UPGRADE";
      apiResponse = await upgradePlan(selectedPlan.id);
    }

    const paymentData = apiResponse?.data?.payment;

    if (!paymentData) {
      Alert.alert("Error", "Payment failed");
      return;
    }

    const options = {
      key: paymentData.razorpay_key,
      amount: paymentData.amount,
      currency: paymentData.currency || "INR",
      order_id: paymentData.order_id,
      name: "Lex Witness",
      prefill: {
        name: `${user?.first_name || ""} ${user?.last_name || ""}`,
        email: user?.email,
        contact: user?.contact,
      },
      theme: { color: "#c9060a" },
    };

    RazorpayCheckout.open(options)
      .then(async (response) => {
        const verifyPayload = {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          membership_plan_id: selectedPlan.id,
          purchase_type: purchaseType,
        };

        const verifyRes = await verifySubscriptionPayment(verifyPayload);

        const sub = verifyRes?.data?.subscription;

        if (sub) {
          dispatch(setSubscription(sub));
        }

        Alert.alert("Success", "Payment successful");
        navigation.navigate("Dashboard");
      })
      .catch(() => {
        Alert.alert("Cancelled", "Payment cancelled");
      });
  } finally {
    setLoading(false);
  }
}, [selectedPlanId, isAuthenticated, activeSubscription]);
  /* ---------------- LOADER ---------------- */

  if (!plans.length) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator
          size="large"
          color="#c9060a"
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          Membership Plans
        </Text>

        <View style={styles.divider} />

        <Text style={styles.subtitle}>
          Choose your subscription
        </Text>
      </View>

      <View style={styles.plansGrid}>
        {plans.map(plan => {
          const isSelected =
            selectedPlanId === plan.id;

          const isFreePlanCard =
            Number(plan.price) === 0;

          const disableFreePlan =
            isFreePlanCard &&
            isFreePlanDisabled;

          const features =
            parseFeatures(plan.feature);

          return (
            <TouchableOpacity
              key={plan.id}
              activeOpacity={0.9}
              disabled={
                disableFreePlan
              }
              onPress={() =>
                setSelectedPlanId(
                  plan.id,
                )
              }
              style={[
                styles.card,

                isSelected &&
                  styles.cardActive,

                disableFreePlan && {
                  opacity: 0.5,
                },
              ]}
            >
              {plan.tag && (
                <View
                  style={
                    styles.badge
                  }
                >
                  <Text
                    style={
                      styles.badgeText
                    }
                  >
                    {disableFreePlan
                      ? 'NOT AVAILABLE'
                      : plan.tag}
                  </Text>
                </View>
              )}

              <Text
                style={
                  styles.planName
                }
              >
                {plan.name}
              </Text>

              {activeSubscription?.plan_id ===
                plan.id && (
                <Text
                  style={
                    styles.currentPlan
                  }
                >
                  Current Plan
                </Text>
              )}

              <View
                style={
                  styles.priceContainer
                }
              >
                <Text
                  style={
                    styles.currency
                  }
                >
                  ₹
                </Text>

                <Text
                  style={
                    styles.price
                  }
                >
                  {plan.price}
                </Text>
              </View>

              <View
                style={
                  styles.featuresContainer
                }
              >
                {features
                  .slice(0, 4)
                  .map(
                    (
                      item: string,
                      index: number,
                    ) => (
                      <View
                        key={
                          index
                        }
                        style={
                          styles.featureRow
                        }
                      >
                        <Text
                          style={
                            styles.check
                          }
                        >
                          ✓
                        </Text>

                        <Text
                          style={
                            styles.featureText
                          }
                        >
                          {item}
                        </Text>
                      </View>
                    ),
                  )}
              </View>

              <View
                style={[
                  styles.selectIndicator,

                  isSelected && {
                    backgroundColor:
                      '#c9060a',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.selectText,

                    isSelected && {
                      color:
                        '#fff',
                    },
                  ]}
                >
                  {isSelected
                    ? 'Selected'
                    : 'Select Plan'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* CTA */}

      <TouchableOpacity
        style={styles.subscribeBtn}
        activeOpacity={0.9}
        disabled={loading}
        onPress={handleSubscribe}
      >
        <LinearGradient
          colors={[
            '#c9060a',
            '#8f0205',
          ]}
          style={
            styles.subscribeGradient
          }
        >
          {loading ? (
            <ActivityIndicator
              color="#fff"
            />
          ) : (
            <>
              <Text
                style={
                  styles.subscribeText
                }
              >
                {isAuthenticated
                  ? 'UPGRADE NOW'
                  : 'SUBSCRIBE NOW'}
              </Text>

              <Text
                style={
                  styles.arrow
                }
              >
                →
              </Text>
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
    marginTop: 30,
  },

  loaderWrap: {
    paddingVertical: 40,
  },

  header: {
    alignItems: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111',
  },

  divider: {
    width: 60,
    height: 4,
    backgroundColor: '#c9060a',
    marginTop: 6,
    borderRadius: 10,
  },

  subtitle: {
    color: '#777',
    marginTop: 10,
  },

  plansGrid: {
    gap: 18,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: '#eee',
  },

  cardActive: {
    borderColor: '#c9060a',
  },

  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#c9060a',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 16,
  },

  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },

  planName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
  },

  currentPlan: {
    marginTop: 6,
    color: '#18b76a',
    fontWeight: '700',
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 18,
  },

  currency: {
    fontSize: 22,
    fontWeight: '700',
  },

  price: {
    fontSize: 46,
    fontWeight: '900',
    color: '#111',
  },

  featuresContainer: {
    marginTop: 24,
  },

  featureRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },

  check: {
    color: '#18b76a',
    fontWeight: '900',
    marginRight: 10,
  },

  featureText: {
    flex: 1,
    color: '#444',
    fontWeight: '500',
  },

  selectIndicator: {
    marginTop: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },

  selectText: {
    fontWeight: '700',
    color: '#555',
  },

  subscribeBtn: {
    marginTop: 28,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 50,
  },

  subscribeGradient: {
    paddingVertical: 18,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  subscribeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },

  arrow: {
    color: '#fff',
    fontSize: 22,
    marginLeft: 12,
    fontWeight: '700',
  },
});