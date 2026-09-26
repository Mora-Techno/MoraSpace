import type {
  IInvitation,
  PickAcceptInvitation,
  PickCreateInvitation,
  PickRejectInvitation,
} from "@repo/types";

import { useAppMutation } from "@/hooks/useAppMutation";
import Api from "@/services/api";

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
    IInvitation,
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
    IInvitation,
    PickRejectInvitation,
    InvitationCacheContext
  >({
    mutationFn: (payload) => Api.Invitation.RejectInvitation(payload),
    invalidateKeys: [invitationsRootKey],
    optimistic: (ns) => ({ previousData: readInvitationSnapshot(ns) }),
  });
}

export function useDeleteInvitation() {
  return useAppMutation<IInvitation, { id: string }, InvitationCacheContext>({
    mutationFn: ({ id }) => Api.Invitation.DeleteInvitation(id),
    invalidateKeys: [invitationsRootKey],
    optimistic: (ns) => ({ previousData: readInvitationSnapshot(ns) }),
  });
}
