import api from "../../../services/axios";



export const sendOtpApi = async (payload: {
  contact: string;
  email: string;
}) => {
  try {
    const response = await api.post(
      `/auth/send-otp`,
      payload
    );

    return response.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};




export const getMembershipPlans = async () => {
  try {
    const response = await api.get("/membership-plan");
    return response.data; // { status, data, message }
  } catch (error) {
    throw error;
  }
};


export const registerApi = async (data: any) => {
  try {
    const response = await api.post("/auth/register", data);

    return response.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

export const verifyPaymentApi = async (data: any) => {
  try {
    const response = await api.post(
      "/auth/verify-payment",
      data
    );

    return response.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};




