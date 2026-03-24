/**
 * @module useAuthStore
 * Global state management for user authentication and session persistence.
 * Uses Zustand's 'persist' middleware to sync state with localStorage.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserData } from '@/schemas/auth.schema';

/**
 * Interface defining the structure and actions of the authentication store.
 */
interface AuthStore {
  /** The currently authenticated user's profile data, or null if guest */
  readonly user: UserData | null;
  /** Action to commit user data to state after successful login */
  setLogin: (data: UserData) => void;
  /** Action to clear session data upon logout */
  setLogout: () => void;
}

/**
 * Core Auth Store implementation.
 * Persistence ensures that the user stays logged in after a page refresh.
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state: no user logged in
      user: null,

      /**
       * Updates the store with validated user profile data.
       * Triggered by the useLogin mutation hook.
       */
      setLogin: (user) => set({ user }),

      /**
       * Wipes user data from both the state and persistent localStorage.
       * Triggered by the useLogout mutation hook.
       */
      setLogout: () => set({ user: null }),
    }),
    { 
      name: 'auth-storage', // Key used in LocalStorage to identify this store
    }
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