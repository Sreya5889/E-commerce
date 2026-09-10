import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notification.service';

export const useNotifications = (userId?: string) => {
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => notificationService.getNotifications(userId!),
    enabled: !!userId
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    }
  });

  useEffect(() => {
    if (!userId) return;
    const subscription = notificationService.subscribeToNotifications(userId, () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [userId, queryClient]);

  const unreadCount = notificationsQuery.data?.filter(n => !n.is_read).length || 0;

  return {
    notifications: notificationsQuery.data || [],
    unreadCount,
    isLoading: notificationsQuery.isLoading,
    markAllRead: markAllReadMutation.mutateAsync
  };
};
