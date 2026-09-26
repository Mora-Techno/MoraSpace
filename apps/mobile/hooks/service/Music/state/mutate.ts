import type { MusicPlaylist, PickCreatePlaylist } from "@repo/types";
import { queryKey } from "@/config/query-key";
import { useAppMutation } from "@/hooks/useAppMutation";
import Api from "@/service/props.service";
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
        title: "Error",
        message: err.message,
        icon: "error",
      });
    },
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
        title: "Error",
        message: err.message,
        icon: "error",
      });
    },
  });
}
