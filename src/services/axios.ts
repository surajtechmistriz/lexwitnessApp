import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

import Config from 'react-native-config';

import AsyncStorage from '@react-native-async-storage/async-storage';

const api: AxiosInstance = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* REQUEST INTERCEPTOR */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem('token');

      // console.log('TOKEN =>', token);

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
    console.log('SUCCESS URL =>', response.config.url);
    console.log('SUCCESS STATUS =>', response.status);

    return response;
  },
  error => {
    console.log('ERROR MESSAGE =>', error.message);
    console.log('ERROR CODE =>', error.code);
    console.log('ERROR URL =>', error.config?.url);
    console.log('ERROR REQUEST =>', !!error.request);
    console.log('ERROR RESPONSE =>', error.response);

    if (error.toJSON) {
      console.log('ERROR JSON =>', error.toJSON());
    }

    return Promise.reject(error);
  },
);

export default api;
