import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import Config from 'react-native-config';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// console.log("FULL CONFIG:", Config);
// console.log("BASE URL:", Config.API_BASE_URL);


// Request interceptor 
// api.interceptors.request.use(
//   async (config: InternalAxiosRequestConfig) => {
//     try {
//       const token = await AsyncStorage.getItem('authToken');

//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     } catch (error) {
//       console.warn('Token retrieval failed:', error);
//     }

//     return config;
//   },
//   (error: AxiosError) => Promise.reject(error)
// );

// Response interceptor
// api.interceptors.response.use(
//   (response) => {
//     console.log('Response:', response.config.url, response.data);
//     return response;
//   },
//   async (error) => {
//     console.log('❌ Error:', error.response?.data || error.message);

//     const status = error.response?.status;

//     if (status === 401) {
//       await AsyncStorage.removeItem('authToken');
//     }

//     return Promise.reject(error);
//   }
// );

export default api;