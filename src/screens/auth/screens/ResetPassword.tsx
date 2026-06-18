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

  // ✅ Get token from URL params (if any)
  const token = route.params?.token || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ============================================================
  // BACK BUTTON
  // ============================================================

  const handleBack = () => {
    navigation.goBack();
  };

  // ============================================================
  // RESET PASSWORD
  // ============================================================

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // ✅ API Call - Reset password with token
      // const response = await resetPasswordApi({ 
      //   token, 
      //   password: newPassword,
      //   password_confirmation: confirmPassword
      // });

      // ✅ Mock API (Replace with actual)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // if (response?.status) {
      Toast.show({
        type: 'success',
        text1: 'Password Reset',
        text2: 'Your password has been reset successfully',
        position: 'top',
        visibilityTime: 3000,
      });

      // Navigate to SignIn
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        });
      }, 500);
      // }

    } catch (err: any) {
      setError(err?.message || 'Failed to reset password');
      Toast.show({
        type: 'error',
        text1: 'Failed',
        text2: 'Unable to reset password. Please try again.',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* BACK BUTTON */}
          <TouchableOpacity 
            style={styles.backButton} 
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
            <Text style={styles.subText}>
              Enter your new password below
            </Text>
          </LinearGradient>

          <View style={styles.formContainer}>
            {/* Error Message */}
            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={18} color={THEME.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* New Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <View style={[
                styles.inputWrapper,
                newPassword && styles.inputWrapperFilled,
              ]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={THEME.grayText}
                  style={styles.inputIcon}
                />
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                  style={styles.input}
                  placeholder="Enter new password"
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={THEME.grayText}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={[
                styles.inputWrapper,
                confirmPassword && styles.inputWrapperFilled,
              ]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={THEME.grayText}
                  style={styles.inputIcon}
                />
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  editable={!loading}
                  style={styles.input}
                  placeholder="Confirm new password"
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={THEME.grayText}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Reset Button */}
            <TouchableOpacity
              style={[styles.resetBtn, loading && styles.disabledBtn]}
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
              <Text style={styles.signInText}>
                Remember your password? <Text style={styles.signInLinkText}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
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
    backgroundColor: 'rgba(255,255,255,0.2)',
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
    color: THEME.white,
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: 'center',
  },

  subText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },

  formContainer: {
    flex: 1,
    backgroundColor: THEME.white,
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 5,
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },

  errorText: {
    color: THEME.error,
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
    color: THEME.dark,
    marginBottom: 8,
    marginLeft: 4,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.lightGray,
    borderWidth: 1.5,
    borderColor: THEME.border,
    borderRadius: 16,
    paddingHorizontal: 16,
  },

  inputWrapperFilled: {
    borderColor: THEME.primary,
    borderWidth: 2,
    backgroundColor: '#FFF5F5',
  },

  inputIcon: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 15,
    color: THEME.dark,
    fontWeight: '500',
  },

  resetBtn: {
    backgroundColor: THEME.primary,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 16,
    shadowColor: THEME.primary,
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
    color: THEME.grayText,
    fontSize: 15,
  },

  signInLinkText: {
    color: THEME.primary,
    fontWeight: '700',
  },
});