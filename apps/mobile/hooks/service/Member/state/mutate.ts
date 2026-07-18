import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

export function useUpdateMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      Api.Member.UpdateMember(id, payload),
    onSuccess: (res: any) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.membersRoot() });
    },
    onError: (err: any) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useDeleteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => Api.Member.DeleteMember(id),
    onSuccess: (res: any) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.membersRoot() });
    },
    onError: (err: any) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      Api.Member.UpdateProfile(id, payload),
    onSuccess: (res: any) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.membersRoot() });
    },
    onError: (err: any) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useUpdateContacts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      Api.Member.UpdateContacts(id, payload),
    onSuccess: (res: any) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.membersRoot() });
    },
    onError: (err: any) => {
      Alert.alert('Error', err.message);
    },
  });
}
