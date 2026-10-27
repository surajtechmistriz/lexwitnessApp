import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import RenderHTML from 'react-native-render-html';
import RazorpayCheckout from 'react-native-razorpay';
import IconBack from 'react-native-vector-icons/Feather';
import {
  CommonActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import { registerApi, verifyPaymentApi } from '../../services/auth.service';
import { getMembershipPlans } from '../../services/membership.service';
import type { MembershipPlan } from '../../types/membership.types';
import MainLayout from '../../MainLayout';
import { useTheme } from '../../store/hooks/useTheme';

const RegisterScreen = () => {
  const { width } = useWindowDimensions();
  const route = useRoute<any>();
  const preselectedPlanId = route?.params?.selectedPlanId;
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    contact: '',
    dob: '',
    organisation_name: '',
    gst_number: '',
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
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
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

          setForm(prev => ({
            ...prev,
            plan_id: defaultPlan.id.toString(),
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
  }, [preselectedPlanId]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleChange = (name: string, value: any) => {
    if (name === 'contact') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
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

  const handleRegistrationSuccess = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'SignIn',
            params: {
              successMessage:
                'Registration successful! Please sign in to continue.',
            },
          },
        ],
      }),
    );
  };

  const registerUser = async () => {
    if (loading) return;

    const log = (step: string, data?: unknown) => {
      if (__DEV__) {
        console.log(`[REGISTER PAYMENT] ${step}`, data ?? '');
      }
    };

    try {
      setLoading(true);

      // STEP 1: Validate selected plan
      const selectedPlan = plans.find(
        p => String(p.id) === String(form.plan_id),
      );

      if (!selectedPlan) {
        showToast('error', 'Error', 'Please select a valid plan');
        return;
      }

      const isPaidPlan = Number(selectedPlan.price ?? 0) > 0;

      log('STEP 1: Selected plan', {
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        isPaidPlan,
      });

      // STEP 2: Prepare registration payload
      const payload = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        contact: form.contact,
        dob: formatDisplayDate(form.dob).replace(/\//g, '-'),
        organisation: form.organisation_name,
        gst_number: form.gst_number,
        address: form.address,
        city: form.city,
        pincode: form.pincode,
        state: form.state,
        country: form.country,
        password: form.password,
        password_confirmation: form.password_confirmation,
        membership_plan_id: form.plan_id,
      };

      log('STEP 2: Sending registration request');

      // STEP 3: Register user
      const res = await registerApi(payload);

      log('STEP 3: Registration response structure', {
        status: res?.status,
        message: res?.message,
        hasData: Boolean(res?.data),
        hasPayment: Boolean(res?.data?.payment),
        hasSubscription: Boolean(res?.data?.subscription),
        hasCheckoutToken: Boolean(res?.data?.checkout_token),
      });

      if (!res?.status) {
        showToast(
          'error',
          'Registration Failed',
          res?.message || 'Registration failed',
        );
        return;
      }

      // STEP 4: Free plan
      if (!isPaidPlan) {
        log('STEP 4: Free registration successful');

        showToast(
          'success',
          'Registration Successful',
          'Please sign in to continue',
        );

        handleRegistrationSuccess();
        return;
      }

      // STEP 5: Paid plan checkout details
      const registrationData = res?.data;

      const subscriptionId = Number(registrationData?.subscription?.id);

      const checkoutToken = registrationData?.checkout_token;

      // Support common response nesting.
      // These paths must match the actual backend response.
      const payment =
        registrationData?.payment ??
        registrationData?.checkout?.payment ??
        registrationData?.checkout;

      const razorpayKey = payment?.razorpay_key ?? payment?.key;

      const orderId = payment?.order_id ?? payment?.razorpay_order_id;

      const amount = Number(payment?.amount);
      const currency = payment?.currency ?? 'INR';

      log('STEP 5: Checkout details', {
        subscriptionId,
        hasCheckoutToken: Boolean(checkoutToken),
        hasRazorpayKey: Boolean(razorpayKey),
        hasOrderId: Boolean(orderId),
        amount,
        currency,
      });

      if (
        !Number.isInteger(subscriptionId) ||
        subscriptionId <= 0 ||
        !checkoutToken ||
        !razorpayKey ||
        !orderId ||
        !Number.isFinite(amount) ||
        amount <= 0
      ) {
        showToast(
          'error',
          'Payment Error',
          'Registration was saved, but payment checkout details are missing. Please contact support.',
        );

        log('ERROR: Incomplete payment checkout response');
        return;
      }

      // STEP 6: Configure Razorpay
      const options = {
        key: razorpayKey,
        order_id: orderId,
        amount,
        currency,
        name: 'Lex Witness',
        description: 'Membership Subscription',
        prefill: {
          email: form.email.trim(),
          contact: form.contact,
          name: `${form.first_name} ${form.last_name}`.trim(),
        },
        theme: {
          color: '#c9060a',
        },
      };

      log('STEP 6: Opening Razorpay');

      // STEP 7: Open Razorpay checkout
      let paymentResponse: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      };

      try {
        paymentResponse = await RazorpayCheckout.open(options);
      } catch (error: any) {
        log('STEP 7: Razorpay checkout closed or failed', {
          code: error?.code,
          description: error?.description,
        });

        showToast(
          'error',
          'Payment Not Completed',
          error?.description ||
            error?.message ||
            'Payment was cancelled or failed',
        );
        return;
      }

      log('STEP 7: Razorpay returned payment details', {
        hasPaymentId: Boolean(paymentResponse?.razorpay_payment_id),
        hasOrderId: Boolean(paymentResponse?.razorpay_order_id),
        hasSignature: Boolean(paymentResponse?.razorpay_signature),
      });

      if (
        !paymentResponse?.razorpay_payment_id ||
        !paymentResponse?.razorpay_order_id ||
        !paymentResponse?.razorpay_signature
      ) {
        showToast(
          'error',
          'Payment Error',
          'Incomplete Razorpay payment response',
        );
        return;
      }

      // STEP 8: Prepare backend verification
      const verifyPayload = {
        subscription_id: subscriptionId,
        checkout_token: checkoutToken,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_signature: paymentResponse.razorpay_signature,
      };

      log('STEP 8: Verifying payment with backend');

      // STEP 9: Verify payment
      let verifyRes;

      try {
        verifyRes = await verifyPaymentApi(verifyPayload);
      } catch (error: any) {
        log('STEP 9: Verification request failed', {
          message: error?.message,
        });

        showToast(
          'error',
          'Payment Verification Pending',
          'Payment checkout completed, but verification could not be confirmed. Please contact support before trying to register again.',
        );
        return;
      }

      log('STEP 9: Verification response', {
        status: verifyRes?.status,
        message: verifyRes?.message,
      });

      // STEP 10: Redirect only after backend confirmation
      if (verifyRes?.status === true) {
        log('STEP 10: Payment verified successfully');

        showToast(
          'success',
          'Payment Successful',
          'Your subscription has been confirmed',
        );

        handleRegistrationSuccess();
        return;
      }

      showToast(
        'error',
        'Verification Failed',
        verifyRes?.message ||
          'Payment verification was not confirmed. Please contact support.',
      );
    } catch (error: any) {
      log('REGISTRATION ERROR', {
        message: error?.message,
      });

      showToast(
        'error',
        'Registration Failed',
        error?.message || 'Something went wrong',
      );
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

  const statusBarColor = '#c9060a';
  const statusBarStyle = 'light-content';

  return (
    <MainLayout
      title="Register"
      routeName="Register"
      showFilter={false}
      statusBarColor={statusBarColor}
      statusBarStyle={statusBarStyle}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.flex, { backgroundColor: colors.background }]}
      >
        <ScrollView
          style={[styles.scrollView, { backgroundColor: colors.background }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            onPress={handleBack}
            style={[styles.backBtn, { backgroundColor: colors.card }]}
          >
            <IconBack name="arrow-left" size={22} color={colors.primary} />
          </TouchableOpacity>

          {/* Header Section */}
          <View style={styles.headerSection}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: colors.primaryBackground },
              ]}
            >
              <Ionicons
                name="person-add-outline"
                size={40}
                color={colors.primary}
              />
            </View>
            <Text style={[styles.heading, { color: colors.text }]}>
              Create Account
            </Text>
            <Text style={[styles.subHeading, { color: colors.textSecondary }]}>
              Join Lex Witness Membership
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.rowContainer}>
              <View style={styles.halfWidth}>
                <Input
                  label="First Name"
                  required
                  value={form.first_name}
                  onChange={(v: string) => handleChange('first_name', v)}
                  placeholder="First name"
                  icon="person-outline"
                  focused={focusedField === 'first_name'}
                  onFocus={() => setFocusedField('first_name')}
                  onBlur={() => setFocusedField(null)}
                  colors={colors}
                  isDark={isDark}
                />
              </View>
              <View style={styles.halfWidth}>
                <Input
                  label="Last Name"
                  required
                  value={form.last_name}
                  onChange={(v: string) => handleChange('last_name', v)}
                  placeholder="Last name"
                  focused={focusedField === 'last_name'}
                  onFocus={() => setFocusedField('last_name')}
                  onBlur={() => setFocusedField(null)}
                  colors={colors}
                  isDark={isDark}
                />
              </View>
            </View>

            <Input
              label="Email"
              required
              value={form.email}
              onChange={(v: string) => handleChange('email', v)}
              keyboardType="email-address"
              placeholder="you@example.com"
              icon="mail-outline"
              focused={focusedField === 'email'}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              colors={colors}
              isDark={isDark}
            />

            {/* Contact Number*/}
            <View style={styles.phoneContainer}>
              <Text style={[styles.label, { color: colors.text }]}>
                Contact Number{' '}
                <Text style={[styles.requiredStar, { color: colors.primary }]}>
                  *
                </Text>
              </Text>

              <View
                style={[
                  styles.phoneInputWrapper,
                  {
                    borderColor: isDark ? colors.border : '#e0e0e0',
                    backgroundColor: isDark ? colors.background : '#fafafa',
                  },
                ]}
              >
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={colors.textMuted}
                  style={styles.inputIcon}
                />

                <TextInput
                  placeholder="Enter contact number"
                  style={[styles.phoneInput, { color: colors.text }]}
                  keyboardType="number-pad"
                  value={form.contact}
                  onChangeText={(v: string) => handleChange('contact', v)}
                  maxLength={10}
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            {/* DOB PICKER */}
            <View style={styles.dobContainer}>
              <Text style={[styles.label, { color: colors.text }]}>
                Date of Birth{' '}
                <Text style={[styles.requiredStar, { color: colors.primary }]}>
                  *
                </Text>
              </Text>
              <TouchableOpacity
                style={[
                  styles.dateButton,
                  {
                    borderColor: isDark ? colors.border : '#e0e0e0',
                    backgroundColor: isDark ? colors.background : '#fafafa',
                  },
                ]}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={colors.textMuted}
                />
                <Text
                  style={
                    form.dob
                      ? [styles.dateText, { color: colors.text }]
                      : [styles.datePlaceholder, { color: colors.textMuted }]
                  }
                >
                  {form.dob
                    ? formatDisplayDate(form.dob)
                    : 'Select Date of Birth'}
                </Text>
                <Ionicons
                  name="chevron-down-outline"
                  size={18}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            {/* Date Picker */}
            {showDatePicker && (
              <DateTimePicker
                value={
                  form.dob
                    ? new Date(form.dob + 'T00:00:00')
                    : new Date(2000, 0, 1) // default DOB year
                }
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
                onChange={(event, selectedDate) => {
                  if (Platform.OS === 'android') {
                    setShowDatePicker(false);
                  }

                  if (event.type === 'set' && selectedDate) {
                    const year = selectedDate.getFullYear();
                    const month = String(selectedDate.getMonth() + 1).padStart(
                      2,
                      '0',
                    );
                    const day = String(selectedDate.getDate()).padStart(2, '0');

                    handleChange('dob', `${year}-${month}-${day}`);
                  }
                }}
              />
            )}

            <Input
              label="Organisation Name"
              value={form.organisation_name}
              onChange={(v: string) => handleChange('organisation_name', v)}
              placeholder="Organisation  "
              icon="business-outline"
              focused={focusedField === 'organisation_name'}
              onFocus={() => setFocusedField('organisation_name')}
              onBlur={() => setFocusedField(null)}
              colors={colors}
              isDark={isDark}
            />

            <Input
              label="GST Number"
              value={form.gst_number}
              onChange={(v: string) =>
                handleChange('gst_number', v.toUpperCase())
              }
              placeholder="Enter GST Number "
              icon="receipt-outline"
              focused={focusedField === 'gst_number'}
              onFocus={() => setFocusedField('gst_number')}
              onBlur={() => setFocusedField(null)}
              maxLength={15}
              colors={colors}
              isDark={isDark}
            />

            <Input
              label="Address"
              required
              value={form.address}
              onChange={(v: string) => handleChange('address', v)}
              multiline
              placeholder="Your complete address"
              focused={focusedField === 'address'}
              onFocus={() => setFocusedField('address')}
              onBlur={() => setFocusedField(null)}
              colors={colors}
              isDark={isDark}
            />

            <View style={styles.rowContainer}>
              <View style={styles.halfWidth}>
                <Input
                  label="City"
                  required
                  value={form.city}
                  onChange={(v: string) => handleChange('city', v)}
                  placeholder="City"
                  icon="business-outline"
                  focused={focusedField === 'city'}
                  onFocus={() => setFocusedField('city')}
                  onBlur={() => setFocusedField(null)}
                  colors={colors}
                  isDark={isDark}
                />
              </View>
              <View style={styles.halfWidth}>
                <Input
                  label="Pincode"
                  required
                  value={form.pincode}
                  onChange={(v: string) => handleChange('pincode', v)}
                  keyboardType="number-pad"
                  maxLength={6}
                  placeholder="Pincode"
                  icon="location-outline"
                  focused={focusedField === 'pincode'}
                  onFocus={() => setFocusedField('pincode')}
                  onBlur={() => setFocusedField(null)}
                  colors={colors}
                  isDark={isDark}
                />
              </View>
            </View>

            <View style={styles.rowContainer}>
              <View style={styles.halfWidth}>
                <Input
                  label="State"
                  required
                  value={form.state}
                  onChange={(v: string) => handleChange('state', v)}
                  placeholder="State"
                  icon="map-outline"
                  focused={focusedField === 'state'}
                  onFocus={() => setFocusedField('state')}
                  onBlur={() => setFocusedField(null)}
                  colors={colors}
                  isDark={isDark}
                />
              </View>
              <View style={styles.halfWidth}>
                <Input
                  label="Country"
                  required
                  value={form.country}
                  onChange={(v: string) => handleChange('country', v)}
                  placeholder="Country"
                  icon="flag-outline"
                  focused={focusedField === 'country'}
                  onFocus={() => setFocusedField('country')}
                  onBlur={() => setFocusedField(null)}
                  colors={colors}
                  isDark={isDark}
                />
              </View>
            </View>

            <Input
              label="Password"
              required
              secure
              value={form.password}
              onChange={(v: string) => handleChange('password', v)}
              placeholder="Create password"
              icon="lock-closed-outline"
              showPasswordToggle
              focused={focusedField === 'password'}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              colors={colors}
              isDark={isDark}
            />

            <Input
              label="Confirm Password"
              required
              secure
              value={form.password_confirmation}
              onChange={(v: string) => handleChange('password_confirmation', v)}
              placeholder="Confirm password"
              icon="lock-closed-outline"
              showPasswordToggle
              focused={focusedField === 'confirm_password'}
              onFocus={() => setFocusedField('confirm_password')}
              onBlur={() => setFocusedField(null)}
              colors={colors}
              isDark={isDark}
            />
          </View>

          {/* Plans Section */}
          <View style={styles.plansSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Select Membership Plan
            </Text>

            {loadingPlans ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : plans.length === 0 ? (
              <Text
                style={[styles.noPlansText, { color: colors.textSecondary }]}
              >
                No plans available
              </Text>
            ) : (
              <>
                {selectedPlan && (
                  <LinearGradient
                    colors={
                      isDark ? ['#1a1a1a', '#9d9595'] : ['#fff', '#fff9f9']
                    }
                    style={[
                      styles.selectedPlan,
                      { borderColor: colors.primary },
                    ]}
                  >
                    <View style={styles.planHeader}>
                      <Text style={[styles.planName, { color: colors.text }]}>
                        {selectedPlan.name}
                      </Text>
                      {selectedPlan.tag && (
                        <View
                          style={[
                            styles.tagBadge,
                            { backgroundColor: colors.primary },
                          ]}
                        >
                          <Text style={styles.tagText}>{selectedPlan.tag}</Text>
                        </View>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.planDuration,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {getDurationText(selectedPlan)}
                    </Text>
                    <Text style={[styles.planPrice, { color: colors.primary }]}>
                      {parseFloat(selectedPlan.price || '0') === 0
                        ? 'FREE'
                        : `₹${selectedPlan.price}`}
                    </Text>
                    {selectedPlan.print_editions > 0 && (
                      <Text
                        style={[
                          styles.printEditions,
                          { color: colors.success },
                        ]}
                      >
                        📄 {selectedPlan.print_editions} Print Editions
                      </Text>
                    )}
                    {!!selectedPlan.feature && (
                      <View style={styles.featuresContainer}>
                        <RenderHTML
                          contentWidth={width}
                          source={{ html: selectedPlan.feature }}
                          baseStyle={{
                            ...styles.featureText,
                            color: colors.textSecondary,
                          }}
                        />
                      </View>
                    )}
                    <View
                      style={[
                        styles.selectedBadge,
                        { backgroundColor: colors.primary },
                      ]}
                    >
                      <Text style={styles.selectedBadgeText}>Selected</Text>
                    </View>
                  </LinearGradient>
                )}

                {otherPlans.length > 0 && (
                  <>
                    <Text
                      style={[
                        styles.otherPlansTitle,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Other Plans
                    </Text>
                    {otherPlans.map(plan => (
                      <TouchableOpacity
                        key={plan.id}
                        style={[
                          styles.planOption,
                          {
                            borderColor: isDark ? colors.border : '#e0e0e0',
                            backgroundColor: colors.card,
                          },
                        ]}
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
                          <Text
                            style={[
                              styles.planOptionName,
                              { color: colors.text },
                            ]}
                          >
                            {plan.name}
                          </Text>
                          {plan.tag && (
                            <View
                              style={[
                                styles.optionTagBadge,
                                { backgroundColor: colors.primary },
                              ]}
                            >
                              <Text style={styles.optionTagText}>
                                {plan.tag}
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text
                          style={[
                            styles.planOptionDuration,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {getDurationText(plan)}
                        </Text>
                        <Text
                          style={[
                            styles.planOptionPrice,
                            { color: colors.primary },
                          ]}
                        >
                          {parseFloat(plan.price || '0') === 0
                            ? 'FREE'
                            : `₹${plan.price}`}
                        </Text>
                        {plan.print_editions > 0 && (
                          <Text
                            style={[
                              styles.printEditionsSmall,
                              { color: colors.success },
                            ]}
                          >
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
            <View
              style={[
                styles.summaryCard,
                {
                  backgroundColor: isDark ? colors.background : '#f8f9fa',
                },
              ]}
            >
              <Text style={[styles.summaryTitle, { color: colors.text }]}>
                Payment Summary
              </Text>
              <View style={styles.summaryRow}>
                <Text
                  style={[styles.summaryLabel, { color: colors.textSecondary }]}
                >
                  Plan Amount
                </Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  ₹{price}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text
                  style={[styles.summaryLabel, { color: colors.textSecondary }]}
                >
                  GST (18%)
                </Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  ₹{gst.toFixed(2)}
                </Text>
              </View>
              <View
                style={[
                  styles.summaryRow,
                  styles.totalRow,
                  { borderTopColor: colors.border },
                ]}
              >
                <Text style={[styles.totalLabel, { color: colors.text }]}>
                  Total Amount
                </Text>
                <Text style={[styles.totalAmount, { color: colors.primary }]}>
                  ₹{total.toFixed(2)}
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
              { backgroundColor: colors.primary },
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.submitButtonText}>
                {price === 0
                  ? 'Register Now'
                  : `Pay ₹${total.toFixed(2)} & Register`}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </MainLayout>
  );
};

// Input Component with dark mode support
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
  colors,
  isDark,
}: any) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: colors.text }]}>
        {label}
        {required && (
          <Text style={[styles.requiredStar, { color: colors.primary }]}>
            {' '}
            *
          </Text>
        )}
      </Text>
      <View
        style={[
          styles.inputWrapper,
          {
            borderColor: focused
              ? colors.primary
              : isDark
              ? colors.border
              : '#e0e0e0',
            backgroundColor: focused
              ? colors.card
              : isDark
              ? colors.background
              : '#fafafa',
          },
          focused && styles.inputWrapperFocused,
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={colors.textMuted}
            style={styles.inputIcon}
          />
        )}
        <TextInput
          value={value}
          onChangeText={onChange}
          secureTextEntry={secure && !showPassword}
          style={[
            styles.input,
            { color: colors.text },
            multiline && styles.textArea,
          ]}
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
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
              color={colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  flex: { flex: 1 },
  safeArea: { flex: 1 },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  headerSection: { alignItems: 'center', marginTop: 20, marginBottom: 30 },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subHeading: { fontSize: 14, textAlign: 'center' },
  formSection: { marginBottom: 24 },
  rowContainer: { flexDirection: 'row', gap: 12 },
  halfWidth: { flex: 1 },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  requiredStar: { color: '#c9060a' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputWrapperFocused: {
    borderWidth: 2,
  },
  inputIcon: { marginRight: 8 },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 14,
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  phoneContainer: { marginBottom: 16 },
  row: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  phoneInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  phoneInput: {
    flex: 1,
    // paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 14,
  },

  dobContainer: { marginBottom: 16 },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  dateText: { fontSize: 14, flex: 1 },
  datePlaceholder: { fontSize: 14, flex: 1 },
  plansSection: { marginTop: 16, marginBottom: 16 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  noPlansText: { textAlign: 'center', padding: 20 },
  selectedPlan: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 2,
    position: 'relative',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  planName: { fontSize: 22, fontWeight: 'bold' },
  tagBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: { color: '#fff', fontSize: 11, fontWeight: '600' as const },
  planDuration: { fontSize: 14, marginBottom: 8 },
  planPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  printEditions: { fontSize: 13, marginBottom: 8 },
  featuresContainer: { marginTop: 8 },
  featureText: { fontSize: 13, lineHeight: 20 },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  selectedBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  otherPlansTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  planOption: {
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  planOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  planOptionName: { fontSize: 16, fontWeight: '600' as const },
  optionTagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  optionTagText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '600' as const,
  },
  planOptionDuration: { fontSize: 12, marginBottom: 4 },
  planOptionPrice: { fontSize: 16, fontWeight: 'bold' },
  printEditionsSmall: { fontSize: 11, marginTop: 4 },
  summaryCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: { fontSize: 14 },
  summaryValue: { fontSize: 14, fontWeight: '500' },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  totalLabel: { fontSize: 16, fontWeight: 'bold' },
  totalAmount: { fontSize: 18, fontWeight: 'bold' },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    borderRadius: 24,
    width: '85%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  modalBody: { padding: 24, alignItems: 'center' },
  modalSubtitle: { fontSize: 14, marginBottom: 12 },

  modalInfo: {
    fontSize: 12,
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
    borderWidth: 1,
  },
  copyButtonText: { fontSize: 14, fontWeight: '600' as const },
  autoFillButton: {},
  autoFillButtonText: { fontSize: 14, fontWeight: '600' as const },
  backBtn: {
    position: 'absolute',
    top: 10,
    left: 5,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default RegisterScreen;
