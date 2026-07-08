import type { QueryClient } from '@tanstack/react-query';
import type { MusicPlaylist } from '@repo/types';
import { queryKey } from '@/config/query-key';

export type MusicCacheContext = {
  previousData?: MusicPlaylist[];
};

export function readPlaylistSnapshot(queryClient: QueryClient): MusicPlaylist[] | undefined {
  return queryClient.getQueryData<MusicPlaylist[]>(queryKey.music.list());
}
