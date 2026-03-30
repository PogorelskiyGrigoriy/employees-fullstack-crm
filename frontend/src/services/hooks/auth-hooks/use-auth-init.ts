import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/auth.implementation';
import { useAuthStore } from '@/store/auth-store';

export const useAuthInit = () => {
  const { setLogin, setInitialized } = useAuthStore();

  return useQuery({
    queryKey: ['auth-me'],
    queryFn: async () => {
      const user = await authService.getCurrentUser();
      if (user) {
        setLogin(user);
      }
      setInitialized(true);
      return user;
    },
    retry: false,
    staleTime: Infinity,
  });
};