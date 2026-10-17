import { t } from 'elysia';
import { PaginationDto, SortDto, SearchDto } from './filter.dto';

export const CreateNoteDto = t.Object({
  title: t.String({ minLength: 1, description: 'Judul catatan' }),
  content: t.String({ minLength: 1, description: 'Isi catatan' }),
  moduleId: t.Optional(t.Nullable(t.String({ format: 'uuid', description: 'ID modul catatan' }))),
  folderId: t.Optional(t.Nullable(t.String({ format: 'uuid', description: 'ID folder catatan' }))),
});

export const UpdateNoteDto = t.Object({
  title: t.Optional(t.String({ minLength: 1, description: 'Judul catatan' })),
  content: t.Optional(t.String({ minLength: 1, description: 'Isi catatan' })),
  moduleId: t.Optional(
    t.Nullable(t.String({ format: 'uuid', description: 'ID modul catatan baru' })),
  ),
  folderId: t.Optional(
    t.Nullable(t.String({ format: 'uuid', description: 'ID folder catatan baru' })),
  ),
});

export const NoteQueryDto = t.Object({
  ...SearchDto.properties,
  ...PaginationDto.properties,
  ...SortDto.properties,
  moduleId: t.Optional(t.String({ format: 'uuid', description: 'Filter berdasarkan ID modul' })),
  folderId: t.Optional(t.String({ format: 'uuid', description: 'Filter berdasarkan folder' })),
  startDate: t.Optional(
    t.String({
      format: 'date-time',
      description: 'Filter tanggal mulai (ISO 8601)',
    }),
  ),
  endDate: t.Optional(
    t.String({
      format: 'date-time',
      description: 'Filter tanggal akhir (ISO 8601)',
    }),
  ),
});

export const NoteParamsDto = t.Object({
  id: t.String({ format: 'uuid', description: 'ID catatan' }),
});
