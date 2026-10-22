/**
 * Centralized AsyncStorage keys.
 * Never hardcode a storage key string anywhere else in the app —
 * always import from here so a rename only happens in one place.
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  SUBSCRIPTION: 'subscription',
  THEME: 'theme',
  // Found in DashboardScreen.tsx's logout cleanup — not previously listed here.
  NEXT_SUBSCRIPTIONS: 'nextSubscriptions',
  // redux-persist's own internal key — kept here for visibility since
  // DashboardScreen clears it on logout, even though redux-persist
  // manages it internally.
  PERSIST_ROOT: 'persist:root',
  // Reserved for when/if a refresh-token flow is added.
  // Remove this line if it's not actually used anywhere yet.
  REFRESH_TOKEN: 'refresh_token',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
