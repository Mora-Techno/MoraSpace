import { useQuery } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

export function useListPositions() {
  return useQuery({
    queryKey: queryKey.positions.list(),
    queryFn: async () => {
      const res = await Api.Position.ListPositions();
      return res.data;
    },
  });
}
