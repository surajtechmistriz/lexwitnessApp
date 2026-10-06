// screens/auth/screens/ResetPassword.tsx
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
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import { useTheme } from '../../store/hooks/useTheme';
import { resetPassword } from '../../services/auth.service';
// import { useTheme } from '../../../store/hooks/useTheme';

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
// const isLargeTablet = width >= 1024;

const THEME = {
  primary: '#c9060a',
  primaryDark: '#a80508',
  dark: '#1F2937',
  lightGray: '#F9FAFB',
  border: '#E5E7EB',
  white: '#FFFFFF',
  grayText: '#6B7280',
  error: '#EF4444',
  success: '#10B981',
};

const ResetPasswordScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { colors, isDark } = useTheme();

  const token = route.params?.token;
  const email = route.params?.email;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      setError('Password is required');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await resetPassword({
        token,
        email,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      if (response?.status) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Password reset successfully',
        });

        navigation.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        });
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message || 'Failed to reset password';

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

  // Responsive values
  const headerPaddingTop = verticalScale(
    isSmallDevice ? 40 : isTablet ? 70 : 50,
  );
  const headerPaddingBottom = verticalScale(
    isSmallDevice ? 40 : isTablet ? 70 : 50,
  );
  const formMarginTop = verticalScale(isTablet ? -30 : -20);
  const formPaddingHorizontal = scale(isTablet ? 32 : 24);
  const formPaddingTop = verticalScale(isTablet ? 36 : 32);
  const formPaddingBottom = verticalScale(isTablet ? 44 : 40);

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
                top: verticalScale(isSmallDevice ? 16 : 20),
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
              color="#fff"
            />
          </TouchableOpacity>

          <LinearGradient
            colors={[THEME.primary, THEME.primaryDark]}
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
            <Text
              style={[
                styles.header,
                {
                  fontSize: moderateScale(isTablet ? 42 : 34),
                  marginBottom: verticalScale(isTablet ? 10 : 8),
                },
              ]}
            >
              Reset Password
            </Text>
            <Text
              style={[
                styles.subText,
                {
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: moderateScale(isTablet ? 18 : 16),
                },
              ]}
            >
              Enter your new password below
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
                paddingTop: formPaddingTop,
                paddingBottom: formPaddingBottom,
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
                  color={THEME.error}
                />
                <Text
                  style={[
                    styles.errorText,
                    {
                      color: THEME.error,
                      fontSize: moderateScale(isTablet ? 15 : 14),
                      marginLeft: scale(isTablet ? 12 : 10),
                    },
                  ]}
                >
                  {error}
                </Text>
              </View>
            ) : null}

            {/* New Password */}
            <View
              style={[
                styles.inputGroup,
                { marginBottom: verticalScale(isTablet ? 24 : 20) },
              ]}
            >
              <Text
                style={[
                  styles.label,
                  {
                    color: colors.text,
                    fontSize: moderateScale(isTablet ? 15 : 14),
                    marginBottom: verticalScale(isTablet ? 10 : 8),
                    marginLeft: scale(isTablet ? 6 : 4),
                  },
                ]}
              >
                New Password
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: isDark
                      ? colors.background
                      : THEME.lightGray,
                    borderColor: newPassword
                      ? THEME.primary
                      : isDark
                      ? colors.border
                      : THEME.border,
                    borderWidth: 1.5,
                    borderRadius: scale(isTablet ? 18 : 16),
                    paddingHorizontal: scale(isTablet ? 18 : 16),
                    paddingVertical: isTablet ? 4 : 0,
                  },
                  newPassword && styles.inputWrapperFilled,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={moderateScale(isTablet ? 22 : 20)}
                  color={colors.textMuted}
                  style={[
                    styles.inputIcon,
                    { marginRight: scale(isTablet ? 14 : 12) },
                  ]}
                />
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                  style={[
                    styles.input,
                    {
                      color: colors.text,
                      paddingVertical: verticalScale(isTablet ? 18 : 16),
                      fontSize: moderateScale(isTablet ? 16 : 15),
                    },
                  ]}
                  placeholder="Enter new password"
                  placeholderTextColor={isDark ? '#888' : '#9CA3AF'}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={moderateScale(isTablet ? 22 : 20)}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View
              style={[
                styles.inputGroup,
                { marginBottom: verticalScale(isTablet ? 24 : 20) },
              ]}
            >
              <Text
                style={[
                  styles.label,
                  {
                    color: colors.text,
                    fontSize: moderateScale(isTablet ? 15 : 14),
                    marginBottom: verticalScale(isTablet ? 10 : 8),
                    marginLeft: scale(isTablet ? 6 : 4),
                  },
                ]}
              >
                Confirm Password
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: isDark
                      ? colors.background
                      : THEME.lightGray,
                    borderColor: confirmPassword
                      ? THEME.primary
                      : isDark
                      ? colors.border
                      : THEME.border,
                    borderWidth: 1.5,
                    borderRadius: scale(isTablet ? 18 : 16),
                    paddingHorizontal: scale(isTablet ? 18 : 16),
                    paddingVertical: isTablet ? 4 : 0,
                  },
                  confirmPassword && styles.inputWrapperFilled,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={moderateScale(isTablet ? 22 : 20)}
                  color={colors.textMuted}
                  style={[
                    styles.inputIcon,
                    { marginRight: scale(isTablet ? 14 : 12) },
                  ]}
                />
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  editable={!loading}
                  style={[
                    styles.input,
                    {
                      color: colors.text,
                      paddingVertical: verticalScale(isTablet ? 18 : 16),
                      fontSize: moderateScale(isTablet ? 16 : 15),
                    },
                  ]}
                  placeholder="Confirm new password"
                  placeholderTextColor={isDark ? '#888' : '#9CA3AF'}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? 'eye-off-outline' : 'eye-outline'
                    }
                    size={moderateScale(isTablet ? 22 : 20)}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Reset Button */}
            <TouchableOpacity
              style={[
                styles.resetBtn,
                {
                  backgroundColor: colors.primary,
                  shadowColor: colors.primary,
                  paddingVertical: verticalScale(isTablet ? 18 : 16),
                  borderRadius: scale(isTablet ? 18 : 16),
                  shadowOffset: {
                    width: 0,
                    height: verticalScale(isTablet ? 6 : 4),
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: scale(isTablet ? 12 : 8),
                  elevation: isTablet ? 6 : 4,
                  marginTop: verticalScale(isTablet ? 12 : 10),
                },
                loading && styles.disabledBtn,
              ]}
              onPress={handleResetPassword}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator
                  color="#fff"
                  size={isSmallDevice ? 'small' : 'large'}
                />
              ) : (
                <Text
                  style={[
                    styles.resetBtnText,
                    {
                      fontSize: moderateScale(isTablet ? 18 : 16),
                      letterSpacing: 0.5,
                    },
                  ]}
                >
                  Reset Password
                </Text>
              )}
            </TouchableOpacity>

            {/* Back to Sign In */}
            <TouchableOpacity
              style={[
                styles.signInLink,
                { marginTop: verticalScale(isTablet ? 24 : 20) },
              ]}
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'SignIn' }],
                });
              }}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;

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
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gradientHeader: {
    alignItems: 'center',
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
  resetBtn: {
    alignItems: 'center',
    width: '100%',
  },
  disabledBtn: {
    opacity: 0.6,
  },
  resetBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  signInLink: {
    alignItems: 'center',
    width: '100%',
  },
  signInText: {
    fontWeight: '500',
  },
  signInLinkText: {
    fontWeight: '600',
  },
});
