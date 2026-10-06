import { AxiosError } from 'axios';
import { ApiError } from '../types/network.types';

/**
 * Converts any axios (or unknown) error into a consistent ApiError shape.
 * Use this in service files / try-catch blocks instead of reading
 * error.response.data.message manually everywhere.
 */
export const normalizeApiError = (error: unknown): ApiError => {
  const axiosError = error as AxiosError<{ message?: string; error?: string }>;

  const isNetworkError = !axiosError?.response && !!axiosError?.request;

  const status = axiosError?.response?.status ?? null;
  const code = axiosError?.code ?? null;

  const message =
    axiosError?.response?.data?.message ||
    axiosError?.response?.data?.error ||
    (isNetworkError
      ? 'Network error. Please check your internet connection.'
      : axiosError?.message) ||
    'Something went wrong. Please try again.';

  return {
    status,
    code,
    message,
    isNetworkError,
    raw: error,
  };
};