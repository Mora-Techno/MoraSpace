import { t } from "elysia";
import { PaginationDto, SearchDto } from "./filter.dto";

export const StartPomodoroDto = t.Object({
  metadata: t.Optional(
    t.Record(t.String(), t.Any(), { description: "Metadata sesi pomodoro" }),
  ),
});

export const StopPomodoroDto = t.Object({
  sessionId: t.Optional(
    t.String({ format: "uuid", description: "ID sesi pomodoro" }),
  ),
  duration: t.Optional(
    t.Numeric({ description: "Durasi fokus dalam detik/menit" }),
  ),
});

export const PomodoroQueryDto = t.Object({
  ...SearchDto.properties,
  ...PaginationDto.properties,
  status: t.Optional(
    t.Union(
      [t.Literal("active"), t.Literal("completed"), t.Literal("cancelled")],
      {
        description: "Filter berdasarkan status sesi",
      },
    ),
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
