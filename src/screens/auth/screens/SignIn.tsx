// screens/auth/screens/SignIn.tsx
import React, { useState } from 'react';
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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';

import { setProfile } from '../../../redux/slices/authSlice';
import { loginApi } from '../api/auth';
import { getProfile } from '../../dashboard/api';

const { height, width } = Dimensions.get('window');

const BRAND = {
  primary: '#c9060a',
  primaryDark: '#a80508',
  primaryLight: '#fef2f2',
  primaryGradient: ['#c9060a', '#a80508'],
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
        })
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

      await AsyncStorage.setItem('token', data.token);

      const profileRes = await getProfile();
      const profile = profileRes.data;

      await AsyncStorage.setItem('user', JSON.stringify(profile.user));
      await AsyncStorage.setItem(
        'subscription',
        JSON.stringify(profile.subscription),
      );
      await AsyncStorage.setItem(
        'nextSubscriptions',
        JSON.stringify(profile.next_subscriptions || []),
      );

      dispatch(
        setProfile({
          user: profile.user,
          subscription: profile.subscription,
          nextSubscriptions: profile.next_subscriptions || [],
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
          routes: [{ name: 'Dashboard' }],
        })
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
          {/* BACK BUTTON - Premium */}
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={BRAND.white} />
          </TouchableOpacity>

          {/* HEADER - Premium Gradient */}
          <LinearGradient
            colors={BRAND.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientHeader}
          >
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Ionicons name="newspaper-outline" size={40} color={BRAND.primary} />
              </View>
            </View>
            <Text style={styles.header}>Welcome Back!</Text>
            <Text style={styles.subText}>Sign in to continue reading</Text>
          </LinearGradient>

          {/* FORM */}
          <View style={styles.formContainer}>
            {/* Error */}
            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={18} color={BRAND.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View
                style={[
                  styles.inputWrapper,
                  email && styles.inputWrapperFilled,
                ]}
              >
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
                  editable={!loading}
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                />
                {email !== '' && !loading && (
                  <TouchableOpacity onPress={() => setEmail('')}>
                    <Ionicons name="close-circle" size={18} color={BRAND.grayText} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View
                style={[
                  styles.inputWrapper,
                  password && styles.inputWrapperFilled,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={password ? BRAND.primary : BRAND.grayText}
                  style={styles.inputIcon}
                />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(prev => !prev)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={BRAND.grayText}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setRememberMe(!rememberMe)}
                disabled={loading}
                activeOpacity={0.7}
              >
                <View
                  style={[styles.checkbox, rememberMe && styles.checkboxActive]}
                >
                  {rememberMe && (
                    <Ionicons name="checkmark" size={12} color={BRAND.white} />
                  )}
                </View>
                <Text style={styles.checkboxText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('ForgetPassword')}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.disabledBtn]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={BRAND.primaryGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loginGradient}
              >
                {loading ? (
                  <ActivityIndicator color={BRAND.white} />
                ) : (
                  <Text style={styles.loginBtnText}>Sign In</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.footerLinks}>
              <Text style={styles.noAccountText}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                activeOpacity={0.7}
              >
                <Text style={styles.registerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInScreen;

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

  logoContainer: {
    marginBottom: 16,
  },

  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: BRAND.white,
    justifyContent: 'center',
    alignItems: 'center',
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

  inputGroup: {
    marginBottom: 18,
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

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 4,
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 10,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  checkboxActive: {
    backgroundColor: BRAND.primary,
    borderColor: BRAND.primary,
  },

  checkboxText: {
    fontSize: 14,
    color: BRAND.dark,
    fontWeight: '500',
  },

  forgotText: {
    color: BRAND.primary,
    fontWeight: '600',
    fontSize: 14,
  },

  loginBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: BRAND.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  loginGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  disabledBtn: {
    opacity: 0.6,
  },

  loginBtnText: {
    color: BRAND.white,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },

  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  noAccountText: {
    color: BRAND.grayText,
    fontSize: 15,
  },

  registerLink: {
    color: BRAND.primary,
    fontWeight: '700',
    fontSize: 15,
  },
});