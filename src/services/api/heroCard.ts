import api from "../axios";

export const getHeroPost = async () => {
  const response = await api.get("/posts", {
    params: {
      is_featured_post: 1,
     
    },
  });
  console.log("Home",response)
  return response.data?.data || [];
};
