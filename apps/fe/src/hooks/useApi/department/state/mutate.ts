import { useMutation } from "@tanstack/react-query";
import {
  DepartmentRespone,
  PickCreateDepartment,
  PickUpdateDepartment,
} from "@repo/types/department.types";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import Api from "@/services/api";
import { TResponse } from "@repo/types";
import {
  DepartmentCacheContext,
  departmentRootKey,
  readDepartmentSnapshot,
} from "./utils";

export function useCreateDepartment() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<DepartmentRespone>,
    Error,
    PickCreateDepartment,
    DepartmentCacheContext
  >({
    mutationFn: (payload) => Api.Department.CreateDepartment(payload),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: departmentRootKey });
      return { previousData: readDepartmentSnapshot(ns) };
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: "success",
      });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: departmentRootKey,
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: "error",
      });
    },
  });
}

export function useUpdateDepartment() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<DepartmentRespone>,
    Error,
    { id: string; payload: PickUpdateDepartment },
    DepartmentCacheContext
  >({
    mutationFn: ({ id, payload }) =>
      Api.Department.UpdateDepartment(id, payload),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: departmentRootKey });
      return { previousData: readDepartmentSnapshot(ns) };
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: "success",
      });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: departmentRootKey,
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: "error",
      });
    },
  });
}

export function useDeleteDepartment() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<DepartmentRespone>,
    Error,
    { id: string },
    DepartmentCacheContext
  >({
    mutationFn: ({ id }) => Api.Department.DeleteDepartment(id),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: departmentRootKey });
      return { previousData: readDepartmentSnapshot(ns) };
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: "success",
      });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: departmentRootKey,
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: "error",
      });
    },
  });
}
