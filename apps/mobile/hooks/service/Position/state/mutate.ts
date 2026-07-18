import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

export function useCreatePosition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => Api.Position.CreatePosition(payload),
    onSuccess: (res: any) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.positionsRoot() });
    },
    onError: (err: any) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useUpdatePosition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      Api.Position.UpdatePosition(id, payload),
    onSuccess: (res: any) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.positionsRoot() });
    },
    onError: (err: any) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useDeletePosition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => Api.Position.DeletePosition(id),
    onSuccess: (res: any) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.positionsRoot() });
    },
    onError: (err: any) => {
      Alert.alert('Error', err.message);
    },
  });
}
