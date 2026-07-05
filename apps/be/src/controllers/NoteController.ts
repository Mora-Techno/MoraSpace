import NoteService from '@/service/NoteService';
import { HttpResponse } from '@/http';
import type { AppContext } from '@/contex';
import type { PickCreateNote, PickUpdateNote } from '@repo/types/note.types';
import { JwtPayload } from '@repo/types/auth.types';
import { paramsValidate, memberContextValidate } from '@/validation/auth.validate';
import { CreateNoteValidation } from '@/validation/note.validate';

class NoteController {
  public async list(c: AppContext) {
    try {
      const user = c.user as JwtPayload;

      const authRespone = await memberContextValidate(user, c);
      if (authRespone) return authRespone;

      const data = await NoteService.list(user.companyMemberId!);

      if (!data) {
        return HttpResponse(c).badRequest();
      }

      return HttpResponse(c).ok(data, 'Berhasil mengambil daftar catatan');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async getById(c: AppContext) {
    try {
      const user = c.user as JwtPayload;
      const params = c.params as { id: string };

      const authRespone = await memberContextValidate(user, c);
      if (authRespone) return authRespone;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await NoteService.getById(params.id, user.companyMemberId!);
      if (!data) return HttpResponse(c).notFound('Catatan tidak ditemukan');
      return HttpResponse(c).ok(data, 'Berhasil mengambil detail catatan');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async create(c: AppContext) {
    try {
      const user = c.user as JwtPayload;
      const input = c.body as PickCreateNote;

      const authRespone = await memberContextValidate(user, c);
      if (authRespone) return authRespone;

      const validateRespone = await CreateNoteValidation(c, input);
      if (validateRespone) return validateRespone;

      const data = await NoteService.create(user.companyMemberId!, input);
      if (!data) {
        return HttpResponse(c).badRequest();
      }
      return HttpResponse(c).created(data, 'Catatan berhasil disimpan');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async update(c: AppContext) {
    try {
      const user = c.user as JwtPayload;
      const params = c.params as { id: string };

      const authRespone = await memberContextValidate(user, c);
      if (authRespone) return authRespone;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const input = c.body as PickUpdateNote;

      const data = await NoteService.update(params.id, user.companyMemberId!, input);
      if (!data) return HttpResponse(c).notFound('Catatan tidak ditemukan');
      return HttpResponse(c).ok(data, 'Catatan berhasil diperbarui');
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

      const data = await NoteService.remove(params.id, user.companyMemberId!);
      if (!data) return HttpResponse(c).notFound('Catatan tidak ditemukan');
      return HttpResponse(c).ok(data, 'Catatan berhasil dihapus');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
}

export default new NoteController();
