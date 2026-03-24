/**
 * @module useEmployees
 * Reliable data hook. 
 * Combines server fetching with client-side filtering for 100% UI accuracy.
 */

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useMemo } from "react";
import { apiClient } from "../ApiClientImplementation";
import { useFilters } from "@/store/filters-store";
import { useSortStore } from "@/store/sort-store";
import { useAuthStore } from "@/store/useAuthStore";
import { calculateAge } from "@/utils/dateUtils";
import type { Employee } from "@/schemas/employee.schema";

export const useEmployees = () => {
  const filters = useFilters((state) => state.filters);
  const sort = useSortStore((state) => state.sort);
  const isAuthenticated = useAuthStore((state) => !!state.user);

  /**
   * Keep filters/sort in queryKey so React Query handles caching.
   * Note: Even if server-side filtering fails, this key ensures 
   * data is separate for different filter states.
   */
  const queryKey = ["employees", filters, sort] as const;

  const query = useQuery<readonly Employee[], Error>({
    queryKey,
    queryFn: ({ signal }) => apiClient.getEmployees(filters, sort, { signal }),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
    enabled: isAuthenticated, 
  });

  const allEmployeesFromApi = query.data ?? [];

  /**
   * Safe Client-Side Filtering.
   * This is our "Safety Net" that guarantees the UI matches the sliders.
   */
  const filteredEmployees = useMemo(() => {
    if (!allEmployeesFromApi.length) return [];

    return allEmployeesFromApi.filter((emp) => {
      // 1. Department
      if (filters.department !== "All" && emp.department !== filters.department) {
        return false;
      }

      // 2. Salary (using numbers from Zod-validated store)
      if (emp.salary < filters.minSalary || emp.salary > filters.maxSalary) {
        return false;
      }

      // 3. Age (The single source of truth: birthDate -> calculateAge)
      const age = calculateAge(emp.birthDate);
      if (age < filters.minAge || age > filters.maxAge) {
        return false;
      }

      return true;
    });
  }, [allEmployeesFromApi, filters]);

  return {
    ...query,
    employees: filteredEmployees,
    totalCount: allEmployeesFromApi.length,
    filteredCount: filteredEmployees.length,
  };
};