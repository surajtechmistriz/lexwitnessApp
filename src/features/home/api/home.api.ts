import api from "../../../services/axios";

// MAGAZINE
export interface Magazine {
  magazine: Magazine;
  id: number;
  slug: string;
  title: string;
  image?: string;
  magazine_name?: string;
  description?: string;
//   posts: Article[];
}
export async function getLatestMagazines(options?: {
  skipId?: number | string;
  limit?: number;
}): Promise<Magazine[]> {
  try {
    const response = await api.get("/magazines", {
      params: {
        page: 1,
        limit: options?.limit ?? 5,
        latest: 1,
        skip_id: options?.skipId, // skip by id
      },
    });

    const result = response.data;
    const magazines = result?.data?.data ?? result?.data ?? result ?? [];

    return magazines;
  } catch (error) {
    console.error("Error fetching latest magazines:", error);
    return [];
  }
}



export const getEditorial = async()=>{
    const response = await api.get('/editorial-settings')
    return response.data
}