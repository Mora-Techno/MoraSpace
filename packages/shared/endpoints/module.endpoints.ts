import { buildEndpoint } from '../config/api.config';

const mount = '/modules';

export const MODULE_ENDPOINTS = {
  LIST: buildEndpoint(mount),
  CREATE: buildEndpoint(mount),
  BYID: (id: string) => buildEndpoint(mount, `/${id}`),
  UPDATE: (id: string) => buildEndpoint(mount, `/${id}`),
  DELETE: (id: string) => buildEndpoint(mount, `/${id}`),
} as const;

export function listModuleEndpoints() {
  return Object.keys(MODULE_ENDPOINTS).map((key) => ({
    name: key,
    path: MODULE_ENDPOINTS[key as keyof typeof MODULE_ENDPOINTS],
  }));
}
