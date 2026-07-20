import type {
  ITeam,
  PickAddTeamMember,
  PickCreateTeam,
  PickUpdateTeam,
  TResponse,
} from '@repo/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

import { readTeamSnapshot,TeamCacheContext } from './utils';

export function useCreateTeam() {
  const queryClient = useQueryClient();
  return useMutation<TResponse<ITeam>, Error, PickCreateTeam, TeamCacheContext>({
    mutationFn: (payload) => Api.Team.CreateTeam(payload),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.teamsRoot() });
      return { previousData: readTeamSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.teamsRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useUpdateTeam() {
  const queryClient = useQueryClient();
  return useMutation<
    TResponse<ITeam>,
    Error,
    { id: string; payload: PickUpdateTeam },
    TeamCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Team.UpdateTeam(id, payload),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.teamsRoot() });
      return { previousData: readTeamSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.teamsRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useDeleteTeam() {
  const queryClient = useQueryClient();
  return useMutation<TResponse<ITeam>, Error, string, TeamCacheContext>({
    mutationFn: (id) => Api.Team.DeleteTeam(id),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.teamsRoot() });
      return { previousData: readTeamSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.teamsRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useAddTeamMember() {
  const queryClient = useQueryClient();
  return useMutation<
    TResponse<unknown>,
    Error,
    { teamId: string; payload: PickAddTeamMember },
    TeamCacheContext
  >({
    mutationFn: ({ teamId, payload }) => Api.Team.AddMember(teamId, payload),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.teamsRoot() });
      return { previousData: readTeamSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.teamsRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useRemoveTeamMember() {
  const queryClient = useQueryClient();
  return useMutation<
    TResponse<unknown>,
    Error,
    { teamId: string; memberId: string },
    TeamCacheContext
  >({
    mutationFn: ({ teamId, memberId }) => Api.Team.RemoveMember(teamId, memberId),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.teamsRoot() });
      return { previousData: readTeamSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.teamsRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useInviteTeamMember() {
  const queryClient = useQueryClient();
  return useMutation<TResponse<unknown>, Error, unknown, TeamCacheContext>({
    mutationFn: (payload) => Api.Team.InviteMember(payload),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.teamsRoot() });
      return { previousData: readTeamSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.teamsRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}
