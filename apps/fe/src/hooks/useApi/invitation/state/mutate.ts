import { useMutation } from '@tanstack/react-query';

import { queryKey } from '@/configs';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/api';

export function useCreateInvitation() {
  const ns = useAppNameSpace();
  return useMutation({
    mutationFn: (payload: any) => Api.Invitation.CreateInvitation(payload),
    onSuccess: (res: any) => {
      ns.alert.toast({ title: res.message, message: res.message, icon: 'success' });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({ queryKey: queryKey.invitationsRoot() });
    },
    onError: (err: any) => {
      ns.alert.toast({ title: err.message, message: err.message, icon: 'error' });
    },
  });
}

export function useAcceptInvitation() {
  const ns = useAppNameSpace();
  return useMutation({
    mutationFn: (payload: any) => Api.Invitation.AcceptInvitation(payload),
    onSuccess: (res: any) => {
      ns.alert.toast({ title: res.message, message: res.message, icon: 'success' });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({ queryKey: queryKey.invitationsRoot() });
    },
    onError: (err: any) => {
      ns.alert.toast({ title: err.message, message: err.message, icon: 'error' });
    },
  });
}

export function useRejectInvitation() {
  const ns = useAppNameSpace();
  return useMutation({
    mutationFn: (payload: any) => Api.Invitation.RejectInvitation(payload),
    onSuccess: (res: any) => {
      ns.alert.toast({ title: res.message, message: res.message, icon: 'success' });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({ queryKey: queryKey.invitationsRoot() });
    },
    onError: (err: any) => {
      ns.alert.toast({ title: err.message, message: err.message, icon: 'error' });
    },
  });
}

export function useDeleteInvitation() {
  const ns = useAppNameSpace();
  return useMutation({
    mutationFn: (id: string) => Api.Invitation.DeleteInvitation(id),
    onSuccess: (res: any) => {
      ns.alert.toast({ title: res.message, message: res.message, icon: 'success' });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({ queryKey: queryKey.invitationsRoot() });
    },
    onError: (err: any) => {
      ns.alert.toast({ title: err.message, message: err.message, icon: 'error' });
    },
  });
}
