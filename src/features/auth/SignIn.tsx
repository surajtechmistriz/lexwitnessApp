import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Linking,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';

import {
  CommonActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../store/hooks/useTheme';
import { setProfile } from '../../store/slices/authSlice';
import { getProfile } from '../../services/dashboard.service';
import { loginApi } from '../../services/auth.service';
import { STORAGE_KEYS } from '../../constant/storageKeys';

const { height, width } = Dimensions.get('window');

// Responsive utility functions
const scale = (size: number) => {
  const baseWidth = 375;
  const scaleFactor = width / baseWidth;
  return Math.round(size * Math.min(scaleFactor, 1.5));
};

const verticalScale = (size: number) => {
  const baseHeight = 667;
  const scaleFactor = height / baseHeight;
  return Math.round(size * Math.min(scaleFactor, 1.5));
};

const moderateScale = (size: number, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

const isSmallDevice = width < 375;
const isTablet = width >= 768;

const BRAND = {
  primary: '#c9060a',
  primaryDark: '#a80508',
  primaryLight: '#fef2f2',
  primaryGradient: ['#c9060a', '#c34244'],
  secondary: '#1a1a2e',
  accent: '#e63946',
  success: '#10B981',
  error: '#EF4444',
  white: '#FFFFFF',
  lightGray: '#F9FAFB',
  border: '#E5E7EB',
  grayText: '#6B7280',
  dark: '#1F2937',
};

const SignInScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();

  const route = useRoute<any>();

  useEffect(() => {
    const message = route.params?.successMessage;

    if (!message) return;

    Toast.show({
      type: 'success',
      text1: 'Registration Successful!',
      text2: message,
      position: 'top',
      visibilityTime: 4000,
    });

    navigation.setParams({
      successMessage: undefined,
    });
  }, [route.params?.successMessage, navigation]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await loginApi({
        email: email.trim(),
        password,
      });

      const data = res?.data;

      if (!data?.token || !data?.user) {
        throw new Error('Invalid login response');
      }

      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);

      const profileRes = await getProfile();

      // Adjust this based on the actual API response structure.
      const responseData = profileRes?.data?.data ?? profileRes?.data;
      const profile = responseData;

      console.log('PROFILE RESPONSE:', JSON.stringify(profile, null, 2));

      console.log(
        'SUBSCRIPTION:',
        JSON.stringify(profile?.subscription, null, 2),
      );

      await AsyncStorage.setItem('user', JSON.stringify(profile.user));
      await AsyncStorage.setItem(
        'subscription',
        JSON.stringify(profile.subscription ?? null),
      );
      await AsyncStorage.setItem(
        'nextSubscriptions',
        JSON.stringify(profile.next_subscriptions ?? []),
      );

      dispatch(
        setProfile({
          user: profile.user,
          subscription: profile.subscription ?? null,
          nextSubscriptions: profile.next_subscriptions ?? [],
        }),
      );

      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: `Welcome back, ${data.user?.first_name || 'User'} 👋`,
      });

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'MainApp',
              state: {
                routes: [
                  {
                    name: 'Dashboard',
                  },
                ],
                index: 0,
              },
            },
          ],
        }),
      );
    } catch (err: any) {
      const msg = err?.message || 'Login failed';
      setError(msg);
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  // Social Media Handlers
  const handleWhatsApp = () => {
    const phoneNumber = '+917982771770';
    const url = `https://wa.me/${phoneNumber}`;
    Linking.openURL(url).catch(() => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'WhatsApp is not installed',
      });
    });
  };

  const handlePhone = () => {
    const phoneNumber = '+917982771770';
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch(() => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Phone dialer not available',
      });
    });
  };

  const handleLinkedIn = () => {
    const url = 'https://www.linkedin.com/company/lexwitness';
    Linking.openURL(url).catch(() => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'LinkedIn not available',
      });
    });
  };

  const handleEmail = () => {
    const email = 'info@lexwitness.com';
    const url = `mailto:${email}`;
    Linking.openURL(url).catch(() => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Email client not available',
      });
    });
  };

  // Responsive values
  const headerPaddingTop = verticalScale(
    isSmallDevice ? 30 : isTablet ? 60 : 40,
  );
  const headerPaddingBottom = verticalScale(
    isSmallDevice ? 30 : isTablet ? 60 : 40,
  );
  const formMarginTop = verticalScale(isTablet ? -30 : -20);
  const formPaddingHorizontal = scale(isTablet ? 32 : 24);
  const formPaddingVertical = verticalScale(isTablet ? 32 : 28);
  const logoSize = isTablet ? 100 : 80;
  const logoIconSize = isTablet ? 50 : 40;

  // Compact glass icon sizes - slightly smaller
  const glassIconSize = isTablet ? 42 : 36;
  const glassIconInner = isTablet ? 18 : 18;

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primary}
        translucent={false}
      />
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.card }]}
        edges={['left', 'right', 'bottom']}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: verticalScale(isTablet ? 30 : 20) },
            ]}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* BACK BUTTON */}
            <TouchableOpacity
              style={[
                styles.backButton,
                {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  top: verticalScale(isSmallDevice ? 16 : 30),
                  left: scale(isSmallDevice ? 12 : 16),
                  width: scale(isTablet ? 52 : 44),
                  height: scale(isTablet ? 52 : 44),
                  borderRadius: scale(isTablet ? 35 : 30),
                },
              ]}
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Ionicons
                name="arrow-back"
                size={moderateScale(isTablet ? 28 : 24)}
                color={BRAND.white}
              />
            </TouchableOpacity>

            {/* HEADER */}
            <LinearGradient
              colors={BRAND.primaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.gradientHeader,
                {
                  paddingTop: headerPaddingTop,
                  paddingBottom: headerPaddingBottom,
                  paddingHorizontal: scale(isTablet ? 40 : 24),
                  borderBottomLeftRadius: scale(isTablet ? 40 : 30),
                  borderBottomRightRadius: scale(isTablet ? 40 : 30),
                },
              ]}
            >
              <View
                style={[
                  styles.logoContainer,
                  { marginBottom: verticalScale(isTablet ? 24 : 16) },
                ]}
              >
                <View
                  style={[
                    styles.logoCircle,
                    {
                      backgroundColor: BRAND.white,
                      width: scale(logoSize),
                      height: scale(logoSize),
                      borderRadius: scale(logoSize / 2),
                    },
                  ]}
                >
                  <Ionicons
                    name="newspaper-outline"
                    size={scale(logoIconSize)}
                    color={BRAND.primary}
                  />
                </View>
              </View>
              <Text
                style={[
                  styles.header,
                  {
                    fontSize: moderateScale(isTablet ? 36 : 28),
                    marginBottom: verticalScale(isTablet ? 8 : 6),
                  },
                ]}
              >
                Welcome Back!
              </Text>
              <Text
                style={[
                  styles.subText,
                  {
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: moderateScale(isTablet ? 17 : 15),
                  },
                ]}
              >
                Sign in to continue reading
              </Text>
            </LinearGradient>

            {/* FORM */}
            <View
              style={[
                styles.formContainer,
                {
                  backgroundColor: colors.card,
                  shadowColor: isDark ? '#000' : '#000',
                  marginTop: formMarginTop,
                  marginHorizontal: scale(isTablet ? 40 : 20),
                  borderRadius: scale(isTablet ? 35 : 30),
                  paddingHorizontal: formPaddingHorizontal,
                  paddingTop: formPaddingVertical,
                  paddingBottom: formPaddingVertical,
                  maxWidth: isTablet ? 600 : undefined,
                  alignSelf: isTablet ? 'center' : 'stretch',
                  width: isTablet ? '90%' : undefined,
                },
              ]}
            >
              {/* Error */}
              {error ? (
                <View
                  style={[
                    styles.errorContainer,
                    {
                      backgroundColor: isDark ? '#2d1a1a' : '#FEF2F2',
                      borderColor: isDark ? '#4a1a1a' : '#FEE2E2',
                      padding: verticalScale(isTablet ? 16 : 14),
                      borderRadius: scale(isTablet ? 16 : 14),
                      marginBottom: verticalScale(isTablet ? 24 : 20),
                    },
                  ]}
                >
                  <Ionicons
                    name="alert-circle"
                    size={moderateScale(isTablet ? 20 : 18)}
                    color={BRAND.error}
                  />
                  <Text
                    style={[
                      styles.errorText,
                      {
                        color: BRAND.error,
                        fontSize: moderateScale(isTablet ? 15 : 14),
                        marginLeft: scale(isTablet ? 12 : 10),
                      },
                    ]}
                  >
                    {error}
                  </Text>
                </View>
              ) : null}

              {/* Email */}
              <View
                style={[
                  styles.inputGroup,
                  { marginBottom: verticalScale(isTablet ? 22 : 18) },
                ]}
              >
                <Text
                  style={[
                    styles.label,
                    {
                      color: colors.text,
                      fontSize: moderateScale(isTablet ? 15 : 14),
                      marginBottom: verticalScale(isTablet ? 8 : 6),
                      marginLeft: scale(isTablet ? 6 : 4),
                    },
                  ]}
                >
                  Email Address
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: isDark
                        ? colors.background
                        : BRAND.lightGray,
                      borderColor: email
                        ? BRAND.primary
                        : isDark
                        ? colors.border
                        : BRAND.border,
                      borderWidth: 1.5,
                      borderRadius: scale(isTablet ? 16 : 14),
                      paddingHorizontal: scale(isTablet ? 18 : 16),
                      paddingVertical: isTablet ? 4 : 0,
                    },
                    email && styles.inputWrapperFilled,
                  ]}
                >
                  <Ionicons
                    name="mail-outline"
                    size={moderateScale(isTablet ? 22 : 20)}
                    color={email ? BRAND.primary : colors.textMuted}
                    style={[
                      styles.inputIcon,
                      { marginRight: scale(isTablet ? 14 : 12) },
                    ]}
                  />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!loading}
                    style={[
                      styles.input,
                      {
                        color: colors.text,
                        paddingVertical: verticalScale(isTablet ? 16 : 14),
                        fontSize: moderateScale(isTablet ? 16 : 15),
                      },
                    ]}
                    placeholder="Enter your email"
                    placeholderTextColor={isDark ? '#888' : '#9CA3AF'}
                  />
                  {email !== '' && !loading && (
                    <TouchableOpacity onPress={() => setEmail('')}>
                      <Ionicons
                        name="close-circle"
                        size={moderateScale(isTablet ? 20 : 18)}
                        color={colors.textMuted}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Password */}
              <View
                style={[
                  styles.inputGroup,
                  { marginBottom: verticalScale(isTablet ? 22 : 18) },
                ]}
              >
                <Text
                  style={[
                    styles.label,
                    {
                      color: colors.text,
                      fontSize: moderateScale(isTablet ? 15 : 14),
                      marginBottom: verticalScale(isTablet ? 8 : 6),
                      marginLeft: scale(isTablet ? 6 : 4),
                    },
                  ]}
                >
                  Password
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: isDark
                        ? colors.background
                        : BRAND.lightGray,
                      borderColor: password
                        ? BRAND.primary
                        : isDark
                        ? colors.border
                        : BRAND.border,
                      borderWidth: 1.5,
                      borderRadius: scale(isTablet ? 16 : 14),
                      paddingHorizontal: scale(isTablet ? 18 : 16),
                      paddingVertical: isTablet ? 4 : 0,
                    },
                    password && styles.inputWrapperFilled,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={moderateScale(isTablet ? 22 : 20)}
                    color={password ? BRAND.primary : colors.textMuted}
                    style={[
                      styles.inputIcon,
                      { marginRight: scale(isTablet ? 14 : 12) },
                    ]}
                  />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    editable={!loading}
                    style={[
                      styles.input,
                      {
                        color: colors.text,
                        paddingVertical: verticalScale(isTablet ? 16 : 14),
                        fontSize: moderateScale(isTablet ? 16 : 15),
                      },
                    ]}
                    placeholder="Enter your password"
                    placeholderTextColor={isDark ? '#888' : '#9CA3AF'}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(prev => !prev)}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={moderateScale(isTablet ? 22 : 20)}
                      color={colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Actions */}
              <View
                style={[
                  styles.actionRow,
                  {
                    marginBottom: verticalScale(isTablet ? 28 : 24),
                    marginTop: verticalScale(isTablet ? 6 : 4),
                  },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.checkboxRow,
                    { gap: scale(isTablet ? 12 : 10) },
                  ]}
                  onPress={() => setRememberMe(!rememberMe)}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkbox,
                      {
                        borderColor: rememberMe
                          ? BRAND.primary
                          : isDark
                          ? colors.border
                          : '#D1D5DB',
                        backgroundColor: rememberMe ? BRAND.primary : '#fff',
                        width: scale(isTablet ? 24 : 20),
                        height: scale(isTablet ? 24 : 20),
                        borderWidth: scale(isTablet ? 2.5 : 2),
                        borderRadius: scale(isTablet ? 8 : 6),
                      },
                      rememberMe && styles.checkboxActive,
                    ]}
                  >
                    {rememberMe && (
                      <Ionicons
                        name="checkmark"
                        size={scale(isTablet ? 14 : 12)}
                        color={BRAND.white}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.checkboxText,
                      {
                        color: colors.text,
                        fontSize: moderateScale(isTablet ? 15 : 14),
                      },
                    ]}
                  >
                    Remember me
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgetPassword')}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.forgotText,
                      {
                        color: colors.primary,
                        fontSize: moderateScale(isTablet ? 15 : 14),
                      },
                    ]}
                  >
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              {/* Login Button */}
              <TouchableOpacity
                style={[
                  styles.loginBtn,
                  {
                    height: verticalScale(isTablet ? 58 : 52),
                    width: '100%',
                    borderRadius: scale(isTablet ? 16 : 14),
                    shadowColor: BRAND.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 4,
                  },
                ]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={BRAND.primaryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: scale(isTablet ? 16 : 14),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Keep both elements mounted to prevent layout changes */}
                  <View
                    style={{
                      position: 'absolute',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%',
                      opacity: loading ? 1 : 0,
                    }}
                    pointerEvents="none"
                  >
                    <ActivityIndicator size="small" color={BRAND.white} />
                  </View>

                  <Text
                    style={{
                      color: BRAND.white,
                      fontWeight: '600',
                      fontSize: moderateScale(isTablet ? 18 : 16),
                      letterSpacing: 0.5,
                      opacity: loading ? 0 : 1,
                    }}
                  >
                    Sign In
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Sign Up Link */}
              <View
                style={[
                  styles.footerLinks,
                  {
                    marginTop: verticalScale(isTablet ? 24 : 20),
                    gap: scale(isTablet ? 8 : 6),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.noAccountText,
                    {
                      color: colors.textSecondary,
                      fontSize: moderateScale(isTablet ? 16 : 15),
                    },
                  ]}
                >
                  Don't have an account?
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Register')}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.registerLink,
                      {
                        color: colors.primary,
                        fontSize: moderateScale(isTablet ? 16 : 15),
                      },
                    ]}
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* SOCIAL ICONS - LIQUID GLASS STYLE (No Labels) */}
            <View
              style={[
                styles.socialSection,
                {
                  marginTop: verticalScale(isTablet ? 24 : 16),
                  marginBottom: verticalScale(isTablet ? 12 : 8),
                },
              ]}
            >
              <View style={styles.socialDividerContainer}>
                <View
                  style={[
                    styles.socialDivider,
                    { backgroundColor: colors.border },
                  ]}
                />
                <Text
                  style={[
                    styles.socialDividerText,
                    { color: colors.textMuted },
                  ]}
                >
                  Connect With Us
                </Text>
                <View
                  style={[
                    styles.socialDivider,
                    { backgroundColor: colors.border },
                  ]}
                />
              </View>

              {/* Liquid Glass Icons - No Labels */}
              <View
                style={[
                  styles.socialIconsContainer,
                  {
                    gap: scale(isTablet ? 20 : 8),
                    marginTop: verticalScale(isTablet ? 16 : 12),
                  },
                ]}
              >
                {/* WhatsApp */}
                <TouchableOpacity
                  style={[
                    styles.glassIconWrapper,
                    {
                      width: scale(glassIconSize),
                      height: scale(glassIconSize),
                      borderRadius: scale(glassIconSize / 2),
                      backgroundColor: isDark
                        ? 'rgba(255,255,255,0.08)'
                        : 'rgba(223, 216, 216, 0.5)',
                      borderColor: isDark
                        ? 'rgba(255,255,255,0.15)'
                        : 'rgba(255,255,255,0.6)',
                      borderWidth: 1,
                    },
                  ]}
                  onPress={handleWhatsApp}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={
                      isDark
                        ? ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.02)']
                        : ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)']
                    }
                    style={[
                      styles.glassGradient,
                      {
                        borderRadius: scale(glassIconSize / 2),
                      },
                    ]}
                  >
                    <FontAwesome
                      name="whatsapp"
                      size={scale(glassIconInner)}
                      color={isDark ? '#25D366' : '#25D366'}
                    />
                  </LinearGradient>
                </TouchableOpacity>

                {/* Phone */}
                <TouchableOpacity
                  style={[
                    styles.glassIconWrapper,
                    {
                      width: scale(glassIconSize),
                      height: scale(glassIconSize),
                      borderRadius: scale(glassIconSize / 2),
                      backgroundColor: isDark
                        ? 'rgba(255,255,255,0.08)'
                        : 'rgba(223, 216, 216, 0.5)',
                      borderColor: isDark
                        ? 'rgba(255,255,255,0.15)'
                        : 'rgba(255,255,255,0.6)',
                      borderWidth: 1,
                    },
                  ]}
                  onPress={handlePhone}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={
                      isDark
                        ? ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.02)']
                        : ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)']
                    }
                    style={[
                      styles.glassGradient,
                      {
                        borderRadius: scale(glassIconSize / 2),
                      },
                    ]}
                  >
                    <Feather
                      name="phone"
                      size={scale(glassIconInner)}
                      color={isDark ? '#4CAF50' : '#4CAF50'}
                    />
                  </LinearGradient>
                </TouchableOpacity>

                {/* LinkedIn */}
                <TouchableOpacity
                  style={[
                    styles.glassIconWrapper,
                    {
                      width: scale(glassIconSize),
                      height: scale(glassIconSize),
                      borderRadius: scale(glassIconSize / 2),
                      backgroundColor: isDark
                        ? 'rgba(255,255,255,0.08)'
                        : 'rgba(223, 216, 216, 0.5)',
                      borderColor: isDark
                        ? 'rgba(255,255,255,0.15)'
                        : 'rgba(255,255,255,0.6)',
                      borderWidth: 1,
                    },
                  ]}
                  onPress={handleLinkedIn}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={
                      isDark
                        ? ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.02)']
                        : ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)']
                    }
                    style={[
                      styles.glassGradient,
                      {
                        borderRadius: scale(glassIconSize / 2),
                      },
                    ]}
                  >
                    <FontAwesome
                      name="linkedin"
                      size={scale(glassIconInner)}
                      color={isDark ? '#0A66C2' : '#0A66C2'}
                    />
                  </LinearGradient>
                </TouchableOpacity>

                {/* Email */}
                <TouchableOpacity
                  style={[
                    styles.glassIconWrapper,
                    {
                      width: scale(glassIconSize),
                      height: scale(glassIconSize),
                      borderRadius: scale(glassIconSize / 2),
                      backgroundColor: isDark
                        ? 'rgba(255,255,255,0.08)'
                        : 'rgba(223, 216, 216, 0.5)',
                      borderColor: isDark
                        ? 'rgba(255,255,255,0.15)'
                        : 'rgba(255,255,255,0.6)',
                      borderWidth: 1,
                    },
                  ]}
                  onPress={handleEmail}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={
                      isDark
                        ? ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.02)']
                        : ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)']
                    }
                    style={[
                      styles.glassGradient,
                      {
                        borderRadius: scale(glassIconSize / 2),
                      },
                    ]}
                  >
                    <Feather
                      name="mail"
                      size={scale(glassIconInner)}
                      color={isDark ? '#EA4335' : '#EA4335'}
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            {/* VERSION INFO */}
            <View style={styles.versionContainer}>
              <Text
                style={[
                  styles.versionText,
                  {
                    color: colors.textMuted,
                    fontSize: moderateScale(isTablet ? 14 : 11),
                  },
                ]}
              >
                Version 1.0.0
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  backButton: {
    position: 'absolute',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
  },

  gradientHeader: {
    alignItems: 'center',
  },

  logoContainer: {
    alignItems: 'center',
  },

  logoCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },

  header: {
    fontWeight: '800' as const,
    color: '#FFFFFF',
    letterSpacing: -0.5,
    textAlign: 'center',
  },

  subText: {
    textAlign: 'center',
    fontWeight: '500',
  },

  formContainer: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 5,
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },

  errorText: {
    fontWeight: '500',
    flex: 1,
  },

  inputGroup: {
    width: '100%',
  },

  label: {
    fontWeight: '600' as const,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  inputWrapperFilled: {
    borderWidth: 2,
  },

  inputIcon: {
    flexShrink: 0,
  },

  input: {
    flex: 1,
    fontWeight: '500',
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxActive: {
    borderColor: BRAND.primary,
  },

  checkboxText: {
    fontWeight: '500',
  },

  forgotText: {
    fontWeight: '600' as const,
  },

  loginBtn: {
    width: '100%',
    alignSelf: 'stretch',
    flexGrow: 0,
    flexShrink: 0,
    overflow: 'hidden',
  },

  loginGradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  disabledBtn: {
    opacity: 0.6,
  },

  loginBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  noAccountText: {
    fontWeight: '400',
  },

  registerLink: {
    fontWeight: '600',
  },

  // Social Section - Liquid Glass Styles (No Labels)
  socialSection: {
    alignItems: 'center',
    width: '100%',
  },

  socialDividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
  },

  socialDivider: {
    flex: 1,
    height: 1,
  },

  socialDividerText: {
    paddingHorizontal: 16,
    fontSize: 12,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  },

  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  glassIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.08,
    // shadowRadius: 4,
    // elevation: 2,
    overflow: 'hidden',
  },

  glassGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
