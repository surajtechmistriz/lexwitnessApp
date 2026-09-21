import api from '../../../services/axios'; // adjust path to your axios instance

export interface UpdateProfilePayload {
  first_name: string;
  last_name: string;
  email: string;
  contact: string;
  password: string;
  password_confirmation: string;
  address: string;
  dob: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  organisation: string;
  gst_number: string;
  otp: string;
}

export const updateProfile = async (
  payload: UpdateProfilePayload,
) => {
  try {
    const response = await api.post('/update-profile', payload);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to update profile',
    );
  }
};

export const sendUpdateOtp = async (data: {
  email: string;
  contact: string;
}) => {
  try {
    const response = await api.post('/send-update-otp', data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to send OTP',
    );
  }
};