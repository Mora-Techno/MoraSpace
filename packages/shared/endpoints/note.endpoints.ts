import { buildEndpoint } from '../config/api.config';

const mount = '/notes';

export const NOTE_ENDPOINTS = {
  LIST: buildEndpoint(mount),
  CREATE: buildEndpoint(mount),
  BYID: (id: string) => buildEndpoint(mount, `/${id}`),
  UPDATE: (id: string) => buildEndpoint(mount, `/${id}`),
  DELETE: (id: string) => buildEndpoint(mount, `/${id}`),
} as const;

export function listNoteEndpoints() {
  return Object.keys(NOTE_ENDPOINTS).map((key) => ({
    name: key,
    path: NOTE_ENDPOINTS[key as keyof typeof NOTE_ENDPOINTS],
  }));
}
