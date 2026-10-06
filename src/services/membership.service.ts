import api from '../network/client';
import { ENDPOINTS } from '../network/endpoints';
import { normalizeApiError } from '../network/errorHandler';
import { ApiResponse } from '../types/network.types';
import { MembershipPlan } from '../types/membership.types';

/**
 * The old codebase had TWO separate functions hitting this exact same
 * endpoint: `getMembershipPlans` (in an auth-related file) and `getPlans`
 * (in a separate plans file). Consolidated into one.
 *
 * IMPORTANT: returns the FULL response ({ status, data, message }), not
 * just the unwrapped array — confirmed from Register.tsx's actual usage
 * (`res?.status`, `res.data`, `res?.message`). Callers check status
 * themselves, same as every other service in this app.
 */
export const getMembershipPlans = async (): Promise<
  ApiResponse<MembershipPlan[]>
> => {
  try {
    const { data } = await api.get<ApiResponse<MembershipPlan[]>>(
      ENDPOINTS.MEMBERSHIP.LIST,
    );
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};