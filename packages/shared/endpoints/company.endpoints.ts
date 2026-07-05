import { buildEndpoint } from "../config/api.config";

const mount = "/companies";

export const COMPANY_ENDPOINTS = {
  REGISTER: buildEndpoint(mount, "/register"),
  CREATE_ADMIN: buildEndpoint(mount, "/admins"),
  LIST_ADMINS: buildEndpoint(mount, "/admins"),
  ME: buildEndpoint(mount, "/me"),
  UPDATE_SUBSCRIPTION: buildEndpoint(mount, "/subscription"),
} as const;

export function listCompanyEndpoints() {
  return Object.keys(COMPANY_ENDPOINTS).map((key) => ({
    name: key,
    path: COMPANY_ENDPOINTS[key as keyof typeof COMPANY_ENDPOINTS],
  }));
}
