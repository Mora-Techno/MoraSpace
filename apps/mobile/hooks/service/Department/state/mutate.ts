import type {
  IDepartment,
  PickCreateDepartment,
  PickUpdateDepartment,
  TResponse,
} from '@repo/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

import { DepartmentCacheContext, readDepartmentSnapshot } from './utils';

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation<TResponse<IDepartment>, Error, PickCreateDepartment, DepartmentCacheContext>({
    mutationFn: (payload) => Api.Department.CreateDepartment(payload),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.departmentsRoot() });
      return { previousData: readDepartmentSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.departmentsRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  return useMutation<
    TResponse<IDepartment>,
    Error,
    { id: string; payload: PickUpdateDepartment },
    DepartmentCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Department.UpdateDepartment(id, payload),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.departmentsRoot() });
      return { previousData: readDepartmentSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.departmentsRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation<TResponse<IDepartment>, Error, string, DepartmentCacheContext>({
    mutationFn: (id) => Api.Department.DeleteDepartment(id),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.departmentsRoot() });
      return { previousData: readDepartmentSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.departmentsRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}
