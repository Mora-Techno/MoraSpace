import { buildEndpoint } from "../config/api.config";

const mount = "/music/tracks";

export const TRACK_CATALOG_ENDPOINTS = {
  LIST: buildEndpoint(mount),
  SUBMIT: buildEndpoint(mount),
  PENDING: buildEndpoint(mount, "/pending"),
} as const;

export const trackCatalogById = (id: string) => buildEndpoint(mount, `/${id}`);

export const trackCatalogApprove = (id: string) =>
  buildEndpoint(mount, `/${id}/approve`);

export const trackCatalogReject = (id: string) =>
  buildEndpoint(mount, `/${id}/reject`);

export function listTrackCatalogEndpoints() {
  return Object.keys(TRACK_CATALOG_ENDPOINTS).map((key) => ({
    name: key,
    path: TRACK_CATALOG_ENDPOINTS[key as keyof typeof TRACK_CATALOG_ENDPOINTS],
  }));
}
