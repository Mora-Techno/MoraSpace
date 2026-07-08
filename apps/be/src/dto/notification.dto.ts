import { t } from 'elysia';

export const SendNotificationDto = t.Object({
  recipient: t.String({
    format: 'email',
    description: 'Alamat email penerima',
  }),
  subject: t.String({ minLength: 1, description: 'Subjek email' }),
  body: t.String({ minLength: 1, description: 'Isi email' }),
});

export const NotificationLogQueryDto = t.Object({
  status: t.Optional(
    t.Union([t.Literal('success'), t.Literal('failed')], {
      description: 'Filter berdasarkan status pengiriman',
    }),
  ),
  limit: t.Optional(
    t.Numeric({
      minimum: 1,
      maximum: 100,
      description: 'Jumlah log (default: 20)',
    }),
  ),
});

export const NotificationParamsDto = t.Object({
  id: t.String({ format: 'uuid', description: 'ID notifikasi' }),
});
