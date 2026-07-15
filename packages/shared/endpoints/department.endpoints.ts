import { buildEndpoint } from '../config/api.config';

const mount = '/departments';

export const DEPARTMENT_ENDPOINTS = {
  LIST: buildEndpoint(mount),
  CREATE: buildEndpoint(mount),
  BYID: (id: string) => buildEndpoint(mount, `/${id}`),
  UPDATE: (id: string) => buildEndpoint(mount, `/${id}`),
  DELETE: (id: string) => buildEndpoint(mount, `/${id}`),
} as const;

export function listDepartmentEndpoints() {
  return Object.keys(DEPARTMENT_ENDPOINTS).map((key) => ({
    name: key,
    path: DEPARTMENT_ENDPOINTS[key as keyof typeof DEPARTMENT_ENDPOINTS],
  }));
}
