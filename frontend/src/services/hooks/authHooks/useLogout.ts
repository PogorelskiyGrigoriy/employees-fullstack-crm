/**
 * @module useLogout
 * A custom mutation hook for handling secure user sign-out and session cleanup.
 * Integrates TanStack Query, Zustand state, and UI notifications.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/AuthServiceImplementation';
import { useAuthStore } from '@/store/useAuthStore';
import { ROUTES } from '@/config/navigation';
import { toaster } from "@/components/ui/toaster-config";

/**
 * Handles the logout lifecycle: API call, state reset, cache invalidation, and redirection.
 * @returns A TanStack Query mutation object for the logout operation.
 */
export const useLogout = () => {
  const setLogout = useAuthStore((state) => state.setLogout);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * Triggers the logout process in the concrete auth service implementation.
     */
    mutationFn: () => authService.logout(),
    
    /**
     * Executes cleanup logic regardless of the mutation outcome (success or error).
     * This "Total Cleanup" approach ensures no sensitive data remains in the browser.
     */
    onSettled: () => {
      // 1. Reset global authentication state in Zustand (and synced LocalStorage)
      setLogout();
      
      /** * 2. Clear the entire TanStack Query Cache. 
       * Critical for security: ensures data from the previous user's session 
       * is not accessible to the next person using the same browser.
       */
      queryClient.clear();
      
      // 3. Provide user feedback and handle secure redirection
      toaster.create({
        title: "Signed out",
        description: "You have been successfully logged out.",
        type: "info",
      });
      
      // Navigate to the login screen and replace current history entry 
      // to prevent the user from navigating back to protected pages.
      navigate(ROUTES.LOGIN, { replace: true });
    }
  });
};