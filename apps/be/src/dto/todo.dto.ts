import { t } from "elysia";
import { PaginationDto, SortDto, SearchDto } from "./filter.dto";

export const TodoStatusEnum = t.Union([
  t.Literal("pending"),
  t.Literal("completed"),
]);

export const CreateTodoDto = t.Object({
  text: t.String({ minLength: 1, description: "Teks tugas" }),
  dueDate: t.Optional(
    t.String({ format: "date-time", description: "Tenggat waktu (ISO 8601)" }),
  ),
});

export const UpdateTodoDto = t.Object({
  text: t.Optional(t.String({ minLength: 1, description: "Teks tugas baru" })),
  status: t.Optional(TodoStatusEnum),
  dueDate: t.Optional(
    t.Nullable(
      t.String({
        format: "date-time",
        description: "Tenggat waktu (ISO 8601)",
      }),
    ),
  ),
});

export const TodoQueryDto = t.Object({
  ...SearchDto.properties,
  ...PaginationDto.properties,
  ...SortDto.properties,
  status: t.Optional(
    t.Union([t.Literal("pending"), t.Literal("completed")], {
      description: "Filter berdasarkan status tugas",
    }),
  ),
  date: t.Optional(
    t.Literal("today", { description: "Filter tugas dengan tenggat hari ini" }),
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

export const TodoParamsDto = t.Object({
  id: t.String({ format: "uuid", description: "ID tugas" }),
});
