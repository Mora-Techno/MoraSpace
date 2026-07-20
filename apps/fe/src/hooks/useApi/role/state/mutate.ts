import {
  IRole,
  PickCreateRole,
  PickUpdateRole,
  PickUpdateRolePermissions,
  TResponse,
} from '@repo/types';
import { useMutation } from '@tanstack/react-query';

import { queryKey } from '@/configs';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/api';

import { readRoleSnapshot, RoleCacheContext, rolesRoot } from './utils';

export function useCreateRole() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<IRole>, Error, PickCreateRole, RoleCacheContext>({
    mutationFn: (payload) => Api.Role.CreateRole(payload),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: rolesRoot });
      return { previousData: readRoleSnapshot(ns) };
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: rolesRoot,
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

export function useUpdateRole() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<IRole>,
    Error,
    { id: string; payload: PickUpdateRole },
    RoleCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Role.UpdateRole(id, payload),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: rolesRoot });
      return { previousData: readRoleSnapshot(ns) };
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: rolesRoot,
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

export function useDeleteRole() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<IRole>, Error, { id: string }, RoleCacheContext>({
    mutationFn: ({ id }) => Api.Role.DeleteRole(id),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: rolesRoot });
      return { previousData: readRoleSnapshot(ns) };
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: rolesRoot,
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

export function useUpdateRolePermissions() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<IRole>,
    Error,
    { id: string; payload: PickUpdateRolePermissions },
    RoleCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Role.UpdateRolePermissions(id, payload),
    onSuccess: (res: any) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: rolesRoot });
      return { previousData: readRoleSnapshot(ns) };
    },

    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.rolesRoot(),
      });
    },
    onError: (err: any) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}
