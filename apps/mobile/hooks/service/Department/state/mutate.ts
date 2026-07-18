import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => Api.Department.CreateDepartment(payload),
    onSuccess: (res: any) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.departmentsRoot() });
    },
    onError: (err: any) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      Api.Department.UpdateDepartment(id, payload),
    onSuccess: (res: any) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.departmentsRoot() });
    },
    onError: (err: any) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => Api.Department.DeleteDepartment(id),
    onSuccess: (res: any) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.departmentsRoot() });
    },
    onError: (err: any) => {
      Alert.alert('Error', err.message);
    },
  });
}
