import React, { useState, useRef, useEffect } from 'react';
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
  Platform,
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
import { useTheme } from '../../redux/hooks/useTheme';
import { useResponsive } from '../../hooks/useResponsive';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import ConfirmationModal from '../../components/common/ConfirmationModal';

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
  const {
    isTablet,
    isSmallDevice,
    moderateScale,
    spacing,
    font,
    sizes,
    wp,
    hp,
    pixelRatio
  } = useResponsive();

  const { user, subscription, nextSubscriptions } = useSelector(
    (state: any) => state.auth,
  ) as AuthState;

  const insets = useSafeAreaInsets();

  const [expandedPlans, setExpandedPlans] = useState<number[]>([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const isMounted = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

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

  const currentPlanDuration = `${subscription?.plan?.duration_value || ''} ${subscription?.plan?.duration_unit || ''
    }`;

  const upcomingPlans = nextSubscriptions || [];

  // ------ FIXED LOGOUT HANDLER ------



  const navigateToSignIn = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          {
            name: 'MainApp',
          },
          {
            name: 'SignIn',
          },
        ],
      }),
    );
  };

  const performLogout = async () => {
    if (isLoggingOut) return;

    // Close modal
    setShowLogoutModal(false);

    setIsLoggingOut(true);

    try {
      // Try API logout (don't block if it fails)
      try {
        const response = await logoutApi();
        console.log('Logout API Success:', response);
      } catch (apiError) {
        console.error('Logout API Failed:', apiError);
      }

      // Remove AsyncStorage
      await Promise.all([
        AsyncStorage.removeItem('token'),
        AsyncStorage.removeItem('user'),
        AsyncStorage.removeItem('subscription'),
        AsyncStorage.removeItem('nextSubscriptions'),
        AsyncStorage.removeItem('persist:root'),
      ]);

      dispatch(logout());

      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: 'MainApp' },
            { name: 'SignIn' },
          ],
        }),
      );

      Toast.show({
        type: 'success',
        text1: '👋 Logged Out',
        text2: 'You have been successfully logged out',
        position: 'top',
        visibilityTime: 2000,
      });

      // Navigate first
      navigateToSignIn();

      // Clear Redux after navigation
      requestAnimationFrame(() => {
        if (isMounted.current) {
          dispatch(logout());
        }
      });
    } catch (error) {
      console.error('Logout Process Failed:', error);

      // Even if API fails, clear local data
      await Promise.all([
        AsyncStorage.removeItem('token'),
        AsyncStorage.removeItem('user'),
        AsyncStorage.removeItem('subscription'),
        AsyncStorage.removeItem('nextSubscriptions'),
        AsyncStorage.removeItem('persist:root'),
      ]);

      Toast.show({
        type: 'info',
        text1: 'Logged Out',
        text2: 'Local session cleared',
        position: 'top',
        visibilityTime: 2000,
      });

      // Navigate first
      navigateToSignIn();

      // Clear Redux after navigation
      requestAnimationFrame(() => {
        if (isMounted.current) {
          dispatch(logout());
        }
      });
    } finally {
      if (isMounted.current) {
        setIsLoggingOut(false);
      }
    }
  };


  const handleLogout = () => {
    if (isLoggingOut) return;
    console.log("Logout pressed");

    setShowLogoutModal(true);
  };


  useEffect(() => {
    console.log("showLogoutModal:", showLogoutModal);
  }, [showLogoutModal]);
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

  const isAndroid = Platform.OS === 'android';

  const cardMargin = isTablet ? 24 : 16;
  const headerPaddingTop =  (isTablet ? 0 : 0);
  const headerPaddingHorizontal = isTablet ? 32 : 20;
  const headerPaddingBottom = isAndroid ? (isTablet ? 40 : 55) : (isTablet ? 45 : 65);
  const avatarSize = isTablet ? 76 : 60;
  const borderRadius = isTablet ? 24 : 20;

  const androidFontWeight = isAndroid ? '600' : '700';
  const androidFontWeightBold = isAndroid ? '800' : '700';

  return (

    <SafeAreaView
      edges={['top']}
      style={[
        styles.container,
        {
          backgroundColor: colors.primary, // header color
        },
      ]}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <StatusBar
          translucent={false}
          backgroundColor={colors.primary}
          barStyle="light-content"
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContainer,
            {
              paddingBottom: isAndroid ? (isTablet ? 40 : 30) : (isTablet ? 50 : 40),
              paddingTop: isAndroid ? (isSmallDevice ? 0 : 0) : 0,
            }
          ]}
        >
          {/* HEADER */}
          <LinearGradient
            colors={[colors.primary, colors.primaryDark || '#8f0205']}
            style={[
              styles.header,
              {
                paddingTop: headerPaddingTop,
                paddingHorizontal: headerPaddingHorizontal,
                paddingBottom: headerPaddingBottom,
                borderBottomLeftRadius: isTablet ? 32 : 28,
                borderBottomRightRadius: isTablet ? 32 : 28,
                elevation: isAndroid ? 8 : 0,
              }
            ]}
          >
            <View style={[
              styles.topRow,
              {
                marginBottom: isAndroid ? (isTablet ? 16 : 12) : (isTablet ? 20 : 15),
                marginTop: 0,
              }
            ]}>
              <TouchableOpacity
                onPress={handleBack}
                style={[
                  styles.backBtn,
                  {
                    width: isTablet ? 48 : 40,
                    height: isTablet ? 48 : 40,
                    borderRadius: isTablet ? 24 : 20,
                    android_ripple: { color: 'rgba(255,255,255,0.3)', borderless: true },
                  }
                ]}
              >
                <Icon name="arrow-left" size={isAndroid ? (isTablet ? 24 : 28) : (isTablet ? 26 : 22)} color="#fff" />
              </TouchableOpacity>
              <View style={{ flex: 1 }} />
            </View>

            <View style={styles.profileRow}>
              <View
                style={[
                  styles.avatar,
                  {
                    backgroundColor: 'rgba(255,255,255,0.18)',
                    width: avatarSize,
                    height: avatarSize,
                    borderRadius: avatarSize / 2,
                    marginRight: isTablet ? 16 : 12,
                  }
                ]}
              >
                <Text style={[
                  styles.avatarText,
                  {
                    fontSize: isAndroid ? (isTablet ? 30 : 24) : (isTablet ? 34 : 28),
                    fontWeight: androidFontWeightBold,
                  }
                ]}>
                  {user?.first_name?.charAt(0) + user?.last_name?.charAt(0) || 'U'}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[
                  styles.welcome,
                  {
                    fontSize: isAndroid ? (isTablet ? 16 : 14) : (isTablet ? 16 : 14),
                    fontWeight: isAndroid ? '500' : '400',
                  }
                ]}>
                  Welcome Back
                </Text>
                <Text style={[
                  styles.name,
                  {
                    fontSize: isAndroid ? (isTablet ? 26 : 20) : (isTablet ? 30 : 24),
                    fontWeight: androidFontWeightBold,
                    marginTop: isAndroid ? (isTablet ? 2 : 1) : (isTablet ? 4 : 2),
                  }
                ]}>
                  {user?.first_name} {user?.last_name}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.notificationBtn,
                  {
                    backgroundColor: 'rgba(255,255,255,0.18)',
                    width: isTablet ? 48 : 40,
                    height: isTablet ? 48 : 40,
                    borderRadius: isTablet ? 24 : 20,
                    android_ripple: { color: 'rgba(255,255,255,0.3)', borderless: true },
                  }
                ]}
              >
                <Icon name="bell" size={isAndroid ? (isTablet ? 22 : 18) : (isTablet ? 24 : 20)} color="#fff" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Rest of your component... */}
          {/* PERSONAL INFO */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                shadowColor: isDark ? '#000' : '#000',
                marginHorizontal: cardMargin,
                marginTop: isAndroid ? (isTablet ? -20 : -16) : (isTablet ? -24 : -18),
                borderRadius: borderRadius,
                padding: isAndroid ? (isTablet ? 20 : 16) : (isTablet ? 24 : 20),
                shadowOffset: { width: 0, height: isAndroid ? 2 : (isTablet ? 6 : 4) },
                shadowRadius: isAndroid ? 4 : (isTablet ? 12 : 8),
                elevation: isAndroid ? (isTablet ? 8 : 4) : (isTablet ? 6 : 4),
              }
            ]}
          >
            <View style={[
              styles.sectionHeader,
              {
                marginBottom: isAndroid ? (isTablet ? 20 : 16) : (isTablet ? 24 : 20),
              }
            ]}>
              <Text style={[
                styles.cardTitle,
                {
                  color: colors.text,
                  fontSize: isAndroid ? (isTablet ? 24 : 20) : (isTablet ? 22 : 18),
                  fontWeight: androidFontWeightBold,
                }
              ]}>
                Personal Information
              </Text>
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: colors.primaryBackground,
                    width: isTablet ? 40 : 34,
                    height: isTablet ? 40 : 34,
                    borderRadius: isTablet ? 20 : 17,
                  }
                ]}
              >
                <Icon name="user" size={isAndroid ? (isTablet ? 18 : 16) : (isTablet ? 20 : 16)} color={colors.primary} />
              </View>
            </View>

            <View style={[
              styles.infoRow,
              { marginBottom: isAndroid ? (isTablet ? 16 : 12) : (isTablet ? 20 : 16) }
            ]}>
              <Text style={[
                styles.label,
                {
                  color: colors.textMuted,
                  fontSize: isAndroid ? (isTablet ? 12 : 12) : (isTablet ? 14 : 12),
                  marginBottom: isAndroid ? (isTablet ? 4 : 3) : (isTablet ? 6 : 4),
                  letterSpacing: isAndroid ? 0.5 : (isTablet ? 1 : 0.7),
                  fontWeight: isAndroid ? '500' : '400',
                }
              ]}>
                Email
              </Text>
              <Text style={[
                styles.value,
                {
                  color: colors.text,
                  fontSize: isAndroid ? (isTablet ? 15 : 15) : (isTablet ? 17 : 15),
                  fontWeight: isAndroid ? '600' : '600',
                }
              ]}>
                {user?.email || '—'}
              </Text>
            </View>

            <View style={[
              styles.infoRow,
              { marginBottom: isAndroid ? (isTablet ? 16 : 12) : (isTablet ? 20 : 16) }
            ]}>
              <Text style={[
                styles.label,
                {
                  color: colors.textMuted,
                  fontSize: isAndroid ? (isTablet ? 14 : 12) : (isTablet ? 14 : 12),
                  marginBottom: isAndroid ? (isTablet ? 4 : 3) : (isTablet ? 6 : 4),
                  letterSpacing: isAndroid ? 0.5 : (isTablet ? 1 : 0.7),
                  fontWeight: isAndroid ? '500' : '400',
                }
              ]}>
                Contact
              </Text>
              <Text style={[
                styles.value,
                {
                  color: colors.text,
                  fontSize: isAndroid ? (isTablet ? 18 : 15) : (isTablet ? 17 : 15),
                  fontWeight: isAndroid ? '600' : '600',
                }
              ]}>
                {user?.contact || '—'}
              </Text>
            </View>

            <View style={[
              styles.infoRow,
              { marginBottom: isAndroid ? (isTablet ? 16 : 12) : (isTablet ? 20 : 16) }
            ]}>
              <Text style={[
                styles.label,
                {
                  color: colors.textMuted,
                  fontSize: isAndroid ? (isTablet ? 14 : 12) : (isTablet ? 14 : 12),
                  marginBottom: isAndroid ? (isTablet ? 4 : 3) : (isTablet ? 6 : 4),
                  letterSpacing: isAndroid ? 0.5 : (isTablet ? 1 : 0.7),
                  fontWeight: isAndroid ? '500' : '400',
                }
              ]}>
                Location
              </Text>
              <Text style={[
                styles.value,
                {
                  color: colors.text,
                  fontSize: isAndroid ? (isTablet ? 18 : 15) : (isTablet ? 17 : 15),
                  fontWeight: isAndroid ? '600' : '600',
                }
              ]}>
                {user?.city && user?.state
                  ? `${user?.city}, ${user?.state}`
                  : '—'}
              </Text>
            </View>

            <View style={[
              styles.infoRow,
              { marginBottom: 0 }
            ]}>
              <Text style={[
                styles.label,
                {
                  color: colors.textMuted,
                  fontSize: isAndroid ? (isTablet ? 14 : 12) : (isTablet ? 14 : 12),
                  marginBottom: isAndroid ? (isTablet ? 4 : 3) : (isTablet ? 6 : 4),
                  letterSpacing: isAndroid ? 0.5 : (isTablet ? 1 : 0.7),
                  fontWeight: isAndroid ? '500' : '400',
                }
              ]}>
                Country
              </Text>
              <Text style={[
                styles.value,
                {
                  color: colors.text,
                  fontSize: isAndroid ? (isTablet ? 18 : 15) : (isTablet ? 17 : 15),
                  fontWeight: isAndroid ? '600' : '600',
                }
              ]}>
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
                style={[
                  styles.renewBtn,
                  {
                    marginHorizontal: cardMargin,
                    marginTop: isAndroid ? (isTablet ? 18 : 14) : (isTablet ? 22 : 18),
                    borderRadius: isTablet ? 20 : 18,
                    android_ripple: { color: 'rgba(255,255,255,0.3)', borderless: true },
                  }
                ]}
                activeOpacity={0.9}
                onPress={handleRenewPlan}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark || '#8f0205']}
                  style={[
                    styles.renewGradient,
                    {
                      paddingVertical: isAndroid ? (isTablet ? 18 : 14) : (isTablet ? 22 : 18),
                    }
                  ]}
                >
                  <Icon name="refresh-cw" size={isAndroid ? (isTablet ? 20 : 16) : (isTablet ? 22 : 18)} color="#fff" />
                  <Text style={[
                    styles.renewText,
                    {
                      fontSize: isAndroid ? (isTablet ? 15 : 13) : (isTablet ? 17 : 15),
                      marginLeft: isAndroid ? (isTablet ? 8 : 6) : (isTablet ? 12 : 10),
                      fontWeight: isAndroid ? '700' : '700',
                    }
                  ]}>
                    Renew Plan ({remainingDays} day
                    {remainingDays > 1 ? 's' : ''} left)
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

          {/* UPGRADE / CHANGE PLAN */}
          <TouchableOpacity
            style={[
              styles.upgradeBtn,
              {
                marginHorizontal: cardMargin,
                marginTop: isAndroid ? (isTablet ? 12 : 10) : (isTablet ? 16 : 14),
                borderRadius: isTablet ? 20 : 18,
                android_ripple: { color: 'rgba(255,255,255,0.2)', borderless: true },
              }
            ]}
            activeOpacity={0.9}
            onPress={handleSubscriptionPress}
          >
            <LinearGradient
              colors={['#111827', '#1f2937']}
              style={[
                styles.upgradeGradient,
                {
                  paddingVertical: isAndroid ? (isTablet ? 18 : 14) : (isTablet ? 22 : 18),
                }
              ]}
            >
              <Icon name="zap" size={isAndroid ? (isTablet ? 20 : 16) : (isTablet ? 22 : 18)} color="#fff" />
              <Text style={[
                styles.upgradeText,
                {
                  fontSize: isAndroid ? (isTablet ? 15 : 13) : (isTablet ? 17 : 15),
                  marginLeft: isAndroid ? (isTablet ? 8 : 6) : (isTablet ? 12 : 10),
                  fontWeight: isAndroid ? '700' : '700',
                }
              ]}>
                {isFreePlan ? 'Upgrade Plan' : 'Change Plan'}
              </Text>
              <Icon
                name="arrow-up-right"
                size={isAndroid ? (isTablet ? 20 : 16) : (isTablet ? 22 : 18)}
                color="#fff"
                style={{ marginLeft: isAndroid ? (isTablet ? 6 : 4) : (isTablet ? 10 : 8) }}
              />
            </LinearGradient>
          </TouchableOpacity>

          {/* CURRENT SUBSCRIPTION */}
          <View
            style={[
              styles.subscriptionCard,
              {
                marginHorizontal: cardMargin,
                marginTop: isAndroid ? (isTablet ? 18 : 14) : (isTablet ? 22 : 18),
                borderRadius: isTablet ? 26 : 24,
                shadowOffset: { width: 0, height: isAndroid ? 2 : (isTablet ? 6 : 4) },
                shadowRadius: isAndroid ? 4 : (isTablet ? 12 : 8),
                elevation: isAndroid ? (isTablet ? 8 : 4) : (isTablet ? 6 : 4),
              }
            ]}
          >
            <LinearGradient
              colors={isDark ? ['#1a1a1a', '#2a1a1a'] : ['#ffffff', '#fff5f5']}
              style={[
                styles.subscriptionInner,
                {
                  padding: isAndroid ? (isTablet ? 20 : 16) : (isTablet ? 24 : 20),
                }
              ]}
            >
              <View style={styles.subscriptionHeader}>
                <View>
                  <Text
                    style={[
                      styles.subscriptionTitle,
                      {
                        color: colors.textSecondary,
                        fontSize: isAndroid ? (isTablet ? 16 : 14) : (isTablet ? 17 : 15),
                        marginBottom: isAndroid ? (isTablet ? 4 : 3) : (isTablet ? 6 : 4),
                        fontWeight: isAndroid ? '500' : '400',
                      }
                    ]}
                  >
                    Current Subscription
                  </Text>
                  <Text style={[
                    styles.planName,
                    {
                      color: colors.text,
                      fontSize: isAndroid ? (isTablet ? 30 : 24) : (isTablet ? 30 : 24),
                      fontWeight: androidFontWeightBold,
                    }
                  ]}>
                    {subscription?.plan?.name || 'No Plan'}
                  </Text>
                </View>
                <View
                  style={[
                    styles.durationBadge,
                    {
                      backgroundColor: colors.primary,
                      paddingHorizontal: isAndroid ? (isTablet ? 18 : 14) : (isTablet ? 18 : 14),
                      paddingVertical: isAndroid ? (isTablet ? 9 : 7) : (isTablet ? 9 : 7),
                      borderRadius: isTablet ? 32 : 30,
                      elevation: isAndroid ? 4 : 0,
                    }
                  ]}
                >
                  <Text style={[
                    styles.durationText,
                    {
                      fontSize: isAndroid ? (isTablet ? 14 : 12) : (isTablet ? 14 : 12),
                      fontWeight: isAndroid ? '700' : '700',
                    }
                  ]}>
                    {currentPlanDuration}
                  </Text>
                </View>
              </View>

              <View style={[
                styles.statusRow,
                { marginTop: isAndroid ? (isTablet ? 18 : 14) : (isTablet ? 22 : 18) }
              ]}>
                <View
                  style={[
                    styles.activeDot,
                    {
                      backgroundColor: isActive ? colors.success : colors.primary,
                      width: isAndroid ? (isTablet ? 12 : 10) : (isTablet ? 12 : 10),
                      height: isAndroid ? (isTablet ? 12 : 10) : (isTablet ? 12 : 10),
                      borderRadius: isAndroid ? (isTablet ? 6 : 5) : (isTablet ? 6 : 5),
                      marginRight: isAndroid ? (isTablet ? 10 : 8) : (isTablet ? 10 : 8),
                    }
                  ]}
                />
                <Text
                  style={[
                    styles.activeText,
                    {
                      color: isActive ? colors.success : colors.primary,
                      fontSize: isAndroid ? (isTablet ? 16 : 14) : (isTablet ? 16 : 14),
                      fontWeight: isAndroid ? '700' : '700',
                    }
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
                    marginTop: isAndroid ? (isTablet ? 18 : 16) : (isTablet ? 18 : 16),
                    borderRadius: isTablet ? 16 : 14,
                    paddingHorizontal: isAndroid ? (isTablet ? 16 : 12) : (isTablet ? 20 : 16),
                    paddingVertical: isAndroid ? (isTablet ? 16 : 14) : (isTablet ? 16 : 14),
                    shadowOffset: { width: 0, height: isAndroid ? 1 : (isTablet ? 3 : 2) },
                    shadowRadius: isAndroid ? 2 : (isTablet ? 6 : 4),
                    elevation: isAndroid ? (isTablet ? 4 : 2) : (isTablet ? 4 : 2),
                  }
                ]}
              >
                <View style={styles.remainingLeft}>
                  <Icon name="clock" size={isAndroid ? (isTablet ? 20 : 16) : (isTablet ? 20 : 16)} color={colors.primary} />
                  <Text
                    style={[
                      styles.remainingLabel,
                      {
                        color: colors.textSecondary,
                        fontSize: isAndroid ? (isTablet ? 15 : 13) : (isTablet ? 15 : 13),
                        marginLeft: isAndroid ? (isTablet ? 10 : 8) : (isTablet ? 10 : 8),
                        fontWeight: isAndroid ? '600' : '600',
                      }
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
                      fontSize: isAndroid ? (isTablet ? 17 : 15) : (isTablet ? 17 : 15),
                      fontWeight: isAndroid ? '800' : '800',
                    }
                  ]}
                >
                  {remainingDaysLabel}
                </Text>
              </View>

              <View
                style={[
                  styles.divider,
                  {
                    backgroundColor: colors.border,
                    height: isAndroid ? 0.5 : 1,
                    marginVertical: isAndroid ? (isTablet ? 22 : 18) : (isTablet ? 22 : 18),
                  }
                ]}
              />

              <View style={[
                styles.detailGrid,
                {
                  gap: isAndroid ? (isTablet ? 12 : 8) : (isTablet ? 12 : 8),
                }
              ]}>
                <View
                  style={[
                    styles.detailBox,
                    {
                      backgroundColor: colors.background,
                      width: isAndroid ? '48%' : '48%',
                      borderRadius: isTablet ? 14 : 12,
                      padding: isAndroid ? (isTablet ? 16 : 14) : (isTablet ? 16 : 14),
                      marginBottom: isAndroid ? (isTablet ? 14 : 12) : (isTablet ? 14 : 12),
                      elevation: isAndroid ? 2 : 0,
                    }
                  ]}
                >
                  <Text style={[
                    styles.detailLabel,
                    {
                      color: colors.textMuted,
                      fontSize: isAndroid ? (isTablet ? 14 : 12) : (isTablet ? 14 : 12),
                      marginBottom: isAndroid ? (isTablet ? 8 : 6) : (isTablet ? 8 : 6),
                      fontWeight: isAndroid ? '500' : '400',
                    }
                  ]}>
                    Start Date
                  </Text>
                  <Text style={[
                    styles.detailValue,
                    {
                      color: colors.text,
                      fontSize: isAndroid ? (isTablet ? 16 : 14) : (isTablet ? 16 : 14),
                      fontWeight: isAndroid ? '700' : '700',
                    }
                  ]}>
                    {formatDate(subscription?.start_date)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.detailBox,
                    {
                      backgroundColor: colors.background,
                      width: isAndroid ? '48%' : '48%',
                      borderRadius: isTablet ? 14 : 12,
                      padding: isAndroid ? (isTablet ? 16 : 14) : (isTablet ? 16 : 14),
                      marginBottom: isAndroid ? (isTablet ? 14 : 12) : (isTablet ? 14 : 12),
                      elevation: isAndroid ? 2 : 0,
                    }
                  ]}
                >
                  <Text style={[
                    styles.detailLabel,
                    {
                      color: colors.textMuted,
                      fontSize: isAndroid ? (isTablet ? 14 : 12) : (isTablet ? 14 : 12),
                      marginBottom: isAndroid ? (isTablet ? 8 : 6) : (isTablet ? 8 : 6),
                      fontWeight: isAndroid ? '500' : '400',
                    }
                  ]}>
                    End Date
                  </Text>
                  <Text style={[
                    styles.detailValue,
                    {
                      color: colors.text,
                      fontSize: isAndroid ? (isTablet ? 16 : 14) : (isTablet ? 16 : 14),
                      fontWeight: isAndroid ? '700' : '700',
                    }
                  ]}>
                    {formatDate(subscription?.end_date)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.detailBox,
                    {
                      backgroundColor: colors.background,
                      width: isAndroid ? '48%' : '48%',
                      borderRadius: isTablet ? 14 : 12,
                      padding: isAndroid ? (isTablet ? 16 : 14) : (isTablet ? 16 : 14),
                      marginBottom: isAndroid ? (isTablet ? 14 : 12) : (isTablet ? 14 : 12),
                      elevation: isAndroid ? 2 : 0,
                    }
                  ]}
                >
                  <Text style={[
                    styles.detailLabel,
                    {
                      color: colors.textMuted,
                      fontSize: isAndroid ? (isTablet ? 14 : 12) : (isTablet ? 14 : 12),
                      marginBottom: isAndroid ? (isTablet ? 8 : 6) : (isTablet ? 8 : 6),
                      fontWeight: isAndroid ? '500' : '400',
                    }
                  ]}>
                    Amount
                  </Text>
                  <Text style={[
                    styles.detailValue,
                    {
                      color: colors.text,
                      fontSize: isAndroid ? (isTablet ? 16 : 14) : (isTablet ? 16 : 14),
                      fontWeight: isAndroid ? '700' : '700',
                    }
                  ]}>
                    ₹{subscription?.total_amount || 0}
                  </Text>
                </View>
                <View
                  style={[
                    styles.detailBox,
                    {
                      backgroundColor: colors.background,
                      width: isAndroid ? '48%' : '48%',
                      borderRadius: isTablet ? 14 : 12,
                      padding: isAndroid ? (isTablet ? 16 : 14) : (isTablet ? 16 : 14),
                      marginBottom: isAndroid ? (isTablet ? 14 : 12) : (isTablet ? 14 : 12),
                      elevation: isAndroid ? 2 : 0,
                    }
                  ]}
                >
                  <Text style={[
                    styles.detailLabel,
                    {
                      color: colors.textMuted,
                      fontSize: isAndroid ? (isTablet ? 14 : 12) : (isTablet ? 14 : 12),
                      marginBottom: isAndroid ? (isTablet ? 8 : 6) : (isTablet ? 8 : 6),
                      fontWeight: isAndroid ? '500' : '400',
                    }
                  ]}>
                    Plan Type
                  </Text>
                  <Text style={[
                    styles.detailValue,
                    {
                      color: colors.text,
                      fontSize: isAndroid ? (isTablet ? 16 : 14) : (isTablet ? 16 : 14),
                      fontWeight: isAndroid ? '700' : '700',
                    }
                  ]}>
                    {subscription?.purchase_type || 'NEW'}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* UPCOMING PLANS */}
          {upcomingPlans.length > 0 && (
            <View style={[
              styles.upcomingWrapper,
              {
                marginHorizontal: cardMargin,
                marginTop: isAndroid ? (isTablet ? 24 : 20) : (isTablet ? 24 : 20),
              }
            ]}>
              <View style={[
                styles.upcomingHeadingRow,
                {
                  marginBottom: isAndroid ? (isTablet ? 18 : 14) : (isTablet ? 18 : 14),
                }
              ]}>
                <Icon name="clock" size={isAndroid ? (isTablet ? 22 : 18) : (isTablet ? 22 : 18)} color={colors.primary} />
                <Text style={[
                  styles.upcomingHeading,
                  {
                    color: colors.text,
                    fontSize: isAndroid ? (isTablet ? 24 : 20) : (isTablet ? 24 : 20),
                    marginLeft: isAndroid ? (isTablet ? 10 : 8) : (isTablet ? 10 : 8),
                    fontWeight: androidFontWeightBold,
                  }
                ]}>
                  Upcoming Plans
                </Text>
                <View
                  style={[
                    styles.upcomingCount,
                    {
                      backgroundColor: colors.primary,
                      marginLeft: isAndroid ? (isTablet ? 12 : 10) : (isTablet ? 12 : 10),
                      minWidth: isAndroid ? (isTablet ? 28 : 24) : (isTablet ? 28 : 24),
                      height: isAndroid ? (isTablet ? 28 : 24) : (isTablet ? 28 : 24),
                      borderRadius: isAndroid ? (isTablet ? 14 : 12) : (isTablet ? 14 : 12),
                      paddingHorizontal: isAndroid ? (isTablet ? 8 : 6) : (isTablet ? 8 : 6),
                      elevation: isAndroid ? 4 : 0,
                    }
                  ]}
                >
                  <Text style={[
                    styles.upcomingCountText,
                    {
                      fontSize: isAndroid ? (isTablet ? 14 : 12) : (isTablet ? 14 : 12),
                      fontWeight: isAndroid ? '700' : '700',
                    }
                  ]}>
                    {upcomingPlans.length}
                  </Text>
                </View>
              </View>

              {upcomingPlans.map((item: Subscription, index: number) => {
                const expanded = expandedPlans.includes(index);
                const duration = `${item?.plan?.duration_value || ''} ${item?.plan?.duration_unit || ''
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
                        borderRadius: isTablet ? 22 : 20,
                        marginBottom: isAndroid ? (isTablet ? 18 : 14) : (isTablet ? 18 : 14),
                        borderLeftWidth: isAndroid ? (isTablet ? 5 : 4) : (isTablet ? 5 : 4),
                        shadowOffset: { width: 0, height: isAndroid ? 1 : (isTablet ? 3 : 2) },
                        shadowRadius: isAndroid ? 2 : (isTablet ? 7 : 5),
                        elevation: isAndroid ? (isTablet ? 4 : 2) : (isTablet ? 4 : 3),
                      }
                    ]}
                  >
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => togglePlan(index)}
                      style={[
                        styles.todoHeader,
                        {
                          padding: isAndroid ? (isTablet ? 22 : 18) : (isTablet ? 22 : 18),
                          android_ripple: { color: 'rgba(0,0,0,0.1)', borderless: true },
                        }
                      ]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[
                          styles.todoTitle,
                          {
                            color: colors.text,
                            fontSize: isAndroid ? (isTablet ? 19 : 17) : (isTablet ? 19 : 17),
                            fontWeight: androidFontWeightBold,
                          }
                        ]}>
                          {item?.plan?.name || 'Plan'}
                        </Text>
                        <Text
                          style={[
                            styles.todoSub,
                            {
                              color: colors.textSecondary,
                              fontSize: isAndroid ? (isTablet ? 15 : 13) : (isTablet ? 15 : 13),
                              marginTop: isAndroid ? (isTablet ? 6 : 4) : (isTablet ? 6 : 4),
                              fontWeight: isAndroid ? '500' : '400',
                            }
                          ]}
                        >
                          {duration}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.pendingBadge,
                          {
                            backgroundColor: isDark ? '#2d1a1a' : '#fff3e8',
                            paddingHorizontal: isAndroid ? (isTablet ? 14 : 12) : (isTablet ? 14 : 12),
                            paddingVertical: isAndroid ? (isTablet ? 8 : 6) : (isTablet ? 8 : 6),
                            borderRadius: isTablet ? 32 : 30,
                          }
                        ]}
                      >
                        <Text
                          style={[
                            styles.pendingBadgeText,
                            {
                              color: isDark ? '#ff8a00' : '#ff8a00',
                              fontSize: isAndroid ? (isTablet ? 13 : 11) : (isTablet ? 13 : 11),
                              fontWeight: isAndroid ? '700' : '700',
                            }
                          ]}
                        >
                          {item?.status || 'PENDING'}
                        </Text>
                      </View>
                      <Icon
                        name="chevron-down"
                        size={isAndroid ? (isTablet ? 26 : 22) : (isTablet ? 26 : 22)}
                        color={colors.text}
                        style={{
                          marginLeft: isAndroid ? (isTablet ? 16 : 12) : (isTablet ? 16 : 12),
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
                          paddingBottom: expanded ? (isAndroid ? (isTablet ? 22 : 18) : (isTablet ? 22 : 18)) : 0,
                          paddingHorizontal: isAndroid ? (isTablet ? 22 : 18) : (isTablet ? 22 : 18),
                        }
                      ]}
                    >
                      <View style={[
                        styles.detailGrid,
                        {
                          gap: isAndroid ? (isTablet ? 12 : 8) : (isTablet ? 12 : 8),
                        }
                      ]}>
                        <View
                          style={[
                            styles.detailBox,
                            {
                              backgroundColor: colors.background,
                              width: isAndroid ? '48%' : '48%',
                              borderRadius: isTablet ? 14 : 12,
                              padding: isAndroid ? (isTablet ? 16 : 14) : (isTablet ? 16 : 14),
                              marginBottom: isAndroid ? (isTablet ? 14 : 12) : (isTablet ? 14 : 12),
                              elevation: isAndroid ? 2 : 0,
                            }
                          ]}
                        >
                          <Text
                            style={[
                              styles.detailLabel,
                              {
                                color: colors.textMuted,
                                fontSize: isAndroid ? (isTablet ? 14 : 12) : (isTablet ? 14 : 12),
                                marginBottom: isAndroid ? (isTablet ? 8 : 6) : (isTablet ? 8 : 6),
                                fontWeight: isAndroid ? '500' : '400',
                              }
                            ]}
                          >
                            Starts
                          </Text>
                          <Text
                            style={[
                              styles.detailValue,
                              {
                                color: colors.text,
                                fontSize: isAndroid ? (isTablet ? 16 : 14) : (isTablet ? 16 : 14),
                                fontWeight: isAndroid ? '700' : '700',
                              }
                            ]}
                          >
                            {formatDate(item?.start_date)}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.detailBox,
                            {
                              backgroundColor: colors.background,
                              width: isAndroid ? '48%' : '48%',
                              borderRadius: isTablet ? 14 : 12,
                              padding: isAndroid ? (isTablet ? 16 : 14) : (isTablet ? 16 : 14),
                              marginBottom: isAndroid ? (isTablet ? 14 : 12) : (isTablet ? 14 : 12),
                              elevation: isAndroid ? 2 : 0,
                            }
                          ]}
                        >
                          <Text
                            style={[
                              styles.detailLabel,
                              {
                                color: colors.textMuted,
                                fontSize: isAndroid ? (isTablet ? 14 : 12) : (isTablet ? 14 : 12),
                                marginBottom: isAndroid ? (isTablet ? 8 : 6) : (isTablet ? 8 : 6),
                                fontWeight: isAndroid ? '500' : '400',
                              }
                            ]}
                          >
                            Ends
                          </Text>
                          <Text
                            style={[
                              styles.detailValue,
                              {
                                color: colors.text,
                                fontSize: isAndroid ? (isTablet ? 16 : 14) : (isTablet ? 16 : 14),
                                fontWeight: isAndroid ? '700' : '700',
                              }
                            ]}
                          >
                            {formatDate(item?.end_date)}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.detailBox,
                            {
                              backgroundColor: colors.background,
                              width: isAndroid ? '48%' : '48%',
                              borderRadius: isTablet ? 14 : 12,
                              padding: isAndroid ? (isTablet ? 16 : 14) : (isTablet ? 16 : 14),
                              marginBottom: isAndroid ? (isTablet ? 14 : 12) : (isTablet ? 14 : 12),
                              elevation: isAndroid ? 2 : 0,
                            }
                          ]}
                        >
                          <Text
                            style={[
                              styles.detailLabel,
                              {
                                color: colors.textMuted,
                                fontSize: isAndroid ? (isTablet ? 14 : 12) : (isTablet ? 14 : 12),
                                marginBottom: isAndroid ? (isTablet ? 8 : 6) : (isTablet ? 8 : 6),
                                fontWeight: isAndroid ? '500' : '400',
                              }
                            ]}
                          >
                            Amount
                          </Text>
                          <Text
                            style={[
                              styles.detailValue,
                              {
                                color: colors.text,
                                fontSize: isAndroid ? (isTablet ? 16 : 14) : (isTablet ? 16 : 14),
                                fontWeight: isAndroid ? '700' : '700',
                              }
                            ]}
                          >
                            ₹{item?.total_amount || 0}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.detailBox,
                            {
                              backgroundColor: colors.background,
                              width: isAndroid ? '48%' : '48%',
                              borderRadius: isTablet ? 14 : 12,
                              padding: isAndroid ? (isTablet ? 16 : 14) : (isTablet ? 16 : 14),
                              marginBottom: isAndroid ? (isTablet ? 14 : 12) : (isTablet ? 14 : 12),
                              elevation: isAndroid ? 2 : 0,
                            }
                          ]}
                        >
                          <Text
                            style={[
                              styles.detailLabel,
                              {
                                color: colors.textMuted,
                                fontSize: isAndroid ? (isTablet ? 14 : 12) : (isTablet ? 14 : 12),
                                marginBottom: isAndroid ? (isTablet ? 8 : 6) : (isTablet ? 8 : 6),
                                fontWeight: isAndroid ? '500' : '400',
                              }
                            ]}
                          >
                            Purchase
                          </Text>
                          <Text
                            style={[
                              styles.detailValue,
                              {
                                color: colors.text,
                                fontSize: isAndroid ? (isTablet ? 16 : 14) : (isTablet ? 16 : 14),
                                fontWeight: isAndroid ? '700' : '700',
                              }
                            ]}
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
                marginHorizontal: cardMargin,
                marginTop: isAndroid ? (isTablet ? 14 : 10) : (isTablet ? 28 : 24),
                borderRadius: isTablet ? 16 : 14,
                paddingVertical: isAndroid ? (isTablet ? 17 : 15) : (isTablet ? 18 : 16),
                paddingHorizontal: isAndroid ? (isTablet ? 20 : 16) : (isTablet ? 24 : 20),
                borderWidth: isAndroid ? 0.5 : 1,
                shadowOffset: { width: 0, height: isAndroid ? 1 : (isTablet ? 3 : 2) },
                shadowRadius: isAndroid ? 2 : (isTablet ? 8 : 6),
                elevation: isAndroid ? (isTablet ? 4 : 2) : (isTablet ? 4 : 2),
                android_ripple: { color: 'rgba(0,0,0,0.05)', borderless: true },
              }
            ]}
            activeOpacity={0.85}
            onPress={handleInvoicePress}
          >
            <Icon name="file-text" size={isAndroid ? (isTablet ? 24 : 20) : (isTablet ? 22 : 18)} color={colors.text} />
            <Text style={[
              styles.invoiceBtnText,
              {
                color: colors.text,
                fontSize: isAndroid ? (isTablet ? 18 : 16) : (isTablet ? 18 : 16),
                fontWeight: isAndroid ? '600' : '700',
              }
            ]}>
              Invoices
            </Text>
            <Icon name="arrow-right" size={isAndroid ? (isTablet ? 22 : 18) : (isTablet ? 22 : 18)} color={colors.text} />
          </TouchableOpacity>

          {/* LOGOUT BUTTON */}
          <TouchableOpacity
            style={[
              styles.logoutBtn,
              {
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
                marginHorizontal: cardMargin,
                marginTop: isAndroid ? (isTablet ? 24 : 20) : (isTablet ? 24 : 20),
                marginBottom: isAndroid ? (isTablet ? 20 : 16) : (isTablet ? 20 : 16),
                borderRadius: isTablet ? 16 : 14,
                paddingVertical: isAndroid ? (isTablet ? 17 : 15) : (isTablet ? 18 : 16),
                shadowOffset: { width: 0, height: isAndroid ? 2 : (isTablet ? 6 : 4) },
                shadowRadius: isAndroid ? 4 : (isTablet ? 12 : 8),
                elevation: isAndroid ? (isTablet ? 8 : 4) : (isTablet ? 6 : 4),
                android_ripple: { color: 'rgba(255,255,255,0.3)', borderless: true },
              }
            ]}
            activeOpacity={0.85}
            onPress={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <ActivityIndicator color="#fff" size={isAndroid ? (isSmallDevice ? 'small' : 'small') : 'large'} />
            ) : (
              <>
                <Icon name="log-out" size={isAndroid ? (isTablet ? 22 : 18) : (isTablet ? 22 : 18)} color="#fff" />
                <Text style={[
                  styles.logoutBtnText,
                  {
                    fontSize: isAndroid ? (isTablet ? 18 : 16) : (isTablet ? 18 : 16),
                    fontWeight: isAndroid ? '700' : '700',
                  }
                ]}>
                  Logout
                </Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.versionContainer}>
            <Text style={[
              styles.versionText,
              {
                color: colors.textMuted,
                fontSize: moderateScale(isTablet ? 14 : 11),
              }
            ]}>
              Version 1.0.0
            </Text>
          </View>
        </ScrollView>
        <ConfirmationModal
          visible={showLogoutModal}
          title="Logout"
          message="Are you sure you want to logout from your account?"
          confirmText="Logout"
          cancelText="Cancel"
          loading={isLoggingOut}
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={performLogout}
        />
      </View>
    </SafeAreaView>
  );
};

// ------ STYLES (Unchanged) ------

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
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingBottom: 20,
  },

  versionText: {
    fontWeight: '500',
    opacity: 0.6,
  },
});

export default DashboardScreen;