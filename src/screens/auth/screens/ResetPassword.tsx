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
import { useTheme } from '../../../redux/hooks/useTheme';
import { resetPassword } from '../api/auth';

const { height } = Dimensions.get('window');

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
      error?.response?.data?.message ||
      'Failed to reset password';

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]} 
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <LinearGradient
            colors={[THEME.primary, THEME.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientHeader}
          >
            <Text style={styles.header}>Reset Password</Text>
            <Text style={[styles.subText, { color: 'rgba(255,255,255,0.9)' }]}>
              Enter your new password below
            </Text>
          </LinearGradient>

          <View style={[styles.formContainer, { 
            backgroundColor: colors.card,
            shadowColor: isDark ? '#000' : '#000',
          }]}>
            {error ? (
              <View style={[styles.errorContainer, { 
                backgroundColor: isDark ? '#2d1a1a' : '#FEF2F2',
                borderColor: isDark ? '#4a1a1a' : '#FEE2E2',
              }]}>
                <Ionicons name="alert-circle" size={18} color={THEME.error} />
                <Text style={[styles.errorText, { color: THEME.error }]}>{error}</Text>
              </View>
            ) : null}

            {/* New Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>New Password</Text>
              <View style={[
                styles.inputWrapper,
                { 
                  backgroundColor: isDark ? colors.background : THEME.lightGray,
                  borderColor: newPassword ? THEME.primary : (isDark ? colors.border : THEME.border),
                },
                newPassword && styles.inputWrapperFilled,
              ]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={colors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter new password"
                  placeholderTextColor={isDark ? '#888' : '#9CA3AF'}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Confirm Password</Text>
              <View style={[
                styles.inputWrapper,
                { 
                  backgroundColor: isDark ? colors.background : THEME.lightGray,
                  borderColor: confirmPassword ? THEME.primary : (isDark ? colors.border : THEME.border),
                },
                confirmPassword && styles.inputWrapperFilled,
              ]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={colors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  editable={!loading}
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Confirm new password"
                  placeholderTextColor={isDark ? '#888' : '#9CA3AF'}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Reset Button */}
            <TouchableOpacity
              style={[styles.resetBtn, { 
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
              }, loading && styles.disabledBtn]}
              onPress={handleResetPassword}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.resetBtnText}>Reset Password</Text>
              )}
            </TouchableOpacity>

            {/* Back to Sign In */}
            <TouchableOpacity
              style={styles.signInLink}
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'SignIn' }],
                });
              }}
            >
              <Text style={[styles.signInText, { color: colors.textSecondary }]}>
                Remember your password? <Text style={[styles.signInLinkText, { color: colors.primary }]}>Sign In</Text>
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
    paddingBottom: Platform.OS === 'ios' ? 20 : 30,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 16,
    zIndex: 10,
    borderRadius: 30,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gradientHeader: {
    paddingTop: height * 0.06,
    paddingBottom: height * 0.06,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  header: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 5,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 14,
    marginLeft: 10,
    fontWeight: '500',
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  inputWrapperFilled: {
    borderWidth: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 15,
    fontWeight: '500',
  },
  resetBtn: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 10,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  resetBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  signInLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  signInText: {
    fontSize: 15,
  },
  signInLinkText: {
    fontWeight: '700',
  },
});