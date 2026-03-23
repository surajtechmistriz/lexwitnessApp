import api from "../axios";

export const getMenu = async () => {
  try {
    const res = await api.get('/categories', {
      params: {
        is_show_in_menu: 1,
      },
    });

    console.log('API:', res.data);
    return res.data.data;
  } catch (error) {
    console.log('Error:', error);
    throw error;
  }
};