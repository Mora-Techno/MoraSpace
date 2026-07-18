import { useQuery } from '@tanstack/react-query';

import { queryKey } from '@/configs';
import Api from '@/services/api';

export function useListPositions() {
  return useQuery({
    queryKey: queryKey.positions.list(),
    queryFn: async () => {
      const res = await Api.Position.ListPositions();
      return res.data;
    },
  });
}
