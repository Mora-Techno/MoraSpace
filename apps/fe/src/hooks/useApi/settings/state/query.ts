import { MODULE_QUERY } from "@repo/config/query-stale";
import { useQuery } from "@tanstack/react-query";
import type { Settings } from "@repo/types";

import { queryKey } from "@/configs";
import Api from "@/services/api";

export function useGetSettings() {
  return useQuery<Settings>({
    queryKey: queryKey.settings.detail(),
    queryFn: async () => {
      const res = await Api.Settings.GetSettings();
      return res.data;
    },
    staleTime: MODULE_QUERY,
  });
}
