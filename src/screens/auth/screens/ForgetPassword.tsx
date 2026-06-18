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

const { height } = Dimensions.get('window');

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

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSendResetLink = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setEmailSent(true);

      Toast.show({
        type: 'success',
        text1: 'Reset Link Sent',
        text2: `Password reset link sent to ${email}`,
        position: 'top',
        visibilityTime: 3000,
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to send reset link');
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
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={BRAND.white} />
          </TouchableOpacity>

          <LinearGradient
            colors={BRAND.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientHeader}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="key-outline" size={40} color={BRAND.primary} />
            </View>
            <Text style={styles.header}>Forgot Password</Text>
            <Text style={styles.subText}>
              Enter your email to receive a reset link
            </Text>
          </LinearGradient>

          <View style={styles.formContainer}>
            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={18} color={BRAND.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {emailSent ? (
              <View style={styles.successContainer}>
                <Ionicons name="checkmark-circle" size={18} color={BRAND.success} />
                <Text style={styles.successText}>
                  Reset link sent! Please check your email.
                </Text>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={[
                styles.inputWrapper,
                email && styles.inputWrapperFilled,
              ]}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={email ? BRAND.primary : BRAND.grayText}
                  style={styles.inputIcon}
                />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading && !emailSent}
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                />
                {email !== '' && !loading && !emailSent && (
                  <TouchableOpacity onPress={() => setEmail('')}>
                    <Ionicons name="close-circle" size={18} color={BRAND.grayText} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {!emailSent ? (
              <TouchableOpacity
                style={[styles.sendBtn, loading && styles.disabledBtn]}
                onPress={handleSendResetLink}
                disabled={loading}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={BRAND.primaryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.sendGradient}
                >
                  {loading ? (
                    <ActivityIndicator color={BRAND.white} />
                  ) : (
                    <Text style={styles.sendBtnText}>Send Reset Link</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <View>
                <TouchableOpacity
                  style={[styles.sendBtn, styles.resendBtn]}
                  onPress={handleSendResetLink}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={BRAND.primaryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.sendGradient}
                  >
                    {loading ? (
                      <ActivityIndicator color={BRAND.white} />
                    ) : (
                      <Text style={styles.sendBtnText}>Resend Link</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.signInLink}
                  onPress={goToSignIn}
                >
                  <Text style={styles.signInText}>
                    Remember your password? <Text style={styles.signInLinkText}>Sign In</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {!emailSent && (
              <TouchableOpacity
                style={styles.signInLink}
                onPress={goToSignIn}
              >
                <Text style={styles.signInText}>
                  Remember your password? <Text style={styles.signInLinkText}>Sign In</Text>
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
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },

  gradientHeader: {
    paddingTop: height * 0.05,
    paddingBottom: height * 0.05,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: BRAND.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },

  header: {
    fontSize: 28,
    fontWeight: '800',
    color: BRAND.white,
    letterSpacing: -0.5,
    marginBottom: 6,
    textAlign: 'center',
  },

  subText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },

  formContainer: {
    flex: 1,
    backgroundColor: BRAND.white,
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 28,
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
    color: BRAND.error,
    fontSize: 14,
    marginLeft: 10,
    fontWeight: '500',
    flex: 1,
  },

  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },

  successText: {
    color: BRAND.success,
    fontSize: 14,
    marginLeft: 10,
    fontWeight: '500',
    flex: 1,
  },

  inputGroup: {
    marginBottom: 24,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: BRAND.dark,
    marginBottom: 6,
    marginLeft: 4,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND.lightGray,
    borderWidth: 1.5,
    borderColor: BRAND.border,
    borderRadius: 14,
    paddingHorizontal: 16,
  },

  inputWrapperFilled: {
    borderColor: BRAND.primary,
    borderWidth: 2,
    backgroundColor: BRAND.primaryLight,
  },

  inputIcon: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: BRAND.dark,
    fontWeight: '500',
  },

  sendBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: BRAND.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  sendGradient: {
    paddingVertical: 16,
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
    color: BRAND.white,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },

  signInLink: {
    marginTop: 20,
    alignItems: 'center',
  },

  signInText: {
    color: BRAND.grayText,
    fontSize: 15,
  },

  signInLinkText: {
    color: BRAND.primary,
    fontWeight: '700',
  },
});