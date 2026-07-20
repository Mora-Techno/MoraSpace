import type { IPosition, PickCreatePosition, PickUpdatePosition, TResponse } from '@repo/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

import { PositionCacheContext, readPositionSnapshot } from './utils';

export function useCreatePosition() {
  const queryClient = useQueryClient();
  return useMutation<TResponse<IPosition>, Error, PickCreatePosition, PositionCacheContext>({
    mutationFn: (payload) => Api.Position.CreatePosition(payload),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.positionsRoot() });
      return { previousData: readPositionSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.positionsRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useUpdatePosition() {
  const queryClient = useQueryClient();
  return useMutation<
    TResponse<IPosition>,
    Error,
    { id: string; payload: PickUpdatePosition },
    PositionCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Position.UpdatePosition(id, payload),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.positionsRoot() });
      return { previousData: readPositionSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.positionsRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useDeletePosition() {
  const queryClient = useQueryClient();
  return useMutation<TResponse<IPosition>, Error, string, PositionCacheContext>({
    mutationFn: (id) => Api.Position.DeletePosition(id),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.positionsRoot() });
      return { previousData: readPositionSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.positionsRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}
