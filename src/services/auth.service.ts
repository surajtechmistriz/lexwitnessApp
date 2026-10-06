import api from '../network/client';
import { ENDPOINTS } from '../network/endpoints';
import { normalizeApiError } from '../network/errorHandler';
import {
  LoginPayload,
  RegisterPayload,
  SendOtpPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from '../types/auth.types';
import { PaymentVerifyPayload } from '../types/payment.types';

export const loginApi = async (payload: LoginPayload) => {
  try {
    const { data } = await api.post(ENDPOINTS.AUTH.LOGIN, payload);
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

export const logoutApi = async () => {
  try {
    const { data } = await api.post(ENDPOINTS.AUTH.LOGOUT);
    return data;
  } catch (error) {
    // Caller should still clear local session data even if this fails.
    throw normalizeApiError(error);
  }
};

export const registerApi = async (payload: RegisterPayload) => {
  try {
    const { data } = await api.post(ENDPOINTS.AUTH.REGISTER, payload);
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

export const sendOtpApi = async (payload: SendOtpPayload) => {
  try {
    const { data } = await api.post(ENDPOINTS.AUTH.SEND_OTP, payload);
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

export const verifyPaymentApi = async (payload: PaymentVerifyPayload) => {
  try {
    const { data } = await api.post(ENDPOINTS.AUTH.VERIFY_PAYMENT, payload);
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  try {
    const { data } = await api.post(ENDPOINTS.PASSWORD.FORGOT, payload);
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

export const resetPassword = async (payload: ResetPasswordPayload) => {
  try {
    const { data } = await api.post(ENDPOINTS.PASSWORD.RESET, payload);
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};
