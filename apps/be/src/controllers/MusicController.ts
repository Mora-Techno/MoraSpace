import MusicService from "@/service/MusicService";
import { HttpResponse } from "@/http";
import type { AppContext } from "@/contex";
import type { PickCreatePlaylist } from "@repo/types/music.types";
import {
  paramsValidate,
  personalContextValidate,
} from "@/validation/auth.validate";
import { CreateMusicValidate } from "@/validation/music.validate";
import { getUser } from "@/utils/authTokens";

class MusicController {
  public async list(c: AppContext) {
    try {
      const user = getUser(c);

      const authRespone = await personalContextValidate(user, c);
      if (authRespone) return authRespone;

      const queryService = await MusicService.list(
        user.companyMemberId ?? null,
        user.id,
        c.query as any,
      );

      if (!queryService) {
        return HttpResponse(c).badRequest();
      }
      return HttpResponse(c).ok(
        queryService.data,
        queryService.meta,
        "Berhasil mengambil daftar playlist",
      );
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async create(c: AppContext) {
    try {
      const user = getUser(c);
      const input = c.body as PickCreatePlaylist;

      const authRespone = await personalContextValidate(user, c);
      if (authRespone) return authRespone;

      const validateRespone = await CreateMusicValidate(c, input);
      if (validateRespone) return validateRespone;

      const queryService = await MusicService.create(
        user.companyMemberId ?? null,
        user.id,
        input,
      );
      if (!queryService) {
        return HttpResponse(c).badRequest();
      }
      return HttpResponse(c).created(
        queryService,
        "Playlist berhasil ditambahkan",
      );
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async remove(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };

      const authRespone = await personalContextValidate(user, c);
      if (authRespone) return authRespone;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const queryService = await MusicService.remove(
        params.id,
        user.companyMemberId ?? null,
        user.id,
      );
      if (!queryService)
        return HttpResponse(c).notFound("Playlist tidak ditemukan");

      return HttpResponse(c).ok(
        queryService,
        undefined,
        "Playlist berhasil dihapus",
      );
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
}

export default new MusicController();
