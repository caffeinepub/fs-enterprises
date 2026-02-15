import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product } from '../backend';
import { toast } from 'sonner';

export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Omit<Product, 'id'>) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProduct({ ...product, id: '' } as Product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create product');
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, product }: { id: string; product: Product }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProduct(id, product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update product');
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete product');
    },
  });
}
