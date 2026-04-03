/**
 * @module ApiEndpoints
 * Centralized API route configuration to eliminate magic strings.
 */

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  EMPLOYEES: {
    BASE: "/employees",
    STATS: "/employees/stats",
    BY_ID: (id: string) => `/employees/${id}`,
  },
  USERS: {
    BASE: "/users",
    LOGS: "/users/logs",
    BY_ID: (id: string) => `/users/${id}`,
  },
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;