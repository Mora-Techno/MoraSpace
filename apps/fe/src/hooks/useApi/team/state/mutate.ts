import { useMutation } from '@tanstack/react-query';

import { queryKey } from '@/configs';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/api';

export function useCreateTeam() {
  const ns = useAppNameSpace();
  return useMutation({
    mutationFn: (payload: any) => Api.Team.CreateTeam(payload),
    onSuccess: (res: any) => {
      ns.alert.toast({ title: res.message, message: res.message, icon: 'success' });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({ queryKey: queryKey.teamsRoot() });
    },
    onError: (err: any) => {
      ns.alert.toast({ title: err.message, message: err.message, icon: 'error' });
    },
  });
}

export function useUpdateTeam() {
  const ns = useAppNameSpace();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => Api.Team.UpdateTeam(id, payload),
    onSuccess: (res: any) => {
      ns.alert.toast({ title: res.message, message: res.message, icon: 'success' });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({ queryKey: queryKey.teamsRoot() });
    },
    onError: (err: any) => {
      ns.alert.toast({ title: err.message, message: err.message, icon: 'error' });
    },
  });
}

export function useDeleteTeam() {
  const ns = useAppNameSpace();
  return useMutation({
    mutationFn: (id: string) => Api.Team.DeleteTeam(id),
    onSuccess: (res: any) => {
      ns.alert.toast({ title: res.message, message: res.message, icon: 'success' });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({ queryKey: queryKey.teamsRoot() });
    },
    onError: (err: any) => {
      ns.alert.toast({ title: err.message, message: err.message, icon: 'error' });
    },
  });
}

export function useAddTeamMember() {
  const ns = useAppNameSpace();
  return useMutation({
    mutationFn: ({ teamId, payload }: { teamId: string; payload: any }) =>
      Api.Team.AddMember(teamId, payload),
    onSuccess: (res: any) => {
      ns.alert.toast({ title: res.message, message: res.message, icon: 'success' });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({ queryKey: queryKey.teamsRoot() });
    },
    onError: (err: any) => {
      ns.alert.toast({ title: err.message, message: err.message, icon: 'error' });
    },
  });
}

export function useRemoveTeamMember() {
  const ns = useAppNameSpace();
  return useMutation({
    mutationFn: ({ teamId, memberId }: { teamId: string; memberId: string }) =>
      Api.Team.RemoveMember(teamId, memberId),
    onSuccess: (res: any) => {
      ns.alert.toast({ title: res.message, message: res.message, icon: 'success' });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({ queryKey: queryKey.teamsRoot() });
    },
    onError: (err: any) => {
      ns.alert.toast({ title: err.message, message: err.message, icon: 'error' });
    },
  });
}

export function useInviteTeamMember() {
  const ns = useAppNameSpace();
  return useMutation({
    mutationFn: (payload: any) => Api.Team.InviteMember(payload),
    onSuccess: (res: any) => {
      ns.alert.toast({ title: res.message, message: res.message, icon: 'success' });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({ queryKey: queryKey.teamsRoot() });
    },
    onError: (err: any) => {
      ns.alert.toast({ title: err.message, message: err.message, icon: 'error' });
    },
  });
}
