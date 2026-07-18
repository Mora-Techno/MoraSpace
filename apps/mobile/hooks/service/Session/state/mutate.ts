import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

export function useDeleteSessionById() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => Api.Session.DeleteSessionById(id),
    onSuccess: (res: any) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.sessionRoot() });
    },
    onError: (err: any) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useDeleteSessionAll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => Api.Session.DeleteSessionAll(),
    onSuccess: (res: any) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.sessionRoot() });
    },
    onError: (err: any) => {
      Alert.alert('Error', err.message);
    },
  });
}
