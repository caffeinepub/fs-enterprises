import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Order } from '../backend';
import { toast } from 'sonner';

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.placeOrder();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cartTotal'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
      toast.success('Order placed successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to place order');
    },
  });
}

export function useGetOrder(orderId: string) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Order | null>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getOrder(orderId);
    },
    enabled: !!actor && !isFetching && !!identity && !!orderId,
  });
}

export function useGetUserOrders() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserOrders();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useGetAllOrders() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Order[]>({
    queryKey: ['allOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}
