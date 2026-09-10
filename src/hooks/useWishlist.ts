import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistService } from '../services/wishlist.service';

export const useWishlist = (userId?: string) => {
  const queryClient = useQueryClient();

  const wishlistQuery = useQuery({
    queryKey: ['wishlist', userId],
    queryFn: () => wishlistService.getWishlist(userId!),
    enabled: !!userId
  });

  const addToWishlistMutation = useMutation({
    mutationFn: (courseId: string) => wishlistService.addToWishlist(userId!, courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', userId] });
    }
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: (courseId: string) => wishlistService.removeFromWishlist(userId!, courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', userId] });
    }
  });

  return {
    wishlist: wishlistQuery.data || [],
    isLoading: wishlistQuery.isLoading,
    addToWishlist: addToWishlistMutation.mutateAsync,
    removeFromWishlist: removeFromWishlistMutation.mutateAsync
  };
};
