import { t } from 'elysia';
import { SearchDto } from './filter.dto';

export const ModuleTypeEnum = t.Union([t.Literal('TASK'), t.Literal('TODO'), t.Literal('NOTE')]);

export const CreateModuleDto = t.Object({
  name: t.String({ minLength: 1, maxLength: 100, description: 'Nama modul' }),
  description: t.Optional(t.Nullable(t.String({ maxLength: 500, description: 'Deskripsi modul' }))),
  color: t.Optional(t.Nullable(t.String({ description: 'Warna tema modul' }))),
  icon: t.Optional(t.Nullable(t.String({ description: 'Ikon modul' }))),
  type: ModuleTypeEnum,
});

export const UpdateModuleDto = t.Object({
  name: t.Optional(t.String({ minLength: 1, maxLength: 100, description: 'Nama modul baru' })),
  description: t.Optional(
    t.Nullable(t.String({ maxLength: 500, description: 'Deskripsi modul baru' })),
  ),
  color: t.Optional(t.Nullable(t.String({ description: 'Warna tema modul baru' }))),
  icon: t.Optional(t.Nullable(t.String({ description: 'Ikon modul baru' }))),
});

export const ModuleQueryDto = t.Object({
  ...SearchDto.properties,
  type: t.Optional(ModuleTypeEnum),
});

export const ModuleParamsDto = t.Object({
  id: t.String({ format: 'uuid', description: 'ID modul' }),
});
