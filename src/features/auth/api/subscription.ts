import axiosInstance from "../axios";

/* ---------------- BUY NEW PLAN ---------------- */
export const buyNewPlan = async (membership_plan_id: number) => {
  try {
    const body = {
      membership_plan_id,
    };

    const res = await axiosInstance.post(
      "/subscription/buy-new-plan",
      body,
    );

    return res.data;
  } catch (error: any) {
    throw error;
  }
};

/* ---------------- RENEW PLAN ---------------- */
export const renewPlan = async (subscription_id: number) => {
  try {
    const body = {
      subscription_id,
    };

    const res = await axiosInstance.post(
      "/subscription/renew-plan",
      body,
    );

    return res.data;
  } catch (error: any) {
    throw error;
  }
};

/* ---------------- UPGRADE PLAN ---------------- */
export const upgradePlan = async (membership_plan_id: number) => {
  try {
    const body = {
      membership_plan_id,
    };

    const res = await axiosInstance.post(
      "/subscription/upgrade-plan",
      body,
    );

    return res.data;
  } catch (error: any) {
    throw error;
  }
};

/* ---------------- PAYMENT VERIFY ---------------- */
export const verifySubscriptionPayment = async (payload: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  purchase_type?: "NEW" | "RENEW" | "UPGRADE";
  membership_plan_id?: number;
}) => {
  try {
    const res = await axiosInstance.post(
      "/subscription/payment-verify",
      payload,
    );

    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const verifyRenewPayment = verifySubscriptionPayment;