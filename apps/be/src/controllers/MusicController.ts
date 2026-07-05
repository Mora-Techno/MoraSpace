import MusicService from '@/service/MusicService';
import { HttpResponse } from '@/http';
import type { AppContext } from '@/contex';
import type { PickCreatePlaylist } from '@repo/types/music.types';
import { JwtPayload } from '@repo/types/auth.types';
import { paramsValidate, memberContextValidate } from '@/validation/auth.validate';
import { CreateMusicValidate } from '@/validation/music.validate';

class MusicController {
  public async list(c: AppContext) {
    try {
      const user = c.user as JwtPayload;

      const authRespone = await memberContextValidate(user, c);
      if (authRespone) return authRespone;

      const data = await MusicService.list(user.companyMemberId!);

      if (!data) {
        return HttpResponse(c).badRequest();
      }
      return HttpResponse(c).ok(data, 'Berhasil mengambil daftar playlist');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async create(c: AppContext) {
    try {
      const user = c.user as JwtPayload;
      const input = c.body as PickCreatePlaylist;

      const authRespone = await memberContextValidate(user, c);
      if (authRespone) return authRespone;

      const validateRespone = await CreateMusicValidate(c, input);
      if (validateRespone) return validateRespone;

      const data = await MusicService.create(user.companyMemberId!, input);
      if (!data) {
        return HttpResponse(c).badRequest();
      }
      return HttpResponse(c).created(data, 'Playlist berhasil ditambahkan');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async remove(c: AppContext) {
    try {
      const user = c.user as JwtPayload;
      const params = c.params as { id: string };

      const authRespone = await memberContextValidate(user, c);
      if (authRespone) return authRespone;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await MusicService.remove(params.id, user.companyMemberId!);
      if (!data) return HttpResponse(c).notFound('Playlist tidak ditemukan');
      return HttpResponse(c).ok(data, undefined, 'Playlist berhasil dihapus');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
}

export default new MusicController();
