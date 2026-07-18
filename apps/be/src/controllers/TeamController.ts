import TeamService from '@/service/TeamService';
import { HttpResponse } from '@/http';
import { getUser } from '@/utils/authTokens';
import { memberContextValidate, paramsValidate } from '@/validation/auth.validate';
import type { AppContext } from '@/contex';
import type { PickCreateTeam, PickUpdateTeam, PickAddTeamMember } from '@repo/types/team.types';
import type { PickInviteMember } from '@repo/types/workstation.types';
import { isTransportResponse } from '@/utils/transportResponse';

class TeamController {
  public async list(c: AppContext) {
    try {
      const user = getUser(c);
      const page =
        Number((c.query as any)?.page) || Number((c.params as any)?.page) || Number(c.params) || 1;
      const limit = Number(c.query.limit) || 10;

      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const query = c.query as { departmentId?: string };
      const result = await TeamService.list(user.companyId!, query.departmentId, page, limit);
      return HttpResponse(c).ok(result.data, result.meta, 'Berhasil mengambil daftar tim');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async create(c: AppContext) {
    try {
      const user = getUser(c);
      const body = c.body as PickCreateTeam;
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const data = await TeamService.create(user.companyId!, body);
      return HttpResponse(c).created(data, 'Tim berhasil dibuat');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Gagal membuat tim';
      return HttpResponse(c).badRequest(msg);
    }
  }

  public async update(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const body = c.body as PickUpdateTeam;
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await TeamService.update(params.id, user.companyId!, body);
      if (!data) return HttpResponse(c).notFound('Tim tidak ditemukan');

      return HttpResponse(c).ok(data, 'Tim berhasil diperbarui');
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

      const data = await TeamService.remove(params.id, user.companyId!);
      if (!data) return HttpResponse(c).notFound('Tim tidak ditemukan');

      return HttpResponse(c).ok(data, 'Tim berhasil dihapus');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async listMembers(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const page = Number((c.query as any)?.page) || Number((c.params as any)?.page) || 1;
      const limit = Number(c.query.limit) || 10;

      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const result = await TeamService.listMembers(params.id, user.companyId!, page, limit);
      if (!result) return HttpResponse(c).notFound('Tim tidak ditemukan');

      return HttpResponse(c).ok(result.data, result.meta, 'Berhasil mengambil daftar anggota tim');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async addMember(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const body = c.body as PickAddTeamMember;
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await TeamService.addMember(params.id, user.companyId!, body);
      return HttpResponse(c).created(data, 'Anggota berhasil ditambahkan ke tim');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Gagal menambah anggota tim';
      return HttpResponse(c).badRequest(msg);
    }
  }

  public async removeMember(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string; memberId: string };
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await TeamService.removeMember(params.id, params.memberId, user.companyId!);
      if (!data) return HttpResponse(c).notFound('Anggota tim tidak ditemukan');

      return HttpResponse(c).ok(data, 'Anggota berhasil dihapus dari tim');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
  public async inviteMember(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const body = c.body as PickInviteMember;

      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;
      const validateParams = await paramsValidate(params.id, c);

      if (validateParams) return validateParams;

      if (!user.companyId) {
        return HttpResponse(c).notFound('Company tidak ditemukan');
      }

      const queryService = await TeamService.inviteMember(params.id, user.companyId, body);

      if (!queryService) {
        return HttpResponse(c).badRequest();
      }

      if (isTransportResponse(queryService))
        return HttpResponse(c).ok(queryService, 'Karyawan berhasil diinvite ke workstation');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
}

export default new TeamController();
