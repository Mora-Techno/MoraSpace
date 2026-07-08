import { t } from 'elysia';

export const CreatePositionDto = t.Object({
  name: t.String({ minLength: 1, description: 'Nama jabatan' }),
  level: t.Optional(t.Numeric({ default: 0, description: 'Level jabatan' })),
  description: t.Optional(t.String({ description: 'Deskripsi jabatan' })),
});

export const UpdatePositionDto = t.Object({
  name: t.Optional(t.String({ minLength: 1, description: 'Nama jabatan baru' })),
  level: t.Optional(t.Numeric({ description: 'Level jabatan baru' })),
  description: t.Optional(t.Nullable(t.String({ description: 'Deskripsi jabatan baru' }))),
});

export const PositionParamsDto = t.Object({
  id: t.String({ format: 'uuid', description: 'ID jabatan' }),
});
