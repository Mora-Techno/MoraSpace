import { MODULE_QUERY } from "@repo/config/query-stale";
import type { TrackCatalogQuery } from "@repo/types";
import { useQuery } from "@tanstack/react-query";

import { queryKey } from "@/configs";
import Api from "@/services/api";

export function useTrackCatalogList(filters?: TrackCatalogQuery) {
  return useQuery({
    queryKey: queryKey.trackCatalog.list(filters),
    queryFn: async () => {
      const res = await Api.TrackCatalog.ListTracks(filters);
      return res.data;
    },
    staleTime: MODULE_QUERY,
  });
}
