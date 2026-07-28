import type {
  MusicPlaylist,
  PickCreatePlaylist,
  PickAddMusicItem,
  IMusicPlayListItem,
} from "@repo/types";
import { useMutation } from "@tanstack/react-query";

import { queryKey } from "@/configs";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import Api from "@/services/api";
import type { TResponse } from "@/types/api/response";

import type { MusicCacheContext } from "./utils";
import { readPlaylistSnapshot } from "./utils";

export function useCreatePlaylist() {
  const ns = useAppNameSpace();

  return useMutation<
    TResponse<MusicPlaylist>,
    Error,
    PickCreatePlaylist,
    MusicCacheContext
  >({
    mutationFn: (payload) => Api.Music.CreatePlaylist(payload),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: queryKey.musicRoot() });
      return { previousData: readPlaylistSnapshot(ns) };
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
        queryKey: queryKey.musicRoot(),
      });
    },
    onError: (err, _variables, context) => {
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
  const ns = useAppNameSpace();

  return useMutation<
    TResponse<IMusicPlayListItem>,
    Error,
    { playlistId: string } & PickAddMusicItem,
    MusicCacheContext
  >({
    mutationFn: ({ playlistId, trackCatalogId }) =>
      Api.Music.AddItemToPlaylist(playlistId, { trackCatalogId }),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: "success",
      });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.musicRoot(),
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

export function useDeletePlaylistItem() {
  const ns = useAppNameSpace();

  return useMutation<
    TResponse<IMusicPlayListItem>,
    Error,
    { playlistId: string; itemId: string },
    MusicCacheContext
  >({
    mutationFn: ({ playlistId, itemId }) =>
      Api.Music.DeletePlaylistItem(playlistId, itemId),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: "success",
      });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.musicRoot(),
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

export function useDeletePlaylist() {
  const ns = useAppNameSpace();

  return useMutation<
    TResponse<MusicPlaylist>,
    Error,
    string,
    MusicCacheContext
  >({
    mutationFn: (id) => Api.Music.DeletePlaylist(id),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: queryKey.musicRoot() });
      return { previousData: readPlaylistSnapshot(ns) };
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
        queryKey: queryKey.musicRoot(),
      });
    },
    onError: (err, _variables, context) => {
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
