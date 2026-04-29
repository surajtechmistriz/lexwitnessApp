import api from "../services/axios";

/**
 * Get all membership plans
 * (default endpoint)
 */
export const getPlans = async () => {
  try {
    const res = await api.get('/membership-plan');

    if (!res.data?.status) {
      throw new Error(res.data?.message || 'Failed to fetch plans');
    }

    return res.data.data;
  } catch (error: any) {
    console.log('getPlans error:', error);
    throw new Error(error?.message || 'Plans fetch failed');
  }
};

/**
 * Get membership plans (with optional trial filter)
 */
export const getMembershipPlans = async (is_trial: number = 0) => {
  try {
    const res = await api.get('/membership-plan', {
      params: { is_trial },
    });

    return res.data;
  } catch (error: any) {
    console.log('getMembershipPlans error:', error);
    throw new Error(
      error?.response?.data?.message || 'Failed to fetch membership plans',
    );
  }
};

/**
 * Get filtered plan (trial or single condition)
 */
export const getMembershipPlan = async (is_trial: number = 1) => {
  try {
    const res = await api.get('/membership-plan', {
      params: { is_trial },
    });

    return res.data;
  } catch (error: any) {
    console.log('getMembershipPlan error:', error);
    throw new Error(
      error?.response?.data?.message || 'Failed to fetch plan',
    );
  }
};