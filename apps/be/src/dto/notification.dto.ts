import { t } from "elysia";
import { PaginationDto, SearchDto } from "./filter.dto";

export const SendNotificationDto = t.Object({
  recipient: t.String({
    format: "email",
    description: "Alamat email penerima",
  }),
  subject: t.String({ minLength: 1, description: "Subjek email" }),
  body: t.String({ minLength: 1, description: "Isi email" }),
});

export const NotificationLogQueryDto = t.Object({
  ...SearchDto.properties,
  status: t.Optional(
    t.Union([t.Literal("success"), t.Literal("failed")], {
      description: "Filter berdasarkan status pengiriman",
    }),
  ),
  ...PaginationDto.properties,
  type: t.Optional(
    t.String({ description: "Filter berdasarkan tipe notifikasi" }),
  ),
  startDate: t.Optional(
    t.String({
      format: "date-time",
      description: "Filter tanggal mulai (ISO 8601)",
    }),
  ),
  endDate: t.Optional(
    t.String({
      format: "date-time",
      description: "Filter tanggal akhir (ISO 8601)",
    }),
  ),
});

export const NotificationInAppQueryDto = t.Object({
  ...SearchDto.properties,
  ...PaginationDto.properties,
  read: t.Optional(
    t.Union([t.Literal("true"), t.Literal("false")], {
      description: "Filter berdasarkan status baca (true/false)",
    }),
  ),
  type: t.Optional(
    t.String({ description: "Filter berdasarkan tipe notifikasi" }),
  ),
  startDate: t.Optional(
    t.String({
      format: "date-time",
      description: "Filter tanggal mulai (ISO 8601)",
    }),
  ),
  endDate: t.Optional(
    t.String({
      format: "date-time",
      description: "Filter tanggal akhir (ISO 8601)",
    }),
  ),
});

export const NotificationQueueQueryDto = t.Object({
  ...PaginationDto.properties,
  status: t.Optional(
    t.Union(
      [t.Literal("pending"), t.Literal("processing"), t.Literal("failed")],
      {
        description: "Filter berdasarkan status antrian",
      },
    ),
  ),
});

export const NotificationParamsDto = t.Object({
  id: t.String({ format: "uuid", description: "ID notifikasi" }),
});
