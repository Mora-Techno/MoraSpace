import type {
  IInvitation,
  PickAcceptInvitation,
  PickCreateInvitation,
  PickRejectInvitation,
} from "@repo/types";
import { useAppMutation } from "@/hooks/useAppMutation";
import Api from "@/service/props.service";
import {
  type InvitationCacheContext,
  invitationsRootKey,
  readInvitationSnapshot,
} from "./utils";

export function useCreateInvitation() {
  return useAppMutation<
    IInvitation,
    PickCreateInvitation,
    InvitationCacheContext
  >({
    mutationFn: (payload) => Api.Invitation.CreateInvitation(payload),
    invalidateKeys: [invitationsRootKey],
    optimistic: (ns) => ({ previousData: readInvitationSnapshot(ns) }),
  });
}

export function useAcceptInvitation() {
  return useAppMutation<
    unknown,
    PickAcceptInvitation,
    InvitationCacheContext
  >({
    mutationFn: (payload) => Api.Invitation.AcceptInvitation(payload),
    invalidateKeys: [invitationsRootKey],
    optimistic: (ns) => ({ previousData: readInvitationSnapshot(ns) }),
  });
}

export function useRejectInvitation() {
  return useAppMutation<
    unknown,
    PickRejectInvitation,
    InvitationCacheContext
  >({
    mutationFn: (payload) => Api.Invitation.RejectInvitation(payload),
    invalidateKeys: [invitationsRootKey],
    optimistic: (ns) => ({ previousData: readInvitationSnapshot(ns) }),
  });
}

export function useDeleteInvitation() {
  return useAppMutation<IInvitation, string, InvitationCacheContext>({
    mutationFn: (id) => Api.Invitation.DeleteInvitation(id),
    invalidateKeys: [invitationsRootKey],
    optimistic: (ns) => ({ previousData: readInvitationSnapshot(ns) }),
  });
}
