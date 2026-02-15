import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';

export function useGetLogo() {
  const { actor, isFetching } = useActor();

  return useQuery<ExternalBlob | null>({
    queryKey: ['logo'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLogo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateLogo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (logo: ExternalBlob) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateLogo(logo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logo'] });
      toast.success('Logo updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update logo');
    },
  });
}
