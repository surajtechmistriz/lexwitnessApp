
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
