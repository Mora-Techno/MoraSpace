import TrackCatalogService from "@/service/TrackCatalogService";
import { HttpResponse } from "@/http";
import type { AppContext } from "@/contex";
import type { PickSubmitTrack } from "@repo/types/trackCatalog.types";
import { getUser } from "@/utils/authTokens";
import {
  personalContextValidate,
  paramsValidate,
} from "@/validation/auth.validate";

interface ReviewBody {
  rejectionReason?: string;
}

class TrackCatalogController {
  public async list(c: AppContext) {
    try {
      const user = getUser(c);
      const authResponse = await personalContextValidate(user, c);
      if (authResponse) return authResponse;

      const result = await TrackCatalogService.list(
        user.companyMemberId ?? null,
        user.id,
        user.companyId ?? null,
        c.query as any,
      );

      return HttpResponse(c).ok(
        result.data,
        result.meta,
        "Berhasil mengambil daftar track",
      );
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async listPending(c: AppContext) {
    try {
      const user = getUser(c);
      const authResponse = await personalContextValidate(user, c);
      if (authResponse) return authResponse;

      const result = await TrackCatalogService.listPending(
        user.companyId ?? null,
        c.query as any,
      );

      return HttpResponse(c).ok(
        result.data,
        result.meta,
        "Berhasil mengambil daftar track",
      );
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async getById(c: AppContext) {
    try {
      const user = getUser(c);
      const authResponse = await personalContextValidate(user, c);
      if (authResponse) return authResponse;

      const params = c.params as { id: string };
      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const track = await TrackCatalogService.getById(params.id);
      if (!track) return HttpResponse(c).notFound("Track tidak ditemukan");

      return HttpResponse(c).ok(track, undefined, "Berhasil mengambil track");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async submit(c: AppContext) {
    try {
      const user = getUser(c);
      const input = c.body as PickSubmitTrack;

      const authResponse = await personalContextValidate(user, c);
      if (authResponse) return authResponse;

      if (!input?.title || !input?.youtubeUrl) {
        return HttpResponse(c).badRequest("title dan youtubeUrl wajib diisi");
      }

      const track = await TrackCatalogService.submit(
        user.companyMemberId ?? null,
        user.id,
        user.companyId ?? null,
        input,
      );

      return HttpResponse(c).created(
        track,
        "Track berhasil dikirim untuk review",
      );
    } catch (error: any) {
      if (error?.message?.includes("duplicate")) {
        return HttpResponse(c).conflict(error.message);
      }
      return HttpResponse(c).internalError(error);
    }
  }

  public async approve(c: AppContext) {
    try {
      const user = getUser(c);
      const authResponse = await personalContextValidate(user, c);
      if (authResponse) return authResponse;

      const params = c.params as { id: string };
      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const track = await TrackCatalogService.approve(
        params.id,
        user.companyMemberId ?? null,
        user.companyId ?? null,
        user.id,
      );

      if (!track) return HttpResponse(c).notFound("Track tidak ditemukan");
      return HttpResponse(c).ok(track, undefined, "Track berhasil disetujui");
    } catch (error: any) {
      if (error?.message?.includes("sudah berstatus")) {
        return HttpResponse(c).badRequest(error.message);
      }
      return HttpResponse(c).internalError(error);
    }
  }

  public async reject(c: AppContext) {
    try {
      const user = getUser(c);
      const authResponse = await personalContextValidate(user, c);
      if (authResponse) return authResponse;

      const params = c.params as { id: string };
      const input = c.body as ReviewBody;
      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const track = await TrackCatalogService.reject(
        params.id,
        user.companyMemberId ?? null,
        user.companyId ?? null,
        user.id,
        { rejectionReason: input?.rejectionReason },
      );

      if (!track) return HttpResponse(c).notFound("Track tidak ditemukan");
      return HttpResponse(c).ok(track, undefined, "Track berhasil ditolak");
    } catch (error: any) {
      if (error?.message?.includes("sudah berstatus")) {
        return HttpResponse(c).badRequest(error.message);
      }
      return HttpResponse(c).internalError(error);
    }
  }

  public async remove(c: AppContext) {
    try {
      const user = getUser(c);
      const authResponse = await personalContextValidate(user, c);
      if (authResponse) return authResponse;

      const params = c.params as { id: string };
      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const result = await TrackCatalogService.remove(
        params.id,
        user.companyMemberId ?? null,
        user.id,
        user.companyId ?? null,
      );

      if (!result) return HttpResponse(c).notFound("Track tidak ditemukan");
      return HttpResponse(c).ok(result, undefined, "Track berhasil dihapus");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
}

export default new TrackCatalogController();
