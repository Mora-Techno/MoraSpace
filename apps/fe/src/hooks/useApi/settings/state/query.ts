import { useQuery } from "@tanstack/react-query";

import { queryKey } from "@/configs";
import Api from "@/services/api";
import { MODULE_QUERY } from "@repo/config/query-stale";

export function useGetSettings() {
  return useQuery({
    queryKey: queryKey.settings.detail(),
    queryFn: async () => {
      const res = await Api.Settings.GetSettings();
      return res.data;
    },
    staleTime: MODULE_QUERY,
  });
}
