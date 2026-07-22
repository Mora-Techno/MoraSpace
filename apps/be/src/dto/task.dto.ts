import { t } from "elysia";
import { PaginationDto, SortDto, SearchDto } from "./filter.dto";

export const CreateTaskDto = t.Object({
  title: t.String({ minLength: 1, description: "Judul tugas" }),
  description: t.Optional(t.String({ description: "Deskripsi tugas" })),
  statusId: t.String({ format: "uuid", description: "ID status tugas" }),
  priorityId: t.Optional(
    t.String({ format: "uuid", description: "ID prioritas tugas" }),
  ),
  startDate: t.Optional(
    t.String({ format: "date-time", description: "Tanggal mulai" }),
  ),
  dueDate: t.Optional(
    t.String({ format: "date-time", description: "Tenggat waktu" }),
  ),
  estimatedMinutes: t.Optional(
    t.Numeric({ description: "Estimasi waktu dalam menit" }),
  ),
  assigneeIds: t.Optional(
    t.Array(t.String({ format: "uuid" }), {
      description: "Daftar ID assignee",
    }),
  ),
});

export const UpdateTaskDto = t.Object({
  title: t.Optional(
    t.String({ minLength: 1, description: "Judul tugas baru" }),
  ),
  description: t.Optional(
    t.Nullable(t.String({ description: "Deskripsi tugas baru" })),
  ),
  statusId: t.Optional(
    t.String({ format: "uuid", description: "ID status tugas baru" }),
  ),
  priorityId: t.Optional(
    t.Nullable(t.String({ format: "uuid", description: "ID prioritas baru" })),
  ),
  startDate: t.Optional(
    t.Nullable(
      t.String({ format: "date-time", description: "Tanggal mulai baru" }),
    ),
  ),
  dueDate: t.Optional(
    t.Nullable(
      t.String({ format: "date-time", description: "Tenggat waktu baru" }),
    ),
  ),
  estimatedMinutes: t.Optional(
    t.Nullable(t.Numeric({ description: "Estimasi waktu baru" })),
  ),
  assigneeIds: t.Optional(
    t.Array(t.String({ format: "uuid" }), {
      description: "Daftar ID assignee baru",
    }),
  ),
});

export const TaskQueryDto = t.Object({
  ...SearchDto.properties,
  ...PaginationDto.properties,
  ...SortDto.properties,
  statusId: t.Optional(
    t.String({
      format: "uuid",
      description: "Filter berdasarkan status tugas",
    }),
  ),
  priorityId: t.Optional(
    t.String({ format: "uuid", description: "Filter berdasarkan prioritas" }),
  ),
  assigneeId: t.Optional(
    t.String({
      format: "uuid",
      description: "Filter berdasarkan penanggung jawab (memberId)",
    }),
  ),
  reporterMemberId: t.Optional(
    t.String({
      format: "uuid",
      description: "Filter berdasarkan pelapor (memberId)",
    }),
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

export const TaskParamsDto = t.Object({
  id: t.String({ format: "uuid", description: "ID tugas" }),
});

export const AssignTaskDto = t.Object({
  assigneeIds: t.Array(t.String({ format: "uuid" }), {
    description: "Daftar ID assignee",
  }),
});

export const UpdateTaskStatusDto = t.Object({
  statusId: t.String({ format: "uuid", description: "ID status baru" }),
});

export const AddTaskCommentDto = t.Object({
  content: t.String({ minLength: 1, description: "Isi komentar" }),
});

export const CreateTaskChecklistDto = t.Object({
  title: t.String({ minLength: 1, description: "Judul checklist atau item" }),
  items: t.Optional(
    t.Array(t.String(), { description: "Daftar item checklist" }),
  ),
});

export const AddTaskAttachmentDto = t.Object({
  fileName: t.String({ minLength: 1, description: "Nama file" }),
  fileUrl: t.String({ minLength: 1, description: "URL file lampiran" }),
  fileSize: t.Numeric({ description: "Ukuran file dalam byte" }),
});
