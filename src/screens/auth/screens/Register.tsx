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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import MainLayout from '../../../MainLayout';
import RenderHTML from 'react-native-render-html';
import {
  getMembershipPlans,
  sendOtpApi,
  registerApi,
  verifyPaymentApi,
} from '../api/services';
import { ActivityIndicator } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { useDispatch } from 'react-redux';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { loginSuccess } from '../../../redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interface for membership plan
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
  const navigation = useNavigation<any>();

  const { width } = useWindowDimensions();

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
    plan_id: '1', // Default to Basic plan
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

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoadingPlans(true);

    try {
      const res = await getMembershipPlans();

      if (res?.status) {
        setPlans(res.data);

        // default selected plan
        if (res.data.length > 0) {
          const firstPlan = res.data[0];

          setForm(prev => ({
            ...prev,
            plan_id: firstPlan.id.toString(),
          }));
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

    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Show toast notification
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

  // Send OTP
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

      const payload = {
        contact: form.contact,
        email: form.email,
      };

      const res = await sendOtpApi(payload);
      console.log('OTP data', res);
      if (res?.status) {
        setIsOtpSent(true);

        // optional only for testing
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

  // Register User
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

      // FREE PLAN
      if (!res?.data?.payment) {
        const token = res?.data?.token;
        const user = res?.data?.user;
        const subscription = res?.data?.subscription;

        // save to storage
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));

        if (subscription) {
          await AsyncStorage.setItem(
            'subscription',
            JSON.stringify(subscription),
          );
        }

        // redux login
        dispatch(
          loginSuccess({
            token,
            user,
            subscription,
          }),
        );

        showToast('success', 'Success', 'Registration completed successfully');

        // redirect dashboard
        setTimeout(() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'AccountTab' }],
            }),
          );
        }, 100);

        return;
      }

      // PAID PLAN
      const payment = res.data.payment;

      const options = {
        description: 'Membership Subscription',
        image: 'https://your-logo-url.com/logo.png',
        currency: payment.currency,
        key: payment.razorpay_key,
        amount: payment.amount,
        name: 'Your App Name',
        order_id: payment.order_id,
        prefill: {
          email: form.email,
          contact: form.contact,
          name: `${form.first_name} ${form.last_name}`,
        },
        theme: {
          color: '#c9060a',
        },
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

          // save storage
          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('user', JSON.stringify(user));

          if (subscription) {
            await AsyncStorage.setItem(
              'subscription',
              JSON.stringify(subscription),
            );
          }

          // redux login
          dispatch(
            loginSuccess({
              token,
              user,
              subscription,
            }),
          );

          showToast(
            'success',
            'Success',
            'Payment verified & subscription activated',
          );

          // redirect
          setTimeout(() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'AccountTab' }],
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

  // Validation
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

  return (
    <MainLayout title="Register" showFilter={false} routeName="Register">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.heading}>Create Account</Text>

            {/* Personal Details */}
            <Input
              label="First Name"
              required
              value={form.first_name}
              onChange={v => handleChange('first_name', v)}
              placeholder="Enter your first name"
            />
            <Input
              label="Last Name"
              required
              value={form.last_name}
              onChange={v => handleChange('last_name', v)}
              placeholder="Enter your last name"
            />
            <Input
              label="Email"
              required
              value={form.email}
              onChange={v => handleChange('email', v)}
              keyboardType="email-address"
              placeholder="you@example.com"
            />

            {/* Phone with OTP */}
            <View style={styles.phoneContainer}>
              <Text style={styles.label}>
                Contact Number <Text style={{ color: 'red' }}>*</Text>
              </Text>
              <View style={styles.row}>
                <TextInput
                  placeholder="Enter 10 digit mobile number"
                  style={[styles.input, { flex: 1 }]}
                  keyboardType="number-pad"
                  value={form.contact}
                  onChangeText={v => handleChange('contact', v)}
                  maxLength={10}
                />
                <TouchableOpacity
                  style={[
                    styles.otpBtn,
                    (loading || resendTimer > 0) && styles.otpBtnDisabled,
                  ]}
                  onPress={handleSendOtp}
                  disabled={loading || resendTimer > 0}
                >
                  <Text style={styles.btnText}>
                    {loading
                      ? 'Sending...'
                      : resendTimer > 0
                      ? `Resend in ${resendTimer}s`
                      : isOtpSent
                      ? 'Resend OTP'
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
              />
            )}

            {/* DOB */}
            <Text style={styles.label}>
              Date of Birth <Text style={{ color: 'red' }}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={form.dob ? styles.dateText : styles.datePlaceholder}>
                {form.dob || 'Select Date of Birth'}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={form.dob ? new Date(form.dob) : new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    const formattedDate =
                      selectedDate.toLocaleDateString('en-GB');
                    handleChange('dob', formattedDate);
                  }
                }}
              />
            )}

            <Input
              label="Organisation Name"
              value={form.organisation_name}
              onChange={v => handleChange('organisation_name', v)}
              placeholder="Organisation (optional)"
            />
            <Input
              label="Address"
              required
              value={form.address}
              onChange={v => handleChange('address', v)}
              multiline
              placeholder="Your complete address"
            />
            <Input
              label="City"
              required
              value={form.city}
              onChange={v => handleChange('city', v)}
              placeholder="City"
            />
            <Input
              label="Pincode"
              required
              value={form.pincode}
              onChange={v => handleChange('pincode', v)}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="Pincode"
            />
            <Input
              label="State"
              required
              value={form.state}
              onChange={v => handleChange('state', v)}
              placeholder="State"
            />
            <Input
              label="Country"
              required
              value={form.country}
              onChange={v => handleChange('country', v)}
              placeholder="Country"
            />

            <Input
              label="Password"
              required
              secure
              value={form.password}
              onChange={v => handleChange('password', v)}
              placeholder="Create password"
            />
            <Input
              label="Confirm Password"
              required
              secure
              value={form.password_confirmation}
              onChange={v => handleChange('password_confirmation', v)}
              placeholder="Confirm password"
            />

            {/* Plans Section */}
            <Text style={styles.sectionTitle}>Select Membership Plan</Text>

            {loadingPlans ? (
              <ActivityIndicator size="large" color="#c9060a" />
            ) : plans.length === 0 ? (
              <Text style={{ textAlign: 'center', color: '#999' }}>
                No plans available
              </Text>
            ) : (
              <>
                {/* Selected Plan */}
                {selectedPlan && (
                  <View style={styles.selectedPlan}>
                    <View style={styles.planHeader}>
                      <Text style={styles.planName}>{selectedPlan.name}</Text>

                      {selectedPlan.tag && (
                        <View style={styles.tagBadge}>
                          <Text style={styles.tagText}>{selectedPlan.tag}</Text>
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
                      <Text style={styles.selectedBadgeText}>
                        Selected Plan
                      </Text>
                    </View>
                  </View>
                )}

                {/* Other Plans */}
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
                          <Text style={styles.planOptionName}>{plan.name}</Text>

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

            {/* Price Summary for Paid Plans */}
            {price > 0 && (
              <View style={styles.summary}>
                <Text style={styles.summaryTitle}>Payment Summary</Text>
                <View style={styles.summaryRow}>
                  <Text>Plan Amount</Text>
                  <Text>₹{price}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text>GST (18%)</Text>
                  <Text>₹{gst.toFixed(2)}</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  <Text style={styles.totalAmount}>₹{total.toFixed(2)}</Text>
                </View>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submit,
                (!isOtpSent || !form.otp) && styles.submitDisabled,
              ]}
              onPress={handleSubmit}
              disabled={loading || !isOtpSent || !form.otp}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>
                  {price === 0
                    ? 'Register Now'
                    : `Pay ₹${total.toFixed(2)} & Register`}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginLink}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.loginButton}>Login</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
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
              <Text style={styles.modalTitle}>📱 OTP Received</Text>
              <TouchableOpacity onPress={() => setShowOtpModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalSubtitle}>
                Your One-Time Password is:
              </Text>
              <Text style={styles.otpDisplay}>{receivedOtp}</Text>
              <Text style={styles.modalInfo}>
                This OTP is valid for 1 minutes.{'\n'}
                Use this OTP to complete your registration.
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

      {/* <Toast /> */}
    </MainLayout>
  );
};

// Input Component
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
}: any) => {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={{ color: 'red' }}> *</Text>}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        secureTextEntry={secure}
        style={[
          styles.input,
          multiline && { height: 80, textAlignVertical: 'top' },
        ]}
        keyboardType={keyboardType}
        placeholder={placeholder}
        multiline={multiline}
        maxLength={maxLength}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollView: { flex: 1, padding: 16 },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
    textAlign: 'center',
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#666' },

  label: { fontSize: 14, fontWeight: '500', color: '#333', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    backgroundColor: '#fff',
  },

  phoneContainer: { marginBottom: 12 },
  row: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  otpBtn: {
    backgroundColor: '#c9060a',
    padding: 12,
    borderRadius: 8,
    minWidth: 110,
    alignItems: 'center',
  },
  otpBtnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  dateButton: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  dateText: { fontSize: 14, color: '#333' },
  datePlaceholder: { fontSize: 14, color: '#999' },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
    color: '#333',
  },

  selectedPlan: {
    borderWidth: 2,
    borderColor: '#c9060a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#fff5f5',
    position: 'relative',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  planName: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  tagBadge: {
    backgroundColor: '#ff9800',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  tagText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  planDuration: { fontSize: 14, color: '#666', marginBottom: 8 },
  planPrice: {
    fontSize: 24,
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  selectedBadgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },

  otherPlansTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#666',
  },
  planOption: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
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
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  optionTagText: { color: '#fff', fontSize: 9, fontWeight: '600' },
  planOptionDuration: { fontSize: 12, color: '#666', marginBottom: 4 },
  planOptionPrice: { fontSize: 16, fontWeight: 'bold', color: '#c9060a' },
  printEditionsSmall: { fontSize: 11, color: '#4caf50', marginTop: 4 },

  summary: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  totalLabel: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  totalAmount: { fontWeight: 'bold', fontSize: 18, color: '#c9060a' },

  submit: {
    backgroundColor: '#c9060a',
    padding: 16,
    borderRadius: 10,
    marginTop: 24,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitDisabled: { opacity: 0.6 },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loginText: { fontSize: 14, color: '#666' },
  loginButton: { fontSize: 14, color: '#c9060a', fontWeight: '600' },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '85%',
    maxWidth: 320,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#c9060a',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  modalClose: { fontSize: 20, color: '#fff', fontWeight: 'bold' },
  modalBody: { padding: 20, alignItems: 'center' },
  modalSubtitle: { fontSize: 14, color: '#666', marginBottom: 12 },
  otpDisplay: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#c9060a',
    letterSpacing: 8,
    marginVertical: 16,
    textAlign: 'center',
  },
  modalInfo: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  modalButtons: { flexDirection: 'row', gap: 12, width: '100%' },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  copyButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  copyButtonText: { color: '#666', fontSize: 14, fontWeight: '600' },
  autoFillButton: { backgroundColor: '#c9060a' },
  autoFillButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});

export default RegisterScreen;
