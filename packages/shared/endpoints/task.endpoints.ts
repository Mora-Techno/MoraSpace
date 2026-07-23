import { buildEndpoint } from '../config/api.config';

const mount = '/tasks';

export const TASK_ENDPOINTS = {
  LIST: buildEndpoint(mount),
  CREATE: buildEndpoint(mount),
  BYID: (id: string) => buildEndpoint(mount, `/${id}`),
  UPDATE: (id: string) => buildEndpoint(mount, `/${id}`),
  DELETE: (id: string) => buildEndpoint(mount, `/${id}`),
  ASSIGN: (id: string) => buildEndpoint(mount, `/${id}/assign`),
  STATUS: (id: string) => buildEndpoint(mount, `/${id}/status`),
  COMMENT: (id: string) => buildEndpoint(mount, `/${id}/comment`),
  CHECKLIST: (id: string) => buildEndpoint(mount, `/${id}/checklist`),
  ATTACHMENT: (id: string) => buildEndpoint(mount, `/${id}/attachment`),
  ACTIVITY: (id: string) => buildEndpoint(mount, `/${id}/activity`),
} as const;

export function listTaskEndpoints() {
  return Object.keys(TASK_ENDPOINTS).map((key) => ({
    name: key,
    path: TASK_ENDPOINTS[key as keyof typeof TASK_ENDPOINTS],
  }));
}
