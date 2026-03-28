import api from "../../../services/axios";

export const getMagazines = async (params?: { year?: number; page?: number; limit?: number }) => {
  try {
    const response = await api.get("/magazines", {
      params, // Axios automatically converts this to query string
    });

    // console.log("Magazines data", response.data);
    return response.data; // or response.data.data if API wraps data
  } catch (error) {
    console.error("Error fetching magazines:", error);
    return { data: [] }; // fallback
  }
};





export interface Magazine {
  id: number;
  slug: string;
  title: string;
  magazine_name?: string;
  image?: string;
  description?: string;
  posts?: any[];
}

/**
 * Get single magazine by slug or id
 */
export async function getSingleMagazine(
  slugOrId: string
): Promise<Magazine> {
  try {
    const response = await api.get(`/magazines/${slugOrId}`);

    const result = response.data;

    const magazine =
      result?.data?.data ?? result?.data ?? result;

    return magazine;
  } catch (error: any) {
    // fallback if slug not found
    if (error.response?.status === 404) {
      try {
        const listRes = await api.get("/magazines");
        const magazines: Magazine[] = listRes.data?.data ?? [];

        const magazine = magazines.find(
          (mag) =>
            mag.slug === slugOrId ||
            mag.id === parseInt(slugOrId, 10)
        );

        if (!magazine) {
          throw new Error(`Magazine "${slugOrId}" not found`);
        }

        return magazine;
      } catch (err) {
        console.error("Slug lookup failed:", err);
        throw err;
      }
    }

    console.error("Error:", error.message);
    throw error;
  }
}