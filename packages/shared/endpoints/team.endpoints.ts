import { buildEndpoint } from "../config/api.config";

const mount = "/teams";

export const TEAM_ENDPOINTS = {
  LIST: buildEndpoint(mount),
  CREATE: buildEndpoint(mount),
  UPDATE: (id: string) => buildEndpoint(mount, `/:${id}`),
  DELETE: (id: string) => buildEndpoint(mount, `/:${id}`),
  MEMBERS: (id: string) => buildEndpoint(mount, `/:${id}/members`),
  ADD_MEMBER: (id: string) => buildEndpoint(mount, `/:${id}/members`),
  REMOVE_MEMBER: (id: string, memberId: string) =>
    buildEndpoint(mount, `/:${id}/members/:${memberId}`),
} as const;

export function listTeamEndpoints() {
  return Object.keys(TEAM_ENDPOINTS).map((key) => ({
    name: key,
    path: TEAM_ENDPOINTS[key as keyof typeof TEAM_ENDPOINTS],
  }));
}
