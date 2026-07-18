import { useMutation } from "@tanstack/react-query";
import { queryKey } from "@/configs";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import Api from "@/services/api";
import {
  ICompanyMember,
  PickUpdateCompanyMember,
  TResponse,
} from "@repo/types";

import { membersRoot, MemberCacheContext, readMemberSnapshot } from "./utils";

export function useUpdateMember() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<ICompanyMember>,
    Error,
    { id: string; payload: PickUpdateCompanyMember },
    MemberCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Member.UpdateMember(id, payload),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: membersRoot });
      return { previousData: readMemberSnapshot(ns) };
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: "success",
      });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({ queryKey: membersRoot });
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

export function useDeleteMember() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<ICompanyMember>,
    Error,
    { id: string },
    MemberCacheContext
  >({
    mutationFn: ({ id }) => Api.Member.DeleteMember(id),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: membersRoot });
      return { previousData: readMemberSnapshot(ns) };
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
        queryKey: queryKey.membersRoot(),
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

export function useUpdateProfile() {
  const ns = useAppNameSpace();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      Api.Member.UpdateProfile(id, payload),
    onSuccess: (res: any) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: "success",
      });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.membersRoot(),
      });
    },
    onError: (err: any) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: "error",
      });
    },
  });
}

export function useUpdateContacts() {
  const ns = useAppNameSpace();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      Api.Member.UpdateContacts(id, payload),
    onSuccess: (res: any) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: "success",
      });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.membersRoot(),
      });
    },
    onError: (err: any) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: "error",
      });
    },
  });
}
