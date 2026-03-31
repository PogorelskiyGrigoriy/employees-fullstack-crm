/**
 * @module AppInitializer
 * Manages session restoration and initial application state hydration.
 * Fixed for Chakra UI 3.x (removed deprecated 'speed' prop).
 */
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth-store';
import { Center, Spinner, Text, VStack } from '@chakra-ui/react';
import { authService } from '@/services/auth.implementation';

export const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setLogin, setLogout, isInitialized, setInitialized } = useAuthStore();

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authService.getCurrentUser(), 
    enabled: !!user?.token, 
    retry: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isSuccess && data && user?.token) {
      setLogin({ ...data, token: user.token });
      setInitialized(true);
    }
  }, [isSuccess, data, user?.token, setLogin, setInitialized]);

  useEffect(() => {
    if (isError) {
      setLogout();
      setInitialized(true);
    }
  }, [isError, setLogout, setInitialized]);

  useEffect(() => {
    if (!user?.token) {
      setInitialized(true);
    }
  }, [user?.token, setInitialized]);

  const showLoader = !isInitialized && !!user?.token && isLoading;

  if (showLoader) {
    return (
      <Center h="100vh" bg="bg.canvas">
        <VStack gap={5}>
          {/* Fixed Spinner for v3.x: removed 'speed' prop */}
          <Spinner 
            size="xl" 
            color="brand.500" 
            borderWidth="4px"
          />
          <VStack gap={1} textAlign="center">
            <Text color="fg.emphasized" fontWeight="bold" letterSpacing="tight">
              Restoring Session
            </Text>
            <Text color="fg.muted" fontSize="sm">
              Please wait while we verify your credentials...
            </Text>
          </VStack>
        </VStack>
      </Center>
    );
  }

  return <>{children}</>;
};