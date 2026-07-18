import { buildEndpoint } from '../config/api.config';

const mount = '/positions';

export const POSITION_ENDPOINTS = {
  LIST: buildEndpoint(mount),
  CREATE: buildEndpoint(mount),
  UPDATE: (id: string) => buildEndpoint(mount, `/${id}`),
  DELETE: (id: string) => buildEndpoint(mount, `/${id}`),
} as const;

export function listPositionEndpoints() {
  return Object.keys(POSITION_ENDPOINTS).map((key) => ({
    name: key,
    path: POSITION_ENDPOINTS[key as keyof typeof POSITION_ENDPOINTS],
  }));
}
