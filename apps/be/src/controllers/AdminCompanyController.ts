import AdminCompanyService, { type CreateCompanyAdminInput } from '@/service/AdminCompanyService';
import { HttpResponse } from '@/http';
import type { PickUpdateCompanySubscription } from '@repo/types/company.types';
import type { AppContext } from '@/contex';

/** v0.0.1 Layer 1 — route sudah di-guard SUPER_ADMIN, controller tetap tipis. */
class AdminCompanyController {
  public async list(c: AppContext) {
    try {
      const result = await AdminCompanyService.list(c.query as any);
      return HttpResponse(c).ok(result.data, result.meta, 'Berhasil mengambil daftar company');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async create(c: AppContext) {
    try {
      const data = await AdminCompanyService.create(c.body as CreateCompanyAdminInput);
      return HttpResponse(c).created(data, 'Company berhasil dibuat');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async suspend(c: AppContext) {
    try {
      const params = c.params as { id: string };
      const data = await AdminCompanyService.suspend(params.id);
      return HttpResponse(c).ok(data, undefined, 'Company di-suspend');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async activate(c: AppContext) {
    try {
      const params = c.params as { id: string };
      const data = await AdminCompanyService.activate(params.id);
      return HttpResponse(c).ok(data, undefined, 'Company diaktifkan');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async setPlan(c: AppContext) {
    try {
      const params = c.params as { id: string };
      const data = await AdminCompanyService.setPlan(
        params.id,
        c.body as PickUpdateCompanySubscription,
      );
      return HttpResponse(c).ok(data, undefined, 'Plan company diperbarui');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
}

export default new AdminCompanyController();
