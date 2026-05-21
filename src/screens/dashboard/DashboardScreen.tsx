import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

import { useDispatch, useSelector } from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  logout,
  setSubscription,
  updateSubscription,
} from '../../redux/slices/authSlice';

import RazorpayCheckout from 'react-native-razorpay';
import { renewPlan, verifyRenewPayment } from '../../services/api/subscription';

const DashboardScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();

  const { user, subscription } = useSelector((state: any) => state.auth);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();

      dispatch(logout());
    } catch (error) {
      console.log('LOGOUT ERROR =>', error);
    }
  };

  const currentPlanDuration = `${subscription?.plan?.duration_value || ''} ${
    subscription?.plan?.duration_unit || ''
  }`;

  const nextPlanDuration = `${
    subscription?.next_subscription?.plan?.duration_value || ''
  } ${subscription?.next_subscription?.plan?.duration_unit || ''}`;

  const formatAmount = (amount?: number | string) => {
    return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
  };

  const formatDate = (date?: string) => {
    if (!date) return '—';

    return new Date(date).toDateString();
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
                  {subscription?.start_date}
                </Text>
              </View>

              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>End Date</Text>

                <Text style={styles.detailValue}>{subscription?.end_date}</Text>
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
            navigation.navigate('Subscription', {
              mode: 'upgrade',
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

        {/* PLAN STATUS CARD */}
        <View style={styles.statsContainer}>
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
        </View>

        {/* UPCOMING SUBSCRIPTION */}
        {subscription?.next_subscription && (
          <View style={styles.subscriptionCard}>
            <LinearGradient
              colors={['#ffffff', '#fff7f0']}
              style={styles.subscriptionInner}
            >
              <View style={styles.subscriptionHeader}>
                <View>
                  <Text style={styles.subscriptionTitle}>
                    Upcoming Subscription
                  </Text>

                  <Text style={styles.planName}>
                    {subscription?.next_subscription?.plan?.name}
                  </Text>
                </View>

                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>{nextPlanDuration}</Text>
                </View>
              </View>

              <View style={styles.pendingRow}>
                <Icon name="clock" size={14} color="#ff8a00" />

                <Text style={styles.pendingText}>
                  {subscription?.next_subscription?.status}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailGrid}>
                <View style={styles.detailBox}>
                  <Text style={styles.detailLabel}>Starts</Text>

                  <Text style={styles.detailValue}>
                    {subscription?.next_subscription?.start_date}
                  </Text>
                </View>

                <View style={styles.detailBox}>
                  <Text style={styles.detailLabel}>Ends</Text>

                  <Text style={styles.detailValue}>
                    {subscription?.next_subscription?.end_date}
                  </Text>
                </View>

                <View style={styles.detailBox}>
                  <Text style={styles.detailLabel}>Amount</Text>

                  <Text style={styles.detailValue}>
                    ₹{subscription?.next_subscription?.total_amount}
                  </Text>
                </View>

                <View style={styles.detailBox}>
                  <Text style={styles.detailLabel}>Purchase</Text>

                  <Text style={styles.detailValue}>
                    {subscription?.next_subscription?.purchase_type}
                  </Text>
                </View>
              </View>

              <Text style={styles.gstText}>GST Included (18%)</Text>
            </LinearGradient>
          </View>
        )}

        {/* LOGOUT BUTTON */}
        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.85}
          onPress={handleLogout}
        >
          <Icon name="log-out" size={18} color="#fff" />

          <Text style={styles.logoutText}>Logout</Text>
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

  logoutBtn: {
    marginHorizontal: 16,
    marginTop: 28,
    backgroundColor: '#c9060a',
    borderRadius: 18,
    paddingVertical: 18,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
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
});
