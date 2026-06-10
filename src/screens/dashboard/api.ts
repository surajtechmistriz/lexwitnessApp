import api from "../../services/axios";


export const getProfile = async () => {
  const response = await api.get("/profile");

  return response.data;
};