import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { authEvents, AUTH_EVENTS } from './authEvents';
import { STORAGE_KEYS } from '../constant/storageKeys';

const api: AxiosInstance = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ---------------- REQUEST INTERCEPTOR ---------------- */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      if (__DEV__) {
        console.log('[API REQUEST]', {
          url: config.url,
          hasToken: Boolean(token),
          tokenLength: token?.length ?? 0,
        });
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        delete config.headers.Authorization;
      }
    } catch (error) {
      if (__DEV__) {
        console.warn('Token retrieval failed:', error);
      }
    }

    return config;
  },
  error => Promise.reject(error),
);

/* ---------------- RESPONSE INTERCEPTOR ---------------- */
api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    if (__DEV__) {
      console.log('[API ERROR]', {
        url: error.config?.url,
        status: error.response?.status,
        code: error.code,
        message: error.message,
      });
    }

    if (__DEV__) {
      console.log('[API ERROR DETAILS]', {
        url: error?.config?.url,
        status: error?.response?.status,
        message: error?.response?.data?.message,
        errors: error?.response?.data?.errors,
      });
    }

    // Session expired / unauthorized — clear token and let the app react.
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
      ]);
      authEvents.emit(AUTH_EVENTS.UNAUTHORIZED);
    }

    return Promise.reject(error);
  },
);

export default api;
