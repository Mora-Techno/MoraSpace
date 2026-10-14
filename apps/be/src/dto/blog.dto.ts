import { t } from 'elysia';
import { PaginationDto, SearchDto } from './filter.dto';

export const BlogQueryDto = t.Object({
  ...SearchDto.properties,
  ...PaginationDto.properties,
  category: t.Optional(t.String({ description: 'Filter kategori' })),
});

export const BlogParamsDto = t.Object({
  slug: t.String({ minLength: 1, maxLength: 160, description: 'Slug artikel' }),
});
