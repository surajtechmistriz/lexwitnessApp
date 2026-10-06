import api from '../network/client';
import { ENDPOINTS } from '../network/endpoints';
import { normalizeApiError } from '../network/errorHandler';
import {
  UpdateProfilePayload,
  SendUpdateOtpPayload,
} from '../types/profile.types';

export const updateProfile = async (payload: UpdateProfilePayload) => {
  try {
    const { data } = await api.post(ENDPOINTS.PROFILE.UPDATE, payload);
    return data;
  } catch (error) {
    // Preserves the original Error(message) contract this function's
    // callers already rely on, but resolves the message consistently.
    throw new Error(normalizeApiError(error).message);
  }
};

export const sendUpdateOtp = async (payload: SendUpdateOtpPayload) => {
  try {
    const { data } = await api.post(
      ENDPOINTS.PROFILE.SEND_UPDATE_OTP,
      payload,
    );
    return data;
  } catch (error) {
    throw new Error(normalizeApiError(error).message);
  }
};
