import {
  IInvitation,
  PickAcceptInvitation,
  PickCreateInvitation,
  PickRejectInvitation,
  TResponse,
} from '@repo/types';
import { useMutation } from '@tanstack/react-query';

import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/api';

import { InvitationCacheContext, invitationsRootKey, readInvitationSnapshot } from './utils';

export function useCreateInvitation() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<IInvitation>, Error, PickCreateInvitation, InvitationCacheContext>({
    mutationFn: (payload) => Api.Invitation.CreateInvitation(payload),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: invitationsRootKey });
      return { previousData: readInvitationSnapshot(ns) };
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: invitationsRootKey,
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useAcceptInvitation() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<IInvitation>, Error, PickAcceptInvitation, InvitationCacheContext>({
    mutationFn: (payload) => Api.Invitation.AcceptInvitation(payload),
    onMutate: async () => {
      await ns.queryClient.invalidateQueries({ queryKey: invitationsRootKey });
      return { previousData: readInvitationSnapshot(ns) };
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: invitationsRootKey,
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useRejectInvitation() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<IInvitation>, Error, PickRejectInvitation, InvitationCacheContext>({
    mutationFn: (payload) => Api.Invitation.RejectInvitation(payload),
    onMutate: async () => {
      await ns.queryClient.invalidateQueries({ queryKey: invitationsRootKey });
      return { previousData: readInvitationSnapshot(ns) };
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: invitationsRootKey,
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useDeleteInvitation() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<IInvitation>, Error, { id: string }, InvitationCacheContext>({
    mutationFn: ({ id }) => Api.Invitation.DeleteInvitation(id),
    onMutate: async () => {
      await ns.queryClient.invalidateQueries({ queryKey: invitationsRootKey });
      return { previousData: readInvitationSnapshot(ns) };
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: invitationsRootKey,
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}
