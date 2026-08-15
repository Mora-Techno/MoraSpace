import { useMutation } from "@tanstack/react-query";

import { queryKey } from "@/configs";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import Api from "@/services/api";
import { PickAddTeamMember, PickCreateTeam, TResponse } from "@repo";
import { ITeam } from "@repo";
import { TeamCacheContext } from "./utils";
import { teamsRoot } from "./utils";
import { readTeamSnapshot } from "./utils";
import { PickUpdateTeam } from "@repo";

export function useCreateTeam() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<ITeam>, Error, PickCreateTeam, TeamCacheContext>(
    {
      mutationFn: (payload) => Api.Team.CreateTeam(payload),
      onMutate: async () => {
        await ns.queryClient.cancelQueries({ queryKey: teamsRoot });
        return { previousData: readTeamSnapshot(ns) };
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
          queryKey: teamsRoot,
        });
      },
      onError: (err: any) => {
        ns.alert.toast({
          title: err.message,
          message: err.message,
          icon: "error",
        });
      },
    },
  );
}

export function useUpdateTeam() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<ITeam>,
    Error,
    { id: string; payload: PickUpdateTeam },
    TeamCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Team.UpdateTeam(id, payload),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: teamsRoot });
      return { previousData: readTeamSnapshot(ns) };
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
        queryKey: teamsRoot,
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

export function useDeleteTeam() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<ITeam>, Error, { id: string }, TeamCacheContext>(
    {
      mutationFn: ({ id }) => Api.Team.DeleteTeam(id),
      onSuccess: (res) => {
        ns.alert.toast({
          title: res.message,
          message: res.message,
          icon: "success",
        });
      },
      onMutate: async () => {
        await ns.queryClient.cancelQueries({ queryKey: teamsRoot });
        return { previousData: readTeamSnapshot(ns) };
      },
      onSettled: async () => {
        await ns.queryClient.invalidateQueries({
          queryKey: teamsRoot,
        });
      },
      onError: (err) => {
        ns.alert.toast({
          title: err.message,
          message: err.message,
          icon: "error",
        });
      },
    },
  );
}

export function useAddTeamMember() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<unknown>,
    Error,
    { teamId: string; payload: PickAddTeamMember },
    TeamCacheContext
  >({
    mutationFn: ({ teamId, payload }) => Api.Team.AddMember(teamId, payload),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: "success",
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: teamsRoot });
      return { previousData: readTeamSnapshot(ns) };
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: teamsRoot,
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

export function useRemoveTeamMember() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<unknown>,
    Error,
    { teamId: string; memberId: string },
    TeamCacheContext
  >({
    mutationFn: ({ teamId, memberId }) =>
      Api.Team.RemoveMember(teamId, memberId),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: "success",
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: teamsRoot });
      return { previousData: readTeamSnapshot(ns) };
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: teamsRoot,
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

export function useInviteTeamMember() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<unknown>, Error, unknown, TeamCacheContext>({
    mutationFn: (payload) => Api.Team.InviteMember(payload),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: "success",
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: teamsRoot });
      return { previousData: readTeamSnapshot(ns) };
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: teamsRoot,
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
