import { buildEndpoint } from '../config/api.config';

const mount = '/members';

export const MEMBER_ENDPOINTS = {
  LIST: buildEndpoint(mount),
  BYID: (id: string) => buildEndpoint(mount, `/${id}`),
  UPDATE: (id: string) => buildEndpoint(mount, `/${id}`),
  DELETE: (id: string) => buildEndpoint(mount, `/${id}`),
  PROFILE: (id: string) => buildEndpoint(mount, `/${id}/profile`),
  UPDATE_PROFILE: (id: string) => buildEndpoint(mount, `/${id}/profile`),
  CONTACTS: (id: string) => buildEndpoint(mount, `/${id}/contact`),
  UPDATE_CONTACTS: (id: string) => buildEndpoint(mount, `/${id}/contact`),
} as const;

export function listMemberEndpoints() {
  return Object.keys(MEMBER_ENDPOINTS).map((key) => ({
    name: key,
    path: MEMBER_ENDPOINTS[key as keyof typeof MEMBER_ENDPOINTS],
  }));
}
