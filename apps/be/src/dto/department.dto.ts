import { t } from "elysia";
import { PaginationDto, SortDto, SearchDto } from "./filter.dto";

export const CreateDepartmentDto = t.Object({
  name: t.String({ minLength: 1, description: "Nama departemen" }),
  description: t.Optional(t.String({ description: "Deskripsi departemen" })),
  managerId: t.Optional(
    t.String({ format: "uuid", description: "ID manajer (user ID)" }),
  ),
});

export const UpdateDepartmentDto = t.Object({
  name: t.Optional(
    t.String({ minLength: 1, description: "Nama departemen baru" }),
  ),
  description: t.Optional(
    t.Nullable(t.String({ description: "Deskripsi departemen baru" })),
  ),
  managerId: t.Optional(
    t.Nullable(t.String({ format: "uuid", description: "ID manajer baru" })),
  ),
});

export const DepartmentQueryDto = t.Object({
  ...SearchDto.properties,
  ...PaginationDto.properties,
  ...SortDto.properties,
  managerId: t.Optional(
    t.String({
      format: "uuid",
      description: "Filter berdasarkan manajer (user ID)",
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

export const DepartmentParamsDto = t.Object({
  id: t.String({ format: "uuid", description: "ID departemen" }),
});
