// frontend/src/services/hooks/useDepartmentStats.ts

import { useStatistics } from "./useStatistics";

export const useDepartmentStats = () => {
  const { data, isLoading, error } = useStatistics();

  // Извлекаем только нужную часть данных
  const departmentsInfo = data?.departmentAnalytics ?? [];

  return { departmentsInfo, isLoading, error };
};