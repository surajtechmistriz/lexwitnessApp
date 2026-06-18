import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import RenderHTML from 'react-native-render-html';
import RazorpayCheckout from 'react-native-razorpay';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IconBack from 'react-native-vector-icons/Feather';
import {
  CommonActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import {
  getMembershipPlans,
  sendOtpApi,
  registerApi,
  verifyPaymentApi,
} from '../api/services';
import { loginSuccess } from '../../../redux/slices/authSlice';
import MainLayout from '../../../MainLayout';

interface MembershipPlan {
  id: number;
  name: string;
  price: string;
  duration_value: number;
  duration_unit: string;
  tag: string | null;
  print_editions: number;
  is_featured: number;
  is_trial: number;
  status: number;
  feature: string;
  created_at: string;
  updated_at: string;
}

const RegisterScreen = () => {
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const route = useRoute<any>();
  const preselectedPlanId = route?.params?.selectedPlanId;
  const navigation = useNavigation<any>();

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    contact: '',
    otp: '',
    dob: '',
    organisation_name: '',
    address: '',
    city: '',
    pincode: '',
    state: '',
    country: 'India',
    password: '',
    password_confirmation: '',
    plan_id: '1',
    auto_renew: false,
  });

  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [receivedOtp, setReceivedOtp] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  

  // Fix: Separate date state for picker
  const [dobDate, setDobDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoadingPlans(true);
    try {
      const res = await getMembershipPlans();
      if (res?.status) {
        setPlans(res.data);
        if (res.data.length > 0) {
          let defaultPlan = res.data[0];
          if (preselectedPlanId) {
            const matchedPlan = res.data.find(
              (p: MembershipPlan) => Number(p.id) === Number(preselectedPlanId),
            );
            if (matchedPlan) {
              defaultPlan = matchedPlan;
            }
          }
          setForm(prev => ({ ...prev, plan_id: defaultPlan.id.toString() }));
        }
      } else {
        showToast('error', 'Failed', res?.message || 'Unable to load plans');
      }
    } catch (err: any) {
      showToast('error', 'Error', err.message || 'Something went wrong');
    } finally {
      setLoadingPlans(false);
    }
  };

  const handleChange = (name: string, value: any) => {
    if (name === 'contact') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Fix: Format date for display
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/YYYY
    }
    return dateString;
  };

  const showToast = (
    type: 'success' | 'error' | 'info',
    text1: string,
    text2?: string,
  ) => {
    Toast.show({
      type: type,
      text1: text1,
      text2: text2,
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 50,
    });
  };

  const handleSendOtp = async () => {
    if (form.contact.length !== 10) {
      showToast(
        'error',
        'Invalid Phone Number',
        'Please enter a valid 10-digit mobile number',
      );
      return;
    }
    if (!form.email) {
      showToast(
        'error',
        'Email Required',
        'Please enter your email address first',
      );
      return;
    }

    try {
      setLoading(true);
      const payload = { contact: form.contact, email: form.email };
      const res = await sendOtpApi(payload);

      if (res?.status) {
        setIsOtpSent(true);
        if (res?.data?.otp) {
          setReceivedOtp(res.data.otp.toString());
          setShowOtpModal(true);
        }
        showToast(
          'success',
          'Success',
          res?.message || 'OTP sent successfully',
        );
        setResendTimer(60);
        const timer = setInterval(() => {
          setResendTimer(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        showToast('error', 'Failed', res?.message || 'Unable to send OTP');
      }
    } catch (err: any) {
      showToast('error', 'Error', err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const autoFillOtp = () => {
    handleChange('otp', receivedOtp);
    setShowOtpModal(false);
    showToast('info', 'OTP Auto-filled', 'OTP has been automatically filled');
  };

  const registerUser = async () => {
    try {
      setLoading(true);
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        contact: form.contact,
        password: form.password,
        password_confirmation: form.password_confirmation,
        address: form.address,
        membership_plan_id: form.plan_id,
        dob: form.dob,
        organisation: form.organisation_name,
        city: form.city,
        state: form.state,
        country: form.country,
        pincode: form.pincode,
        otp: form.otp,
      };

      const res = await registerApi(payload);
      if (!res?.status) {
        showToast('error', 'Failed', res?.message || 'Registration failed');
        return;
      }

      if (!res?.data?.payment) {
        const token = res?.data?.token;
        const user = res?.data?.user;
        const subscription = res?.data?.subscription;

        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        if (subscription) {
          await AsyncStorage.setItem(
            'subscription',
            JSON.stringify(subscription),
          );
        }

        dispatch(loginSuccess({ token, user, subscription }));
        showToast('success', 'Success', 'Registration completed successfully');

       setTimeout(() => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Dashboard' }],
    }),
  );
}, 100);
        return;
      }

      const payment = res.data.payment;
      const options = {
        description: 'Membership Subscription',
        image: 'https://your-logo-url.com/logo.png',
        currency: payment.currency,
        key: payment.razorpay_key,
        amount: payment.amount,
        name: 'Lex Witness',
        order_id: payment.order_id,
        prefill: {
          email: form.email,
          contact: form.contact,
          name: `${form.first_name} ${form.last_name}`,
        },
        theme: { color: '#c9060a' },
      };

      try {
        const paymentResponse: any = await RazorpayCheckout.open(options);
        const verifyPayload = {
          purchase_type: res.data.purchase_type,
          membership_plan_id: res.data.membership_plan_id.toString(),
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_signature: paymentResponse.razorpay_signature,
        };

        const verifyRes = await verifyPaymentApi(verifyPayload);
        if (verifyRes?.status) {
          const token = verifyRes?.data?.token || res?.data?.token;
          const user = verifyRes?.data?.user || res?.data?.user;
          const subscription =
            verifyRes?.data?.subscription || res?.data?.subscription;

          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('user', JSON.stringify(user));
          if (subscription) {
            await AsyncStorage.setItem(
              'subscription',
              JSON.stringify(subscription),
            );
          }

          dispatch(loginSuccess({ token, user, subscription }));
          showToast(
            'success',
            'Success',
            'Payment verified & subscription activated',
          );

          setTimeout(() => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Dashboard' }],
    }),
  );
}, 100);
        } else {
          showToast(
            'error',
            'Verification Failed',
            verifyRes?.message || 'Verification failed',
          );
        }
      } catch (error: any) {
        showToast(
          'error',
          'Payment Failed',
          error?.description || error?.message || 'User cancelled payment',
        );
      }
    } catch (err: any) {
      showToast('error', 'Error', err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const getDurationText = (plan: MembershipPlan) => {
    return `${plan.duration_value} ${plan.duration_unit}${
      plan.duration_value > 1 ? 's' : ''
    }`;
  };

  const validateForm = () => {
    if (!isOtpSent) {
      showToast('error', 'OTP Required', 'Please request OTP first');
      return false;
    }
    if (!form.otp) {
      showToast('error', 'OTP Required', 'Please enter the OTP');
      return false;
    }
    if (!form.first_name) {
      showToast('error', 'First Name Required', 'Please enter your first name');
      return false;
    }
    if (!form.last_name) {
      showToast('error', 'Last Name Required', 'Please enter your last name');
      return false;
    }
    if (!form.email || !form.email.includes('@')) {
      showToast('error', 'Invalid Email', 'Please enter a valid email');
      return false;
    }
    if (!form.contact || form.contact.length !== 10) {
      showToast(
        'error',
        'Invalid Phone',
        'Please enter a valid 10-digit number',
      );
      return false;
    }
    if (!form.address || !form.city || !form.pincode || !form.state) {
      showToast('error', 'Address Required', 'Please fill all address fields');
      return false;
    }
    if (!form.password || form.password.length < 6) {
      showToast(
        'error',
        'Weak Password',
        'Password must be at least 6 characters',
      );
      return false;
    }
    if (form.password !== form.password_confirmation) {
      showToast('error', 'Password Mismatch', 'Passwords do not match');
      return false;
    }
    if (!form.dob) {
      showToast('error', 'Date of Birth Required', 'Please enter your DOB');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    await registerUser();
  };

  const selectedPlan = plans.find(p => p.id.toString() === form.plan_id);
  const otherPlans = plans.filter(p => p.id.toString() !== form.plan_id);
  const price = selectedPlan ? parseFloat(selectedPlan.price) : 0;
  const gst = price * 0.18;
  const total = price + gst;


    const handleBack = () => {
    navigation.goBack();
  };
return (
  <MainLayout
    title="Register"
    routeName="Register"
    showFilter={false}
  >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        {/* <SafeAreaView style={styles.safeArea}> */}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >

                <TouchableOpacity
                onPress={handleBack}
                style={styles.backBtn}
              >
                <IconBack name="arrow-left" size={22} color="#c9060a" />
              </TouchableOpacity>
            {/* Header Section */}
            <View style={styles.headerSection}>
              <View style={styles.iconContainer}>
                <Ionicons name="person-add-outline" size={40} color="#c9060a" />
              </View>
              <Text style={styles.heading}>Create Account</Text>
              <Text style={styles.subHeading}>Join Lex Witness Membership</Text>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              <View style={styles.rowContainer}>
                <View style={styles.halfWidth}>
                  <Input
                    label="First Name"
                    required
                    value={form.first_name}
                    onChange={v => handleChange('first_name', v)}
                    placeholder="First name"
                    icon="person-outline"
                    focused={focusedField === 'first_name'}
                    onFocus={() => setFocusedField('first_name')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
                <View style={styles.halfWidth}>
                  <Input
                    label="Last Name"
                    required
                    value={form.last_name}
                    onChange={v => handleChange('last_name', v)}
                    placeholder="Last name"
                    // icon="person-outline"
                    focused={focusedField === 'last_name'}
                    onFocus={() => setFocusedField('last_name')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              <Input
                label="Email"
                required
                value={form.email}
                onChange={v => handleChange('email', v)}
                keyboardType="email-address"
                placeholder="you@example.com"
                icon="mail-outline"
                focused={focusedField === 'email'}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />

              {/* Phone with OTP */}
              <View style={styles.phoneContainer}>
                <Text style={styles.label}>
                  Contact Number <Text style={styles.requiredStar}>*</Text>
                </Text>
                <View style={styles.row}>
                  <View style={styles.phoneInputWrapper}>
                    <Ionicons
                      name="call-outline"
                      size={20}
                      color="#999"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      placeholder="Enter 10 digit mobile number"
                      style={styles.phoneInput}
                      keyboardType="number-pad"
                      value={form.contact}
                      onChangeText={v => handleChange('contact', v)}
                      maxLength={10}
                    />
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.otpBtn,
                      (loading || resendTimer > 0) && styles.otpBtnDisabled,
                    ]}
                    onPress={handleSendOtp}
                    disabled={loading || resendTimer > 0}
                  >
                    <Text style={styles.otpBtnText}>
                      {loading
                        ? 'Sending...'
                        : resendTimer > 0
                        ? `${resendTimer}s`
                        : isOtpSent
                        ? 'Resend'
                        : 'Send OTP'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* OTP Input */}
              {isOtpSent && (
                <Input
                  label="OTP"
                  required
                  value={form.otp}
                  onChange={v => handleChange('otp', v)}
                  keyboardType="number-pad"
                  placeholder="Enter 6 digit OTP"
                  icon="key-outline"
                  focused={focusedField === 'otp'}
                  onFocus={() => setFocusedField('otp')}
                  onBlur={() => setFocusedField(null)}
                />
              )}

              {/* FIXED DOB PICKER */}
              <View style={styles.dobContainer}>
                <Text style={styles.label}>
                  Date of Birth <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => {
                    setShowDatePicker(true);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="calendar-outline" size={20} color="#999" />
                  <Text
                    style={form.dob ? styles.dateText : styles.datePlaceholder}
                  >
                    {form.dob
                      ? formatDisplayDate(form.dob)
                      : 'Select Date of Birth'}
                  </Text>
                  <Ionicons
                    name="chevron-down-outline"
                    size={18}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>

              {/* Date Picker - Fixed for both platforms */}
              {showDatePicker && (
                <DateTimePicker
                  value={dobDate || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  maximumDate={new Date()}
                  minimumDate={new Date(1900, 0, 1)}
                  onChange={(event, selectedDate) => {
                    if (Platform.OS === 'android') {
                      setShowDatePicker(false);
                    }

                    if (event.type === 'set' && selectedDate) {
                      setDobDate(selectedDate);

                      const year = selectedDate.getFullYear();
                      const month = String(
                        selectedDate.getMonth() + 1,
                      ).padStart(2, '0');
                      const day = String(selectedDate.getDate()).padStart(
                        2,
                        '0',
                      );

                      handleChange('dob', `${year}-${month}-${day}`);
                    }
                  }}
                />
              )}
              <Input
                label="Organisation Name"
                value={form.organisation_name}
                onChange={v => handleChange('organisation_name', v)}
                placeholder="Organisation (optional)"
                icon="business-outline"
                focused={focusedField === 'organisation_name'}
                onFocus={() => setFocusedField('organisation_name')}
                onBlur={() => setFocusedField(null)}
              />

              <Input
                label="Address"
                required
                value={form.address}
                onChange={v => handleChange('address', v)}
                multiline
                placeholder="Your complete address"
                // icon="location-outline"
                focused={focusedField === 'address'}
                onFocus={() => setFocusedField('address')}
                onBlur={() => setFocusedField(null)}
              />

              <View style={styles.rowContainer}>
                <View style={styles.halfWidth}>
                  <Input
                    label="City"
                    required
                    value={form.city}
                    onChange={v => handleChange('city', v)}
                    placeholder="City"
                    icon="business-outline"
                    focused={focusedField === 'city'}
                    onFocus={() => setFocusedField('city')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
                <View style={styles.halfWidth}>
                  <Input
                    label="Pincode"
                    required
                    value={form.pincode}
                    onChange={v => handleChange('pincode', v)}
                    keyboardType="number-pad"
                    maxLength={6}
                    placeholder="Pincode"
                    icon="location-outline"
                    focused={focusedField === 'pincode'}
                    onFocus={() => setFocusedField('pincode')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              <View style={styles.rowContainer}>
                <View style={styles.halfWidth}>
                  <Input
                    label="State"
                    required
                    value={form.state}
                    onChange={v => handleChange('state', v)}
                    placeholder="State"
                    icon="map-outline"
                    focused={focusedField === 'state'}
                    onFocus={() => setFocusedField('state')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
                <View style={styles.halfWidth}>
                  <Input
                    label="Country"
                    required
                    value={form.country}
                    onChange={v => handleChange('country', v)}
                    placeholder="Country"
                    icon="flag-outline"
                    focused={focusedField === 'country'}
                    onFocus={() => setFocusedField('country')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              <Input
                label="Password"
                required
                secure
                value={form.password}
                onChange={v => handleChange('password', v)}
                placeholder="Create password"
                icon="lock-closed-outline"
                showPasswordToggle
                focused={focusedField === 'password'}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />

              <Input
                label="Confirm Password"
                required
                secure
                value={form.password_confirmation}
                onChange={v => handleChange('password_confirmation', v)}
                placeholder="Confirm password"
                icon="lock-closed-outline"
                showPasswordToggle
                focused={focusedField === 'confirm_password'}
                onFocus={() => setFocusedField('confirm_password')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            {/* Plans Section */}
            <View style={styles.plansSection}>
              <Text style={styles.sectionTitle}>Select Membership Plan</Text>

              {loadingPlans ? (
                <ActivityIndicator size="large" color="#c9060a" />
              ) : plans.length === 0 ? (
                <Text style={styles.noPlansText}>No plans available</Text>
              ) : (
                <>
                  {selectedPlan && (
                    <LinearGradient
                      colors={['#fff', '#fff9f9']}
                      style={styles.selectedPlan}
                    >
                      <View style={styles.planHeader}>
                        <Text style={styles.planName}>{selectedPlan.name}</Text>
                        {selectedPlan.tag && (
                          <View style={styles.tagBadge}>
                            <Text style={styles.tagText}>
                              {selectedPlan.tag}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.planDuration}>
                        {getDurationText(selectedPlan)}
                      </Text>
                      <Text style={styles.planPrice}>
                        {parseFloat(selectedPlan.price || '0') === 0
                          ? 'FREE'
                          : `₹${selectedPlan.price}`}
                      </Text>
                      {selectedPlan.print_editions > 0 && (
                        <Text style={styles.printEditions}>
                          📄 {selectedPlan.print_editions} Print Editions
                        </Text>
                      )}
                      {!!selectedPlan.feature && (
                        <View style={styles.featuresContainer}>
                          <RenderHTML
                            contentWidth={width}
                            source={{ html: selectedPlan.feature }}
                            baseStyle={styles.featureText}
                          />
                        </View>
                      )}
                      <View style={styles.selectedBadge}>
                        <Text style={styles.selectedBadgeText}>Selected</Text>
                      </View>
                    </LinearGradient>
                  )}

                  {otherPlans.length > 0 && (
                    <>
                      <Text style={styles.otherPlansTitle}>Other Plans</Text>
                      {otherPlans.map(plan => (
                        <TouchableOpacity
                          key={plan.id}
                          style={styles.planOption}
                          onPress={() => {
                            handleChange('plan_id', plan.id.toString());
                            showToast(
                              'info',
                              'Plan Changed',
                              `${plan.name} selected`,
                            );
                          }}
                        >
                          <View style={styles.planOptionHeader}>
                            <Text style={styles.planOptionName}>
                              {plan.name}
                            </Text>
                            {plan.tag && (
                              <View style={styles.optionTagBadge}>
                                <Text style={styles.optionTagText}>
                                  {plan.tag}
                                </Text>
                              </View>
                            )}
                          </View>
                          <Text style={styles.planOptionDuration}>
                            {getDurationText(plan)}
                          </Text>
                          <Text style={styles.planOptionPrice}>
                            {parseFloat(plan.price || '0') === 0
                              ? 'FREE'
                              : `₹${plan.price}`}
                          </Text>
                          {plan.print_editions > 0 && (
                            <Text style={styles.printEditionsSmall}>
                              📄 {plan.print_editions} Print Editions
                            </Text>
                          )}
                        </TouchableOpacity>
                      ))}
                    </>
                  )}
                </>
              )}
            </View>

            {price > 0 && (
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Payment Summary</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Plan Amount</Text>
                  <Text style={styles.summaryValue}>₹{price}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>GST (18%)</Text>
                  <Text style={styles.summaryValue}>₹{gst.toFixed(2)}</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  <Text style={styles.totalAmount}>₹{total.toFixed(2)}</Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.submitButton,
                (!isOtpSent || !form.otp) && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={loading || !isOtpSent || !form.otp}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {price === 0
                    ? 'Register Now'
                    : `Pay ₹${total.toFixed(2)} & Register`}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        {/* </SafeAreaView> */}
      </KeyboardAvoidingView>

      {/* OTP Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showOtpModal}
        onRequestClose={() => setShowOtpModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>OTP Received</Text>
              <TouchableOpacity onPress={() => setShowOtpModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalSubtitle}>
                Your One-Time Password is:
              </Text>
              <Text style={styles.otpDisplay}>{receivedOtp}</Text>
              <Text style={styles.modalInfo}>
                This OTP is valid for 1 minute.{'\n'}Use this OTP to complete
                your registration.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.copyButton]}
                  onPress={() => setShowOtpModal(false)}
                >
                  <Text style={styles.copyButtonText}>Enter Manually</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.autoFillButton]}
                  onPress={autoFillOtp}
                >
                  <Text style={styles.autoFillButtonText}>Auto-Fill OTP</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
     </MainLayout>
  );
};

// Input Component remains the same...
const Input = ({
  label,
  required = false,
  value,
  onChange,
  secure = false,
  keyboardType = 'default',
  multiline = false,
  placeholder = '',
  maxLength,
  icon,
  showPasswordToggle = false,
  focused = false,
  onFocus,
  onBlur,
}: any) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.requiredStar}> *</Text>}
      </Text>
      <View
        style={[styles.inputWrapper, focused && styles.inputWrapperFocused]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color="#999"
            style={styles.inputIcon}
          />
        )}
        <TextInput
          value={value}
          onChangeText={onChange}
          secureTextEntry={secure && !showPassword}
          style={[styles.input, multiline && styles.textArea]}
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor="#999"
          multiline={multiline}
          maxLength={maxLength}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {showPasswordToggle && secure && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... (keep all styles from previous version)
  mainContainer: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: '#fff' },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  headerSection: { alignItems: 'center', marginTop: 20, marginBottom: 30 },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subHeading: { fontSize: 14, color: '#666', textAlign: 'center' },
  formSection: { marginBottom: 24 },
  rowContainer: { flexDirection: 'row', gap: 12 },
  halfWidth: { flex: 1 },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#333', marginBottom: 8 },
  requiredStar: { color: '#c9060a' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#fafafa',
    paddingHorizontal: 12,
  },
  inputWrapperFocused: {
    borderColor: '#c9060a',
    borderWidth: 2,
    backgroundColor: '#fff',
  },
  inputIcon: { marginRight: 8 },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 14,
    color: '#333',
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  phoneContainer: { marginBottom: 16 },
  row: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  phoneInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#fafafa',
    paddingHorizontal: 12,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 14,
  },
  otpBtn: {
    backgroundColor: '#c9060a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  otpBtnDisabled: { opacity: 0.6 },
  otpBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  dobContainer: { marginBottom: 16 },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fafafa',
  },
  dateText: { fontSize: 14, color: '#333', flex: 1 },
  datePlaceholder: { fontSize: 14, color: '#999', flex: 1 },
  plansSection: { marginTop: 16, marginBottom: 16 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  noPlansText: { textAlign: 'center', color: '#999', padding: 20 },
  selectedPlan: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#c9060a',
    position: 'relative',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  planName: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a' },
  tagBadge: {
    backgroundColor: '#ff9800',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  planDuration: { fontSize: 14, color: '#666', marginBottom: 8 },
  planPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#c9060a',
    marginBottom: 8,
  },
  printEditions: { fontSize: 13, color: '#4caf50', marginBottom: 8 },
  featuresContainer: { marginTop: 8 },
  featureText: { fontSize: 13, color: '#666', lineHeight: 20 },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#c9060a',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  selectedBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  otherPlansTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  planOption: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  planOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  planOptionName: { fontSize: 16, fontWeight: '600', color: '#333' },
  optionTagBadge: {
    backgroundColor: '#ff9800',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  optionTagText: { color: '#fff', fontSize: 9, fontWeight: '600' },
  planOptionDuration: { fontSize: 12, color: '#666', marginBottom: 4 },
  planOptionPrice: { fontSize: 16, fontWeight: 'bold', color: '#c9060a' },
  printEditionsSmall: { fontSize: 11, color: '#4caf50', marginTop: 4 },
  summaryCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: { fontSize: 14, color: '#666' },
  summaryValue: { fontSize: 14, color: '#333', fontWeight: '500' },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#1a1a1a' },
  totalAmount: { fontSize: 18, fontWeight: 'bold', color: '#c9060a' },
  submitButton: {
    backgroundColor: '#c9060a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#c9060a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    width: '85%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#c9060a',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  modalBody: { padding: 24, alignItems: 'center' },
  modalSubtitle: { fontSize: 14, color: '#666', marginBottom: 12 },
  otpDisplay: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#c9060a',
    letterSpacing: 8,
    marginVertical: 16,
  },
  modalInfo: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  modalButtons: { flexDirection: 'row', gap: 12, width: '100%' },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  copyButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  copyButtonText: { color: '#666', fontSize: 14, fontWeight: '600' },
  autoFillButton: { backgroundColor: '#c9060a' },
  autoFillButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
   backBtn: {
    position: 'absolute',
    top: 10,
    left: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default RegisterScreen;
