import { useCreatePlaylist, useDeletePlaylist } from './state/mutate';
import { usePlaylists } from './state/query';

export const useMusic = () => {
  return {
    mutate: {
      create: useCreatePlaylist,
      delete: useDeletePlaylist,
    },
    query: {
      getPlayList: usePlaylists,
    },
  };
};
