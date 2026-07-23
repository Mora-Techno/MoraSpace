import { t } from "elysia";
import { PaginationDto, SortDto, SearchDto } from "./filter.dto";

export const CreateEventDto = t.Object({
  title: t.String({ minLength: 1, description: "Judul jadwal" }),
  description: t.Optional(t.String({ description: "Deskripsi jadwal" })),
  startDate: t.String({
    format: "date-time",
    description: "Waktu mulai (ISO 8601)",
  }),
  endDate: t.Optional(
    t.String({ format: "date-time", description: "Waktu selesai (ISO 8601)" }),
  ),
});

export const UpdateEventDto = t.Object({
  title: t.Optional(t.String({ minLength: 1, description: "Judul jadwal" })),
  description: t.Optional(
    t.Nullable(t.String({ description: "Deskripsi jadwal" })),
  ),
  startDate: t.Optional(
    t.String({ format: "date-time", description: "Waktu mulai (ISO 8601)" }),
  ),
  endDate: t.Optional(
    t.Nullable(
      t.String({
        format: "date-time",
        description: "Waktu selesai (ISO 8601)",
      }),
    ),
  ),
});

export const EventQueryDto = t.Object({
  ...SearchDto.properties,
  month: t.Optional(
    t.String({ pattern: "^(0[1-9]|1[0-2])$", description: "Bulan (01-12)" }),
  ),
  year: t.Optional(
    t.String({ pattern: "^\\d{4}$", description: "Tahun (contoh: 2026)" }),
  ),
  ...PaginationDto.properties,
  ...SortDto.properties,
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
  createdBy: t.Optional(
    t.String({
      format: "uuid",
      description: "Filter berdasarkan pembuat (company member ID)",
    }),
  ),
});

export const EventParamsDto = t.Object({
  id: t.String({ format: "uuid", description: "ID event" }),
});
