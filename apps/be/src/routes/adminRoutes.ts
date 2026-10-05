import Elysia from 'elysia';
import AdminCompanyController from '@/controllers/AdminCompanyController';
import {
  CompanyParamsDto,
  CompanyQueryDto,
  CreateCompanyAdminDto,
  UpdateSubscriptionDto,
} from '@/dto/company.dto';
import type { AppContext } from '@/contex';
import { verifyToken } from '@/middlewares/auth';
import { requirePlatformRole } from '@/middlewares/platformRole';

const superAdminOnly = [
  verifyToken().beforeHandle,
  requirePlatformRole(['SUPER_ADMIN']).beforeHandle,
];

/** v0.0.1 Layer 1 — Super Admin ops (prefix /admin). */
class AdminRouter {
  public adminRouter;

  constructor() {
    this.adminRouter = new Elysia({
      prefix: '/admin/companies',
      tags: ['Admin'],
    });
    this.routes();
  }

  private routes() {
    this.adminRouter.get('/', (c: AppContext) => AdminCompanyController.list(c), {
      query: CompanyQueryDto,
      beforeHandle: superAdminOnly,
      detail: {
        summary: 'Daftar company (Super Admin)',
        tags: ['Admin'],
      },
    });
    this.adminRouter.post('/', (c: AppContext) => AdminCompanyController.create(c), {
      body: CreateCompanyAdminDto,
      beforeHandle: superAdminOnly,
      detail: {
        summary: 'Buat company manual (Super Admin)',
        tags: ['Admin'],
      },
    });
    this.adminRouter.patch('/:id/suspend', (c: AppContext) => AdminCompanyController.suspend(c), {
      params: CompanyParamsDto,
      beforeHandle: superAdminOnly,
      detail: {
        summary: 'Suspend company (Super Admin)',
        tags: ['Admin'],
      },
    });
    this.adminRouter.patch('/:id/activate', (c: AppContext) => AdminCompanyController.activate(c), {
      params: CompanyParamsDto,
      beforeHandle: superAdminOnly,
      detail: {
        summary: 'Aktifkan company (Super Admin)',
        tags: ['Admin'],
      },
    });
    this.adminRouter.patch('/:id/plan', (c: AppContext) => AdminCompanyController.setPlan(c), {
      params: CompanyParamsDto,
      body: UpdateSubscriptionDto,
      beforeHandle: superAdminOnly,
      detail: {
        summary: 'Set plan manual (Super Admin)',
        tags: ['Admin'],
      },
    });
  }
}

export default new AdminRouter().adminRouter;
