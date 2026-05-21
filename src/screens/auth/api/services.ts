import api from "../../../services/axios";


// Auth API endpoints


// Auth API endpoints
export const authAPI = {
  // Send OTP
  sendOTP: (data: { contact: string; email: string }) => {
    return api.post('/auth/send-otp', data);
  },

  // Register user
  register: (data: {
    first_name: string;
    last_name: string;
    email: string;
    contact: string;
    password: string;
    password_confirmation: string;
    address: string;
    membership_plan_id: string;
    dob: string;
    organisation: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    otp: string;
  }) => {
    return api.post('/auth/register', data);
  },

  // Verify payment
  verifyPayment: (data: {
    purchase_type: string;
    membership_plan_id: string;
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => {
    return api.post('/auth/verify-payment', data);
  },

  // Create Razorpay Order
  createRazorpayOrder: (data: {
    membership_plan_id: string;
    amount: number;
  }) => {
    return api.post('/auth/create-order', data);
  },

  // Get Membership Plans
  getMembershipPlans: () => {
    return api.get('/membership-plan');
  },
};
