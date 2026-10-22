import api from '../network/client';
import { ENDPOINTS } from '../network/endpoints';
import { normalizeApiError } from '../network/errorHandler';

export const getProfile = async () => {
  try {
    const { data } = await api.get(ENDPOINTS.DASHBOARD.PROFILE);
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};
