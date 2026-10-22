import api from '../network/client';
import { ENDPOINTS } from '../network/endpoints';
import { normalizeApiError } from '../network/errorHandler';
import { Author } from '../types/author.types';

/**
 * Fetches ALL authors and filters client-side for the matching slug —
 * there's no dedicated /authors/{slug} endpoint being used here.
 * Inefficient if the author list is large; worth checking whether the
 * backend actually supports fetching a single author by slug directly.
 */
export const getAuthorBySlug = async (
  slug: string,
): Promise<{ data: Author | null }> => {
  try {
    const { data } = await api.get(ENDPOINTS.AUTHOR.LIST);
    const authors: Author[] = data?.data || data || [];
    const author = authors.find(item => item.slug === slug);
    return { data: author || null };
  } catch (error) {
    throw normalizeApiError(error);
  }
};

/**
 * RESTORED — this is actually used by components/common/SearchOverlay.tsx
 * for its author filter dropdown. An earlier project-wide search missed
 * it due to a non-recursive glob pattern; see the note in chat history.
 * Do not delete this again without a properly recursive search.
 */
export const getAuthor = async () => {
  try {
    const { data } = await api.get(ENDPOINTS.AUTHOR.LIST);
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};
