/**
 * @module useEmployeesMutation
 * A higher-order hook that wraps TanStack Query mutations for employee-related operations.
 * Provides automatic cache invalidation for the 'employees' key and specialized error logging.
 */

import { useMutation, useQueryClient, type UseMutationResult, type UseMutationOptions } from "@tanstack/react-query";
import { ZodError } from "zod";

/**
 * Enhanced mutation hook for employee data management.
 * * @template T - The type of variables passed to the mutation function.
 * @template R - The type of data returned by the mutation function.
 * * @param mutateFn - The core asynchronous function to execute (API call).
 * @param options - Standard TanStack Query mutation options for custom overrides.
 * @returns A mutation result object with integrated error handling and cache sync.
 */
export const useEmployeesMutation = <T, R>(
  mutateFn: (variables: T) => Promise<R>,
  options?: UseMutationOptions<R, Error, T>
): UseMutationResult<R, Error, T> => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options, // Spread incoming options to allow component-level overrides (e.g., onSuccess)
    mutationFn: mutateFn,
    
    /**
     * Automatic Cache Sync:
     * Marks the 'employees' query key as stale to trigger a background refetch,
     * ensuring the UI always reflects the latest server state.
     */
    onSettled: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      // Execute original onSettled callback if provided in options
      options?.onSettled?.(...args); 
    },

    /**
     * Specialized Error Interception:
     * Distinguishes between Zod schema mismatches and standard Network/Server errors
     * to provide clearer debugging information.
     */
    onError: (...args) => {
      const error = args[0]; // Extract error object from the callback arguments

      if (error instanceof ZodError) {
        // Log detailed validation issues if the server response doesn't match our schema
        console.error("[Schema Validation Error]:", {
          message: "Server response mismatch or invalid payload",
          details: error.issues 
        });
      } else {
        // Handle standard HTTP errors (404, 500) or connectivity issues
        console.error(`[Network/Server Error]: ${error.message}`);
      }
      
      // Propagate the error to UI-level handlers (e.g., to show a Toast notification)
      options?.onError?.(...args);
    },
  });
};