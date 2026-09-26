import type {
  ITeam,
  PickAddTeamMember,
  PickCreateTeam,
  PickUpdateTeam,
} from "@repo/types";
import { useAppMutation } from "@/hooks/useAppMutation";
import Api from "@/service/props.service";
import {
  readTeamSnapshot,
  type TeamCacheContext,
  teamsRoot,
} from "./utils";

export function useCreateTeam() {
  return useAppMutation<ITeam, PickCreateTeam, TeamCacheContext>({
    mutationFn: (payload) => Api.Team.CreateTeam(payload),
    invalidateKeys: [teamsRoot],
    optimistic: (ns) => ({ previousData: readTeamSnapshot(ns) }),
  });
}

export function useUpdateTeam() {
  return useAppMutation<
    ITeam,
    { id: string; payload: PickUpdateTeam },
    TeamCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Team.UpdateTeam(id, payload),
    invalidateKeys: [teamsRoot],
    optimistic: (ns) => ({ previousData: readTeamSnapshot(ns) }),
  });
}

export function useDeleteTeam() {
  return useAppMutation<ITeam, string, TeamCacheContext>({
    mutationFn: (id) => Api.Team.DeleteTeam(id),
    invalidateKeys: [teamsRoot],
    optimistic: (ns) => ({ previousData: readTeamSnapshot(ns) }),
  });
}

export function useAddTeamMember() {
  return useAppMutation<
    unknown,
    { teamId: string; payload: PickAddTeamMember },
    TeamCacheContext
  >({
    mutationFn: ({ teamId, payload }) => Api.Team.AddMember(teamId, payload),
    invalidateKeys: [teamsRoot],
    optimistic: (ns) => ({ previousData: readTeamSnapshot(ns) }),
  });
}

export function useRemoveTeamMember() {
  return useAppMutation<
    unknown,
    { teamId: string; memberId: string },
    TeamCacheContext
  >({
    mutationFn: ({ teamId, memberId }) =>
      Api.Team.RemoveMember(teamId, memberId),
    invalidateKeys: [teamsRoot],
    optimistic: (ns) => ({ previousData: readTeamSnapshot(ns) }),
  });
}
