import { IPosition, PickCreatePosition, PickUpdatePosition, TResponse } from '@repo/types';
import { useMutation } from '@tanstack/react-query';

import { queryKey } from '@/configs';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/api';

import { PositionCacheContext, positionsRoot, readPositionSnapshot } from './utils';

export function useCreatePosition() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<IPosition>, Error, PickCreatePosition, PositionCacheContext>({
    mutationFn: (payload) => Api.Position.CreatePosition(payload),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({
        queryKey: positionsRoot,
      });
      return { previousData: readPositionSnapshot(ns) };
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: positionsRoot,
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useUpdatePosition() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<IPosition>,
    Error,
    { id: string; payload: PickUpdatePosition },
    PositionCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Position.UpdatePosition(id, payload),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({
        queryKey: positionsRoot,
      });
      return { previousData: readPositionSnapshot(ns) };
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: positionsRoot,
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useDeletePosition() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<IPosition>, Error, { id: string }, PositionCacheContext>({
    mutationFn: ({ id }) => Api.Position.DeletePosition(id),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({
        queryKey: positionsRoot,
      });
      return { previousData: readPositionSnapshot(ns) };
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: positionsRoot,
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}
