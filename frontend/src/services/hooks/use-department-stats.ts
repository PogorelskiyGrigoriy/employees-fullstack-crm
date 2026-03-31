import { useStatistics } from "./use-statistics";

export const useDepartmentStats = () => {
  // We take EVERYTHING that useStatistics gives us
  const { data, isLoading, isError, error, refetch } = useStatistics();

  const departmentsInfo = data?.departmentAnalytics ?? [];

  // And we return EVERYTHING back, so UI components can use these flags
  return { departmentsInfo, isLoading, isError, error, refetch };
};