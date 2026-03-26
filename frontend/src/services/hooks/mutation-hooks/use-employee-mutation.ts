/**
 * @module useEmployeesMutation
 * Universal wrapper for employee mutations.
 * Handles cache invalidation for both the main list and analytical statistics.
 */

import { useMutation, useQueryClient, type UseMutationResult, type UseMutationOptions } from "@tanstack/react-query";
import { ZodError } from "zod";

export const useEmployeesMutation = <T, R>(
  mutateFn: (variables: T) => Promise<R>,
  options?: UseMutationOptions<R, Error, T>
): UseMutationResult<R, Error, T> => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: mutateFn,
    
    /**
     * Invalidate both "employees" and "stats" query keys.
     * Uses spread operator (...args) to match the library's internal signature perfectly.
     */
    onSettled: (...args) => {
      // Invalidate the main list cache
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      // Invalidate the analytical dashboard cache
      queryClient.invalidateQueries({ queryKey: ["employees", "stats"] });
      
      options?.onSettled?.(...args); 
    },

    /**
     * Centralized error logging for all mutations.
     */
    onError: (...args) => {
      const error = args[0];

      if (error instanceof ZodError) {
        console.error("[Schema Validation Error]:", error.issues);
      } else {
        console.error(`[Mutation Error]: ${error.message}`);
      }
      
      options?.onError?.(...args);
    },
  });
};