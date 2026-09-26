import type {
  IDepartment,
  PickCreateDepartment,
  PickUpdateDepartment,
} from "@repo/types";
import { useAppMutation } from "@/hooks/useAppMutation";
import Api from "@/service/props.service";
import {
  type DepartmentCacheContext,
  departmentRootKey,
  readDepartmentSnapshot,
} from "./utils";

export function useCreateDepartment() {
  return useAppMutation<
    IDepartment,
    PickCreateDepartment,
    DepartmentCacheContext
  >({
    mutationFn: (payload) => Api.Department.CreateDepartment(payload),
    invalidateKeys: [departmentRootKey],
    optimistic: (ns) => ({ previousData: readDepartmentSnapshot(ns) }),
  });
}

export function useUpdateDepartment() {
  return useAppMutation<
    IDepartment,
    { id: string; payload: PickUpdateDepartment },
    DepartmentCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Department.UpdateDepartment(id, payload),
    invalidateKeys: [departmentRootKey],
    optimistic: (ns) => ({ previousData: readDepartmentSnapshot(ns) }),
  });
}

export function useDeleteDepartment() {
  return useAppMutation<
    IDepartment,
    string,
    DepartmentCacheContext
  >({
    mutationFn: (id) => Api.Department.DeleteDepartment(id),
    invalidateKeys: [departmentRootKey],
    optimistic: (ns) => ({ previousData: readDepartmentSnapshot(ns) }),
  });
}
