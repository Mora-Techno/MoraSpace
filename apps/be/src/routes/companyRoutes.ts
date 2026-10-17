import Elysia from 'elysia';
import CompanyController from '@/controllers/CompanyController';
import {
  CompanyParamsDto,
  CompanyQueryDto,
  CreateAdminDto,
  JoinCompanyDto,
  JoinCompanyParamsDto,
  PresignLogoDto,
  RegisterCompanyDto,
  UpdateCompanyProfileDto,
  UpdateCompanySettingsDto,
  UpdateSubscriptionDto,
} from '@/dto/company.dto';
import type { AppContext } from '@/contex';
import { requireRole, verifyToken } from '@/middlewares/auth';

class CompanyRouter {
  public companyRouter;

  constructor() {
    this.companyRouter = new Elysia({
      prefix: '/companies',
      tags: ['Companies'],
    });
    this.routes();
  }

  private routes() {
    this.companyRouter.post('/register', (c: AppContext) => CompanyController.register(c), {
      body: RegisterCompanyDto,

      detail: {
        summary: 'Daftar company + leader',
        description:
          'Membuat company baru beserta akun leader. Tier default: free (max 4 user/workstation).',
        tags: ['Companies'],
      },
    });

    this.companyRouter.post('/admins', (c: AppContext) => CompanyController.createAdmin(c), {
      body: CreateAdminDto,
      beforeHandle: [verifyToken().beforeHandle, requireRole(['Owner']).beforeHandle],
      detail: {
        summary: 'Buat akun admin',
        description: 'Leader membuat akun admin untuk mengelola workstation.',
        tags: ['Companies'],
      },
    });
    this.companyRouter.delete('/admins/:id', (c: AppContext) => CompanyController.deleteAdmin(c), {
      params: CompanyParamsDto,
      beforeHandle: [verifyToken().beforeHandle, requireRole(['Owner']).beforeHandle],
      detail: {
        summary: 'Berhasil Delete',
        description: 'Leader menghapus admin',
        tags: ['Companies'],
      },
    });
    this.companyRouter.get('/admins', (c: AppContext) => CompanyController.listAdmins(c), {
      query: CompanyQueryDto,
      beforeHandle: [verifyToken().beforeHandle, requireRole(['Owner']).beforeHandle],
      detail: {
        summary: 'Daftar admin company',
        tags: ['Companies'],
      },
    });
    this.companyRouter.get('/me', (c: AppContext) => CompanyController.getProfile(c), {
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: 'Profil company saat ini',
        tags: ['Companies'],
      },
    });
    this.companyRouter.patch('/profile', (c: AppContext) => CompanyController.updateProfile(c), {
      body: UpdateCompanyProfileDto,
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: 'Update logo & country perusahaan',
        description: 'Memperbarui logo URL dan/atau negara perusahaan.',
        tags: ['Companies'],
      },
    });
    this.companyRouter.post('/logo/presign', (c: AppContext) => CompanyController.presignLogo(c), {
      body: PresignLogoDto,
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: 'Presign upload logo (R2)',
        description: 'Terbitkan URL PUT presigned 5 menit; browser upload langsung ke R2.',
        tags: ['Companies'],
      },
    });
    this.companyRouter.patch(
      '/subscription',
      (c: AppContext) => CompanyController.updateSubscription(c),
      {
        body: UpdateSubscriptionDto,
        beforeHandle: [verifyToken().beforeHandle, requireRole(['Owner']).beforeHandle],
        detail: {
          summary: 'Upgrade/downgrade langganan',
          description: 'Leader mengubah tier (free/pro/enterprise). Pro = max 8 user/workstation.',
          tags: ['Companies'],
        },
      },
    );
    this.companyRouter.get('/settings', (c: AppContext) => CompanyController.getSettings(c), {
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: 'Pengaturan working hours perusahaan',
        tags: ['Companies'],
      },
    });
    this.companyRouter.patch('/settings', (c: AppContext) => CompanyController.updateSettings(c), {
      body: UpdateCompanySettingsDto,
      beforeHandle: [verifyToken().beforeHandle, requireRole(['Owner']).beforeHandle],
      detail: {
        summary: 'Ubah working hours (Owner)',
        tags: ['Companies'],
      },
    });

    this.companyRouter.get('/join-code', (c: AppContext) => CompanyController.getJoinCode(c), {
      beforeHandle: [verifyToken().beforeHandle, requireRole(['Owner']).beforeHandle],
      detail: {
        summary: 'Ambil kode undangan & QR perusahaan',
        tags: ['Companies'],
      },
    });

    this.companyRouter.post(
      '/join-code/regenerate',
      (c: AppContext) => CompanyController.regenerateJoinCode(c),
      {
        beforeHandle: [verifyToken().beforeHandle, requireRole(['Owner']).beforeHandle],
        detail: {
          summary: 'Buat ulang kode undangan perusahaan',
          tags: ['Companies'],
        },
      },
    );

    this.companyRouter.get(
      '/join/preview/:code',
      (c: AppContext) => CompanyController.previewJoinCode(c),
      {
        params: JoinCompanyParamsDto,
        detail: {
          summary: 'Pratinjau perusahaan sebelum bergabung via kode',
          tags: ['Companies'],
        },
      },
    );

    this.companyRouter.post('/join', (c: AppContext) => CompanyController.join(c), {
      body: JoinCompanyDto,
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: 'Bergabung ke perusahaan menggunakan kode undangan / QR',
        tags: ['Companies'],
      },
    });
  }
}

export default new CompanyRouter().companyRouter;
