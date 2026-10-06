export interface BuyNewPlanPayload {
  membership_plan_id: number;
}

export interface RenewPlanPayload {
  subscription_id: number;
}

export interface UpgradePlanPayload {
  membership_plan_id: number;
}
