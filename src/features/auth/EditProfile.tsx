import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Platform,
    KeyboardAvoidingView,
    StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../../redux/hooks/useTheme';
import LinearGradient from 'react-native-linear-gradient';
import { useResponsive } from '../../../hooks/useResponsive';
import { getProfile } from '../../dashboard/api';
import { setProfile } from '../../../redux/slices/authSlice';
import { sendUpdateOtp, updateProfile } from '../api/profile';

// Types
interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    contact: string;
    otp: string;
    dob: string;
    organisation: string;
    gstNumber: string;
    address: string;
    city: string;
    pincode: string;
    state: string;
    country: string;
}

interface PasswordForm {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    contact: string;
    dob?: string;
    organisation?: string;
    gst_number?: string;
    address?: string;
    city?: string;
    pincode?: string | number;
    state?: string;
    country?: string;
}

interface AuthState {
    user: User | null;
}

const EditProfileScreen = () => {
    const navigation = useNavigation<any>();
    const dispatch = useDispatch();
    const { colors, isDark } = useTheme();
    const insets = useSafeAreaInsets();
    const {
        isTablet,
        isSmallDevice,
        moderateScale,
        spacing,
        font,
        sizes,
        wp,
        hp,
        pixelRatio
    } = useResponsive();

    const { user } = useSelector((state: any) => state.auth) as AuthState;

    console.log("User Data Load", user)

    // State
    const [otpSent, setOtpSent] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [formData, setFormData] = useState<FormData>({
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
    });

    const [initialFormData, setInitialFormData] = useState<FormData>({
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
    });

    const [passwordForm, setPasswordForm] = useState<PasswordForm>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const isMounted = useRef(true);
    const countdownTimer = useRef<NodeJS.Timeout>();

    // Cleanup
    useEffect(() => {
        return () => {
            isMounted.current = false;
            if (countdownTimer.current) {
                clearInterval(countdownTimer.current);
            }
        };
    }, []);

    // Countdown timer
    useEffect(() => {
        if (countdown <= 0) {
            if (countdownTimer.current) {
                clearInterval(countdownTimer.current);
            }
            return;
        }

        countdownTimer.current = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => {
            if (countdownTimer.current) {
                clearInterval(countdownTimer.current);
            }
        };
    }, [countdown]);

    // Load user data
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

    // Handlers
    const handleChange = (name: keyof FormData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === 'contact' ? { otp: '' } : {}),
        }));

        if (name === 'contact') {
            setOtpSent(false);
        }
    };

    const handleContactChange = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        setFormData((prev) => ({
            ...prev,
            contact: cleaned,
            otp: ''
        }));
        setOtpSent(false);
    };

    const handlePasswordChange = (name: keyof PasswordForm, value: string) => {
        setPasswordForm((prev) => ({
            ...prev,
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

            const res = await sendUpdateOtp({
                email: formData.email,
                contact: formData.contact,
            });

            Toast.show({
                type: 'success',
                text1: res.message,
            });

            setOtpSent(true);
            setCountdown(60);
        } catch (e: any) {
            Toast.show({
                type: 'error',
                text1: e.message,
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

        // if (!formData.pincode.trim()) {
        //     Toast.show({
        //         type: 'error',
        //         text1: 'Pincode is required',
        //     });
        //     return;
        // }

        if (!formData.address.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Address is required',
            });
            return;
        }

        // Validate mobile verification
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

        // Validate password
        if (passwordForm.newPassword || passwordForm.confirmPassword) {
            if (
                passwordForm.newPassword &&
                passwordForm.newPassword.length < 8
            ) {
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

            console.log("Updating profile...");
            const res = await updateProfile(payload);
            console.log("Update Response", res);

            console.log("Fetching profile...");
            const profile = await getProfile();
            console.log("Profile Response", profile);

            console.log("Dispatch exists?", dispatch);
            console.log("setProfile", setProfile);

            dispatch(
                setProfile({
                    user: profile.data.user,
                    subscription: profile.data.subscription,
                    nextSubscriptions: profile.data.next_subscriptions || [],
                })
            );

            // Refresh profile data
            //   await dispatch(fetchProfile());

            // Reset states
            setInitialFormData({
                ...formData,
                otp: '',
            });
            setOtpSent(false);
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            setFormData((prev) => ({
                ...prev,
                otp: '',
            }));

            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: res.message || 'Profile updated successfully',
                position: 'top',
                visibilityTime: 3000,
            });
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message || 'Failed to update profile',
                position: 'top',
                visibilityTime: 3000,
            });
        } finally {
            if (isMounted.current) {
                setIsLoading(false);
            }
        }
    };

    // Computed values
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

    // Responsive values
    const isAndroid = Platform.OS === 'android';
    const cardMargin = isTablet ? 24 : 16;
    const borderRadius = isTablet ? 16 : 12;
    const inputHeight = isTablet ? 48 : 44;
    const fontSize = isTablet ? 15 : 13;

    const androidFontWeight = isAndroid ? '600' : '700';
    const androidFontWeightBold = isAndroid ? '800' : '700';

    return (
        <SafeAreaView
            edges={['top']}
            style={{
                flex: 1,
                backgroundColor: colors.primary,
            }}
        >
            <StatusBar
                translucent={false}
                backgroundColor={colors.primary}
                barStyle="light-content"
            />
            <View style={{ flex: 1, backgroundColor: colors.background }}>

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
                >
                    {/* Header */}
                    <LinearGradient
                        colors={[colors.primary, colors.primaryDark || '#c9060a']}
                        style={[
                            styles.header,
                            {
                                paddingTop: isTablet ? 16 : 12, // Remove insets.top from here
                                paddingHorizontal: isTablet ? 32 : 20,
                                paddingBottom: isTablet ? 20 : 16,
                            }
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
                                    }
                                ]}
                            >
                                <Icon name="arrow-left" size={isTablet ? 24 : 22} color="#fff" />
                            </TouchableOpacity>
                            <Text style={[
                                styles.headerTitle,
                                {
                                    fontSize: isTablet ? 22 : 18,
                                    fontWeight: androidFontWeightBold,
                                }
                            ]}>
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
                            }
                        ]}
                    >
                        <View
                            style={[
                                styles.formCard,
                                {
                                    backgroundColor: colors.card,
                                    borderRadius: borderRadius,
                                    shadowColor: isDark ? '#000' : '#000',
                                    shadowOffset: { width: 0, height: isAndroid ? 2 : 4 },
                                    shadowRadius: isAndroid ? 4 : 8,
                                    elevation: isAndroid ? 4 : 4,
                                    padding: isTablet ? 24 : 16,
                                    marginTop: isTablet ? 24 : 6,
                                }
                            ]}
                        >
                            <Text style={[
                                styles.formTitle,
                                {
                                    color: colors.text,
                                    fontSize: isTablet ? 20 : 18,
                                    fontWeight: androidFontWeightBold,
                                    marginBottom: isTablet ? 24 : 20,
                                }
                            ]}>
                                Personal Information
                            </Text>

                            {/* First Name */}
                            <View style={styles.fieldContainer}>
                                <Text style={[
                                    styles.label,
                                    {
                                        color: colors.text,
                                        fontSize: isTablet ? 14 : 12,
                                        fontWeight: androidFontWeight,
                                    }
                                ]}>
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
                                            fontSize: fontSize,
                                            borderRadius: isTablet ? 12 : 8,
                                        }
                                    ]}
                                    value={formData.firstName}
                                    onChangeText={(value) => handleChange('firstName', value)}
                                    placeholder="Enter first name"
                                    placeholderTextColor={colors.textMuted}
                                />
                            </View>

                            {/* Last Name */}
                            <View style={styles.fieldContainer}>
                                <Text style={[
                                    styles.label,
                                    {
                                        color: colors.text,
                                        fontSize: isTablet ? 14 : 12,
                                        fontWeight: androidFontWeight,
                                    }
                                ]}>
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
                                            fontSize: fontSize,
                                            borderRadius: isTablet ? 12 : 8,
                                        }
                                    ]}
                                    value={formData.lastName}
                                    onChangeText={(value) => handleChange('lastName', value)}
                                    placeholder="Enter last name"
                                    placeholderTextColor={colors.textMuted}
                                />
                            </View>

                            {/* Email */}
                            <View style={styles.fieldContainer}>
                                <Text style={[
                                    styles.label,
                                    {
                                        color: colors.text,
                                        fontSize: isTablet ? 14 : 12,
                                        fontWeight: androidFontWeight,
                                    }
                                ]}>
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
                                            fontSize: fontSize,
                                            borderRadius: isTablet ? 12 : 8,
                                        }
                                    ]}
                                    value={formData.email}
                                    editable={false}
                                    placeholder="Email"
                                    placeholderTextColor={colors.textMuted}
                                />
                            </View>

                            {/* Contact / OTP */}
                            <View style={styles.fieldContainer}>
                                <Text style={[
                                    styles.label,
                                    {
                                        color: colors.text,
                                        fontSize: isTablet ? 14 : 12,
                                        fontWeight: androidFontWeight,
                                    }
                                ]}>
                                    {otpSent ? 'OTP' : 'Contact No'} <Text style={{ color: colors.primary }}>*</Text>
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
                                                    fontSize: fontSize,
                                                    borderRadius: isTablet ? 12 : 8,
                                                    flex: 1,
                                                }
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
                                                    }
                                                ]}
                                                onPress={handleSendOtp}
                                                disabled={sendingOtp || countdown > 0}
                                            >
                                                {sendingOtp ? (
                                                    <ActivityIndicator size="small" color="#fff" />
                                                ) : (
                                                    <Text style={[
                                                        styles.otpButtonText,
                                                        {
                                                            fontSize: isTablet ? 13 : 11,
                                                            fontWeight: androidFontWeight,
                                                        }
                                                    ]}>
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
                                                    fontSize: fontSize,
                                                    borderRadius: isTablet ? 12 : 8,
                                                }
                                            ]}
                                            value={formData.otp}
                                            onChangeText={(value) => handleChange('otp', value)}
                                            placeholder="Enter OTP"
                                            placeholderTextColor={colors.textMuted}
                                            keyboardType="number-pad"
                                            maxLength={6}
                                        />
                                        <View style={styles.otpFooter}>
                                            <Text style={[
                                                styles.otpFooterText,
                                                {
                                                    color: colors.textMuted,
                                                    fontSize: isTablet ? 13 : 11,
                                                }
                                            ]}>
                                                OTP sent to <Text style={{ color: colors.text, fontWeight: androidFontWeight }}>
                                                    {formData.contact}
                                                </Text>
                                            </Text>
                                            <TouchableOpacity
                                                onPress={handleSendOtp}
                                                disabled={sendingOtp || countdown > 0}
                                            >
                                                <Text style={[
                                                    styles.resendText,
                                                    {
                                                        color: countdown > 0 ? colors.textMuted : colors.primary,
                                                        fontSize: isTablet ? 13 : 11,
                                                        fontWeight: androidFontWeight,
                                                    }
                                                ]}>
                                                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </View>

                            {/* Date of Birth */}
                            <View style={styles.fieldContainer}>
                                <Text style={[
                                    styles.label,
                                    {
                                        color: colors.text,
                                        fontSize: isTablet ? 14 : 12,
                                        fontWeight: androidFontWeight,
                                    }
                                ]}>
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
                                        }
                                    ]}
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Text style={[
                                        {
                                            color: formData.dob ? colors.text : colors.textMuted,
                                            fontSize: fontSize,
                                        }
                                    ]}>
                                        {formData.dob || 'Select date of birth'}
                                    </Text>
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={formData.dob ? new Date(formData.dob) : new Date(2000, 0, 1)}
                                        mode="date"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={(event, selectedDate) => {
                                            setShowDatePicker(false);
                                            if (selectedDate) {
                                                const dateStr = selectedDate.toISOString().split('T')[0];
                                                handleChange('dob', dateStr);
                                            }
                                        }}
                                    />
                                )}
                            </View>

                            {/* Organisation */}
                            <View style={styles.fieldContainer}>
                                <Text style={[
                                    styles.label,
                                    {
                                        color: colors.text,
                                        fontSize: isTablet ? 14 : 12,
                                        fontWeight: androidFontWeight,
                                    }
                                ]}>
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
                                            fontSize: fontSize,
                                            borderRadius: isTablet ? 12 : 8,
                                        }
                                    ]}
                                    value={formData.organisation}
                                    onChangeText={(value) => handleChange('organisation', value)}
                                    placeholder="Enter organisation name"
                                    placeholderTextColor={colors.textMuted}
                                />
                            </View>

                            {/* Password Fields */}
                            <View style={styles.fieldContainer}>
                                <Text style={[
                                    styles.label,
                                    {
                                        color: colors.text,
                                        fontSize: isTablet ? 14 : 12,
                                        fontWeight: androidFontWeight,
                                    }
                                ]}>
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
                                                fontSize: fontSize,
                                                borderRadius: isTablet ? 12 : 8,
                                                flex: 1,
                                                paddingRight: 40,
                                            }
                                        ]}
                                        value={passwordForm.newPassword}
                                        onChangeText={(value) => handlePasswordChange('newPassword', value)}
                                        placeholder="Enter new password"
                                        placeholderTextColor={colors.textMuted}
                                        secureTextEntry={!showNewPassword}
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeButton}
                                        onPress={() => setShowNewPassword(!showNewPassword)}
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
                                <Text style={[
                                    styles.label,
                                    {
                                        color: colors.text,
                                        fontSize: isTablet ? 14 : 12,
                                        fontWeight: androidFontWeight,
                                    }
                                ]}>
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
                                                fontSize: fontSize,
                                                borderRadius: isTablet ? 12 : 8,
                                                flex: 1,
                                                paddingRight: 40,
                                            }
                                        ]}
                                        value={passwordForm.confirmPassword}
                                        onChangeText={(value) => handlePasswordChange('confirmPassword', value)}
                                        placeholder="Confirm new password"
                                        placeholderTextColor={colors.textMuted}
                                        secureTextEntry={!showConfirmPassword}
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeButton}
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        <Icon
                                            name={showConfirmPassword ? 'eye-off' : 'eye'}
                                            size={isTablet ? 22 : 18}
                                            color={colors.textMuted}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* GST Number */}
                            <View style={styles.fieldContainer}>
                                <Text style={[
                                    styles.label,
                                    {
                                        color: colors.text,
                                        fontSize: isTablet ? 14 : 12,
                                        fontWeight: androidFontWeight,
                                    }
                                ]}>
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
                                            fontSize: fontSize,
                                            borderRadius: isTablet ? 12 : 8,
                                        }
                                    ]}
                                    value={formData.gstNumber}
                                    onChangeText={(value) => handleChange('gstNumber', value.toUpperCase())}
                                    placeholder="22AAAAA0000A1Z5"
                                    placeholderTextColor={colors.textMuted}
                                    autoCapitalize="characters"
                                />
                            </View>

                            {/* Country */}
                            <View style={styles.fieldContainer}>
                                <Text style={[
                                    styles.label,
                                    {
                                        color: colors.text,
                                        fontSize: isTablet ? 14 : 12,
                                        fontWeight: androidFontWeight,
                                    }
                                ]}>
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
                                            fontSize: fontSize,
                                            borderRadius: isTablet ? 12 : 8,
                                        }
                                    ]}
                                    value={formData.country}
                                    onChangeText={(value) => handleChange('country', value)}
                                    placeholder="Enter country"
                                    placeholderTextColor={colors.textMuted}
                                />
                            </View>

                            {/* State, City, Pincode */}
                            <View style={styles.rowContainer}>
                                <View style={[styles.rowField, { marginRight: isTablet ? 16 : 8 }]}>
                                    <Text style={[
                                        styles.label,
                                        {
                                            color: colors.text,
                                            fontSize: isTablet ? 14 : 12,
                                            fontWeight: androidFontWeight,
                                        }
                                    ]}>
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
                                                fontSize: fontSize,
                                                borderRadius: isTablet ? 12 : 8,
                                            }
                                        ]}
                                        value={formData.state}
                                        onChangeText={(value) => handleChange('state', value)}
                                        placeholder="State"
                                        placeholderTextColor={colors.textMuted}
                                    />
                                </View>

                                <View style={[styles.rowField, { marginRight: isTablet ? 16 : 8 }]}>
                                    <Text style={[
                                        styles.label,
                                        {
                                            color: colors.text,
                                            fontSize: isTablet ? 14 : 12,
                                            fontWeight: androidFontWeight,
                                        }
                                    ]}>
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
                                                fontSize: fontSize,
                                                borderRadius: isTablet ? 12 : 8,
                                            }
                                        ]}
                                        value={formData.city}
                                        onChangeText={(value) => handleChange('city', value)}
                                        placeholder="City"
                                        placeholderTextColor={colors.textMuted}
                                    />
                                </View>

                                <View style={styles.rowField}>
                                    <Text style={[
                                        styles.label,
                                        {
                                            color: colors.text,
                                            fontSize: isTablet ? 14 : 12,
                                            fontWeight: androidFontWeight,
                                        }
                                    ]}>
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
                                                fontSize: fontSize,
                                                borderRadius: isTablet ? 12 : 8,
                                            }
                                        ]}
                                        value={formData.pincode}
                                        onChangeText={(value) => handleChange('pincode', value)}
                                        placeholder="Pincode"
                                        placeholderTextColor={colors.textMuted}
                                        keyboardType="number-pad"
                                    />
                                </View>
                            </View>

                            {/* Address */}
                            <View style={styles.fieldContainer}>
                                <Text style={[
                                    styles.label,
                                    {
                                        color: colors.text,
                                        fontSize: isTablet ? 14 : 12,
                                        fontWeight: androidFontWeight,
                                    }
                                ]}>
                                    Address <Text style={{ color: colors.primary }}>*</Text>
                                </Text>
                                <TextInput
                                    style={[
                                        styles.textArea,
                                        {
                                            backgroundColor: colors.background,
                                            color: colors.text,
                                            borderColor: colors.border,
                                            fontSize: fontSize,
                                            borderRadius: isTablet ? 12 : 8,
                                            minHeight: isTablet ? 120 : 100,
                                        }
                                    ]}
                                    value={formData.address}
                                    onChangeText={(value) => handleChange('address', value)}
                                    placeholder="Enter your address"
                                    placeholderTextColor={colors.textMuted}
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                />
                            </View>

                            {/* Update Button */}
                            <TouchableOpacity
                                style={[
                                    styles.updateButton,
                                    {
                                        backgroundColor: canUpdate ? colors.primary : colors.primary,
                                        borderRadius: isTablet ? 14 : 10,
                                        height: isTablet ? 56 : 48,
                                        marginTop: isTablet ? 20 : 16,
                                        opacity: canUpdate ? 1 : 0.6,
                                    }
                                ]}
                                onPress={handleSubmit}
                                disabled={!canUpdate || isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <Text style={[
                                        styles.updateButtonText,
                                        {
                                            color: '#f9f2f2',
                                            fontSize: isTablet ? 17 : 15,
                                            fontWeight: androidFontWeightBold,
                                        }
                                    ]}>
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
        // elevation: 8,
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
        fontWeight: '700',
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
        fontWeight: '700',
    },
    fieldContainer: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 6,
        fontWeight: '600',
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
        fontWeight: '700',
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
        fontWeight: '600',
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
        fontWeight: '700',
    },
});

export default EditProfileScreen;