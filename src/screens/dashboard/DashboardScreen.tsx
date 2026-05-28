import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

import { useDispatch, useSelector } from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { logout, updateSubscription } from '../../redux/slices/authSlice';

import RazorpayCheckout from 'react-native-razorpay';
import { renewPlan, verifyRenewPayment } from '../../services/api/subscription';
import Toast from 'react-native-toast-message';

const DashboardScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();

  const { user, subscription } = useSelector((state: any) => state.auth);

  const [expandedPlans, setExpandedPlans] = useState<number[]>([]);

  useEffect(() => {
    // if (
    //   Platform.OS === 'android' &&
    //   UIManager.setLayoutAnimationEnabledExperimental
    // ) {
    //   UIManager.setLayoutAnimationEnabledExperimental(true);
    // }
  }, []);

  const togglePlan = (index: number) => {
    LayoutAnimation.configureNext({
      duration: 300,
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });

    setExpandedPlans(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index],
    );
  };

  const upcomingPlans = Array.isArray(subscription?.next_subscriptions)
    ? subscription.next_subscriptions
    : subscription?.next_subscription
    ? [subscription.next_subscription]
    : [];

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();

      dispatch(logout());

      //  ONLY TOAST
      Toast.show({
        type: 'info',
        text1: '👋 Logged Out',
        text2: 'You have been successfully logged out',
        position: 'top',
        visibilityTime: 2500,
      });
    } catch (error) {
      console.log('LOGOUT ERROR =>', error);

      Toast.show({
        type: 'error',
        text1: 'Logout Failed',
        text2: 'Please try again',
      });
    }
  };

  const currentPlanDuration = `${subscription?.plan?.duration_value || ''} ${
    subscription?.plan?.duration_unit || ''
  }`;

  // const nextPlanDuration = `${
  //   subscription?.next_subscription?.plan?.duration_value || ''
  // } ${subscription?.next_subscription?.plan?.duration_unit || ''}`;

  // const formatAmount = (amount?: number | string) => {
  //   return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
  // };

  const formatDate = (date?: string) => {
    if (!date) return '—';

    const d = new Date(date);

    const day = d.getDate().toString().padStart(2, '0');

    const month = d.toLocaleString('en-IN', {
      month: 'short',
    });

    const year = d.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const now = new Date();

  const hasExpiredByDate = subscription?.end_date
    ? new Date(subscription?.end_date) < now
    : false;

  const status = subscription?.status?.toUpperCase();

  const isActive = status === 'ACTIVE' && !hasExpiredByDate;

  const isExpired = hasExpiredByDate || status === 'EXPIRED';

  const isFreePlan = subscription?.plan?.price
    ? Number(subscription.plan.price) === 0
    : Number(subscription?.total_amount || 0) === 0;

  const isPaidPlan = !isFreePlan;

  const remainingDays = subscription?.end_date
    ? Math.ceil(
        (new Date(subscription.end_date).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  const remainingDaysLabel =
    remainingDays === null
      ? '—'
      : remainingDays <= 0
      ? 'Expired'
      : `${remainingDays} day${remainingDays > 1 ? 's' : ''} left`;

  const handleRenewPlan = async () => {
    try {
      console.log('RENEW SUBSCRIPTION ID =>', subscription?.id);

      /* STEP 1: CREATE RENEW ORDER */
      const res = await renewPlan(subscription?.id);

      console.log('RENEW API RESPONSE =>', res);

      if (!res?.status) {
        Alert.alert('Error', res?.message || 'Unable to renew plan');
        return;
      }

      const payment = res?.data?.payment;

      if (!payment) {
        Alert.alert('Error', 'Payment data not received');
        return;
      }

      /* STEP 2: OPEN RAZORPAY */
      const options = {
        key: payment?.razorpay_key,
        amount: Number(payment?.amount),
        currency: payment?.currency || 'INR',
        order_id: payment?.order_id,

        name: 'Lex Witness',

        description: 'Subscription Renewal',

        prefill: {
          email: user?.email || '',
          contact: user?.contact || '',
          name: `${user?.first_name || ''} ${user?.last_name || ''}`,
        },

        theme: {
          color: '#c9060a',
        },
      };

      const razorpayResponse = await RazorpayCheckout.open(options);

      console.log('RAZORPAY SUCCESS =>', razorpayResponse);

      /* STEP 3: VERIFY PAYMENT */
      const verifyRes = await verifyRenewPayment({
        razorpay_payment_id: razorpayResponse?.razorpay_payment_id,

        razorpay_order_id: razorpayResponse?.razorpay_order_id,

        razorpay_signature: razorpayResponse?.razorpay_signature,

        membership_plan_id: subscription?.membership_plan_id,

        purchase_type: 'RENEW',
      });

      console.log('VERIFY PAYMENT RESPONSE =>', verifyRes);

      if (verifyRes?.status) {
        dispatch(
          updateSubscription({
            next_subscription: verifyRes?.data?.subscription,
          }),
        );

        Alert.alert('Success', 'Plan renewed successfully');
      } else {
        Alert.alert(
          'Error',
          verifyRes?.message || 'Payment verification failed',
        );
      }
    } catch (error: any) {
      console.log('RENEW FLOW ERROR =>', error?.response?.data || error);

      Alert.alert(
        'Error',
        error?.response?.data?.message || error?.message || 'Renew failed',
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#b30404" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* HEADER */}
        <LinearGradient colors={['#d10a0f', '#8f0205']} style={styles.header}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.first_name?.charAt(0)}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.welcome}>Welcome Back</Text>

              <Text style={styles.name}>
                {user?.first_name} {user?.last_name}
              </Text>
            </View>

            <TouchableOpacity style={styles.notificationBtn}>
              <Icon name="bell" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* PERSONAL INFO */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>Personal Information</Text>

            <View style={styles.iconCircle}>
              <Icon name="user" size={16} color="#c9060a" />
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user?.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Contact</Text>
            <Text style={styles.value}>{user?.contact}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Location</Text>
            <Text style={styles.value}>
              {user?.city}, {user?.state}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Country</Text>
            <Text style={styles.value}>{user?.country}</Text>
          </View>
        </View>

        {/* RENEW BUTTON */}
        {isPaidPlan &&
          isActive &&
          remainingDays !== null &&
          remainingDays <= 30 &&
          remainingDays > 0 && (
            <TouchableOpacity
              style={styles.renewBtn}
              activeOpacity={0.9}
              onPress={handleRenewPlan}
            >
              <LinearGradient
                colors={['#c9060a', '#8f0205']}
                style={styles.renewGradient}
              >
                <Icon name="refresh-cw" size={18} color="#fff" />

                <Text style={styles.renewText}>
                  Renew Plan ({remainingDays} day
                  {remainingDays > 1 ? 's' : ''} left)
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

        {/* CHANGE / UPGRADE PLAN BUTTON */}
        <TouchableOpacity
          style={styles.upgradeBtn}
          activeOpacity={0.9}
          onPress={() =>
            navigation.navigate('HomeTab', {
              screen: 'Subscription',
              params: {
                mode: 'upgrade',
              },
            })
          }
        >
          <LinearGradient
            colors={['#111827', '#1f2937']}
            style={styles.upgradeGradient}
          >
            <Icon name="zap" size={18} color="#fff" />

            <Text style={styles.upgradeText}>
              {isFreePlan ? 'Upgrade Plan' : 'Change Plan'}
            </Text>

            <Icon
              name="arrow-up-right"
              size={18}
              color="#fff"
              style={{ marginLeft: 8 }}
            />
          </LinearGradient>
        </TouchableOpacity>

        {/* CURRENT SUBSCRIPTION */}
        <View style={styles.subscriptionCard}>
          <LinearGradient
            colors={['#ffffff', '#fff5f5']}
            style={styles.subscriptionInner}
          >
            <View style={styles.subscriptionHeader}>
              <View>
                <Text style={styles.subscriptionTitle}>
                  Current Subscription
                </Text>

                <Text style={styles.planName}>{subscription?.plan?.name}</Text>
              </View>

              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{currentPlanDuration}</Text>
              </View>
            </View>

            <View style={styles.statusRow}>
              <View
                style={[
                  styles.activeDot,
                  {
                    backgroundColor: isActive ? '#18b76a' : '#c9060a',
                  },
                ]}
              />

              <Text
                style={[
                  styles.activeText,
                  {
                    color: isActive ? '#18b76a' : '#c9060a',
                  },
                ]}
              >
                {isActive ? 'Active' : isExpired ? 'Expired' : status}
              </Text>
            </View>

            {/* REMAINING DAYS CARD */}
            <View style={styles.remainingContainer}>
              <View style={styles.remainingLeft}>
                <Icon name="clock" size={16} color="#c9060a" />

                <Text style={styles.remainingLabel}>Remaining Time</Text>
              </View>

              <Text
                style={[
                  styles.remainingValue,
                  remainingDays !== null && remainingDays <= 7
                    ? { color: '#c9060a' }
                    : {},
                ]}
              >
                {remainingDaysLabel}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailGrid}>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Start Date</Text>

                <Text style={styles.detailValue}>
                  {formatDate(subscription?.start_date)}
                </Text>
              </View>

              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>End Date</Text>

                <Text style={styles.detailValue}>
                  {formatDate(subscription?.end_date)}
                </Text>
              </View>

              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Amount</Text>

                <Text style={styles.detailValue}>
                  ₹{subscription?.total_amount}
                </Text>
              </View>

              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Plan Type</Text>

                <Text style={styles.detailValue}>
                  {subscription?.purchase_type || 'NEW'}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* PLAN STATUS CARD */}
        {/* <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconWrap}>
              <Icon name="award" size={18} color="#c9060a" />
            </View>

            <Text style={styles.statLabel}>Current Plan</Text>

            <Text style={styles.statValue}>
              {subscription?.plan?.name || 'No Plan'}
            </Text>

            <Text style={styles.statSub}>{currentPlanDuration}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconWrap}>
              <Icon name="clock" size={18} color="#c9060a" />
            </View>

            <Text style={styles.statLabel}>Remaining</Text>

            <Text
              style={[
                styles.statValue,
                remainingDays !== null && remainingDays <= 7
                  ? { color: '#c9060a' }
                  : {},
              ]}
            >
              {remainingDaysLabel}
            </Text>

            <Text style={styles.statSub}>until expiry</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconWrap}>
              <Icon
                name={isActive ? 'check-circle' : 'x-circle'}
                size={18}
                color={isActive ? '#18b76a' : '#c9060a'}
              />
            </View>

            <Text style={styles.statLabel}>Status</Text>

            <Text
              style={[
                styles.statValue,
                {
                  color: isActive ? '#18b76a' : '#c9060a',
                },
              ]}
            >
              {isActive ? 'Active' : isExpired ? 'Expired' : status}
            </Text>
          </View>
        </View> */}

        {/* UPCOMING PLANS */}
        {upcomingPlans.length > 0 && (
          <View style={styles.upcomingWrapper}>
            {/* HEADING */}
            <View style={styles.upcomingHeadingRow}>
              <Icon name="clock" size={18} color="#c9060a" />

              <Text style={styles.upcomingHeading}>Upcoming Plans</Text>

              <View style={styles.upcomingCount}>
                <Text style={styles.upcomingCountText}>
                  {upcomingPlans.length}
                </Text>
              </View>
            </View>

            {upcomingPlans.map((item: any, index: number) => {
              const expanded = expandedPlans.includes(index);

              const duration = `${item?.plan?.duration_value || ''} ${
                item?.plan?.duration_unit || ''
              }`;

              return (
                <View key={index} style={styles.todoCard}>
                  {/* HEADER */}
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => togglePlan(index)}
                    style={styles.todoHeader}
                  >
                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <Text style={styles.todoTitle}>{item?.plan?.name}</Text>

                      <Text style={styles.todoSub}>{duration}</Text>
                    </View>

                    <View style={styles.pendingBadge}>
                      <Text style={styles.pendingBadgeText}>
                        {item?.status}
                      </Text>
                    </View>

                    <View
                      style={{
                        transform: [
                          {
                            rotate: expanded ? '180deg' : '0deg',
                          },
                        ],
                      }}
                    >
                      <Icon
                        name="chevron-down"
                        size={22}
                        color="#111"
                        style={{ marginLeft: 12 }}
                      />
                    </View>
                  </TouchableOpacity>

                  {/* EXPANDED DETAILS */}

                  <View
                    style={[
                      styles.todoDetails,
                      {
                        maxHeight: expanded ? 500 : 0,
                        opacity: expanded ? 1 : 0,
                        paddingBottom: expanded ? 18 : 0,
                      },
                    ]}
                  >
                    <View style={styles.detailGrid}>
                      <View style={styles.detailBox}>
                        <Text style={styles.detailLabel}>Starts</Text>

                        <Text style={styles.detailValue}>
                          {formatDate(item?.start_date)}
                        </Text>
                      </View>

                      <View style={styles.detailBox}>
                        <Text style={styles.detailLabel}>Ends</Text>

                        <Text style={styles.detailValue}>
                          {formatDate(item?.end_date)}
                        </Text>
                      </View>

                      <View style={styles.detailBox}>
                        <Text style={styles.detailLabel}>Amount</Text>

                        <Text style={styles.detailValue}>
                          ₹{item?.total_amount}
                        </Text>
                      </View>

                      <View style={styles.detailBox}>
                        <Text style={styles.detailLabel}>Purchase</Text>

                        <Text style={styles.detailValue}>
                          {item?.purchase_type}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Bottom Action Buttons */}
        <TouchableOpacity
          style={styles.invoiceBtn}
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate('HomeTab', { screen: 'InvoiceScreen' })
          }
        >
          <Icon name="file-text" size={18} color="#111827" />
          <Text style={styles.invoiceBtnText}>Invoices</Text>
          <Icon name="arrow-right" size={18} color="#111827" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.85}
          onPress={handleLogout}
        >
          <Icon name="log-out" size={18} color="#fff" />
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fb',
  },

  scrollContainer: {
    paddingBottom: 40,
  },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 35,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },

  welcome: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },

  name: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 2,
  },

  notificationBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -18,
    borderRadius: 22,
    padding: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,

    elevation: 4,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },

  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  infoRow: {
    marginBottom: 16,
  },

  label: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },

  value: {
    fontSize: 15,
    color: '#222',
    fontWeight: '600',
  },

  subscriptionCard: {
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 24,
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,

    elevation: 4,
  },

  subscriptionInner: {
    padding: 20,
  },

  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  subscriptionTitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 4,
  },

  planName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
  },

  durationBadge: {
    backgroundColor: '#c9060a',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 30,
  },

  durationText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'capitalize',
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },

  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#18b76a',
    marginRight: 8,
  },

  activeText: {
    color: '#18b76a',
    fontWeight: '700',
  },

  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },

  pendingText: {
    marginLeft: 8,
    color: '#ff8a00',
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: '#ececec',
    marginVertical: 18,
  },

  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  detailBox: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },

  detailLabel: {
    fontSize: 12,
    color: '#777',
    marginBottom: 6,
  },

  detailValue: {
    fontSize: 14,
    color: '#111',
    fontWeight: '700',
  },

  gstText: {
    marginTop: 6,
    color: '#888',
    fontSize: 12,
  },

  invoiceBtn: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  invoiceBtnText: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: '700',
  },
  logoutBtn: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 16,
    backgroundColor: '#c9060a',
    borderRadius: 18,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    shadowColor: '#c9060a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 18,
  },

  statCard: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 14,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.05,
    shadowRadius: 6,

    elevation: 3,
  },

  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  statLabel: {
    fontSize: 11,
    color: '#777',
    marginBottom: 6,
  },

  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },

  statSub: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },

  renewBtn: {
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 18,
    overflow: 'hidden',
  },

  renewGradient: {
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  renewText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 10,
  },

  upgradeBtn: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 18,
    overflow: 'hidden',
  },

  upgradeGradient: {
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  upgradeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 10,
  },

  remainingContainer: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.04,
    shadowRadius: 4,

    elevation: 2,
  },

  remainingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  remainingLabel: {
    marginLeft: 8,
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },

  remainingValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#18b76a',
  },

  upcomingWrapper: {
    marginHorizontal: 16,
    marginTop: 20,
  },

  upcomingHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  upcomingHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
    marginLeft: 8,
  },

  upcomingCount: {
    marginLeft: 10,
    backgroundColor: '#c9060a',
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },

  upcomingCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  todoCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#c9060a',
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.05,
    shadowRadius: 5,

    elevation: 3,
  },

  todoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },

  todoTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111',
  },

  todoSub: {
    marginTop: 4,
    fontSize: 13,
    color: '#777',
    textTransform: 'capitalize',
  },

  pendingBadge: {
    backgroundColor: '#fff3e8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
  },

  pendingBadgeText: {
    color: '#ff8a00',
    fontWeight: '700',
    fontSize: 11,
    textTransform: 'uppercase',
  },

  todoDetails: {
    overflow: 'hidden',
    paddingHorizontal: 18,
  },
});
