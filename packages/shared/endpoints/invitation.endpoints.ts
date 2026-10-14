import { buildEndpoint } from '../config/api.config';

const mount = '/invitations';

export const INVITATION_ENDPOINTS = {
  LIST: buildEndpoint(mount),
  CREATE: buildEndpoint(mount),
  ACCEPT: buildEndpoint(mount, '/accept'),
  REJECT: buildEndpoint(mount, '/reject'),
  DELETE: (id: string) => buildEndpoint(mount, `/${id}`),
} as const;

export function listInvitationEndpoints() {
  return Object.keys(INVITATION_ENDPOINTS).map((key) => ({
    name: key,
    path: INVITATION_ENDPOINTS[key as keyof typeof INVITATION_ENDPOINTS],
  }));
}
