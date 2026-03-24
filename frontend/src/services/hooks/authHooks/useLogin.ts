/**
 * @module useLogin
 * A custom mutation hook for handling user authentication.
 * Integrates TanStack Query with the AuthStore and centralized navigation logic.
 */

import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '@/services/AuthServiceImplementation';
import { useAuthStore } from '@/store/useAuthStore';
import { ROUTES } from '@/config/navigation';
import type { LoginData, UserData } from '@/schemas/auth.schema';
import { toaster } from "@/components/ui/toaster-config";

/**
 * Custom hook to manage the login process.
 * Handles the authentication request, state updates, notifications, and routing logic.
 * * @returns A TanStack Query mutation object for the login operation.
 */
export const useLogin = () => {
  // Extracting only the necessary action from the store to prevent unnecessary re-renders
  const setLogin = useAuthStore((state) => state.setLogin);
  const navigate = useNavigate();
  const location = useLocation();

  return useMutation({
    /**
     * Executes the login logic via the concrete auth service implementation.
     * @param data - The user credentials validated by LoginData schema.
     */
    mutationFn: (data: LoginData) => authService.login(data),
    
    /**
     * Side effects on successful authentication:
     * 1. Updates the global AuthStore with user profile data.
     * 2. Displays a success notification.
     * 3. Redirects to the intended destination or defaults to Home.
     */
    onSuccess: (userData: UserData) => {
      setLogin(userData);
      
      toaster.create({
        title: "Success",
        description: `Welcome back, ${userData.username}!`,
        type: "success",
      });
      
      // Navigate to the page the user was trying to access, or Home by default
      const from = location.state?.from?.pathname || ROUTES.HOME;
      navigate(from, { replace: true });
    },

    /**
     * Side effects on authentication failure:
     * Shows an error message provided by the service or a fallback string.
     */
    onError: (error: Error) => {
      toaster.create({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        type: "error",
      });
    }
  });
};