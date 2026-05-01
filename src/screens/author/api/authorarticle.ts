import api from "../../../services/axios";

export const getAuthorBySlug = async (slug: string) => {
  const response = await api.get("/authors");

  const authors = response.data?.data || response.data || [];

  const author = authors.find((item: any) => item.slug === slug);

  return {
    data: author || null,
  };
};