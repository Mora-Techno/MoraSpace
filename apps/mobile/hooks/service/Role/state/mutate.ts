import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => Api.Role.CreateRole(payload),
    onSuccess: (res: any) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.rolesRoot() });
    },
    onError: (err: any) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => Api.Role.UpdateRole(id, payload),
    onSuccess: (res: any) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.rolesRoot() });
    },
    onError: (err: any) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => Api.Role.DeleteRole(id),
    onSuccess: (res: any) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.rolesRoot() });
    },
    onError: (err: any) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      Api.Role.UpdateRolePermissions(id, payload),
    onSuccess: (res: any) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.rolesRoot() });
    },
    onError: (err: any) => {
      Alert.alert('Error', err.message);
    },
  });
}
