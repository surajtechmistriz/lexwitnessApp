import api from '../network/client';
import { ENDPOINTS } from '../network/endpoints';
import { normalizeApiError } from '../network/errorHandler';
import { ApiResponse } from '../types/network.types';
import { MembershipPlan } from '../types/membership.types';


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
