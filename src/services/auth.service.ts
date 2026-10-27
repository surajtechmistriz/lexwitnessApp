import api from '../network/client';
import { ENDPOINTS } from '../network/endpoints';
import { normalizeApiError } from '../network/errorHandler';

import {
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from '../types/auth.types';

import {
  PaymentVerifyPayload,
  RegistrationPaymentVerifyPayload,
} from '../types/payment.types';

// Login API
export const loginApi = async (payload: LoginPayload) => {
  try {
    const { data } = await api.post(ENDPOINTS.AUTH.LOGIN, payload);
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

// Logout API
export const logoutApi = async () => {
  try {
    const { data } = await api.post(ENDPOINTS.AUTH.LOGOUT);
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

// Register API - Without OTP
export const registerApi = async (payload: RegisterPayload) => {
  try {
    const { data } = await api.post(ENDPOINTS.AUTH.REGISTER, payload);
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

// Verify Razorpay Payment
export const verifyPaymentApi = async (
  payload: RegistrationPaymentVerifyPayload,
) => {
  try {
    const { data } = await api.post(ENDPOINTS.AUTH.VERIFY_PAYMENT, payload);

    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

// Forgot Password API
export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  try {
    const { data } = await api.post(ENDPOINTS.PASSWORD.FORGOT, payload);
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

// Reset Password API
export const resetPassword = async (payload: ResetPasswordPayload) => {
  try {
    const { data } = await api.post(ENDPOINTS.PASSWORD.RESET, payload);
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};
