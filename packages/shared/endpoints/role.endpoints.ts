import { buildEndpoint } from '../config/api.config';

const mount = '/roles';

export const ROLE_ENDPOINTS = {
  LIST: buildEndpoint(mount),
  CREATE: buildEndpoint(mount),
  UPDATE: (id: string) => buildEndpoint(mount, `/${id}`),
  DELETE: (id: string) => buildEndpoint(mount, `/${id}`),
  PERMISSIONS: (id: string) => buildEndpoint(mount, `/${id}/permissions`),
  UPDATE_PERMISSIONS: (id: string) => buildEndpoint(mount, `/${id}/permissions`),
  MASTER_PERMISSIONS: buildEndpoint('/permissions'),
} as const;

export function listRoleEndpoints() {
  return Object.keys(ROLE_ENDPOINTS).map((key) => ({
    name: key,
    path: ROLE_ENDPOINTS[key as keyof typeof ROLE_ENDPOINTS],
  }));
}
