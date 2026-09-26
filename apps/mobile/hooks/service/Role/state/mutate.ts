import type {
  IRole,
  PickCreateRole,
  PickUpdateRole,
  PickUpdateRolePermissions,
} from "@repo/types";
import { useAppMutation } from "@/hooks/useAppMutation";
import Api from "@/service/props.service";
import {
  readRoleSnapshot,
  type RoleCacheContext,
  rolesRoot,
} from "./utils";

export function useCreateRole() {
  return useAppMutation<IRole, PickCreateRole, RoleCacheContext>({
    mutationFn: (payload) => Api.Role.CreateRole(payload),
    invalidateKeys: [rolesRoot],
    optimistic: (ns) => ({ previousData: readRoleSnapshot(ns) }),
  });
}

export function useUpdateRole() {
  return useAppMutation<
    IRole,
    { id: string; payload: PickUpdateRole },
    RoleCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Role.UpdateRole(id, payload),
    invalidateKeys: [rolesRoot],
    optimistic: (ns) => ({ previousData: readRoleSnapshot(ns) }),
  });
}

export function useDeleteRole() {
  return useAppMutation<IRole, string, RoleCacheContext>({
    mutationFn: (id) => Api.Role.DeleteRole(id),
    invalidateKeys: [rolesRoot],
    optimistic: (ns) => ({ previousData: readRoleSnapshot(ns) }),
  });
}

export function useUpdateRolePermissions() {
  return useAppMutation<
    IRole,
    { id: string; payload: PickUpdateRolePermissions },
    RoleCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Role.UpdateRolePermissions(id, payload),
    invalidateKeys: [rolesRoot],
    optimistic: (ns) => ({ previousData: readRoleSnapshot(ns) }),
  });
}
