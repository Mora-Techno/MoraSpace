import type {
  ICompanyMember,
  PickUpdateCompanyMember,
} from "@repo/types";

import { useAppMutation } from "@/hooks/useAppMutation";
import Api from "@/services/api";

import {
  type MemberCacheContext,
  membersRoot,
  readMemberSnapshot,
} from "./utils";

export function useUpdateMember() {
  return useAppMutation<
    ICompanyMember,
    { id: string; payload: PickUpdateCompanyMember },
    MemberCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Member.UpdateMember(id, payload),
    invalidateKeys: [membersRoot],
    optimistic: (ns) => ({ previousData: readMemberSnapshot(ns) }),
  });
}

export function useDeleteMember() {
  return useAppMutation<
    ICompanyMember,
    { id: string },
    MemberCacheContext
  >({
    mutationFn: ({ id }) => Api.Member.DeleteMember(id),
    invalidateKeys: [membersRoot],
    optimistic: (ns) => ({ previousData: readMemberSnapshot(ns) }),
  });
}

export function useUpdateProfile() {
  return useAppMutation<unknown, { id: string; payload: unknown }>({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      Api.Member.UpdateProfile(id, payload),
    invalidateKeys: [membersRoot],
  });
}

export function useUpdateContacts() {
  return useAppMutation<unknown, { id: string; payload: unknown }>({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      Api.Member.UpdateContacts(id, payload),
    invalidateKeys: [membersRoot],
  });
}
