import api from '../network/client';
import { ENDPOINTS } from '../network/endpoints';
import { normalizeApiError } from '../network/errorHandler';
import { GetPostsParams } from '../types/article.types';

export const getPosts = async ({
  search,
  category_id,
  year,
  author_id,
  magazine_id,
  tag_id,
  page = 1,
  per_page = 10,
}: GetPostsParams = {}) => {
  try {
    const params: Record<string, unknown> = {
      page,
      per_page,
      ...(magazine_id && { magazine_id }),
      ...(search && { search }),
      ...(category_id && { category_id }),
      ...(year && { year }),
      ...(author_id && { author_id }),
      ...(tag_id && { tag_id }),
    };

    const { data } = await api.get(ENDPOINTS.POSTS.LIST, { params });
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

export const getArticleBySlug = async (slug: string) => {
  try {
    const { data } = await api.get(ENDPOINTS.POSTS.DETAIL(slug));

    if (data?.data) return data.data;
    if (data?.post) return data.post;
    return data;
  } catch (error) {
    if (__DEV__) {
      console.error('getArticleBySlug error:', error);
    }
    return null;
  }
};

export const getRelatedPosts = async ({
  category_id,
  author_id,
  magazine_id,
}: {
  category_id?: number;
  author_id?: number;
  magazine_id?: number;
}) => {
  try {
    const { data } = await api.get(ENDPOINTS.POSTS.LIST, {
      params: { category_id, author_id, magazine_id, per_page: 10 },
    });
    return data?.data || [];
  } catch (error) {
    if (__DEV__) {
      console.error('getRelatedPosts error:', error);
    }
    return [];
  }
};

