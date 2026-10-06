// screens/auth/screens/ForgetPassword.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import { useTheme } from '../../store/hooks/useTheme';
import { forgotPassword } from '../../services/auth.service';

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
  primaryGradient: ['#c9060a', '#a80508'],
  white: '#FFFFFF',
  lightGray: '#F9FAFB',
  border: '#E5E7EB',
  grayText: '#6B7280',
  dark: '#1F2937',
  error: '#EF4444',
  success: '#10B981',
};

const ForgetPasswordScreen = () => {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSendResetLink = async () => {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await forgotPassword(email);

      if (response?.status) {
        setEmailSent(true);

        Toast.show({
          type: 'success',
          text1: 'Reset Link Sent',
          text2: response?.message || 'Please check your email',
        });
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message || 'Failed to send reset link';

      setError(message);

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const goToSignIn = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn' }],
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
  const iconSize = isTablet ? 100 : 80;
  const iconInnerSize = isTablet ? 50 : 40;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
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
                styles.iconContainer,
                {
                  backgroundColor: BRAND.white,
                  width: scale(iconSize),
                  height: scale(iconSize),
                  borderRadius: scale(iconSize / 2),
                  marginBottom: verticalScale(isTablet ? 24 : 16),
                  shadowOffset: {
                    width: 0,
                    height: verticalScale(isTablet ? 6 : 4),
                  },
                  shadowRadius: scale(isTablet ? 16 : 12),
                  elevation: isTablet ? 8 : 5,
                },
              ]}
            >
              <Ionicons
                name="key-outline"
                size={scale(iconInnerSize)}
                color={BRAND.primary}
              />
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
              Forgot Password
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
              Enter your email to receive a reset link
            </Text>
          </LinearGradient>

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
                shadowOffset: {
                  width: 0,
                  height: verticalScale(isTablet ? 12 : 8),
                },
                shadowRadius: scale(isTablet ? 32 : 24),
                elevation: isTablet ? 8 : 5,
              },
            ]}
          >
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

            {emailSent ? (
              <View
                style={[
                  styles.successContainer,
                  {
                    backgroundColor: isDark ? '#1a2d1a' : '#ECFDF5',
                    borderColor: isDark ? '#1a4a1a' : '#A7F3D0',
                    padding: verticalScale(isTablet ? 16 : 14),
                    borderRadius: scale(isTablet ? 16 : 14),
                    marginBottom: verticalScale(isTablet ? 24 : 20),
                  },
                ]}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={moderateScale(isTablet ? 20 : 18)}
                  color={BRAND.success}
                />
                <Text
                  style={[
                    styles.successText,
                    {
                      color: BRAND.success,
                      fontSize: moderateScale(isTablet ? 15 : 14),
                      marginLeft: scale(isTablet ? 12 : 10),
                    },
                  ]}
                >
                  Reset link sent! Please check your email.
                </Text>
              </View>
            ) : null}

            <View
              style={[
                styles.inputGroup,
                { marginBottom: verticalScale(isTablet ? 28 : 24) },
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
                  editable={!loading && !emailSent}
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
                {email !== '' && !loading && !emailSent && (
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

            {!emailSent ? (
              <TouchableOpacity
                style={[
                  styles.sendBtn,
                  loading && styles.disabledBtn,
                  {
                    shadowColor: BRAND.primary,
                    borderRadius: scale(isTablet ? 16 : 14),
                    shadowOffset: {
                      width: 0,
                      height: verticalScale(isTablet ? 6 : 4),
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: scale(isTablet ? 12 : 8),
                    elevation: isTablet ? 6 : 4,
                  },
                ]}
                onPress={handleSendResetLink}
                disabled={loading}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={BRAND.primaryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.sendGradient,
                    {
                      paddingVertical: verticalScale(isTablet ? 18 : 16),
                      borderRadius: scale(isTablet ? 16 : 14),
                    },
                  ]}
                >
                  {loading ? (
                    <ActivityIndicator
                      color={BRAND.white}
                      size={isSmallDevice ? 'small' : 'large'}
                    />
                  ) : (
                    <Text
                      style={[
                        styles.sendBtnText,
                        {
                          fontSize: moderateScale(isTablet ? 18 : 16),
                          letterSpacing: 0.5,
                        },
                      ]}
                    >
                      Send Reset Link
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <View style={{ width: '100%' }}>
                <TouchableOpacity
                  style={[
                    styles.sendBtn,
                    styles.resendBtn,
                    {
                      shadowColor: BRAND.primary,
                      borderRadius: scale(isTablet ? 16 : 14),
                      shadowOffset: {
                        width: 0,
                        height: verticalScale(isTablet ? 6 : 4),
                      },
                      shadowOpacity: 0.3,
                      shadowRadius: scale(isTablet ? 12 : 8),
                      elevation: isTablet ? 6 : 4,
                    },
                  ]}
                  onPress={handleSendResetLink}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={BRAND.primaryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                      styles.sendGradient,
                      {
                        paddingVertical: verticalScale(isTablet ? 18 : 16),
                        borderRadius: scale(isTablet ? 16 : 14),
                      },
                    ]}
                  >
                    {loading ? (
                      <ActivityIndicator
                        color={BRAND.white}
                        size={isSmallDevice ? 'small' : 'large'}
                      />
                    ) : (
                      <Text
                        style={[
                          styles.sendBtnText,
                          {
                            fontSize: moderateScale(isTablet ? 18 : 16),
                            letterSpacing: 0.5,
                          },
                        ]}
                      >
                        Resend Link
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.signInLink,
                    { marginTop: verticalScale(isTablet ? 24 : 20) },
                  ]}
                  onPress={goToSignIn}
                >
                  <Text
                    style={[
                      styles.signInText,
                      {
                        color: colors.textSecondary,
                        fontSize: moderateScale(isTablet ? 16 : 15),
                      },
                    ]}
                  >
                    Remember your password?{' '}
                    <Text
                      style={[
                        styles.signInLinkText,
                        {
                          color: colors.primary,
                          fontSize: moderateScale(isTablet ? 16 : 15),
                        },
                      ]}
                    >
                      Sign In
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {!emailSent && (
              <TouchableOpacity
                style={[
                  styles.signInLink,
                  { marginTop: verticalScale(isTablet ? 24 : 20) },
                ]}
                onPress={goToSignIn}
              >
                <Text
                  style={[
                    styles.signInText,
                    {
                      color: colors.textSecondary,
                      fontSize: moderateScale(isTablet ? 16 : 15),
                    },
                  ]}
                >
                  Remember your password?{' '}
                  <Text
                    style={[
                      styles.signInLinkText,
                      {
                        color: colors.primary,
                        fontSize: moderateScale(isTablet ? 16 : 15),
                      },
                    ]}
                  >
                    Sign In
                  </Text>
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgetPasswordScreen;

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
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  gradientHeader: {
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
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
    shadowOpacity: 0.08,
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
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  successText: {
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
  sendBtn: {
    overflow: 'hidden',
    width: '100%',
  },
  sendGradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendBtn: {
    marginTop: 12,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontWeight: '700' as const,
  },
  signInLink: {
    alignItems: 'center',
    width: '100%',
  },
  signInText: {
    fontWeight: '500',
  },
  signInLinkText: {
    fontWeight: '700' as const,
  },
});
