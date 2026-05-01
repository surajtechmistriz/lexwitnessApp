import api from "../../../services/axios";

export interface Editorial {
  description: string; // Changed from ReactNode to string for Native
  name: string;
  designation: string;
  company_name: string;
  place: string;
  image: string;
}

export async function getEditorial(): Promise<Editorial> {
  // Replace with your actual API endpoint
  const response = await api.get("/editorial-settings");
  return response.data.data;
}