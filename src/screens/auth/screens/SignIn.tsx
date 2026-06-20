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
import { useTheme } from '../../../redux/hooks/useTheme';

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
  const { colors, isDark } = useTheme();

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
          {/* BACK BUTTON - Premium */}
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]} 
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
              <View style={[styles.logoCircle, { backgroundColor: BRAND.white }]}>
                <Ionicons name="newspaper-outline" size={40} color={BRAND.primary} />
              </View>
            </View>
            <Text style={styles.header}>Welcome Back!</Text>
            <Text style={[styles.subText, { color: 'rgba(255,255,255,0.85)' }]}>
              Sign in to continue reading
            </Text>
          </LinearGradient>

          {/* FORM */}
          <View style={[styles.formContainer, { 
            backgroundColor: colors.card,
            shadowColor: isDark ? '#000' : '#000',
          }]}>
            {/* Error */}
            {error ? (
              <View style={[styles.errorContainer, { 
                backgroundColor: isDark ? '#2d1a1a' : '#FEF2F2',
                borderColor: isDark ? '#4a1a1a' : '#FEE2E2',
              }]}>
                <Ionicons name="alert-circle" size={18} color={BRAND.error} />
                <Text style={[styles.errorText, { color: BRAND.error }]}>{error}</Text>
              </View>
            ) : null}

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
              <View
                style={[
                  styles.inputWrapper,
                  { 
                    backgroundColor: isDark ? colors.background : BRAND.lightGray,
                    borderColor: email ? BRAND.primary : (isDark ? colors.border : BRAND.border),
                  },
                  email && styles.inputWrapperFilled,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={email ? BRAND.primary : colors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your email"
                  placeholderTextColor={isDark ? '#888' : '#9CA3AF'}
                />
                {email !== '' && !loading && (
                  <TouchableOpacity onPress={() => setEmail('')}>
                    <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Password</Text>
              <View
                style={[
                  styles.inputWrapper,
                  { 
                    backgroundColor: isDark ? colors.background : BRAND.lightGray,
                    borderColor: password ? BRAND.primary : (isDark ? colors.border : BRAND.border),
                  },
                  password && styles.inputWrapperFilled,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={password ? BRAND.primary : colors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your password"
                  placeholderTextColor={isDark ? '#888' : '#9CA3AF'}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(prev => !prev)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textMuted}
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
                  style={[
                    styles.checkbox, 
                    { 
                      borderColor: rememberMe ? BRAND.primary : (isDark ? colors.border : '#D1D5DB'),
                      backgroundColor: rememberMe ? BRAND.primary : '#fff',
                    },
                    rememberMe && styles.checkboxActive
                  ]}
                >
                  {rememberMe && (
                    <Ionicons name="checkmark" size={12} color={BRAND.white} />
                  )}
                </View>
                <Text style={[styles.checkboxText, { color: colors.text }]}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('ForgetPassword')}
                activeOpacity={0.7}
              >
                <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot Password?</Text>
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
              <Text style={[styles.noAccountText, { color: colors.textSecondary }]}>
                Don't have an account ? 
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                activeOpacity={0.7}
              >
                <Text style={[styles.registerLink, { color: colors.primary }]}>
                 {" "} Sign Up
                </Text>
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
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 6,
    textAlign: 'center',
  },

  subText: {
    fontSize: 15,
    textAlign: 'center',
  },

  formContainer: {
    flex: 1,
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 28,
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
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 4,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
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
    paddingVertical: 14,
    fontSize: 15,
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
    marginRight: 10,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxActive: {
    borderColor: BRAND.primary,
  },

  checkboxText: {
    fontSize: 14,
    fontWeight: '500',
  },

  forgotText: {
    fontWeight: '600',
    fontSize: 14,
  },

  loginBtn: {
    borderRadius: 14,
    overflow: 'hidden',
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
    color: '#FFFFFF',
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
    fontSize: 15,
  },

  registerLink: {
    fontWeight: '700',
    fontSize: 15,
  },
});