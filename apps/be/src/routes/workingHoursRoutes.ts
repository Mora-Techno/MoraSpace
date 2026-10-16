import Elysia from 'elysia';
import WorkingHoursController from '@/controllers/WorkingHoursController';
import { WorkingHoursStatusQueryDto } from '@/dto/workingHours.dto';
import type { AppContext } from '@/contex';
import { requireRole, verifyToken } from '@/middlewares/auth';

class WorkingHoursRouter {
  public workingHoursRouter;

  constructor() {
    this.workingHoursRouter = new Elysia({
      prefix: '/companies/working-hours',
      tags: ['Working Hours'],
    });
    this.routes();
  }

  private routes() {
    this.workingHoursRouter.get('/status', (c: AppContext) => WorkingHoursController.getStatus(c), {
      query: WorkingHoursStatusQueryDto,
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: 'Status jam kerja anggota',
        description:
          'Mengembalikan status jam kerja ("working" / "out_of_hours") beserta label ramah ("Sedang kerja" / "Kembali [hari] [jam]").',
        tags: ['Working Hours'],
      },
    });

    this.workingHoursRouter.get('/quota', (c: AppContext) => WorkingHoursController.getQuota(c), {
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: 'Kuota pesan mendesak anggota',
        description: 'Melihat sisa jatah tombol Mendesak hari ini.',
        tags: ['Working Hours'],
      },
    });

    this.workingHoursRouter.get(
      '/metrics',
      (c: AppContext) => WorkingHoursController.getOwnerMetrics(c),
      {
        beforeHandle: [verifyToken().beforeHandle, requireRole(['Owner']).beforeHandle],
        detail: {
          summary: 'Ringkasan metrik jam kerja (Owner only)',
          description:
            'Melihat frekuensi pemakaian tombol mendesak dan pesan di luar jam kerja secara anonim.',
          tags: ['Working Hours'],
        },
      },
    );

    this.workingHoursRouter.post(
      '/app-opened',
      (c: AppContext) => WorkingHoursController.recordAppOpened(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: 'Pencatatan pembukaan app di luar jam kerja (Anonim)',
          description:
            'Mencatat metrik pembukaan aplikasi di luar jam kerja untuk evaluasi efektivitas produk.',
          tags: ['Working Hours'],
        },
      },
    );
  }
}

export default new WorkingHoursRouter().workingHoursRouter;
