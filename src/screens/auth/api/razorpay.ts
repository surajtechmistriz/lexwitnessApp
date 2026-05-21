import RazorpayCheckout from 'react-native-razorpay';
import { Platform, Alert } from 'react-native';

export interface RazorpayOptions {
  order_id: string;
  amount: number;
  name: string;
  description: string;
  prefill: {
    contact: string;
    email: string;
    name?: string;
  };
  theme?: {
    color: string;
  };
}

export const initRazorpayPayment = (
  options: RazorpayOptions,
  onSuccess: (paymentId: string, orderId: string, signature: string) => void,
  onFailure: (error: any) => void
) => {
  const razorpayOptions = {
    order_id: options.order_id,
    amount: options.amount * 100, // Convert to paise
    currency: 'INR',
    name: options.name,
    description: options.description,
    prefill: options.prefill,
    theme: options.theme || { color: '#c9060a' },
    modal: {
      ondismiss: function() {
        Alert.alert('Payment Cancelled', 'You cancelled the payment process');
        onFailure({ error: 'Payment cancelled by user' });
      }
    }
  };

  RazorpayCheckout.open(razorpayOptions)
    .then((data: any) => {
      // Handle success
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = data;
      onSuccess(razorpay_payment_id, razorpay_order_id, razorpay_signature);
    })
    .catch((error: any) => {
      // Handle failure
      console.error('Razorpay error:', error);
      let errorMessage = 'Payment failed. Please try again.';
      
      if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.code === 'PAYMENT_FAILED') {
        errorMessage = error.description || 'Payment failed. Please try again.';
      }
      
      Alert.alert('Payment Failed', errorMessage);
      onFailure(error);
    });
};