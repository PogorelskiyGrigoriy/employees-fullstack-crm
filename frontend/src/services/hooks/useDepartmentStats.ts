import { useStatistics } from "./useStatistics";

export const useDepartmentStats = () => {
  const { data, isLoading, error } = useStatistics();

  // Directly use the analytics calculated by the backend
  const departmentsInfo = data?.departmentAnalytics ?? [];

  return { departmentsInfo, isLoading, error };
};