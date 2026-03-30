import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user.implementation';

export const useAuditLogs = () => {
  return useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => userService.getAuditLogs(),
    staleTime: 1000 * 60 * 0.5, 
  });
};