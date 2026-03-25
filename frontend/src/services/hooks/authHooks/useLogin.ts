/**
 * @module useLogin
 * No logic changes needed, only import cleanup.
 */

import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '@/services/AuthServiceImplementation';
import { useAuthStore } from '@/store/useAuthStore';
import { ROUTES } from '@/config/navigation';
// Use the shared schema with .js extension
import type { LoginData, UserData } from '@crm/shared/schemas/auth.schema.js';
import { toaster } from "@/components/ui/toaster-config";

export const useLogin = () => {
  const setLogin = useAuthStore((state) => state.setLogin);
  const navigate = useNavigate();
  const location = useLocation();

  return useMutation({
    mutationFn: (data: LoginData) => authService.login(data),
    
    onSuccess: (userData: UserData) => {
      // userData now includes the 'token' from the backend
      setLogin(userData);
      
      toaster.create({
        title: "Success",
        description: `Welcome back, ${userData.username}!`,
        type: "success",
      });
      
      const from = location.state?.from?.pathname || ROUTES.HOME;
      navigate(from, { replace: true });
    },

    onError: (error: any) => {
      // Accessing the backend error message if it exists in the Axios response
      const message = error.response?.data?.error || error.message || "Invalid credentials";
      
      toaster.create({
        title: "Login Failed",
        description: message,
        type: "error",
      });
    }
  });
};