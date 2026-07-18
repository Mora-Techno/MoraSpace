import NoteService from '@/service/NoteService';
import { HttpResponse } from '@/http';
import type { AppContext } from '@/contex';
import type { PickCreateNote, PickUpdateNote } from '@repo/types/note.types';
import { JwtPayload } from '@repo/types/auth.types';
import { paramsValidate, memberContextValidate } from '@/validation/auth.validate';
import { CreateNoteValidation } from '@/validation/note.validate';
import { isTransportResponse } from '@/utils/transportResponse';
import { getUser } from '@/utils/authTokens';

class NoteController {
  public async list(c: AppContext) {
    try {
      const user = getUser(c);
      const page = Number(c.params) || 1;
      const limit = Number(c.query.limit) || 10;
      const authRespone = await memberContextValidate(user, c);
      if (authRespone) return authRespone;

      const queryService = await NoteService.list(user.companyMemberId!, page, limit);

      if (!queryService) {
        return HttpResponse(c).badRequest();
      }

      if (isTransportResponse(queryService))
        return HttpResponse(c).ok(
          queryService.data,
          queryService.meta,
          'Berhasil mengambil daftar catatan',
        );
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async getById(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };

      const authRespone = await memberContextValidate(user, c);
      if (authRespone) return authRespone;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const queryService = await NoteService.getById(params.id, user.companyMemberId!);
      if (!queryService) return HttpResponse(c).notFound('Catatan tidak ditemukan');

      if (isTransportResponse(queryService))
        return HttpResponse(c).ok(queryService, 'Berhasil mengambil detail catatan');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async create(c: AppContext) {
    try {
      const user = getUser(c);
      const input = c.body as PickCreateNote;

      const authRespone = await memberContextValidate(user, c);
      if (authRespone) return authRespone;

      const validateRespone = await CreateNoteValidation(c, input);
      if (validateRespone) return validateRespone;

      const queryService = await NoteService.create(user.companyMemberId!, input);
      if (!queryService) {
        return HttpResponse(c).badRequest();
      }
      if (isTransportResponse(queryService))
        return HttpResponse(c).created(queryService, 'Catatan berhasil disimpan');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async update(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };

      const authRespone = await memberContextValidate(user, c);
      if (authRespone) return authRespone;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const input = c.body as PickUpdateNote;

      const queryService = await NoteService.update(params.id, user.companyMemberId!, input);
      if (!queryService) return HttpResponse(c).notFound('Catatan tidak ditemukan');

      if (isTransportResponse(queryService))
        return HttpResponse(c).ok(queryService, 'Catatan berhasil diperbarui');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async remove(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };

      const authRespone = await memberContextValidate(user, c);
      if (authRespone) return authRespone;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const queryService = await NoteService.remove(params.id, user.companyMemberId!);

      if (!queryService) return HttpResponse(c).notFound('Catatan tidak ditemukan');
      if (isTransportResponse(queryService))
        return HttpResponse(c).ok(queryService, 'Catatan berhasil dihapus');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
}

export default new NoteController();
