import { MUSIC_ENDPOINTS, musicPlaylistById } from '../endpoints/music.endpoints';
import type { MusicPlaylist, PickCreatePlaylist } from '../types/music.types';
import type { TResponse } from '../types/response.types';
import { DeleteResponse, GetResponse, PostResponse } from './http';
import { toServiceResponse } from './service-response';

class MusicService {
  public async ListPlaylists(): Promise<TResponse<MusicPlaylist[]>> {
    const res = await GetResponse<MusicPlaylist[]>(MUSIC_ENDPOINTS.LIST);
    return toServiceResponse(res, {
      message: 'Daftar playlist berhasil diambil',
    });
  }
  public async CreatePlaylist(payload: PickCreatePlaylist): Promise<TResponse<MusicPlaylist>> {
    const res = await PostResponse<MusicPlaylist>(MUSIC_ENDPOINTS.CREATE, payload);
    return toServiceResponse(res, {
      message: 'Playlist berhasil dibuat',
      statusCode: 201,
    });
  }

  public async DeletePlaylist(id: string): Promise<TResponse<MusicPlaylist>> {
    const res = await DeleteResponse<MusicPlaylist>(musicPlaylistById(id));
    return toServiceResponse(res, { message: 'Playlist berhasil dihapus' });
  }
}
export default new MusicService();
