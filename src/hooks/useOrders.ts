import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/order.service';

export const useOrders = (userId?: string) => {
  return useQuery({
    queryKey: ['orders', userId],
    queryFn: () => orderService.getUserOrders(userId!),
    enabled: !!userId
  });
};
