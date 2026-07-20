import type {
  IInvitation,
  PickAcceptInvitation,
  PickCreateInvitation,
  PickRejectInvitation,
  TResponse,
} from '@repo/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

import { InvitationCacheContext, readInvitationSnapshot } from './utils';

export function useCreateInvitation() {
  const queryClient = useQueryClient();
  return useMutation<TResponse<IInvitation>, Error, PickCreateInvitation, InvitationCacheContext>({
    mutationFn: (payload) => Api.Invitation.CreateInvitation(payload),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.invitationsRoot() });
      return { previousData: readInvitationSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.invitationsRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useAcceptInvitation() {
  const queryClient = useQueryClient();
  return useMutation<TResponse<unknown>, Error, PickAcceptInvitation, InvitationCacheContext>({
    mutationFn: (payload) => Api.Invitation.AcceptInvitation(payload),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.invitationsRoot() });
      return { previousData: readInvitationSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.invitationsRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useRejectInvitation() {
  const queryClient = useQueryClient();
  return useMutation<TResponse<unknown>, Error, PickRejectInvitation, InvitationCacheContext>({
    mutationFn: (payload) => Api.Invitation.RejectInvitation(payload),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.invitationsRoot() });
      return { previousData: readInvitationSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.invitationsRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useDeleteInvitation() {
  const queryClient = useQueryClient();
  return useMutation<TResponse<IInvitation>, Error, string, InvitationCacheContext>({
    mutationFn: (id) => Api.Invitation.DeleteInvitation(id),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.invitationsRoot() });
      return { previousData: readInvitationSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.invitationsRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}
