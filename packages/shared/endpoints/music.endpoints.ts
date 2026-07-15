import { buildEndpoint } from '../config/api.config';

const mount = '/music/playlists';

export const MUSIC_ENDPOINTS = {
  LIST: buildEndpoint(mount),
  CREATE: buildEndpoint(mount),
} as const;

export const musicPlaylistById = (id: string) => buildEndpoint(mount, `/${id}`);

export function listMusicEndpoints() {
  return Object.keys(MUSIC_ENDPOINTS).map((key) => ({
    name: key,
    path: MUSIC_ENDPOINTS[key as keyof typeof MUSIC_ENDPOINTS],
  }));
}
