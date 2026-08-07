import { buildEndpoint } from "../config/api.config";

const mount = "/settings";

export const SETTINGS_ENDPOINTS = {
  GET: buildEndpoint(mount),
  UPDATE: buildEndpoint(mount),
  SEND_EMAIL: buildEndpoint(mount, "/send-mailer"),
} as const;

export function listSettingsEndpoints() {
  return Object.keys(SETTINGS_ENDPOINTS).map((key) => ({
    name: key,
    path: SETTINGS_ENDPOINTS[key as keyof typeof SETTINGS_ENDPOINTS],
  }));
}
