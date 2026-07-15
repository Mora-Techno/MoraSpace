import { buildEndpoint } from '../config/api.config';

const mount = '/calendar/events';

export const CALENDAR_ENDPOINTS = {
  LIST: buildEndpoint(mount),
  CREATE: buildEndpoint(mount),
} as const;

export const calendarEventById = (id: string) => buildEndpoint(mount, `/${id}`);

export function listCalendarEndpoints() {
  return Object.keys(CALENDAR_ENDPOINTS).map((key) => ({
    name: key,
    path: CALENDAR_ENDPOINTS[key as keyof typeof CALENDAR_ENDPOINTS],
  }));
}
