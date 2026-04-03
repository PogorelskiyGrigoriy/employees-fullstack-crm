/**
 * @module useLogout
 * Refactored to FSD: Now part of the 'auth' feature.
 * Coordinates between authApi (network) and authStore (local state).
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

// 1. Импортируем новый API из этой же фичи
import { authApi } from '../api/auth-api'; 

// 2. Достаем ROUTES из Shared слоя
import { ROUTES } from '@/shared/config/routes';

// 3. Достаем стор через публичное API сущности User
import { useAuthStore } from '@/entities/user';

// 4. Достаем тостер из Shared UI
import { toaster } from "@/shared/ui/chakra/toaster";

export const useLogout = () => {
  const setLogout = useAuthStore((state) => state.setLogout);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    // Используем новую функцию из auth-api
    mutationFn: () => authApi.logout(),
    
    onSettled: () => {
      // Бизнес-логика выхода:
      setLogout();        // 1. Очищаем Zustand (Entity)
      queryClient.clear(); // 2. Стираем кэш данных (чтобы следующий юзер не увидел старых сотрудников)
      
      toaster.create({
        title: "Signed out",
        description: "You have been successfully logged out.",
        type: "info",
      });
      
      // 3. Редирект через константу из Shared
      navigate(ROUTES.LOGIN, { replace: true });
    }
  });
};