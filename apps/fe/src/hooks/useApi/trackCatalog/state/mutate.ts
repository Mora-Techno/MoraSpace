import type { TrackCatalog, PickSubmitTrack } from "@repo/types";
import { useMutation } from "@tanstack/react-query";

import { queryKey } from "@/configs";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import Api from "@/services/api";
import type { TResponse } from "@/types/api/response";

export function useSubmitTrack() {
  const ns = useAppNameSpace();

  return useMutation<TResponse<TrackCatalog>, Error, PickSubmitTrack>({
    mutationFn: (payload) => Api.TrackCatalog.SubmitTrack(payload),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: "Track berhasil diajukan untuk review",
        icon: "success",
      });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.trackCatalogRoot(),
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

export function useDeleteTrack() {
  const ns = useAppNameSpace();

  return useMutation<TResponse<TrackCatalog>, Error, string>({
    mutationFn: (id) => Api.TrackCatalog.DeleteTrack(id),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: "success",
      });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.trackCatalogRoot(),
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
