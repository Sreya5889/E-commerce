import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { certificateService } from '../services/certificate.service';

export const useCertificates = (userId?: string) => {
  const queryClient = useQueryClient();

  const certificatesQuery = useQuery({
    queryKey: ['certificates', userId],
    queryFn: () => certificateService.getUserCertificates(userId!),
    enabled: !!userId
  });

  const generateCertMutation = useMutation({
    mutationFn: (courseId: string) => certificateService.generateCertificate(userId!, courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates', userId] });
    }
  });

  return {
    certificates: certificatesQuery.data || [],
    isLoading: certificatesQuery.isLoading,
    generateCertificate: generateCertMutation.mutateAsync,
    isGenerating: generateCertMutation.isPending
  };
};
