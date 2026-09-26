import type {
  ICompanyMember,
  PickUpdateCompanyMember,
  PickUpdateMemberContacts,
  PickUpdateMemberProfile,
} from "@repo/types";
import { useAppMutation } from "@/hooks/useAppMutation";
import Api from "@/service/props.service";
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
  return useAppMutation<ICompanyMember, string, MemberCacheContext>({
    mutationFn: (id) => Api.Member.DeleteMember(id),
    invalidateKeys: [membersRoot],
    optimistic: (ns) => ({ previousData: readMemberSnapshot(ns) }),
  });
}

export function useUpdateProfile() {
  return useAppMutation<
    ICompanyMember,
    { id: string; payload: PickUpdateMemberProfile },
    MemberCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Member.UpdateProfile(id, payload),
    invalidateKeys: [membersRoot],
    optimistic: (ns) => ({ previousData: readMemberSnapshot(ns) }),
  });
}

export function useUpdateContacts() {
  return useAppMutation<
    ICompanyMember,
    { id: string; payload: PickUpdateMemberContacts },
    MemberCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Member.UpdateContacts(id, payload),
    invalidateKeys: [membersRoot],
    optimistic: (ns) => ({ previousData: readMemberSnapshot(ns) }),
  });
}
