export interface UpdateProfilePayload {
  first_name: string;
  last_name: string;
  email: string;
  contact: string;
  password: string;
  password_confirmation: string;
  address: string;
  dob: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  organisation: string;
  gst_number: string;
  otp: string;
}

export interface SendUpdateOtpPayload {
  email: string;
  contact: string;
}

/** Lightweight quick-edit form (name/email/phone only) — different screen from the full update form below. */
export interface EditProfileFormData {
  name: string;
  email: string;
  phone: string;
}

/**
 * RENAMED from `FormData` (found in features/auth/types.ts). That name
 * collides with the built-in DOM `FormData` global type and silently
 * shadows it wherever that file was imported without an alias — a real
 * bug risk. This is the camelCase form state for the full profile-update
 * screen; it gets transformed into UpdateProfilePayload (snake_case)
 * before the API call.
 */
export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  otp: string;
  dob: string;
  organisation: string;
  gstNumber: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
  country: string;
}

export interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}