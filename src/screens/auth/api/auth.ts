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