import api from '../network/client';
import { ENDPOINTS } from '../network/endpoints';
import { normalizeApiError } from '../network/errorHandler';
import { Category } from '../types/category.types';

/** Categories shown in the top menu bar. */
export const getMenu = async () => {
  try {
    const { data } = await api.get(ENDPOINTS.CATEGORY.LIST, {
      params: { is_show_in_menu: 1 },
    });
    return data?.data || [];
  } catch (error) {
    if (__DEV__) {
      console.log('getMenu Error:', error);
    }
    return [];
  }
};

/**
 * BUG FIX: the original checked `response?.status` — but that's axios's
 * HTTP status code (200, 404, ...), which is basically always truthy,
 * not the backend's own success flag. The check never actually did
 * anything. Now checks `response.data?.status`, matching the pattern
 * used by every other service in this app (e.g. getMembershipPlans).
 */
export async function getAllCategories(): Promise<Category[]> {
  try {
    const response = await api.get(ENDPOINTS.CATEGORY.LIST);

    if (!response.data?.status) {
      return [];
    }

    return response.data?.data ?? [];
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const categories = await getAllCategories();
  return categories.find(cat => cat.slug === slug) ?? null;
}
