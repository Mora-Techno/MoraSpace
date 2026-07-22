import { t } from "elysia";
import { PaginationDto, SortDto, SearchDto } from "./filter.dto";

export const CreateRoleDto = t.Object({
  name: t.String({ minLength: 1, description: "Nama role" }),
  description: t.Optional(t.String({ description: "Deskripsi role" })),
});

export const UpdateRoleDto = t.Object({
  name: t.Optional(t.String({ minLength: 1, description: "Nama role baru" })),
  description: t.Optional(
    t.Nullable(t.String({ description: "Deskripsi role baru" })),
  ),
});

export const RoleParamsDto = t.Object({
  id: t.String({ format: "uuid", description: "ID role atau permission" }),
});

export const RoleQueryDto = t.Object({
  ...SearchDto.properties,
  ...PaginationDto.properties,
  ...SortDto.properties,
  isSystem: t.Optional(
    t.Union([t.Literal("true"), t.Literal("false")], {
      description: "Filter berdasarkan role system (true/false)",
    }),
  ),
});

export const PermissionQueryDto = t.Object({
  ...SearchDto.properties,
  ...PaginationDto.properties,
  module: t.Optional(
    t.String({ description: "Filter berdasarkan modul permission" }),
  ),
});

export const UpdateRolePermissionsDto = t.Object({
  permissionIds: t.Array(t.String({ format: "uuid" }), {
    description: "Daftar ID permission",
  }),
});
