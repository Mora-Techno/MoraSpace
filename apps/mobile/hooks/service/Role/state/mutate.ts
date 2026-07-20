import type {
  IPermission,
  IRole,
  PickCreateRole,
  PickUpdateRole,
  PickUpdateRolePermissions,
  TResponse,
} from '@repo/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

import { readRoleSnapshot,RoleCacheContext } from './utils';

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation<TResponse<IRole>, Error, PickCreateRole, RoleCacheContext>({
    mutationFn: (payload) => Api.Role.CreateRole(payload),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.rolesRoot() });
      return { previousData: readRoleSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.rolesRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation<
    TResponse<IRole>,
    Error,
    { id: string; payload: PickUpdateRole },
    RoleCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Role.UpdateRole(id, payload),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.rolesRoot() });
      return { previousData: readRoleSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.rolesRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation<TResponse<IRole>, Error, string, RoleCacheContext>({
    mutationFn: (id) => Api.Role.DeleteRole(id),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.rolesRoot() });
      return { previousData: readRoleSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.rolesRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();
  return useMutation<
    TResponse<IRole>,
    Error,
    { id: string; payload: PickUpdateRolePermissions },
    RoleCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Role.UpdateRolePermissions(id, payload),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.rolesRoot() });
      return { previousData: readRoleSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.rolesRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}
