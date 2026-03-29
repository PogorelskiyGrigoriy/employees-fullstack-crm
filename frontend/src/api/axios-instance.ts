/**
 * @module AxiosInstance
 * Centralized API client with typed error handling based on ApiErrorResponse.
 */

import axios, { AxiosError } from 'axios';
import { toaster } from "@/components/ui/toaster-config";
import { useAuthStore } from '@/store/auth-store';
import { appRouter } from '@/router/app-router';
import { ROUTES } from '@/config/navigation';
import type { ApiErrorResponse } from "@crm/shared/types/error.types";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

/**
 * Request Interceptor: Auth injection
 */
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().user?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor: Typed Error Handling
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (axios.isCancel(error)) return Promise.reject(error);

    const status = error.response?.status;
    const errorData = error.response?.data;

    // CASE A: Unauthorized (401)
    if (status === 401) {
      useAuthStore.getState().setLogout();
      appRouter.navigate(ROUTES.LOGIN, { replace: true });

      toaster.create({
        title: errorData?.code || "Session Expired",
        description: errorData?.error || "Please log in again.",
        type: "error",
      });
      return Promise.reject(error);
    }

    // CASE B: Validation Error (400)
    if (errorData?.code === 'VALIDATION_ERROR') {
      return Promise.reject(error);
    }

    // CASE C: Server-side errors (500+) 
    if (status && status >= 500) {
      return Promise.reject(error);
    }

    // CASE D: Other client errors (403, 404, 409) or Network failures
    toaster.create({
      title: errorData?.code || `Error ${status || 'Network'}`,
      description: errorData?.error || error.message,
      type: "error",
    });

    return Promise.reject(error);
  }
);