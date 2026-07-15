import Elysia from 'elysia';
import NotificationController from '@/controllers/NotificationController';
import {
  NotificationLogQueryDto,
  NotificationParamsDto,
  SendNotificationDto,
} from '@/dto/notification.dto';
import type { AppContext } from '@/contex';
import { verifyToken } from '@/middlewares/auth';

class NotificationRouter {
  public notificationRouter;

  constructor() {
    this.notificationRouter = new Elysia({
      prefix: '/notifications',
      tags: ['Notifications'],
    });
    this.routes();
  }

  private routes() {
    this.notificationRouter.post('/send', (c: AppContext) => NotificationController.send(c), {
      body: SendNotificationDto,
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: 'Kirim notifikasi email',
        description:
          'Men-trigger pengiriman email secara manual atau digunakan oleh cron job internal backend via SMTP Gmail.',
        tags: ['Notifications'],
      },
    });
    this.notificationRouter.get('/logs', (c: AppContext) => NotificationController.listLogs(c), {
      query: NotificationLogQueryDto,
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: 'Riwayat notifikasi',
        description: 'Melihat riwayat notifikasi email yang sukses atau gagal dikirim oleh sistem.',
        tags: ['Notifications'],
      },
    });
    this.notificationRouter.get('/', (c: AppContext) => NotificationController.listInApp(c), {
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: 'Daftar notifikasi in-app',
        description:
          'Menampilkan semua notifikasi aplikasi (in-app notification) untuk pengguna saat ini.',
        tags: ['Notifications'],
      },
    });
    this.notificationRouter.patch(
      '/:id/read',
      (c: AppContext) => NotificationController.markRead(c),
      {
        params: NotificationParamsDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: 'Tandai notifikasi dibaca',
          description: 'Mengubah status satu notifikasi menjadi sudah dibaca.',
          tags: ['Notifications'],
        },
      },
    );
    this.notificationRouter.patch(
      '/read-all',
      (c: AppContext) => NotificationController.markAllRead(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: 'Tandai semua notifikasi dibaca',
          description: 'Mengubah status seluruh notifikasi yang belum dibaca menjadi sudah dibaca.',
          tags: ['Notifications'],
        },
      },
    );
    this.notificationRouter.get('/queue', (c: AppContext) => NotificationController.listQueue(c), {
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: 'Antrean notifikasi tertunda',
        description:
          'Menampilkan daftar antrean notifikasi (NotificationQueue) yang dijadwalkan atau tertunda.',
        tags: ['Notifications'],
      },
    });
  }
}

export default new NotificationRouter().notificationRouter;
