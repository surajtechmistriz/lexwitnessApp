export interface BuyNewPlanPayload {
  membership_plan_id: number;
}

export interface RenewPlanPayload {
  subscription_id: number;
}

export interface UpgradePlanPayload {
  membership_plan_id: number;
}

export interface Plan {
  id: number;
  name: string;
  price: string;
  duration_value: number;
  duration_unit: string;
}

export interface Subscription {
  id: number;
  plan_id?: number;
  plan: Plan;
  membership_plan_id?: number;

  status: string;

  start_date?: string | null;
  end_date?: string | null;
  expiry_date?: string | null;

  created_at?: string | null;
  updated_at?: string | null;

  total_amount: string | number;
  subtotal_amount?: string | number;
  tax_amount?: string | number;
  tax_percent?: number;

  purchase_type: string;

  user_id?: number;
  previous_subscription_id?: number | null;
  next_subscription_id?: number | null;
  transaction?: Record<string, unknown> | null;
}