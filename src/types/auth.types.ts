import { User } from './user.types';
import { Subscription } from './subscription.types';

export interface LoginPayload {
  email: string;
  password: string;
}
// Alias — screens historically imported this name.
export type SignInFormData = LoginPayload;

/**
 * CORRECTED (again) — found the real payload in Register.tsx's actual
 * registerApi(payload) call. It does NOT match RegisterFormData below
 * (that only has name/email/password/password_confirmation). Either
 * RegisterFormData is dead/unused code, or it's a leftover from an
 * older/simpler register flow — worth confirming and removing if unused.
 */
export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  contact: string;
  password: string;
  password_confirmation: string;
  address: string;
  membership_plan_id: string;
  dob: string;
  organisation: string;
  gst_number: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  otp: string;
}

/**
 * From features/auth/types.ts — kept for reference, but does NOT match
 * the real registerApi payload above. Confirm where this is actually
 * used (if anywhere) before relying on it.
 */
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation?: string;
}

export interface SendOtpPayload {
  contact: string;
  email: string;
}

export interface ForgotPasswordPayload {
  email: string;
}
export type ForgotPasswordFormData = ForgotPasswordPayload;

/** Full payload sent to the API — includes token/email added programmatically. */
export interface ResetPasswordPayload {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

/** Just the two fields the reset-password screen collects from the user. */
export interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

/**
 * CORRECTED — found the real shape in DashboardScreen.tsx's local
 * AuthState interface. The earlier guess only had `user`; the Redux
 * auth slice actually also carries `subscription` and `nextSubscriptions`.
 */
export interface AuthState {
  user: User | null;
  subscription: Subscription | null;
  nextSubscriptions: Subscription[];
}
