import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import { useAppDispatch } from '../../store/hooks/hooks';

import { useTheme } from '../../store/hooks/useTheme';
import { useResponsive } from '../../hooks/useResponsive';
import { getProfile } from '../dashboard/api/dashboard.api';
import { setProfile } from '../../store/slices/authSlice';
import { sendUpdateOtp, updateProfile } from '../../services/profile.service';
import { PasswordForm } from '../../types/profile.types';
import { AuthState } from '../../types/auth.types';

const INITIAL_FORM_DATA: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  contact: '',
  otp: '',
  dob: '',
  organisation: '',
  gstNumber: '',
  address: '',
  city: '',
  pincode: '',
  state: '',
  country: '',
};

const INITIAL_PASSWORD_FORM: PasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { isTablet } = useResponsive();
  const dispatch = useAppDispatch();

  const user = useSelector((state: { auth: AuthState }) => state.auth.user);

  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [initialFormData, setInitialFormData] =
    useState<FormData>(INITIAL_FORM_DATA);

  const [passwordForm, setPasswordForm] = useState<PasswordForm>(
    INITIAL_PASSWORD_FORM,
  );

  const isMounted = useRef(true);
  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      isMounted.current = false;

      if (countdownTimer.current) {
        clearInterval(countdownTimer.current);
        countdownTimer.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      if (countdownTimer.current) {
        clearInterval(countdownTimer.current);
        countdownTimer.current = null;
      }

      return;
    }

    countdownTimer.current = setInterval(() => {
      setCountdown(previous => previous - 1);
    }, 1000);

    return () => {
      if (countdownTimer.current) {
        clearInterval(countdownTimer.current);
        countdownTimer.current = null;
      }
    };
  }, [countdown]);

  useEffect(() => {
    if (!user) return;

    const data: FormData = {
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      email: user.email || '',
      contact: user.contact || '',
      otp: '',
      dob: user.dob || '',
      organisation: user.organisation || '',
      gstNumber: user.gst_number || '',
      address: user.address || '',
      city: user.city || '',
      pincode: user.pincode ? String(user.pincode) : '',
      state: user.state || '',
      country: user.country || '',
    };

    setFormData(data);
    setInitialFormData(data);
  }, [user]);

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData(previous => ({
      ...previous,
      [name]: value,
      ...(name === 'contact' ? { otp: '' } : {}),
    }));

    if (name === 'contact') {
      setOtpSent(false);
    }
  };

  const handleContactChange = (value: string) => {
    const cleanedValue = value.replace(/\D/g, '');

    setFormData(previous => ({
      ...previous,
      contact: cleanedValue,
      otp: '',
    }));

    setOtpSent(false);
  };

  const handlePasswordChange = (name: keyof PasswordForm, value: string) => {
    setPasswordForm(previous => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSendOtp = async () => {
    try {
      if (formData.contact.length !== 10) {
        Toast.show({
          type: 'error',
          text1: 'Please enter a valid mobile number',
        });
        return;
      }

      setSendingOtp(true);

      const response = await sendUpdateOtp({
        email: formData.email,
        contact: formData.contact,
      });

      Toast.show({
        type: 'success',
        text1: response.message,
      });

      setOtpSent(true);
      setCountdown(60);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error instanceof Error ? error.message : 'Failed to send OTP',
      });
    } finally {
      setSendingOtp(false);
    }
  };

  const handleSubmit = async () => {
    const isContactChanged = formData.contact !== (user?.contact || '');

    if (!formData.firstName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'First name is required',
      });
      return;
    }

    if (!formData.lastName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Last name is required',
      });
      return;
    }

    if (!formData.contact.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Contact number is required',
      });
      return;
    }

    if (!formData.country.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Country is required',
      });
      return;
    }

    if (!formData.state.trim()) {
      Toast.show({
        type: 'error',
        text1: 'State is required',
      });
      return;
    }

    if (!formData.city.trim()) {
      Toast.show({
        type: 'error',
        text1: 'City is required',
      });
      return;
    }

    if (!formData.address.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Address is required',
      });
      return;
    }

    if (isContactChanged && !formData.otp.trim()) {
      Toast.show({
        type: 'error',
        text1: 'OTP Required',
        text2: 'Please enter the OTP sent to your mobile number',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (passwordForm.newPassword || passwordForm.confirmPassword) {
      if (passwordForm.newPassword && passwordForm.newPassword.length < 8) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Password',
          text2: 'Password must be at least 8 characters',
          position: 'top',
          visibilityTime: 3000,
        });
        return;
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        Toast.show({
          type: 'error',
          text1: 'Password Mismatch',
          text2: 'Passwords do not match',
          position: 'top',
          visibilityTime: 3000,
        });
        return;
      }
    }

    setIsLoading(true);

    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        contact: formData.contact,
        password: passwordForm.newPassword || '',
        password_confirmation: passwordForm.confirmPassword || '',
        address: formData.address,
        dob: formData.dob,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
        organisation: formData.organisation,
        gst_number: formData.gstNumber,
        otp: isContactChanged ? formData.otp : '',
      };

      const response = await updateProfile(payload);
      const profile = await getProfile();

      dispatch(
        setProfile({
          user: profile.data.user,
          subscription: profile.data.subscription,
          nextSubscriptions: profile.data.next_subscriptions || [],
        }),
      );

      setInitialFormData({
        ...formData,
        otp: '',
      });

      setOtpSent(false);

      setPasswordForm(INITIAL_PASSWORD_FORM);

      setFormData(previous => ({
        ...previous,
        otp: '',
      }));

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: response.message || 'Profile updated successfully',
        position: 'top',
        visibilityTime: 3000,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2:
          error instanceof Error ? error.message : 'Failed to update profile',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  const isContactChanged = formData.contact !== (user?.contact || '');

  const hasFormChanged =
    JSON.stringify({
      ...formData,
      otp: '',
    }) !==
    JSON.stringify({
      ...initialFormData,
      otp: '',
    });

  const hasPasswordChanged =
    passwordForm.newPassword.trim() !== '' ||
    passwordForm.confirmPassword.trim() !== '';

  const canUpdate = hasFormChanged || hasPasswordChanged;

  const isAndroid = Platform.OS === 'android';
  const cardMargin = isTablet ? 24 : 16;
  const borderRadius = isTablet ? 16 : 12;
  const inputHeight = isTablet ? 48 : 44;
  const fontSize = isTablet ? 15 : 13;

  const androidFontWeight = isAndroid ? '600' : '700';
  const androidFontWeightBold = isAndroid ? '800' : '700';

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.primary,
        },
      ]}
    >
      <StatusBar
        translucent={false}
        backgroundColor={colors.primary}
        barStyle="light-content"
      />

      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDark || '#c9060a']}
            style={[
              styles.header,
              {
                paddingTop: isTablet ? 16 : 12,
                paddingHorizontal: isTablet ? 32 : 20,
                paddingBottom: isTablet ? 20 : 16,
              },
            ]}
          >
            <View style={styles.headerRow}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={[
                  styles.backBtn,
                  {
                    width: isTablet ? 44 : 40,
                    height: isTablet ? 44 : 40,
                    borderRadius: isTablet ? 22 : 20,
                  },
                ]}
              >
                <Icon
                  name="arrow-left"
                  size={isTablet ? 24 : 22}
                  color="#fff"
                />
              </TouchableOpacity>

              <Text
                style={[
                  styles.headerTitle,
                  {
                    fontSize: isTablet ? 22 : 18,
                    fontWeight: androidFontWeightBold,
                  },
                ]}
              >
                Edit Profile
              </Text>

              <View style={{ width: isTablet ? 44 : 40 }} />
            </View>
          </LinearGradient>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContent,
              {
                padding: cardMargin,
                paddingBottom: isAndroid ? 40 : 30,
              },
            ]}
          >
            <View
              style={[
                styles.formCard,
                {
                  backgroundColor: colors.card,
                  borderRadius,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: isAndroid ? 2 : 4,
                  },
                  shadowRadius: isAndroid ? 4 : 8,
                  elevation: 4,
                  padding: isTablet ? 24 : 16,
                  marginTop: isTablet ? 24 : 6,
                },
              ]}
            >
              <Text
                style={[
                  styles.formTitle,
                  {
                    color: colors.text,
                    fontSize: isTablet ? 20 : 18,
                    fontWeight: androidFontWeightBold,
                    marginBottom: isTablet ? 24 : 20,
                  },
                ]}
              >
                Personal Information
              </Text>

              <View style={styles.fieldContainer}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: colors.text,
                      fontSize: isTablet ? 14 : 12,
                      fontWeight: androidFontWeight,
                    },
                  ]}
                >
                  First Name <Text style={{ color: colors.primary }}>*</Text>
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderColor: colors.border,
                      height: inputHeight,
                      fontSize,
                      borderRadius: isTablet ? 12 : 8,
                    },
                  ]}
                  value={formData.firstName}
                  onChangeText={value => handleChange('firstName', value)}
                  placeholder="Enter first name"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: colors.text,
                      fontSize: isTablet ? 14 : 12,
                      fontWeight: androidFontWeight,
                    },
                  ]}
                >
                  Last Name <Text style={{ color: colors.primary }}>*</Text>
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderColor: colors.border,
                      height: inputHeight,
                      fontSize,
                      borderRadius: isTablet ? 12 : 8,
                    },
                  ]}
                  value={formData.lastName}
                  onChangeText={value => handleChange('lastName', value)}
                  placeholder="Enter last name"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: colors.text,
                      fontSize: isTablet ? 14 : 12,
                      fontWeight: androidFontWeight,
                    },
                  ]}
                >
                  Email <Text style={{ color: colors.primary }}>*</Text>
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.border,
                      color: colors.textMuted,
                      borderColor: colors.border,
                      height: inputHeight,
                      fontSize,
                      borderRadius: isTablet ? 12 : 8,
                    },
                  ]}
                  value={formData.email}
                  editable={false}
                  placeholder="Email"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: colors.text,
                      fontSize: isTablet ? 14 : 12,
                      fontWeight: androidFontWeight,
                    },
                  ]}
                >
                  {otpSent ? 'OTP' : 'Contact No'}{' '}
                  <Text style={{ color: colors.primary }}>*</Text>
                </Text>

                {!otpSent ? (
                  <View style={styles.contactRow}>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: colors.background,
                          color: colors.text,
                          borderColor: colors.border,
                          height: inputHeight,
                          fontSize,
                          borderRadius: isTablet ? 12 : 8,
                          flex: 1,
                        },
                      ]}
                      value={formData.contact}
                      onChangeText={handleContactChange}
                      placeholder="Enter 10-digit mobile"
                      placeholderTextColor={colors.textMuted}
                      keyboardType="phone-pad"
                      maxLength={10}
                    />

                    {isContactChanged && (
                      <TouchableOpacity
                        style={[
                          styles.otpButton,
                          {
                            backgroundColor: colors.primary,
                            height: inputHeight,
                            borderRadius: isTablet ? 12 : 8,
                            opacity: sendingOtp || countdown > 0 ? 0.6 : 1,
                          },
                        ]}
                        onPress={handleSendOtp}
                        disabled={sendingOtp || countdown > 0}
                      >
                        {sendingOtp ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Text
                            style={[
                              styles.otpButtonText,
                              {
                                fontSize: isTablet ? 13 : 11,
                                fontWeight: androidFontWeight,
                              },
                            ]}
                          >
                            {countdown > 0 ? `${countdown}s` : 'Get OTP'}
                          </Text>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                ) : (
                  <View>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: colors.background,
                          color: colors.text,
                          borderColor: colors.border,
                          height: inputHeight,
                          fontSize,
                          borderRadius: isTablet ? 12 : 8,
                        },
                      ]}
                      value={formData.otp}
                      onChangeText={value => handleChange('otp', value)}
                      placeholder="Enter OTP"
                      placeholderTextColor={colors.textMuted}
                      keyboardType="number-pad"
                      maxLength={6}
                    />

                    <View style={styles.otpFooter}>
                      <Text
                        style={[
                          styles.otpFooterText,
                          {
                            color: colors.textMuted,
                            fontSize: isTablet ? 13 : 11,
                          },
                        ]}
                      >
                        OTP sent to{' '}
                        <Text
                          style={{
                            color: colors.text,
                            fontWeight: androidFontWeight,
                          }}
                        >
                          {formData.contact}
                        </Text>
                      </Text>

                      <TouchableOpacity
                        onPress={handleSendOtp}
                        disabled={sendingOtp || countdown > 0}
                      >
                        <Text
                          style={[
                            styles.resendText,
                            {
                              color:
                                countdown > 0
                                  ? colors.textMuted
                                  : colors.primary,
                              fontSize: isTablet ? 13 : 11,
                              fontWeight: androidFontWeight,
                            },
                          ]}
                        >
                          {countdown > 0
                            ? `Resend in ${countdown}s`
                            : 'Resend OTP'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.fieldContainer}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: colors.text,
                      fontSize: isTablet ? 14 : 12,
                      fontWeight: androidFontWeight,
                    },
                  ]}
                >
                  Date of Birth <Text style={{ color: colors.primary }}>*</Text>
                </Text>

                <TouchableOpacity
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      height: inputHeight,
                      borderRadius: isTablet ? 12 : 8,
                      justifyContent: 'center',
                    },
                  ]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text
                    style={{
                      color: formData.dob ? colors.text : colors.textMuted,
                      fontSize,
                    }}
                  >
                    {formData.dob || 'Select date of birth'}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={
                      formData.dob
                        ? new Date(formData.dob)
                        : new Date(2000, 0, 1)
                    }
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(_, selectedDate) => {
                      setShowDatePicker(false);

                      if (selectedDate) {
                        const dateString = selectedDate
                          .toISOString()
                          .split('T')[0];

                        handleChange('dob', dateString);
                      }
                    }}
                  />
                )}
              </View>

              <View style={styles.fieldContainer}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: colors.text,
                      fontSize: isTablet ? 14 : 12,
                      fontWeight: androidFontWeight,
                    },
                  ]}
                >
                  Organisation Name
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderColor: colors.border,
                      height: inputHeight,
                      fontSize,
                      borderRadius: isTablet ? 12 : 8,
                    },
                  ]}
                  value={formData.organisation}
                  onChangeText={value => handleChange('organisation', value)}
                  placeholder="Enter organisation name"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: colors.text,
                      fontSize: isTablet ? 14 : 12,
                      fontWeight: androidFontWeight,
                    },
                  ]}
                >
                  New Password
                </Text>

                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.background,
                        color: colors.text,
                        borderColor: colors.border,
                        height: inputHeight,
                        fontSize,
                        borderRadius: isTablet ? 12 : 8,
                        flex: 1,
                        paddingRight: 40,
                      },
                    ]}
                    value={passwordForm.newPassword}
                    onChangeText={value =>
                      handlePasswordChange('newPassword', value)
                    }
                    placeholder="Enter new password"
                    placeholderTextColor={colors.textMuted}
                    secureTextEntry={!showNewPassword}
                  />

                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowNewPassword(previous => !previous)}
                  >
                    <Icon
                      name={showNewPassword ? 'eye-off' : 'eye'}
                      size={isTablet ? 22 : 18}
                      color={colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: colors.text,
                      fontSize: isTablet ? 14 : 12,
                      fontWeight: androidFontWeight,
                    },
                  ]}
                >
                  Confirm Password
                </Text>

                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.background,
                        color: colors.text,
                        borderColor: colors.border,
                        height: inputHeight,
                        fontSize,
                        borderRadius: isTablet ? 12 : 8,
                        flex: 1,
                        paddingRight: 40,
                      },
                    ]}
                    value={passwordForm.confirmPassword}
                    onChangeText={value =>
                      handlePasswordChange('confirmPassword', value)
                    }
                    placeholder="Confirm new password"
                    placeholderTextColor={colors.textMuted}
                    secureTextEntry={!showConfirmPassword}
                  />

                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() =>
                      setShowConfirmPassword(previous => !previous)
                    }
                  >
                    <Icon
                      name={showConfirmPassword ? 'eye-off' : 'eye'}
                      size={isTablet ? 22 : 18}
                      color={colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: colors.text,
                      fontSize: isTablet ? 14 : 12,
                      fontWeight: androidFontWeight,
                    },
                  ]}
                >
                  GST Number
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderColor: colors.border,
                      height: inputHeight,
                      fontSize,
                      borderRadius: isTablet ? 12 : 8,
                    },
                  ]}
                  value={formData.gstNumber}
                  onChangeText={value =>
                    handleChange('gstNumber', value.toUpperCase())
                  }
                  placeholder="22AAAAA0000A1Z5"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: colors.text,
                      fontSize: isTablet ? 14 : 12,
                      fontWeight: androidFontWeight,
                    },
                  ]}
                >
                  Country <Text style={{ color: colors.primary }}>*</Text>
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderColor: colors.border,
                      height: inputHeight,
                      fontSize,
                      borderRadius: isTablet ? 12 : 8,
                    },
                  ]}
                  value={formData.country}
                  onChangeText={value => handleChange('country', value)}
                  placeholder="Enter country"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <View style={styles.rowContainer}>
                <View
                  style={[styles.rowField, { marginRight: isTablet ? 16 : 8 }]}
                >
                  <Text
                    style={[
                      styles.label,
                      {
                        color: colors.text,
                        fontSize: isTablet ? 14 : 12,
                        fontWeight: androidFontWeight,
                      },
                    ]}
                  >
                    State <Text style={{ color: colors.primary }}>*</Text>
                  </Text>

                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.background,
                        color: colors.text,
                        borderColor: colors.border,
                        height: inputHeight,
                        fontSize,
                        borderRadius: isTablet ? 12 : 8,
                      },
                    ]}
                    value={formData.state}
                    onChangeText={value => handleChange('state', value)}
                    placeholder="State"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>

                <View
                  style={[styles.rowField, { marginRight: isTablet ? 16 : 8 }]}
                >
                  <Text
                    style={[
                      styles.label,
                      {
                        color: colors.text,
                        fontSize: isTablet ? 14 : 12,
                        fontWeight: androidFontWeight,
                      },
                    ]}
                  >
                    City <Text style={{ color: colors.primary }}>*</Text>
                  </Text>

                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.background,
                        color: colors.text,
                        borderColor: colors.border,
                        height: inputHeight,
                        fontSize,
                        borderRadius: isTablet ? 12 : 8,
                      },
                    ]}
                    value={formData.city}
                    onChangeText={value => handleChange('city', value)}
                    placeholder="City"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>

                <View style={styles.rowField}>
                  <Text
                    style={[
                      styles.label,
                      {
                        color: colors.text,
                        fontSize: isTablet ? 14 : 12,
                        fontWeight: androidFontWeight,
                      },
                    ]}
                  >
                    Pincode <Text style={{ color: colors.primary }}>*</Text>
                  </Text>

                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.background,
                        color: colors.text,
                        borderColor: colors.border,
                        height: inputHeight,
                        fontSize,
                        borderRadius: isTablet ? 12 : 8,
                      },
                    ]}
                    value={formData.pincode}
                    onChangeText={value => handleChange('pincode', value)}
                    placeholder="Pincode"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: colors.text,
                      fontSize: isTablet ? 14 : 12,
                      fontWeight: androidFontWeight,
                    },
                  ]}
                >
                  Address <Text style={{ color: colors.primary }}>*</Text>
                </Text>

                <TextInput
                  style={[
                    styles.textArea,
                    {
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderColor: colors.border,
                      fontSize,
                      borderRadius: isTablet ? 12 : 8,
                      minHeight: isTablet ? 120 : 100,
                    },
                  ]}
                  value={formData.address}
                  onChangeText={value => handleChange('address', value)}
                  placeholder="Enter your address"
                  placeholderTextColor={colors.textMuted}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.updateButton,
                  {
                    backgroundColor: colors.primary,
                    borderRadius: isTablet ? 14 : 10,
                    height: isTablet ? 56 : 48,
                    marginTop: isTablet ? 20 : 16,
                    opacity: canUpdate ? 1 : 0.6,
                  },
                ]}
                onPress={handleSubmit}
                disabled={!canUpdate || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text
                    style={[
                      styles.updateButtonText,
                      {
                        color: '#f9f2f2',
                        fontSize: isTablet ? 17 : 15,
                        fontWeight: androidFontWeightBold,
                      },
                    ]}
                  >
                    Update Profile
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
  },
  formCard: {
    marginTop: -12,
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  formTitle: {
    fontWeight: '600',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontWeight: '600' as const,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  textArea: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  otpButton: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 90,
  },
  otpButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  otpFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  otpFooterText: {
    fontStyle: 'italic',
  },
  resendText: {
    fontWeight: '600' as const,
  },
  passwordContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  rowField: {
    flex: 1,
  },
  updateButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButtonText: {
    fontWeight: '600',
  },
});

export default EditProfileScreen;
