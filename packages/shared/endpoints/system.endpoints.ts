import { buildEndpoint } from '../config/api.config';

const mount = '/system';

export const SYSTEM_ENDPOINTS = {
  PING: buildEndpoint(mount, '/ping'),
} as const;

export function listSystemEndpoints() {
  return Object.keys(SYSTEM_ENDPOINTS).map((key) => ({
    name: key,
    path: SYSTEM_ENDPOINTS[key as keyof typeof SYSTEM_ENDPOINTS],
  }));
}
