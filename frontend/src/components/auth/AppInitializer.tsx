/**
 * @module AppInitializer
 * Manages session restoration and initial application state hydration.
 */
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/ApiClientImplementation';
import { useAuthStore } from '@/store/useAuthStore';
import { Center, Spinner, Text, VStack } from '@chakra-ui/react';

export const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setLogin, setLogout, isInitialized, setInitialized } = useAuthStore();

  /**
   * Fetch current user profile if a token exists in localStorage.
   * Uses TanStack Query v5 (onSuccess/onError are deprecated).
   */
  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => apiClient.getMe(),
    enabled: !!user?.token, 
    retry: false,
    staleTime: Infinity, // Keep session data fresh within the current tab lifecycle
  });

  // Handle successful session restoration
  useEffect(() => {
    if (isSuccess && data && user?.token) {
      // Merge fresh profile data with the existing persistent token
      setLogin({ ...data, token: user.token });
      setInitialized(true);
    }
  }, [isSuccess, data, user?.token, setLogin, setInitialized]);

  // Handle failed restoration (e.g., expired or tampered token)
  useEffect(() => {
    if (isError) {
      setLogout();
      setInitialized(true);
    }
  }, [isError, setLogout, setInitialized]);

  // Handle guest users (no token found in store)
  useEffect(() => {
    if (!user?.token) {
      setInitialized(true);
    }
  }, [user?.token, setInitialized]);

  /**
   * Show a loading splash screen during the initial verification process
   * only if the app is not yet initialized and a token is being verified.
   */
  const showLoader = !isInitialized && !!user?.token && isLoading;

  if (showLoader) {
    return (
      <Center h="100vh" bg="gray.900">
        <VStack gap={4}>
          <Spinner 
            size="xl" 
            color="blue.500" 
            borderWidth="4px"
          />
          <Text color="white" fontWeight="medium">
            Restoring your session...
          </Text>
        </VStack>
      </Center>
    );
  }

  return <>{children}</>;
};