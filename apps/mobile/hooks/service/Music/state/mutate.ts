import type { MusicPlaylist, PickCreatePlaylist } from '@repo/types';
import type { TResponse } from '@repo/types/response.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

import { type MusicCacheContext, readPlaylistSnapshot } from './utils';

export function useCreatePlaylist() {
  const queryClient = useQueryClient();

  return useMutation<TResponse<MusicPlaylist>, Error, PickCreatePlaylist, MusicCacheContext>({
    mutationFn: (payload) => Api.Music.CreatePlaylist(payload),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.musicRoot() });
      return { previousData: readPlaylistSnapshot(queryClient) };
    },
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.musicRoot() });
    },
    onError: (err, _variables, context) => {
      if (context?.previousData !== undefined) {
        queryClient.setQueryData(queryKey.music.list(), context.previousData);
      }
      Alert.alert('Error', err.message);
    },
  });
}

export function useDeletePlaylist() {
  const queryClient = useQueryClient();

  return useMutation<TResponse<MusicPlaylist>, Error, string, MusicCacheContext>({
    mutationFn: (id) => Api.Music.DeletePlaylist(id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.musicRoot() });
      return { previousData: readPlaylistSnapshot(queryClient) };
    },
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.musicRoot() });
    },
    onError: (err, _variables, context) => {
      if (context?.previousData !== undefined) {
        queryClient.setQueryData(queryKey.music.list(), context.previousData);
      }
      Alert.alert('Error', err.message);
    },
  });
}
