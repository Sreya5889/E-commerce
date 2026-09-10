import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../services/cart.service';

export const useCart = (userId?: string) => {
  const queryClient = useQueryClient();

  const cartQuery = useQuery({
    queryKey: ['cart', userId],
    queryFn: () => cartService.getCart(userId!),
    enabled: !!userId
  });

  const addToCartMutation = useMutation({
    mutationFn: (courseId: string) => cartService.addToCart(userId!, courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });
    }
  });

  const removeFromCartMutation = useMutation({
    mutationFn: (courseId: string) => cartService.removeFromCart(userId!, courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });
    }
  });

  return {
    cart: cartQuery.data || [],
    isLoading: cartQuery.isLoading,
    addToCart: addToCartMutation.mutateAsync,
    removeFromCart: removeFromCartMutation.mutateAsync
  };
};
