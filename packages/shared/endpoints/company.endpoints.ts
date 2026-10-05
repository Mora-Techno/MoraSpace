import { buildEndpoint } from '../config/api.config';

const mount = '/companies';

export const COMPANY_ENDPOINTS = {
  REGISTER: buildEndpoint(mount, '/register'),
  CREATE_ADMIN: buildEndpoint(mount, '/admins'),
  DELETE_ADMIN: (id: string) => buildEndpoint(mount, `/admins/${id}`),
  LIST_ADMINS: buildEndpoint(mount, '/admins'),
  ME: buildEndpoint(mount, '/me'),
  UPDATE_SUBSCRIPTION: buildEndpoint(mount, '/subscription'),
  UPDATE_PROFILE: buildEndpoint(mount, '/profile'),
  GET_SETTINGS: buildEndpoint(mount, '/settings'),
  UPDATE_SETTINGS: buildEndpoint(mount, '/settings'),
} as const;

export function listCompanyEndpoints() {
  return Object.keys(COMPANY_ENDPOINTS).map((key) => ({
    name: key,
    path: COMPANY_ENDPOINTS[key as keyof typeof COMPANY_ENDPOINTS],
  }));
}

// v0.0.1 Layer 1: Super Admin ops.
const adminMount = '/admin/companies';

export const ADMIN_COMPANY_ENDPOINTS = {
  LIST: buildEndpoint(adminMount),
  CREATE: buildEndpoint(adminMount),
  SUSPEND: (id: string) => buildEndpoint(adminMount, `/${id}/suspend`),
  ACTIVATE: (id: string) => buildEndpoint(adminMount, `/${id}/activate`),
  SET_PLAN: (id: string) => buildEndpoint(adminMount, `/${id}/plan`),
} as const;
