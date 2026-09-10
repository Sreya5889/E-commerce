import { useQuery } from '@tanstack/react-query';
import { enrollmentService } from '../services/enrollment.service';

export const useEnrollments = (userId?: string) => {
  return useQuery({
    queryKey: ['enrollments', userId],
    queryFn: () => enrollmentService.getUserEnrollments(userId!),
    enabled: !!userId
  });
};
