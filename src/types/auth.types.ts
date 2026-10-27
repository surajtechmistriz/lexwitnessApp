
import { User } from './user.types';
import { Subscription } from './subscription.types';

export interface LoginPayload {
  email: string;
  password: string;
}

export type SignInFormData = LoginPayload;

// Registration payload - No OTP required
export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  contact: string;
  dob: string;
  organisation: string;
  gst_number: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
  country: string;
  password: string;
  password_confirmation: string;
  membership_plan_id: string;
}

// Keep if used by another registration form
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export type ForgotPasswordFormData = ForgotPasswordPayload;

export interface ResetPasswordPayload {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

export interface AuthState {
  user: User | null;
  subscription: Subscription | null;
  nextSubscriptions: Subscription[];
}
