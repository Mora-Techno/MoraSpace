import type { Session, TResponse } from '@repo/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

import { readSessionSnapshot,SessionCacheContext } from './utils';

export function useDeleteSessionById() {
  const queryClient = useQueryClient();
  return useMutation<TResponse<Session>, Error, string, SessionCacheContext>({
    mutationFn: (id) => Api.Session.DeleteSessionById(id),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.sessionRoot() });
      return { previousData: readSessionSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.sessionRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useDeleteSessionAll() {
  const queryClient = useQueryClient();
  return useMutation<TResponse<Session[]>, Error, void, SessionCacheContext>({
    mutationFn: () => Api.Session.DeleteSessionAll(),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.sessionRoot() });
      return { previousData: readSessionSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.sessionRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}
