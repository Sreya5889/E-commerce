import { useQuery } from '@tanstack/react-query';
import { teacherService } from '../services/teacher.service';

export const useTeachers = () => {
  return useQuery({
    queryKey: ['teachers'],
    queryFn: () => teacherService.getTeachers(),
    staleTime: 1000 * 60 * 10
  });
};
