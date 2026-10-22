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
  },
  CATEGORY: {
    LIST: '/categories',
  },
  AUTHOR: {
    LIST: '/authors',
  },
  DASHBOARD: {
    PROFILE: '/profile',
  },
  INVOICE: {
    HISTORY: '/subscription/plan-history',
    DOWNLOAD: (id: number | string) => `/subscription/plan-invoice/${id}`,
  },
  MAGAZINE: {
    LIST: '/magazines',
    DETAIL: (slugOrId: string | number) => `/magazines/${slugOrId}`,
    // Shared with category and author screens for the year filter.
    YEARS: '/years',
  },
  // Shared by home (hero/editor-picks) AND article (list/detail/related) —
  // both features hit this same endpoint, so it lives here once instead
  // of being duplicated as a literal string under each feature.
  POSTS: {
    LIST: '/posts',
    DETAIL: (slug: string | number) => `/posts/${slug}`,
  },
} as const;
