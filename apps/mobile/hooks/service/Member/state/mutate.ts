import type {
  ICompanyMember,
  PickUpdateCompanyMember,
  PickUpdateMemberContacts,
  PickUpdateMemberProfile,
  TResponse,
} from '@repo/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

import { MemberCacheContext, readMemberSnapshot } from './utils';

export function useUpdateMember() {
  const queryClient = useQueryClient();
  return useMutation<
    TResponse<ICompanyMember>,
    Error,
    { id: string; payload: PickUpdateCompanyMember },
    MemberCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Member.UpdateMember(id, payload),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.membersRoot() });
      return { previousData: readMemberSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.membersRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useDeleteMember() {
  const queryClient = useQueryClient();
  return useMutation<TResponse<ICompanyMember>, Error, string, MemberCacheContext>({
    mutationFn: (id) => Api.Member.DeleteMember(id),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.membersRoot() });
      return { previousData: readMemberSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.membersRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation<
    TResponse<ICompanyMember>,
    Error,
    { id: string; payload: PickUpdateMemberProfile },
    MemberCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Member.UpdateProfile(id, payload),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.membersRoot() });
      return { previousData: readMemberSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.membersRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useUpdateContacts() {
  const queryClient = useQueryClient();
  return useMutation<
    TResponse<ICompanyMember>,
    Error,
    { id: string; payload: PickUpdateMemberContacts },
    MemberCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Member.UpdateContacts(id, payload),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.membersRoot() });
      return { previousData: readMemberSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.membersRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}
