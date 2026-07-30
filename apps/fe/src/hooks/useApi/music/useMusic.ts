import {
  useCreatePlaylist,
  useDeletePlaylist,
  useAddPlaylistItem,
  useDeletePlaylistItem,
} from "./state/mutate";
import { usePlaylists } from "./state/query";

export const useMusic = () => {
  return {
    mutate: {
      create: useCreatePlaylist,
      delete: useDeletePlaylist,
      addItem: useAddPlaylistItem,
      deleteItem: useDeletePlaylistItem,
    },
    query: {
      getPlayList: usePlaylists,
    },
  };
};
