import { t } from 'elysia';

export const CreateRoleDto = t.Object({
  name: t.String({ minLength: 1, description: 'Nama role' }),
  description: t.Optional(t.String({ description: 'Deskripsi role' })),
});

export const UpdateRoleDto = t.Object({
  name: t.Optional(t.String({ minLength: 1, description: 'Nama role baru' })),
  description: t.Optional(t.Nullable(t.String({ description: 'Deskripsi role baru' }))),
});

export const RoleParamsDto = t.Object({
  id: t.String({ format: 'uuid', description: 'ID role atau permission' }),
});

export const UpdateRolePermissionsDto = t.Object({
  permissionIds: t.Array(t.String({ format: 'uuid' }), { description: 'Daftar ID permission' }),
});
