import { useQuery } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

export function usePlaylists() {
  return useQuery({
    queryKey: queryKey.music.list(),
    queryFn: async () => {
      const res = await Api.Music.ListPlaylists();
      return res.data;
    },
  });
}
