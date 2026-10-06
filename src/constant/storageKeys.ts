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
  // Reserved for when/if a refresh-token flow is added.
  // Remove this line if it's not actually used anywhere yet.
  REFRESH_TOKEN: 'refresh_token',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];