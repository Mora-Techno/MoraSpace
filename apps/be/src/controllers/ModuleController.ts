import ModuleService from '@/service/ModuleService';
import { HttpResponse } from '@/http';
import type { AppContext } from '@/contex';
import type { ModuleQuery, PickCreateModule, PickUpdateModule } from '@repo/types/module.types';
import { paramsValidate, personalContextValidate } from '@/validation/auth.validate';
import { getUser } from '@/utils/authTokens';

class ModuleController {
  public async list(c: AppContext) {
    try {
      const user = getUser(c);

      const authResponse = await personalContextValidate(user, c);
      if (authResponse) return authResponse;

      const modules = await ModuleService.list(
        user.companyId ?? null,
        user.id,
        c.query as ModuleQuery,
      );

      return HttpResponse(c).ok(modules, undefined, 'Berhasil mengambil daftar modul');
    } catch (error) {
      console.error(error);
      return HttpResponse(c).internalError(error);
    }
  }

  public async getById(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };

      const authResponse = await personalContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const moduleItem = await ModuleService.getById(params.id, user.companyId ?? null, user.id);

      return HttpResponse(c).ok(moduleItem, undefined, 'Berhasil mengambil detail modul');
    } catch (error: any) {
      if (error?.message === 'Modul tidak ditemukan') {
        return HttpResponse(c).notFound(error.message);
      }
      return HttpResponse(c).internalError(error);
    }
  }

  public async create(c: AppContext) {
    try {
      const user = getUser(c);
      const input = c.body as PickCreateModule;

      const authResponse = await personalContextValidate(user, c);
      if (authResponse) return authResponse;

      if (!input?.name || !input.name.trim()) {
        return HttpResponse(c).badRequest('Nama modul wajib diisi');
      }

      if (!input?.type) {
        return HttpResponse(c).badRequest('Tipe modul (TASK, TODO, NOTE) wajib diisi');
      }

      const created = await ModuleService.create(
        user.companyId ?? null,
        user.companyMemberId ?? null,
        user.id,
        user.companyRole ?? undefined,
        input,
      );

      return HttpResponse(c).created(created, 'Modul berhasil dibuat');
    } catch (error: any) {
      if (error?.message?.includes('Hanya Owner')) {
        return HttpResponse(c).forbidden(error.message);
      }
      return HttpResponse(c).internalError(error);
    }
  }

  public async update(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const input = c.body as PickUpdateModule;

      const authResponse = await personalContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const updated = await ModuleService.update(
        params.id,
        user.companyId ?? null,
        user.id,
        user.companyRole ?? undefined,
        input,
      );

      return HttpResponse(c).ok(updated, undefined, 'Modul berhasil diperbarui');
    } catch (error: any) {
      if (error?.message === 'Modul tidak ditemukan') {
        return HttpResponse(c).notFound(error.message);
      }
      if (error?.message?.includes('Hanya Owner')) {
        return HttpResponse(c).forbidden(error.message);
      }
      return HttpResponse(c).internalError(error);
    }
  }

  public async delete(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };

      const authResponse = await personalContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const result = await ModuleService.delete(
        params.id,
        user.companyId ?? null,
        user.id,
        user.companyRole ?? undefined,
      );

      return HttpResponse(c).ok(result, undefined, 'Modul berhasil dihapus');
    } catch (error: any) {
      if (error?.message === 'Modul tidak ditemukan') {
        return HttpResponse(c).notFound(error.message);
      }
      if (error?.message?.includes('Hanya Owner')) {
        return HttpResponse(c).forbidden(error.message);
      }
      return HttpResponse(c).internalError(error);
    }
  }
}

export default new ModuleController();
