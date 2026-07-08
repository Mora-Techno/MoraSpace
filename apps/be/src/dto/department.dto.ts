import { t } from 'elysia';

export const CreateDepartmentDto = t.Object({
  name: t.String({ minLength: 1, description: 'Nama departemen' }),
  description: t.Optional(t.String({ description: 'Deskripsi departemen' })),
  managerId: t.Optional(t.String({ format: 'uuid', description: 'ID manajer (user ID)' })),
});

export const UpdateDepartmentDto = t.Object({
  name: t.Optional(t.String({ minLength: 1, description: 'Nama departemen baru' })),
  description: t.Optional(t.Nullable(t.String({ description: 'Deskripsi departemen baru' }))),
  managerId: t.Optional(t.Nullable(t.String({ format: 'uuid', description: 'ID manajer baru' }))),
});

export const DepartmentParamsDto = t.Object({
  id: t.String({ format: 'uuid', description: 'ID departemen' }),
});
