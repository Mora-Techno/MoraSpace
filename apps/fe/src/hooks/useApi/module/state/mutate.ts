import type { IModule, PickCreateModule, PickUpdateModule } from '@repo/types/module.types';

import { queryKey } from '@/configs';
import { useAppMutation } from '@/hooks/useAppMutation';
import Api from '@/services/api';

import { type ModuleCacheContext, readModuleDetailSnapshot, readModuleListSnapshot } from './utils';

export function useCreateModule() {
  return useAppMutation<IModule, PickCreateModule, ModuleCacheContext>({
    mutationFn: (payload) => Api.Module.CreateModule(payload),
    invalidateKeys: [queryKey.modulesRoot()],
    optimistic: (ns) => ({ previousList: readModuleListSnapshot(ns) }),
    onError: (err, _vars, context, ns) => {
      if (context?.previousList !== undefined) {
        ns.queryClient.setQueryData(queryKey.modules.list(), context.previousList);
      }
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useUpdateModule() {
  return useAppMutation<IModule, { id: string; payload: PickUpdateModule }, ModuleCacheContext>({
    mutationFn: ({ id, payload }) => Api.Module.UpdateModule(id, payload),
    invalidateKeys: [queryKey.modulesRoot()],
    optimistic: (ns, { id }) => ({
      previousList: readModuleListSnapshot(ns),
      previousDetail: readModuleDetailSnapshot(ns, id),
    }),
    onError: (err, { id }, context, ns) => {
      if (context?.previousList !== undefined) {
        ns.queryClient.setQueryData(queryKey.modules.list(), context.previousList);
      }
      if (context?.previousDetail !== undefined) {
        ns.queryClient.setQueryData(queryKey.modules.detail(id), context.previousDetail);
      }
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useDeleteModule() {
  return useAppMutation<{ id: string }, string, ModuleCacheContext>({
    mutationFn: (id) => Api.Module.DeleteModule(id),
    invalidateKeys: [queryKey.modulesRoot()],
    optimistic: (ns) => ({ previousList: readModuleListSnapshot(ns) }),
    onError: (err, _vars, context, ns) => {
      if (context?.previousList !== undefined) {
        ns.queryClient.setQueryData(queryKey.modules.list(), context.previousList);
      }
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}
