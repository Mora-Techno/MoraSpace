import { buildEndpoint } from '../config/api.config';

const mount = '/dashboards';

export const DASHBOARD_ENDPOINTS = {
  OWNER: buildEndpoint(mount, '/owner'),
} as const;

export function listDashboardEndpoints() {
  return Object.keys(DASHBOARD_ENDPOINTS).map((key) => ({
    name: key,
    path: DASHBOARD_ENDPOINTS[key as keyof typeof DASHBOARD_ENDPOINTS],
  }));
}
