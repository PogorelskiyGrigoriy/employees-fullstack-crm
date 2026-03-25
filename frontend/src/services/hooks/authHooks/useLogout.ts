/**
 * @module useLogout
 * Stays exactly the same as it handles client-side cleanup.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/AuthServiceImplementation';
import { useAuthStore } from '@/store/useAuthStore';
import { ROUTES } from '@/config/navigation';
import { toaster } from "@/components/ui/toaster-config";

export const useLogout = () => {
  const setLogout = useAuthStore((state) => state.setLogout);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    
    onSettled: () => {
      setLogout();
      queryClient.clear(); // Important: wipes all cached employee data
      
      toaster.create({
        title: "Signed out",
        description: "You have been successfully logged out.",
        type: "info",
      });
      
      navigate(ROUTES.LOGIN, { replace: true });
    }
  });
};