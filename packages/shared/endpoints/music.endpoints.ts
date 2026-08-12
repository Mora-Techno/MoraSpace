import { buildEndpoint } from "../config/api.config";

const mount = "/music/playlists";

export const MUSIC_ENDPOINTS = {
  LIST: buildEndpoint(mount),
  CREATE: buildEndpoint(mount),
  PLAYLIST_ID: (id: string) => buildEndpoint(mount, `/:${id}`),
  PLAYLIST_ITEM: (id: string) => buildEndpoint(mount, `/${id}/items`),
  PLAYLIST_ITEM_ID: (id: string, itemId: string) =>
    buildEndpoint(mount, `/${id}/items/${itemId}`),
} as const;

export function listMusicEndpoints() {
  return Object.keys(MUSIC_ENDPOINTS).map((key) => ({
    name: key,
    path: MUSIC_ENDPOINTS[key as keyof typeof MUSIC_ENDPOINTS],
  }));
}
