import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';

export function useGetCeoPhoto() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ExternalBlob | null>({
    queryKey: ['ceoPhoto'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCeoPhoto();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useUpdateCeoPhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (photo: ExternalBlob) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCeoPhoto(photo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ceoPhoto'] });
    },
  });
}
