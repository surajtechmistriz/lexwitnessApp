/**
 * Shared by BOTH auth's verifyPaymentApi and subscription's
 * verifySubscriptionPayment — these had the exact same shape
 * duplicated in two files. Import this one type from both places.
 */
// types/payment.types.ts

export interface RazorpayPaymentFields {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Registration payment verification
export interface RegistrationPaymentVerifyPayload
  extends RazorpayPaymentFields {
  subscription_id: number;
  checkout_token: string;
}

// Existing subscription payment verification
export interface PaymentVerifyPayload
  extends RazorpayPaymentFields {
  purchase_type?: 'NEW' | 'RENEW' | 'UPGRADE';
  membership_plan_id?: number;
}

export interface RazorpayPrefill {
  contact: string;
  email: string;
  name?: string;
}

export interface RazorpayOptions {
  order_id: string;
  amount: number;
  name: string;
  description: string;
  prefill: RazorpayPrefill;
  theme?: {
    color: string;
  };
}

export type RazorpaySuccessHandler = (
  paymentId: string,
  orderId: string,
  signature: string,
) => void;

export type RazorpayFailureHandler = (error: unknown) => void;
