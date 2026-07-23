import { MODULE_QUERY } from '@repo/config/query-stale';
import { useQuery } from '@tanstack/react-query';

import { queryKey } from '@/configs';
import Api from '@/services/api';

export function usePlaylists() {
  return useQuery({
    queryKey: queryKey.music.list(),
    queryFn: async () => {
      const res = await Api.Music.ListPlaylists();
      return res.data;
    },
    staleTime: MODULE_QUERY,
  });
}
