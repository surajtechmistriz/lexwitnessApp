import { env } from './env';

export const paymentConfig = {
  razorpayKeyId: env.razorpayKeyId,
  currency: 'INR',
} as const;