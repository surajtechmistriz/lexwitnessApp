import api from "../../../services/axios";

export const getMagazines = async (params?: { year?: number; page?: number; limit?: number }) => {
  try {
    const response = await api.get("/magazines", {
      params, // Axios automatically converts this to query string
    });

    console.log("Magazines data", response.data);
    return response.data; // or response.data.data if API wraps data
  } catch (error) {
    console.error("Error fetching magazines:", error);
    return { data: [] }; // fallback
  }
};