import { useQuery } from "@tanstack/react-query";

import { queryKey } from "@/configs";
import Api from "@/services/api";
import { MODULE_QUERY } from "@repo/config/query-stale";

export function useListPositions() {
  return useQuery({
    queryKey: queryKey.positions.list(),
    queryFn: async () => {
      const res = await Api.Position.ListPositions();
      return res.data;
    },
    staleTime: MODULE_QUERY,
  });
}
