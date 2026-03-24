/**
 * @module AxiosInstance
 * Centralized API client configuration with interceptors for authentication 
 * and global error handling.
 */

import axios, { AxiosError } from 'axios';
import { toaster } from "@/components/ui/toaster-config";
import { useAuthStore } from '@/store/useAuthStore';
import { appRouter } from '@/router/routes';
import { ROUTES } from '@/config/navigation';

/**
 * Global axios instance with predefined base URL and timeout.
 */
export const api = axios.create({
  baseURL: 'http://localhost:4000',
  timeout: 10000,
});

/**
 * Response Interceptor:
 * Handles global API responses and error scenarios like 401 Unauthorized 
 * or 500 Server Errors.
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle request cancellation
    if (axios.isCancel(error)) return Promise.reject(error);

    const status = error.response?.status;

    // CASE A: Unauthorized (401) - Session expired or invalid token
    if (status === 401) {
      // Direct store state access to clear auth data
      useAuthStore.getState().setLogout();
      
      // Programmatic navigation to login page
      appRouter.navigate(ROUTES.LOGIN, { replace: true });

      toaster.create({
        title: "Session Expired",
        description: "Please log in again.",
        type: "error",
      });
      return Promise.reject(error);
    }

    // CASE B: Server-side errors (500+)
    if (status && status >= 500) {
      // Propagate error to let React Router's ErrorPage handle it if triggered during routing
      return Promise.reject(error);
    }

    // CASE C: Client-side errors (400, 403, 404) or Network failures
    const message = (error.response?.data as any)?.message || error.message;
    toaster.create({
      title: `Error ${status || 'Network'}`,
      description: message,
      type: "error",
    });

    return Promise.reject(error);
  }
);