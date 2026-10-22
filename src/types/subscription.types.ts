export interface BuyNewPlanPayload {
  membership_plan_id: number;
}

export interface RenewPlanPayload {
  subscription_id: number;
}

export interface UpgradePlanPayload {
  membership_plan_id: number;
}

/** Found locally defined in DashboardScreen.tsx — the membership plan entity itself. */
export interface Plan {
  id: number;
  name: string;
  price: string;
  duration_value: number;
  duration_unit: string;
}

/** Found locally defined in DashboardScreen.tsx — a user's subscription record. */
export interface Subscription {
  id: number;
  plan_id: number;
  plan: Plan;
  membership_plan_id?: number;
  status: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  purchase_type: string;
}
