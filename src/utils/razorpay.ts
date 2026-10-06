import RazorpayCheckout from 'react-native-razorpay';
import { Alert } from 'react-native';
import Config from 'react-native-config';

import {
  RazorpayOptions,
  RazorpaySuccessHandler,
  RazorpayFailureHandler,
} from '../types/payment.types';

export const initRazorpayPayment = (
  options: RazorpayOptions,
  onSuccess: RazorpaySuccessHandler,
  onFailure: RazorpayFailureHandler,
) => {
  const razorpayOptions = {
    key: Config.RAZORPAY_KEY_ID ?? '',
    order_id: options.order_id,
    amount: options.amount * 100, // Convert to paise
    currency: 'INR',
    name: options.name,
    description: options.description,
    prefill: options.prefill,
    theme: options.theme || { color: '#c9060a' },
    modal: {
      ondismiss: () => {
        Alert.alert('Payment Cancelled', 'You cancelled the payment process');
        onFailure({ error: 'Payment cancelled by user' });
      },
    },
  };

  RazorpayCheckout.open(razorpayOptions)
    .then((data: any) => {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
        data;
      onSuccess(razorpay_payment_id, razorpay_order_id, razorpay_signature);
    })
    .catch((error: any) => {
      if (__DEV__) {
        console.error('Razorpay error:', error);
      }

      let errorMessage = 'Payment failed. Please try again.';

      if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.code === 'PAYMENT_FAILED') {
        errorMessage =
          error.description || 'Payment failed. Please try again.';
      }

      Alert.alert('Payment Failed', errorMessage);
      onFailure(error);
    });
};
