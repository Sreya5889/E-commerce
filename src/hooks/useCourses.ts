import { useQuery } from '@tanstack/react-query';
import { courseService, CourseSearchFilters } from '../services/course.service';

export const useCourses = (filters?: CourseSearchFilters) => {
  return useQuery({
    queryKey: ['courses', filters],
    queryFn: () => courseService.getCourses(filters),
    staleTime: 1000 * 60 * 5 // 5 minutes cache
  });
};
