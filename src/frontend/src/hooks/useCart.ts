import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { CartItem } from '../backend';
import { toast } from 'sonner';

export function useGetCart() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<CartItem[]>({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCart();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useAddToCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addToCart(productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Added to cart');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add to cart');
    },
  });
}

export function useUpdateCartItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCartItem(productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update cart');
    },
  });
}

export function useRemoveFromCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeFromCart(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Removed from cart');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove from cart');
    },
  });
}

export function useCalculateCartTotal() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<bigint>({
    queryKey: ['cartTotal'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.calculateCartTotal();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useClearCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.clearCart();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cartTotal'] });
    },
  });
}
