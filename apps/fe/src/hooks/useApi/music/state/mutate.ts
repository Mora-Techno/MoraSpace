import type {
  IMusicPlayListItem,
  MusicPlaylist,
  PickAddMusicItem,
  PickCreatePlaylist,
} from "@repo/types";

import { queryKey } from "@/configs";
import { useAppMutation } from "@/hooks/useAppMutation";
import Api from "@/services/api";

import {
  type MusicCacheContext,
  readPlaylistSnapshot,
} from "./utils";

export function useCreatePlaylist() {
  return useAppMutation<
    MusicPlaylist,
    PickCreatePlaylist,
    MusicCacheContext
  >({
    mutationFn: (payload) => Api.Music.CreatePlaylist(payload),
    invalidateKeys: [queryKey.musicRoot()],
    optimistic: (ns) => ({ previousData: readPlaylistSnapshot(ns) }),
    onError: (err, _vars, context, ns) => {
      if (context?.previousData !== undefined) {
        ns.queryClient.setQueryData(
          queryKey.music.list(),
          context.previousData,
        );
      }
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: "error",
      });
    },
  });
}

export function useAddPlaylistItem() {
  return useAppMutation<
    IMusicPlayListItem,
    { playlistId: string } & PickAddMusicItem,
    MusicCacheContext
  >({
    mutationFn: ({ playlistId, trackCatalogId }) =>
      Api.Music.AddItemToPlaylist(playlistId, { trackCatalogId }),
    invalidateKeys: [queryKey.musicRoot()],
  });
}

export function useDeletePlaylistItem() {
  return useAppMutation<
    IMusicPlayListItem,
    { playlistId: string; itemId: string },
    MusicCacheContext
  >({
    mutationFn: ({ playlistId, itemId }) =>
      Api.Music.DeletePlaylistItem(playlistId, itemId),
    invalidateKeys: [queryKey.musicRoot()],
  });
}

export function useDeletePlaylist() {
  return useAppMutation<MusicPlaylist, string, MusicCacheContext>({
    mutationFn: (id) => Api.Music.DeletePlaylist(id),
    invalidateKeys: [queryKey.musicRoot()],
    optimistic: (ns) => ({ previousData: readPlaylistSnapshot(ns) }),
    onError: (err, _vars, context, ns) => {
      if (context?.previousData !== undefined) {
        ns.queryClient.setQueryData(
          queryKey.music.list(),
          context.previousData,
        );
      }
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: "error",
      });
    },
  });
}
