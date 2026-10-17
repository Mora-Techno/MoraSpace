import type { IModule, ModuleQuery } from '@repo/types/module.types';

import { queryKey } from '@/configs';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';

export type ModuleCacheContext = {
  previousList?: IModule[];
  previousDetail?: IModule;
};

export function readModuleListSnapshot(
  ns: AppNameSpace,
  filters?: ModuleQuery,
): IModule[] | undefined {
  return ns.queryClient.getQueryData<IModule[]>(queryKey.modules.list(filters));
}

export function readModuleDetailSnapshot(ns: AppNameSpace, id: string): IModule | undefined {
  return ns.queryClient.getQueryData<IModule>(queryKey.modules.detail(id));
}
