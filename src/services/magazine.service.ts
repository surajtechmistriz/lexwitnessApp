import api from '../network/client';
import { ENDPOINTS } from '../network/endpoints';
import { normalizeApiError } from '../network/errorHandler';
import { MagazineDetail } from '../types/magazine.types';

export const getMagazines = async (params?: {
  year?: number;
  page?: number;
  limit?: number;
  per_page?: number;
}) => {
  try {
    const { data } = await api.get(ENDPOINTS.MAGAZINE.LIST, { params });
    return data;
  } catch (error) {
    if (__DEV__) {
      console.error('Error fetching magazines:', error);
    }
    return { data: [] };
  }
};

/**
 * Get a single magazine by slug or id. Falls back to fetching the full
 * list and finding a match client-side if the direct lookup 404s —
 * kept as-is from the original (a bit unusual as a pattern, but harmless).
 */
export async function getSingleMagazine(
  slugOrId: string,
): Promise<MagazineDetail> {
  try {
    const response = await api.get(ENDPOINTS.MAGAZINE.DETAIL(slugOrId));
    const result = response.data;
    return result?.data?.data ?? result?.data ?? result;
  } catch (error: any) {
    if (error.response?.status === 404) {
      try {
        const listRes = await api.get(ENDPOINTS.MAGAZINE.LIST);
        const magazines: MagazineDetail[] = listRes.data?.data ?? [];

        const magazine = magazines.find(
          mag => mag.slug === slugOrId || mag.id === parseInt(slugOrId, 10),
        );

        if (!magazine) {
          throw new Error(`Magazine "${slugOrId}" not found`);
        }

        return magazine;
      } catch (err) {
        if (__DEV__) {
          console.error('Slug lookup failed:', err);
        }
        throw err;
      }
    }

    throw normalizeApiError(error);
  }
}

/**
 * Years available for filtering — also used by CategoryScreen and
 * AuthorScreen (their YearFilter components), not just magazines.
 */
export const getYears = async () => {
  try {
    const { data } = await api.get(ENDPOINTS.MAGAZINE.YEARS);
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};
