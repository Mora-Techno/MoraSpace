import { buildEndpoint } from '../config/api.config';

const mount = '/session';

export const SESSION_ENDPOINT = {
  LIST: buildEndpoint(mount, '/'),
  BYID: (id: string) => buildEndpoint(mount, `/${id}`),
  DELETE: (id: string) => buildEndpoint(mount, `/${id}`),
  DELETEALL: buildEndpoint(mount, '/'),
} as const;

export function listSessionEndpoints() {
  return Object.keys(SESSION_ENDPOINT).map((key) => ({
    name: key,
    path: SESSION_ENDPOINT[key as keyof typeof SESSION_ENDPOINT],
  }));
}
