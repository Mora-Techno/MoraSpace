import { buildEndpoint } from '../config/api.config';

const mount = '/todos';

export const TODO_ENDPOINTS = {
  LIST: buildEndpoint(mount),
  CREATE: buildEndpoint(mount),
  BYID: (id: string) => buildEndpoint(mount, `/${id}`),
  DELETE: (id: string) => buildEndpoint(mount, `/${id}`),
  UPDATE: (id: string) => buildEndpoint(mount, `/${id}`),
} as const;

export function listTodoEndpoints() {
  return Object.keys(TODO_ENDPOINTS).map((key) => ({
    name: key,
    path: TODO_ENDPOINTS[key as keyof typeof TODO_ENDPOINTS],
  }));
}
