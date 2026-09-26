import type {
  DepartmentRespone,
  PickCreateDepartment,
  PickUpdateDepartment,
} from "@repo/types/department.types";

import { useAppMutation } from "@/hooks/useAppMutation";
import Api from "@/services/api";

import {
  type DepartmentCacheContext,
  departmentRootKey,
  readDepartmentSnapshot,
} from "./utils";

export function useCreateDepartment() {
  return useAppMutation<
    DepartmentRespone,
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
    DepartmentRespone,
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
    DepartmentRespone,
    { id: string },
    DepartmentCacheContext
  >({
    mutationFn: ({ id }) => Api.Department.DeleteDepartment(id),
    invalidateKeys: [departmentRootKey],
    optimistic: (ns) => ({ previousData: readDepartmentSnapshot(ns) }),
  });
}
