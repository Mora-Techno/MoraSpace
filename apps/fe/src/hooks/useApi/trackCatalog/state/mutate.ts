import type { PickSubmitTrack, TrackCatalog } from "@repo/types";

import { queryKey } from "@/configs";
import { useAppMutation } from "@/hooks/useAppMutation";
import Api from "@/services/api";

export function useSubmitTrack() {
  return useAppMutation<TrackCatalog, PickSubmitTrack>({
    mutationFn: (payload) => Api.TrackCatalog.SubmitTrack(payload),
    invalidateKeys: [queryKey.trackCatalogRoot()],
  });
}

export function useDeleteTrack() {
  return useAppMutation<TrackCatalog, string>({
    mutationFn: (id) => Api.TrackCatalog.DeleteTrack(id),
    invalidateKeys: [queryKey.trackCatalogRoot()],
  });
}
