import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/admin.service';

export const useAdmin = (isAdmin: boolean) => {
  const queryClient = useQueryClient();

  const statsQuery = useQuery({
    queryKey: ['adminStats'],
    queryFn: () => adminService.getDashboardStats(),
    enabled: isAdmin
  });

  const usersQuery = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => adminService.getUsers(),
    enabled: isAdmin
  });

  const teachersQuery = useQuery({
    queryKey: ['adminTeachers'],
    queryFn: () => adminService.getTeachers(),
    enabled: isAdmin
  });

  const updateTeacherVerificationMutation = useMutation({
    mutationFn: ({ teacherId, status, verifiedBy }: { teacherId: string; status: 'approved' | 'rejected' | 'suspended'; verifiedBy: string }) =>
      adminService.updateTeacherVerification(teacherId, status, verifiedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTeachers'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    }
  });

  const updateCourseStatusMutation = useMutation({
    mutationFn: ({ courseId, status }: { courseId: string; status: 'draft' | 'pending_review' | 'published' | 'rejected' | 'archived' }) =>
      adminService.updateCourseStatus(courseId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCourses'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    }
  });

  return {
    stats: statsQuery.data,
    users: usersQuery.data || [],
    teachers: teachersQuery.data || [],
    isLoadingStats: statsQuery.isLoading,
    updateTeacherVerification: updateTeacherVerificationMutation.mutateAsync,
    updateCourseStatus: updateCourseStatusMutation.mutateAsync
  };
};
