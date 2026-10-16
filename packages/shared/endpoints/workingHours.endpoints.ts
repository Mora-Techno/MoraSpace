import { buildEndpoint } from '../config/api.config';

const mount = '/companies/working-hours';

export const WORKING_HOURS_ENDPOINTS = {
  STATUS: buildEndpoint(mount, '/status'),
  QUOTA: buildEndpoint(mount, '/quota'),
  METRICS: buildEndpoint(mount, '/metrics'),
  APP_OPENED: buildEndpoint(mount, '/app-opened'),
} as const;

export function listWorkingHoursEndpoints() {
  return Object.keys(WORKING_HOURS_ENDPOINTS).map((key) => ({
    name: key,
    path: WORKING_HOURS_ENDPOINTS[key as keyof typeof WORKING_HOURS_ENDPOINTS],
  }));
}
