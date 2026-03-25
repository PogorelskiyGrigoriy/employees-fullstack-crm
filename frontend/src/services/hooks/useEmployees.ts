// frontend/src/services/hooks/useEmployees.ts

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiClient } from "../ApiClientImplementation";
import { useFilters } from "@/store/filters-store";
import { useSortStore } from "@/store/sort-store";
import { useAuthStore } from "@/store/useAuthStore";
import type { Employee } from "@crm/shared/schemas/employee.schema";

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

  return {
    ...query,
    employees: query.data ?? [], // Just return data from server
    totalCount: query.data?.length ?? 0,
  };
};