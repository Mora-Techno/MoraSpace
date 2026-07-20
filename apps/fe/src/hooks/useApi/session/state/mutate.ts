import { Session,TResponse } from '@repo/types';
import { useMutation } from '@tanstack/react-query';

import { queryKey } from '@/configs';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/api';

import { readSessionSnapshot,SessionCacheContext } from './utils';

export function useDeleteSessionById() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<Session>, Error, string, SessionCacheContext>({
    mutationFn: (id: string) => Api.Session.DeleteSessionById(id),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({
        queryKey: queryKey.sessionRoot(),
      });
      return { previousData: readSessionSnapshot(ns) };
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.sessionRoot(),
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

export function useDeleteSessionAll() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<Session[]>, Error, void, SessionCacheContext>({
    mutationFn: () => Api.Session.DeleteSessionAll(),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({
        queryKey: queryKey.sessionRoot(),
      });
      return { previousData: readSessionSnapshot(ns) };
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.sessionRoot(),
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
