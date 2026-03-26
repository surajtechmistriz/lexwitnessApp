import api from "../axios"; // adjust path for RN project

// Types
export interface GetPostsParams {
  search?: string;
  category_id?: number;
  year?: number;
  author_id?: number;
  magazine_id?: number;
  page?: number;
  per_page?: number;
  latest?: number;
}

// Get Posts (All filters supported)
export const getPosts = async ({
  search,
  category_id,
  year,
  author_id,
  magazine_id,
  page = 1,
  per_page = 10,
}: GetPostsParams = {}) => {
  try {
    const params: any = {
      page,
      per_page,
      ...(magazine_id && { magazine_id }),
      ...(search && { search }),
      ...(category_id && { category_id }),
      ...(year && { year }),
      ...(author_id && { author_id }),
    };

    const response = await api.get("/posts", { params });
    return response.data;
  } catch (error) {
    console.error("getPosts error:", error);
    throw error;
  }
};

// Get Article by Slug
export const getArticleBySlug = async (slug: string) => {
  try {
    const response = await api.get(`/posts/${slug}`);
    const data = response.data;

    if (data?.data) return data.data;
    if (data?.post) return data.post;

    return data;
  } catch (error) {
    console.error("getArticleBySlug error:", error);
    return null;
  }
};

// Related Posts
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
    const response = await api.get("/posts", {
      params: {
        category_id,
        author_id,
        magazine_id,
        per_page: 10,
      },
    });

    return response.data?.data || [];
  } catch (error) {
    console.error("getRelatedPosts error:", error);
    return [];
  }
};

// Editor Picks
export const getEditorPicksPosts = async ({
  category_id = 5,
  limit = 5,
}: {
  category_id?: number;
  limit?: number;
} = {}) => {
  try {
    const response = await api.get("/posts", {
      params: {
        category_id,
        per_page: limit,
        latest: 1,
      },
    });

    return response.data?.data || [];
  } catch (error) {
    console.error("getEditorPicksPosts error:", error);
    return [];
  }
};

// Magazine Type
export interface Magazine {
  id: number;
  title: string;
  slug: string;
  image: string;
  featured_image: string;
  created_at: string;
  category?: {
    name: string;
  };
}