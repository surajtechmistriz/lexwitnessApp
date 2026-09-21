import api from "../axios";

// Types
export interface Category {
  id: number;
  name: string;
  slug: string;
}

// Get Menu Categories
export const getMenu = async () => {
  try {
    const res = await api.get("/categories", {
      params: {
        is_show_in_menu: 1,
      },
    });

    return res.data?.data || [];
  } catch (error) {
    console.log("getMenu Error:", error);
    return [];
  }
};

export async function getAllCategories(): Promise<Category[]> {
  const response = await api.get("/categories"
  );

  if (!response?.status) return [];

  return response.data?.data ?? [];
}

  //  GET CATEGORY BY SLUG
export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const categories = await getAllCategories();

  return categories.find((cat) => cat.slug === slug) ?? null;
}