import api from "../../../services/axios";

type LoginPayload = {
  email: string;
  password: string;
};

export const loginApi = async (payload: LoginPayload) => {
  try {
    const response = await api.post('/auth/login', payload);

    return response.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

export const logoutApi = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error: any) {
    // Even if API fails, we should still clear local data
    console.log('Logout API error:', error);
    throw error;
  }
};



export const forgotPassword = async (email: string) => {
  const response = await api.post('/forgot-password', {
    email,
  });

  return response.data;
};

export const resetPassword = async (payload: {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}) => {
  const response = await api.post('/reset-password', payload);

  return response.data;
};