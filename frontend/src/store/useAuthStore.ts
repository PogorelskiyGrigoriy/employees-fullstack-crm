/**
 * @module useAuthStore
 * Global state management for user authentication and session persistence.
 * Uses Zustand's 'persist' middleware to sync state with localStorage.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserData } from '@crm/shared/schemas/auth.schema';

interface AuthStore {
  user: UserData | null;
  isInitialized: boolean;
  setLogin: (data: UserData) => void;
  setLogout: () => void;
  setInitialized: (val: boolean) => void; 
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isInitialized: false,

      setLogin: (user) => set({ user, isInitialized: true }),
      setLogout: () => set({ user: null, isInitialized: true }),
      setInitialized: (isInitialized) => set({ isInitialized }),
    }),
    { name: 'auth-storage' }
  )
);

/**
 * CUSTOM SELECTORS (Memoized Derived State)
 * These hooks provide access to specific slices of the auth state.
 * Using selectors prevents components from re-rendering unless the specific data changes.
 */

/**
 * Derived hook to check the current authentication status.
 * @returns boolean - True if a user object exists in the store.
 */
export const useIsAuthenticated = () => useAuthStore((state) => !!state.user);

/**
 * Derived hook to access the current user's role (e.g., 'ADMIN', 'USER').
 * Essential for Role-Based Access Control (RBAC) in UI components and routes.
 */
export const useUserRole = () => useAuthStore((state) => state.user?.role);