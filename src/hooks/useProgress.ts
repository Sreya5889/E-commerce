import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { progressService } from '../services/progress.service';

export const useProgress = (userId?: string, courseId?: string) => {
  const queryClient = useQueryClient();

  const progressQuery = useQuery({
    queryKey: ['lessonProgress', userId, courseId],
    queryFn: () => progressService.getLessonProgress(userId!, courseId!),
    enabled: !!userId && !!courseId
  });

  const updateProgressMutation = useMutation({
    mutationFn: ({ lessonId, completed, watchedSeconds, lastPosition }: { lessonId: string; completed: boolean; watchedSeconds?: number; lastPosition?: number }) =>
      progressService.updateLessonProgress(userId!, courseId!, lessonId, completed, watchedSeconds, lastPosition),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessonProgress', userId, courseId] });
      queryClient.invalidateQueries({ queryKey: ['enrollments', userId] });
    }
  });

  return {
    progressList: progressQuery.data || [],
    isLoading: progressQuery.isLoading,
    updateProgress: updateProgressMutation.mutateAsync
  };
};
