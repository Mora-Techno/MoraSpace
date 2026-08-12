import { MUSIC_ENDPOINTS } from "../endpoints/music.endpoints";
import type {
  MusicPlaylist,
  MusicQuery,
  PickCreatePlaylist,
  PickAddMusicItem,
  IMusicPlayListItem,
} from "../types/music.types";
import type { TResponse } from "../types/response.types";
import { DeleteResponse, GetResponse, PostResponse, withQuery } from "./http";
import { toServiceResponse } from "./service-response";

class MusicService {
  public async ListPlaylists(
    query?: MusicQuery,
  ): Promise<TResponse<MusicPlaylist[]>> {
    const res = await GetResponse<MusicPlaylist[]>(
      withQuery(MUSIC_ENDPOINTS.LIST, query),
    );
    return toServiceResponse(res, {
      message: "Daftar playlist berhasil diambil",
    });
  }
  public async CreatePlaylist(
    payload: PickCreatePlaylist,
  ): Promise<TResponse<MusicPlaylist>> {
    const res = await PostResponse<MusicPlaylist>(
      MUSIC_ENDPOINTS.CREATE,
      payload,
    );
    return toServiceResponse(res, {
      message: "Playlist berhasil dibuat",
      statusCode: 201,
    });
  }

  public async DeletePlaylist(id: string): Promise<TResponse<MusicPlaylist>> {
    const res = await DeleteResponse<MusicPlaylist>(
      MUSIC_ENDPOINTS.PLAYLIST_ID(id),
    );
    return toServiceResponse(res, { message: "Playlist berhasil dihapus" });
  }

  public async AddItemToPlaylist(
    playlistId: string,
    payload: PickAddMusicItem,
  ): Promise<TResponse<IMusicPlayListItem>> {
    const res = await PostResponse<IMusicPlayListItem>(
      MUSIC_ENDPOINTS.PLAYLIST_ITEM(playlistId),
      payload,
    );
    return toServiceResponse(res, {
      message: "Musik berhasil ditambahkan",
      statusCode: 201,
    });
  }

  public async DeletePlaylistItem(
    playlistId: string,
    itemId: string,
  ): Promise<TResponse<IMusicPlayListItem>> {
    const res = await DeleteResponse<IMusicPlayListItem>(
      MUSIC_ENDPOINTS.PLAYLIST_ITEM_ID(playlistId, itemId),
    );
    return toServiceResponse(res, { message: "Musik berhasil dihapus" });
  }
}
export default new MusicService();
