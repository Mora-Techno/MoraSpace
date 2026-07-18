import { useMutation } from '@tanstack/react-query';

import { queryKey } from '@/configs';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/api';

export function useUpdateMember() {
  const ns = useAppNameSpace();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      Api.Member.UpdateMember(id, payload),
    onSuccess: (res: any) => {
      ns.alert.toast({ title: res.message, message: res.message, icon: 'success' });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({ queryKey: queryKey.membersRoot() });
    },
    onError: (err: any) => {
      ns.alert.toast({ title: err.message, message: err.message, icon: 'error' });
    },
  });
}

export function useDeleteMember() {
  const ns = useAppNameSpace();
  return useMutation({
    mutationFn: (id: string) => Api.Member.DeleteMember(id),
    onSuccess: (res: any) => {
      ns.alert.toast({ title: res.message, message: res.message, icon: 'success' });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({ queryKey: queryKey.membersRoot() });
    },
    onError: (err: any) => {
      ns.alert.toast({ title: err.message, message: err.message, icon: 'error' });
    },
  });
}

export function useUpdateProfile() {
  const ns = useAppNameSpace();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      Api.Member.UpdateProfile(id, payload),
    onSuccess: (res: any) => {
      ns.alert.toast({ title: res.message, message: res.message, icon: 'success' });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({ queryKey: queryKey.membersRoot() });
    },
    onError: (err: any) => {
      ns.alert.toast({ title: err.message, message: err.message, icon: 'error' });
    },
  });
}

export function useUpdateContacts() {
  const ns = useAppNameSpace();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      Api.Member.UpdateContacts(id, payload),
    onSuccess: (res: any) => {
      ns.alert.toast({ title: res.message, message: res.message, icon: 'success' });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({ queryKey: queryKey.membersRoot() });
    },
    onError: (err: any) => {
      ns.alert.toast({ title: err.message, message: err.message, icon: 'error' });
    },
  });
}
