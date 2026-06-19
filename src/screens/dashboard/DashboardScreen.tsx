import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  LayoutAnimation,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RazorpayCheckout from 'react-native-razorpay';
import Toast from 'react-native-toast-message';

import { logoutApi } from '../../screens/auth/api/auth';
import { logout } from '../../redux/slices/authSlice';
import { renewPlan, verifyRenewPayment } from '../../services/api/subscription';
import { refreshProfile } from '../../utils/helper/refreshProfile';
import { useTheme } from '../../redux/useTheme';

// ------ TYPES ------

interface Plan {
  id: number;
  name: string;
  price: string;
  duration_value: number;
  duration_unit: string;
}

interface Subscription {
  id: number;
  plan_id: number;
  plan: Plan;
  membership_plan_id?: number;
  status: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  purchase_type: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  contact: string;
  city?: string;
  state?: string;
  country?: string;
}

interface AuthState {
  user: User | null;
  subscription: Subscription | null;
  nextSubscriptions: Subscription[];
}

// ------ COMPONENT ------

const DashboardScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();

  const { user, subscription, nextSubscriptions } = useSelector(
    (state: any) => state.auth,
  ) as AuthState;

  const [expandedPlans, setExpandedPlans] = useState<number[]>([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // ------ HELPERS ------

  const togglePlan = (index: number) => {
    LayoutAnimation.configureNext({
      duration: 300,
      update: { type: LayoutAnimation.Types.easeInEaseOut },
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

  const formatDate = (date?: string) => {
    if (!date) return '—';
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = d.toLocaleString('en-IN', { month: 'short' });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // ------ SUBSCRIPTION STATUS ------

  const now = new Date();
  const hasExpiredByDate = subscription?.end_date
    ? new Date(subscription.end_date) < now
    : false;
  const status = subscription?.status?.toUpperCase();
  const isActive = status === 'ACTIVE' && !hasExpiredByDate;
  const isExpired = hasExpiredByDate || status === 'EXPIRED';

  const isFreePlan = subscription?.plan?.price
    ? Number(subscription.plan.price) === 0
    : Number(subscription?.total_amount || 0) === 0;

  const remainingDays = subscription?.end_date
    ? Math.ceil(
        (new Date(subscription.end_date).getTime() - now.getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  const remainingDaysLabel =
    remainingDays === null
      ? '—'
      : remainingDays <= 0
      ? 'Expired'
      : `${remainingDays} day${remainingDays > 1 ? 's' : ''} left`;

  const currentPlanDuration = `${subscription?.plan?.duration_value || ''} ${
    subscription?.plan?.duration_unit || ''
  }`;

  const upcomingPlans = nextSubscriptions || [];

  // ------ LOGOUT HANDLER ------

  const handleLogout = async () => {
    if (isLoggingOut) return;

    const clearUserData = async () => {
      await AsyncStorage.multiRemove([
        'token',
        'user',
        'subscription',
        'nextSubscriptions',
        'persist:root',
      ]);

      dispatch(logout());
    };

    const navigateToSignIn = () => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      });
    };

    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);

            try {
              // Attempt logout API (don't block logout if it fails)
              try {
                const response = await logoutApi();
                console.log(' Logout API Success:', response);
              } catch (apiError) {
                console.error(' Logout API Failed:', apiError);
              }

              await clearUserData();

              Toast.show({
                type: 'success',
                text1: '👋 Logged Out',
                text2: 'You have been successfully logged out',
                position: 'top',
                visibilityTime: 2000,
              });

              navigateToSignIn();
            } catch (error) {
              console.error(' Logout Process Failed:', error);

              // Best-effort cleanup
              try {
                await clearUserData();
              } catch (cleanupError) {
                console.error(
                  ' Failed to clear local user data:',
                  cleanupError,
                );
              }

              Toast.show({
                type: 'info',
                text1: 'Logged Out',
                text2: 'Local session cleared',
                position: 'top',
                visibilityTime: 2000,
              });

              navigateToSignIn();
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  // ------  RENEW PLAN ------

  const handleRenewPlan = async () => {
    try {
      const res = await renewPlan(subscription?.id);

      if (!res?.status) {
        Alert.alert('Error', res?.message || 'Unable to renew plan');
        return;
      }

      const payment = res?.data?.payment;
      if (!payment) {
        Alert.alert('Error', 'Payment data not received');
        return;
      }

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
        theme: { color: colors.primary },
      };

      const razorpayResponse = await RazorpayCheckout.open(options);

      const verifyRes = await verifyRenewPayment({
        razorpay_payment_id: razorpayResponse?.razorpay_payment_id,
        razorpay_order_id: razorpayResponse?.razorpay_order_id,
        razorpay_signature: razorpayResponse?.razorpay_signature,
        membership_plan_id: subscription?.membership_plan_id,
        purchase_type: 'RENEW',
      });

      if (verifyRes?.status) {
        await refreshProfile(dispatch);
        Alert.alert('Success', 'Plan renewed successfully');
      } else {
        Alert.alert(
          'Error',
          verifyRes?.message || 'Payment verification failed',
        );
      }
    } catch (error: any) {
      console.log('RENEW ERROR =>', error);
      Alert.alert(
        'Error',
        error?.response?.data?.message || error?.message || 'Renew failed',
      );
    }
  };

  // ------  NAVIGATION FUNCTIONS ------

  const handleSubscriptionPress = () => {
    navigation.navigate('Subscription', { mode: 'upgrade' });
  };

  const handleInvoicePress = () => {
    navigation.navigate('InvoiceScreen');
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'MainApp',
              state: {
                routes: [
                  {
                    name: 'MainTabs',
                    state: {
                      routes: [{ name: 'HomeTab' }],
                      index: 0,
                    },
                  },
                ],
                index: 0,
              },
            },
          ],
        }),
      );
    }
  };

  // ------ RENDER ------

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primaryDark || '#b30404'}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* HEADER */}
        <LinearGradient
          colors={[colors.primary, colors.primaryDark || '#8f0205']}
          style={styles.header}
        >
          <View style={styles.topRow}>
            <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
              <Icon name="arrow-left" size={22} color="#fff" />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
          </View>

          <View style={styles.profileRow}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: 'rgba(255,255,255,0.18)' },
              ]}
            >
              <Text style={styles.avatarText}>
                {user?.first_name?.charAt(0) || 'U'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.welcome}>Welcome Back</Text>
              <Text style={styles.name}>
                {user?.first_name} {user?.last_name}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.notificationBtn,
                { backgroundColor: 'rgba(255,255,255,0.18)' },
              ]}
            >
              <Icon name="bell" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* PERSONAL INFO */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              shadowColor: isDark ? '#000' : '#000',
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Personal Information
            </Text>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: colors.primaryBackground },
              ]}
            >
              <Icon name="user" size={16} color={colors.primary} />
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.textMuted }]}>
              Email
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {user?.email || '—'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.textMuted }]}>
              Contact
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {user?.contact || '—'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.textMuted }]}>
              Location
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {user?.city && user?.state
                ? `${user?.city}, ${user?.state}`
                : '—'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.textMuted }]}>
              Country
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {user?.country || '—'}
            </Text>
          </View>
        </View>

        {/* RENEW BUTTON */}
        {subscription &&
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
                colors={[colors.primary, colors.primaryDark || '#8f0205']}
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

        {/* UPGRADE / CHANGE PLAN */}
        <TouchableOpacity
          style={styles.upgradeBtn}
          activeOpacity={0.9}
          onPress={handleSubscriptionPress}
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
        <View
          style={[
            styles.subscriptionCard,
            {
              shadowColor: isDark ? '#000' : '#000',
            },
          ]}
        >
          <LinearGradient
            colors={isDark ? ['#1a1a1a', '#2a1a1a'] : ['#ffffff', '#fff5f5']}
            style={styles.subscriptionInner}
          >
            <View style={styles.subscriptionHeader}>
              <View>
                <Text
                  style={[
                    styles.subscriptionTitle,
                    { color: colors.textSecondary },
                  ]}
                >
                  Current Subscription
                </Text>
                <Text style={[styles.planName, { color: colors.text }]}>
                  {subscription?.plan?.name || 'No Plan'}
                </Text>
              </View>
              <View
                style={[
                  styles.durationBadge,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.durationText}>{currentPlanDuration}</Text>
              </View>
            </View>

            <View style={styles.statusRow}>
              <View
                style={[
                  styles.activeDot,
                  {
                    backgroundColor: isActive ? colors.success : colors.primary,
                  },
                ]}
              />
              <Text
                style={[
                  styles.activeText,
                  { color: isActive ? colors.success : colors.primary },
                ]}
              >
                {isActive ? 'Active' : isExpired ? 'Expired' : status || '—'}
              </Text>
            </View>

            <View
              style={[
                styles.remainingContainer,
                {
                  backgroundColor: colors.card,
                  shadowColor: isDark ? '#000' : '#000',
                },
              ]}
            >
              <View style={styles.remainingLeft}>
                <Icon name="clock" size={16} color={colors.primary} />
                <Text
                  style={[
                    styles.remainingLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Remaining Time
                </Text>
              </View>
              <Text
                style={[
                  styles.remainingValue,
                  {
                    color:
                      remainingDays !== null && remainingDays <= 7
                        ? colors.primary
                        : colors.success,
                  },
                ]}
              >
                {remainingDaysLabel}
              </Text>
            </View>

            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />

            <View style={styles.detailGrid}>
              <View
                style={[
                  styles.detailBox,
                  { backgroundColor: colors.background },
                ]}
              >
                <Text style={[styles.detailLabel, { color: colors.textMuted }]}>
                  Start Date
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {formatDate(subscription?.start_date)}
                </Text>
              </View>
              <View
                style={[
                  styles.detailBox,
                  { backgroundColor: colors.background },
                ]}
              >
                <Text style={[styles.detailLabel, { color: colors.textMuted }]}>
                  End Date
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {formatDate(subscription?.end_date)}
                </Text>
              </View>
              <View
                style={[
                  styles.detailBox,
                  { backgroundColor: colors.background },
                ]}
              >
                <Text style={[styles.detailLabel, { color: colors.textMuted }]}>
                  Amount
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  ₹{subscription?.total_amount || 0}
                </Text>
              </View>
              <View
                style={[
                  styles.detailBox,
                  { backgroundColor: colors.background },
                ]}
              >
                <Text style={[styles.detailLabel, { color: colors.textMuted }]}>
                  Plan Type
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {subscription?.purchase_type || 'NEW'}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* UPCOMING PLANS */}
        {upcomingPlans.length > 0 && (
          <View style={styles.upcomingWrapper}>
            <View style={styles.upcomingHeadingRow}>
              <Icon name="clock" size={18} color={colors.primary} />
              <Text style={[styles.upcomingHeading, { color: colors.text }]}>
                Upcoming Plans
              </Text>
              <View
                style={[
                  styles.upcomingCount,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.upcomingCountText}>
                  {upcomingPlans.length}
                </Text>
              </View>
            </View>

            {upcomingPlans.map((item: Subscription, index: number) => {
              const expanded = expandedPlans.includes(index);
              const duration = `${item?.plan?.duration_value || ''} ${
                item?.plan?.duration_unit || ''
              }`;

              return (
                <View
                  key={index}
                  style={[
                    styles.todoCard,
                    {
                      backgroundColor: colors.card,
                      borderLeftColor: colors.primary,
                      shadowColor: isDark ? '#000' : '#000',
                    },
                  ]}
                >
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => togglePlan(index)}
                    style={styles.todoHeader}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.todoTitle, { color: colors.text }]}>
                        {item?.plan?.name || 'Plan'}
                      </Text>
                      <Text
                        style={[
                          styles.todoSub,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {duration}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.pendingBadge,
                        { backgroundColor: isDark ? '#2d1a1a' : '#fff3e8' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.pendingBadgeText,
                          { color: isDark ? '#ff8a00' : '#ff8a00' },
                        ]}
                      >
                        {item?.status || 'PENDING'}
                      </Text>
                    </View>
                    <Icon
                      name="chevron-down"
                      size={22}
                      color={colors.text}
                      style={{
                        marginLeft: 12,
                        transform: [{ rotate: expanded ? '180deg' : '0deg' }],
                      }}
                    />
                  </TouchableOpacity>

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
                      <View
                        style={[
                          styles.detailBox,
                          { backgroundColor: colors.background },
                        ]}
                      >
                        <Text
                          style={[
                            styles.detailLabel,
                            { color: colors.textMuted },
                          ]}
                        >
                          Starts
                        </Text>
                        <Text
                          style={[styles.detailValue, { color: colors.text }]}
                        >
                          {formatDate(item?.start_date)}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.detailBox,
                          { backgroundColor: colors.background },
                        ]}
                      >
                        <Text
                          style={[
                            styles.detailLabel,
                            { color: colors.textMuted },
                          ]}
                        >
                          Ends
                        </Text>
                        <Text
                          style={[styles.detailValue, { color: colors.text }]}
                        >
                          {formatDate(item?.end_date)}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.detailBox,
                          { backgroundColor: colors.background },
                        ]}
                      >
                        <Text
                          style={[
                            styles.detailLabel,
                            { color: colors.textMuted },
                          ]}
                        >
                          Amount
                        </Text>
                        <Text
                          style={[styles.detailValue, { color: colors.text }]}
                        >
                          ₹{item?.total_amount || 0}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.detailBox,
                          { backgroundColor: colors.background },
                        ]}
                      >
                        <Text
                          style={[
                            styles.detailLabel,
                            { color: colors.textMuted },
                          ]}
                        >
                          Purchase
                        </Text>
                        <Text
                          style={[styles.detailValue, { color: colors.text }]}
                        >
                          {item?.purchase_type || 'NEW'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* INVOICE BUTTON */}
        <TouchableOpacity
          style={[
            styles.invoiceBtn,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              shadowColor: isDark ? '#000' : '#000',
            },
          ]}
          activeOpacity={0.85}
          onPress={handleInvoicePress}
        >
          <Icon name="file-text" size={18} color={colors.text} />
          <Text style={[styles.invoiceBtnText, { color: colors.text }]}>
            Invoices
          </Text>
          <Icon name="arrow-right" size={18} color={colors.text} />
        </TouchableOpacity>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity
          style={[
            styles.logoutBtn,
            {
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
            },
          ]}
          activeOpacity={0.85}
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Icon name="log-out" size={18} color="#fff" />
              <Text style={styles.logoutBtnText}>Logout</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// ------ STYLES ------

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    marginTop: -50,
  },

  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
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
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    marginHorizontal: 16,
    marginTop: -18,
    borderRadius: 22,
    padding: 20,
    shadowOffset: { width: 0, height: 4 },
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
  },

  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  infoRow: {
    marginBottom: 16,
  },

  label: {
    fontSize: 12,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },

  value: {
    fontSize: 15,
    fontWeight: '600',
  },

  subscriptionCard: {
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 24,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
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
    marginBottom: 4,
  },

  planName: {
    fontSize: 24,
    fontWeight: '800',
  },

  durationBadge: {
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
    marginRight: 8,
  },

  activeText: {
    fontWeight: '700',
  },

  divider: {
    height: 1,
    marginVertical: 18,
  },

  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  detailBox: {
    width: '48%',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },

  detailLabel: {
    fontSize: 12,
    marginBottom: 6,
  },

  detailValue: {
    fontSize: 14,
    fontWeight: '700',
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
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
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
    fontWeight: '600',
  },

  remainingValue: {
    fontSize: 15,
    fontWeight: '800',
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
    marginLeft: 8,
  },

  upcomingCount: {
    marginLeft: 10,
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
    borderRadius: 20,
    marginBottom: 14,
    borderLeftWidth: 4,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
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
  },

  todoSub: {
    marginTop: 4,
    fontSize: 13,
    textTransform: 'capitalize',
  },

  pendingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
  },

  pendingBadgeText: {
    fontWeight: '700',
    fontSize: 11,
    textTransform: 'uppercase',
  },

  todoDetails: {
    overflow: 'hidden',
    paddingHorizontal: 18,
  },

  invoiceBtn: {
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  invoiceBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },

  logoutBtn: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 16,
    borderRadius: 18,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
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
});

export default DashboardScreen;
