/**
 * @module useEmployees
 * Hook for fetching employee data with server-side filtering and sorting.
 * Provides necessary metadata for the UI (counts and status).
 */

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiClient } from "../api-client.implementation";
import { useFilters } from "@/features/filter-employees/model/filters-store";
import { useSortStore } from "@/features/sort-employees/model/sort-store";
import { useAuthStore } from "@/entities/user/model/auth-store";
import type { Employee } from "@crm/shared/schemas/employee.schema.js";

export const useEmployees = () => {
  const filters = useFilters((state) => state.filters);
  const sort = useSortStore((state) => state.sort);
  const isAuthenticated = useAuthStore((state) => !!state.user);

  const query = useQuery<readonly Employee[], Error>({
    queryKey: ["employees", filters, sort],
    queryFn: ({ signal }) => apiClient.getEmployees(filters, sort, { signal }),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
    enabled: isAuthenticated, 
  });

  const employees = query.data ?? [];

  return {
    ...query,
    employees,
    /** 
     * Current count of employees matching active filters.
     * In Fullstack, this is simply the length of the result array.
     */
    filteredCount: employees.length,
    /** 
     * Total count of employees in the database.
     * In Phase 1 (In-Memory), we use array length. 
     * In Phase 2 (SQL), we can fetch the real total from the server.
     */
    totalCount: employees.length,
  };
};