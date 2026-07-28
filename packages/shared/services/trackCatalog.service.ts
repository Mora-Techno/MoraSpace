import type {
  PickSubmitTrack,
  PickReviewTrack,
  TrackCatalog,
  TrackCatalogQuery,
} from "../types/trackCatalog.types";
import type { TResponse } from "../types/response.types";
import {
  trackCatalogById,
  trackCatalogApprove,
  trackCatalogReject,
  TRACK_CATALOG_ENDPOINTS,
} from "../endpoints/trackCatalog.endpoints";

class TrackCatalogService {
  public async ListTracks(
    query?: TrackCatalogQuery,
  ): Promise<TResponse<TrackCatalog[]>> {
    const params = new URLSearchParams();
    if (query?.search) params.set("search", query.search);
    if (query?.status) params.set("status", query.status);
    if (query?.page) params.set("page", String(query.page));
    if (query?.limit) params.set("limit", String(query.limit));
    if (query?.sortBy) params.set("sortBy", query.sortBy);
    if (query?.sortOrder) params.set("sortOrder", query.sortOrder);

    const qs = params.toString();
    const url = qs
      ? `${TRACK_CATALOG_ENDPOINTS.LIST}?${qs}`
      : TRACK_CATALOG_ENDPOINTS.LIST;

    const res = await fetch(url);
    return res.json();
  }

  public async SubmitTrack(
    payload: PickSubmitTrack,
  ): Promise<TResponse<TrackCatalog>> {
    const res = await fetch(TRACK_CATALOG_ENDPOINTS.SUBMIT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  }

  public async GetTrack(id: string): Promise<TResponse<TrackCatalog>> {
    const res = await fetch(trackCatalogById(id));
    return res.json();
  }

  public async ApproveTrack(id: string): Promise<TResponse<TrackCatalog>> {
    const res = await fetch(trackCatalogApprove(id), {
      method: "PATCH",
    });
    return res.json();
  }

  public async RejectTrack(
    id: string,
    payload: PickReviewTrack,
  ): Promise<TResponse<TrackCatalog>> {
    const res = await fetch(trackCatalogReject(id), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  }

  public async DeleteTrack(id: string): Promise<TResponse<TrackCatalog>> {
    const res = await fetch(trackCatalogById(id), {
      method: "DELETE",
    });
    return res.json();
  }
}

export default new TrackCatalogService();
