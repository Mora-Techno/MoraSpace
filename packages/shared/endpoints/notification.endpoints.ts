import { buildEndpoint } from "../config/api.config";

const mount = "/notifications";

export const NOTIFICATION_ENDPOINTS = {
  SEND: buildEndpoint(mount, "/send"),
  LOGS: buildEndpoint(mount, "/logs"),
} as const;

export function listNotificationEndpoints() {
  return Object.keys(NOTIFICATION_ENDPOINTS).map((key) => ({
    name: key,
    path: NOTIFICATION_ENDPOINTS[key as keyof typeof NOTIFICATION_ENDPOINTS],
  }));
}
