// frontend/src/services/hooks/useStatistics.ts
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../ApiClientImplementation";

export const useStatistics = () => {
  return useQuery({
    queryKey: ["employees", "stats"],
    queryFn: () => apiClient.getStatistics(),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};