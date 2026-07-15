import InvitationService from '@/service/InvitationService';
import { HttpResponse } from '@/http';
import { getUser } from '@/utils/authTokens';
import {
  memberContextValidate,
  paramsValidate,
  unauthorizedValidate,
} from '@/validation/auth.validate';
import type { AppContext } from '@/contex';
import type {
  PickCreateInvitation,
  PickAcceptInvitation,
  PickRejectInvitation,
} from '@repo/types/invitation.types';

class InvitationController {
  public async list(c: AppContext) {
    try {
      const user = getUser(c);
      const page =
        Number((c.query as any)?.page) || Number((c.params as any)?.page) || Number(c.params) || 1;
      const limit = Number(c.query.limit) || 10;

      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const result = await InvitationService.list(user.companyId!, page, limit);
      return HttpResponse(c).ok(result.data, result.meta, 'Berhasil mengambil daftar undangan');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async create(c: AppContext) {
    try {
      const user = getUser(c);
      const body = c.body as PickCreateInvitation;
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const data = await InvitationService.create(user.companyId!, user.id, body);
      return HttpResponse(c).created(data, 'Undangan berhasil dikirim');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async accept(c: AppContext) {
    try {
      const user = getUser(c);
      const body = c.body as PickAcceptInvitation;
      const authResponse = await unauthorizedValidate(user, c);
      if (authResponse) return authResponse;

      const data = await InvitationService.accept(body.token, user.id);
      return HttpResponse(c).ok(data, 'Undangan berhasil diterima, selamat bergabung!');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Gagal menerima undangan';
      return HttpResponse(c).badRequest(msg);
    }
  }

  public async reject(c: AppContext) {
    try {
      const body = c.body as PickRejectInvitation;
      const data = await InvitationService.reject(body.token);
      if (!data) return HttpResponse(c).notFound('Undangan tidak ditemukan atau sudah diproses');

      return HttpResponse(c).ok(data, 'Undangan berhasil ditolak');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async remove(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await InvitationService.remove(params.id, user.companyId!);
      if (!data) return HttpResponse(c).notFound('Undangan tidak ditemukan');

      return HttpResponse(c).ok(data, 'Undangan berhasil dibatalkan/dihapus');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
}

export default new InvitationController();
