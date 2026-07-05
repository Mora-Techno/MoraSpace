import { buildEndpoint } from "../config/api.config";

const mount = "/workstations";

export const WORKSTATION_ENDPOINTS = {
  LIST: buildEndpoint(mount),
  CREATE: buildEndpoint(mount),
  BYID: (id: string) => buildEndpoint(mount, `/:${id}`),
  BYIDMEMBER: (id: string) => buildEndpoint(mount, `/:${id}/members`),
  UPDATE: (id: string) => buildEndpoint(mount, `/:${id}`),
  DELETE: (id: string) => buildEndpoint(mount, `/:${id}`),
  REMOVEMEMBER: (id: string, userId: string) =>
    buildEndpoint(mount, `/:${id}/members/:${userId}`),
} as const;

export function listWorkstationEndpoints() {
  return Object.keys(WORKSTATION_ENDPOINTS).map((key) => ({
    name: key,
    path: WORKSTATION_ENDPOINTS[key as keyof typeof WORKSTATION_ENDPOINTS],
  }));
}
