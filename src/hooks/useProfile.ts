import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService, ProfileUpdateInput } from '../services/profile.service';

export const useProfile = (userId?: string) => {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => profileService.getProfile(userId!),
    enabled: !!userId
  });

  const updateProfileMutation = useMutation({
    mutationFn: (input: ProfileUpdateInput) => profileService.updateProfile(userId!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    }
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending
  };
};
