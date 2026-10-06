/**
 * Real shape — found inline in features/auth/Register.tsx (it was
 * declared locally there as `interface MembershipPlan`). Moved here;
 * remove the local duplicate from Register.tsx and import this instead.
 */
export interface MembershipPlan {
  id: number;
  name: string;
  price: string;
  duration_value: number;
  duration_unit: string;
  tag: string | null;
  print_editions: number;
  is_featured: number;
  is_trial: number;
  status: number;
  feature: string;
  created_at: string;
  updated_at: string;
}