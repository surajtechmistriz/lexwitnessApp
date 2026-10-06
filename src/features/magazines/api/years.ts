import api from '../../../network/client';

export const getYears = async () => {
  const response = await api.get('/years');
  // console.log("Year Data",response)
  return response.data;
};
