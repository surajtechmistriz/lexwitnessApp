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