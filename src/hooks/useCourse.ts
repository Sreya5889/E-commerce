import { useQuery } from '@tanstack/react-query';
import { courseService } from '../services/course.service';

export const useCourse = (identifier?: string, isSlug = true) => {
  return useQuery({
    queryKey: ['course', identifier, isSlug],
    queryFn: () => isSlug ? courseService.getCourseBySlug(identifier!) : courseService.getCourseById(identifier!),
    enabled: !!identifier
  });
};
