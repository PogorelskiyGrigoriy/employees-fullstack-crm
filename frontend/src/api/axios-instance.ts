/**
 * @module AxiosInstance
 * Centralized API client refined for AAA: Strict separation of 401 vs 403.
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

    // CASE A: Authentication (401 / AUTH_REQUIRED)
    if (status === 401 || errorData?.code === 'AUTH_REQUIRED') {
      useAuthStore.getState().setLogout();
      appRouter.navigate(ROUTES.LOGIN, { replace: true });

      toaster.create({
        title: "Session Expired",
        description: errorData?.error || "Please log in again.",
        type: "error",
      });
      return Promise.reject(error);
    }

    // CASE B: Authorization (403 / FORBIDDEN) - Наш RBAC предохранитель
    if (status === 403 || errorData?.code === 'FORBIDDEN') {
      toaster.create({
        title: "Access Denied", 
        description: errorData?.error || "Insufficient permissions for this operation.",
        type: "error",
      });
      // Accounting: попытка зафиксирована на бэкенде, фронтенд заблокировал UI-действие.
      return Promise.reject(error);
    }

    // CASE C: Resource Not Found (404 / NOT_FOUND)
    if (status === 404 || errorData?.code === 'NOT_FOUND') {
      toaster.create({
        title: "Not Found",
        description: errorData?.error || "The requested resource does not exist.",
        type: "info",
      });
      return Promise.reject(error);
    }

    // CASE D: Validation (400 / VALIDATION_ERROR)
    if (errorData?.code === 'VALIDATION_ERROR') {
      // Пробрасываем ошибку дальше для обработки в формах (React Hook Form)
      return Promise.reject(error);
    }

    // CASE E: Global Fallback (500, Network, etc.)
    toaster.create({
      title: errorData?.code || "System Error",
      description: errorData?.error || error.message || "An unexpected error occurred.",
      type: "error",
    });

    return Promise.reject(error);
  }
);