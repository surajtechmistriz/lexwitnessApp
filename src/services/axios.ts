import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

import Config from 'react-native-config';

import AsyncStorage from '@react-native-async-storage/async-storage';

const api: AxiosInstance = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* REQUEST INTERCEPTOR */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem('token');

      console.log('TOKEN =>', token);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Token retrieval failed:', error);
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

/* RESPONSE INTERCEPTOR */
api.interceptors.response.use(
  response => {
    console.log(
      'API RESPONSE =>',
      response.config.url,
      response.data,
    );

    return response;
  },
  async error => {
    console.log(
      'API ERROR =>',
      error.response?.data || error.message,
    );

    return Promise.reject(error);
  },
);

export default api;