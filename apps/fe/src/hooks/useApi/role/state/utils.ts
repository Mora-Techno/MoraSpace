import type { IRole } from "@repo/types";

import { queryKey } from "@/configs";
import type { AppNameSpace } from "@/hooks/useAppNameSpace";

export type RoleCacheContext = {
  previousData?: IRole[];
};

export function readRoleSnapshot(ns: AppNameSpace): IRole[] | undefined {
  return ns.queryClient.getQueryData<IRole[]>(queryKey.roles.list());
}

export const rolesRoot = queryKey.rolesRoot();
