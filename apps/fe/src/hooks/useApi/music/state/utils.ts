import type { MusicPlaylist } from '@repo/types';

import { queryKey } from '@/configs';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';

export type MusicCacheContext = {
  previousData?: MusicPlaylist[];
};

export function readPlaylistSnapshot(ns: AppNameSpace): MusicPlaylist[] | undefined {
  return ns.queryClient.getQueryData<MusicPlaylist[]>(queryKey.music.list());
}
