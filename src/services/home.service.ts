import api from '../network/client';
import { ENDPOINTS } from '../network/endpoints';
import { normalizeApiError } from '../network/errorHandler';
import { MagazineListItem } from '../types/magazine.types';

/**
 * Consolidated from features/home/api/{latestedition,heroCard,editorpicks,
 * home.api,service}.ts. service.ts was completely empty and has been
 * dropped entirely.
 */

/** GET /homepage-latest-edition */
export const getLatestEdition = async () => {
  try {
    const { data } = await api.get(ENDPOINTS.HOME.LATEST_EDITION);
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};
// Backward-compatible alias — Subscription.tsx imports this exact
// (slightly misspelled) name. Update it to getLatestEdition when convenient.
export const latesteEdition = getLatestEdition;

export const getHeroPost = async () => {
  try {
    const { data } = await api.get(ENDPOINTS.HOME.POSTS, {
      params: { is_featured_post: 1 },
    });
    return data?.data || [];
  } catch (error) {
    throw normalizeApiError(error);
  }
};

/**
 * BUG FIX: the original hardcoded `category_id: 5` and completely
 * ignored the category_id passed via params — any caller requesting a
 * different category silently got category 5's posts instead. Now
 * actually uses params?.category_id, defaulting to 5 only when none
 * is given.
 */
export const getEditorPick = async (params?: {
  category_id?: number;
  limit?: number;
}) => {
  try {
    const { data } = await api.get(ENDPOINTS.HOME.POSTS, {
      params: {
        category_id: params?.category_id ?? 5,
        limit: params?.limit ?? 5,
        latest: 1,
      },
    });
    return data?.data || [];
  } catch (error) {
    throw normalizeApiError(error);
  }
};

export const getLatestMagazines = async (options?: {
  skipId?: number | string;
  limit?: number;
}): Promise<MagazineListItem[]> => {
  try {
    const { data: result } = await api.get(ENDPOINTS.HOME.MAGAZINES, {
      params: {
        page: 1,
        limit: options?.limit ?? 5,
        latest: 1,
        skip_id: options?.skipId,
      },
    });

    // Backend response shape is inconsistent — defensive fallback kept
    // as-is from the original implementation.
    return result?.data?.data ?? result?.data ?? result ?? [];
  } catch (error) {
    if (__DEV__) {
      console.error('Error fetching latest magazines:', error);
    }
    return [];
  }
};

export const getEditorial = async () => {
  try {
    const { data } = await api.get(ENDPOINTS.HOME.EDITORIAL_SETTINGS);
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};
