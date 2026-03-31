/**
 * @module DataStateWrapper
 * A centralized logic wrapper for handling standard API states in Chakra UI 3.x.
 * Automatically manages Loading, Error, and Empty states to keep pages clean.
 */
import { Center, Spinner, Text, VStack, Icon, Button } from "@chakra-ui/react";
import { LuSearchX, LuCircleAlert, LuRefreshCw } from "react-icons/lu";

interface DataStateWrapperProps {
  children: React.ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  /** Error message or object from the API/Query hook */
  error?: any;
  /** Condition to show the empty state (e.g., data.length === 0) */
  isEmpty?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  /** Optional callback to trigger a refetch or retry */
  onRetry?: () => void;
}

export const DataStateWrapper = ({
  children,
  isLoading,
  isError,
  error,
  isEmpty,
  emptyMessage = "No records found",
  emptyDescription = "Try adjusting your search filters or adding new data.",
  onRetry,
}: DataStateWrapperProps) => {
  
  // 1. LOADING STATE
  if (isLoading) {
    return (
      <Center h="40vh">
        <VStack gap={4}>
          <Spinner size="xl" color="brand.500" borderWidth="4px" />
          <Text color="fg.muted" fontWeight="medium">Fetching system data...</Text>
        </VStack>
      </Center>
    );
  }

  // 2. ERROR STATE
  if (isError) {
    const message = error?.response?.data?.error || error?.message || "Connection failed";
    
    return (
      <Center h="40vh" p={8}>
        <VStack 
          gap={4} 
          p={6} 
          borderRadius="xl" 
          bg="red.500/5" 
          borderWidth="1px" 
          borderColor="red.500/20"
          maxW="md"
          textAlign="center"
        >
          <Icon as={LuCircleAlert} boxSize={10} color="red.500" />
          <VStack gap={1}>
            <Text fontWeight="bold">Synchronization Error</Text>
            <Text fontSize="sm" color="fg.muted">{message}</Text>
          </VStack>
          {onRetry && (
            <Button 
              size="sm" 
              variant="outline" 
              colorPalette="red" 
              onClick={onRetry}
              mt={2}
            >
              <LuRefreshCw /> Try Again
            </Button>
          )}
        </VStack>
      </Center>
    );
  }

  // 3. EMPTY STATE
  if (isEmpty) {
    return (
      <Center 
        h="300px" 
        borderWidth="1px" 
        borderStyle="dashed" 
        borderRadius="xl" 
        borderColor="border.subtle"
        bg="bg.panel"
      >
        <VStack gap={3}>
          <Icon as={LuSearchX} boxSize={12} opacity={0.2} />
          <VStack gap={1}>
            <Text fontWeight="bold" fontSize="lg">{emptyMessage}</Text>
            <Text color="fg.muted" fontSize="sm">{emptyDescription}</Text>
          </VStack>
        </VStack>
      </Center>
    );
  }

  // 4. SUCCESS STATE
  return <>{children}</>;
};