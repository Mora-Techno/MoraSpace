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
import {
  GetResponse,
  PostResponse,
  PatchResponse,
  DelResponse,
  withQuery,
} from "./http";
import { toServiceResponse } from "./service-response";
import type { ApiSuccessResponse } from "../types/api.types";

class TrackCatalogService {
  public async ListTracks(
    query?: TrackCatalogQuery,
  ): Promise<TResponse<TrackCatalog[]>> {
    const res: ApiSuccessResponse<TrackCatalog[]> = await GetResponse<
      TrackCatalog[]
    >(
      withQuery(TRACK_CATALOG_ENDPOINTS.LIST, query as Record<string, unknown>),
    );
    return toServiceResponse(res, { message: "Daftar track berhasil diambil" });
  }

  public async ListPendingTracks(
    query?: TrackCatalogQuery,
  ): Promise<TResponse<TrackCatalog[]>> {
    const res: ApiSuccessResponse<TrackCatalog[]> = await GetResponse<
      TrackCatalog[]
    >(
      withQuery(
        TRACK_CATALOG_ENDPOINTS.PENDING,
        query as Record<string, unknown>,
      ),
    );
    return toServiceResponse(res, {
      message: "Daftar track pending berhasil diambil",
    });
  }

  public async SubmitTrack(
    payload: PickSubmitTrack,
  ): Promise<TResponse<TrackCatalog>> {
    const res: ApiSuccessResponse<TrackCatalog> =
      await PostResponse<TrackCatalog>(TRACK_CATALOG_ENDPOINTS.SUBMIT, payload);
    return toServiceResponse(res, { message: "Track berhasil dikirim" });
  }

  public async GetTrack(id: string): Promise<TResponse<TrackCatalog>> {
    const res: ApiSuccessResponse<TrackCatalog> =
      await GetResponse<TrackCatalog>(trackCatalogById(id));
    return toServiceResponse(res, { message: "Detail track berhasil diambil" });
  }

  public async ApproveTrack(id: string): Promise<TResponse<TrackCatalog>> {
    const res: ApiSuccessResponse<TrackCatalog> =
      await PatchResponse<TrackCatalog>(trackCatalogApprove(id));
    return toServiceResponse(res, { message: "Track berhasil disetujui" });
  }

  public async RejectTrack(
    id: string,
    payload: PickReviewTrack,
  ): Promise<TResponse<TrackCatalog>> {
    const res: ApiSuccessResponse<TrackCatalog> =
      await PatchResponse<TrackCatalog>(trackCatalogReject(id), payload);
    return toServiceResponse(res, { message: "Track berhasil ditolak" });
  }

  public async DeleteTrack(id: string): Promise<TResponse<TrackCatalog>> {
    const res: ApiSuccessResponse<TrackCatalog> =
      await DelResponse<TrackCatalog>(trackCatalogById(id));
    return toServiceResponse(res, { message: "Track berhasil dihapus" });
  }
}

export default new TrackCatalogService();
