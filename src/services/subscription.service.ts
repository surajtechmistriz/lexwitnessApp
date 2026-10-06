import api from '../network/client';
import { ENDPOINTS } from '../network/endpoints';
import { normalizeApiError } from '../network/errorHandler';
import {
  BuyNewPlanPayload,
  RenewPlanPayload,
  UpgradePlanPayload,
} from '../types/subscription.types';
import { PaymentVerifyPayload } from '../types/payment.types';

export const buyNewPlan = async (membership_plan_id: number) => {
  try {
    const payload: BuyNewPlanPayload = { membership_plan_id };
    const { data } = await api.post(
      ENDPOINTS.SUBSCRIPTION.BUY_NEW_PLAN,
      payload,
    );
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

export const renewPlan = async (subscription_id: number) => {
  try {
    const payload: RenewPlanPayload = { subscription_id };
    const { data } = await api.post(
      ENDPOINTS.SUBSCRIPTION.RENEW_PLAN,
      payload,
    );
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

export const upgradePlan = async (membership_plan_id: number) => {
  try {
    const payload: UpgradePlanPayload = { membership_plan_id };
    const { data } = await api.post(
      ENDPOINTS.SUBSCRIPTION.UPGRADE_PLAN,
      payload,
    );
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

export const verifySubscriptionPayment = async (
  payload: PaymentVerifyPayload,
) => {
  try {
    const { data } = await api.post(
      ENDPOINTS.SUBSCRIPTION.PAYMENT_VERIFY,
      payload,
    );
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

// Kept as an alias so existing call sites using verifyRenewPayment don't break.
export const verifyRenewPayment = verifySubscriptionPayment;
