/**
 * Centralized API endpoint paths — matches the actual backend routes
 * found across the app's service files.
 * Never write a raw '/auth/login' string inside a screen/component —
 * import from here instead.
 */
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    SEND_OTP: '/auth/send-otp',
    VERIFY_PAYMENT: '/auth/verify-payment',
  },
  // NOTE: these two are NOT under /auth in the current backend — verified
  // from the existing forgotPassword/resetPassword calls.
  PASSWORD: {
    FORGOT: '/forgot-password',
    RESET: '/reset-password',
  },
  PROFILE: {
    UPDATE: '/update-profile',
    SEND_UPDATE_OTP: '/send-update-otp',
  },
  MEMBERSHIP: {
    LIST: '/membership-plan',
  },
  SUBSCRIPTION: {
    BUY_NEW_PLAN: '/subscription/buy-new-plan',
    RENEW_PLAN: '/subscription/renew-plan',
    UPGRADE_PLAN: '/subscription/upgrade-plan',
    PAYMENT_VERIFY: '/subscription/payment-verify',
  },
  HOME: {
    LATEST_EDITION: '/homepage-latest-edition',
    MAGAZINES: '/magazines',
    EDITORIAL_SETTINGS: '/editorial-settings',
    POSTS: '/posts',
  },
  CATEGORY: {
    LIST: '/categories',
  },
} as const;