import Config from 'react-native-config';

export const env = {
  apiBaseUrl: Config.API_BASE_URL ?? '',
  razorpayKeyId: Config.RAZORPAY_KEY_ID ?? '',
} as const;