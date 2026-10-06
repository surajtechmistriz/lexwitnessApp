/**
 * The app currently has TWO different "user" shapes with inconsistent
 * field naming:
 *  - `User`: first_name/last_name/contact (used in AuthState / profile flows)
 *  - `UserProfile`: name/phone (used elsewhere, e.g. header/avatar display)
 * Kept both as-is to avoid breaking existing screens. Worth confirming
 * with the backend which one /auth/login and /update-profile actually
 * return, and unifying into a single shape later.
 */
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  contact: string;
  dob?: string;
  organisation?: string;
  gst_number?: string;
  address?: string;
  city?: string;
  pincode?: string | number;
  state?: string;
  country?: string;
}

export interface UserProfile {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  profile_image?: string;
  avatar?: string;
}
