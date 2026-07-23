import { t } from "elysia";

/**
 * Shared pagination schema for list endpoints.
 */
export const PaginationDto = t.Object({
  page: t.Optional(
    t.Numeric({ minimum: 1, default: 1, description: "Halaman (default: 1)" }),
  ),
  limit: t.Optional(
    t.Numeric({
      minimum: 1,
      maximum: 100,
      default: 10,
      description: "Jumlah data per halaman (default: 10, maks: 100)",
    }),
  ),
});

/**
 * Shared sorting schema for list endpoints.
 */
export const SortDto = t.Object({
  sortBy: t.Optional(t.String({ description: "Kolom untuk sorting" })),
  sortOrder: t.Optional(
    t.Union([t.Literal("asc"), t.Literal("desc")], {
      default: "asc",
      description: "Arah sorting (asc/desc, default: asc)",
    }),
  ),
});

/**
 * Shared date range filter schema.
 */
export const DateRangeDto = t.Object({
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

/**
 * Shared search keyword schema.
 */
export const SearchDto = t.Object({
  search: t.Optional(t.String({ description: "Kata kunci pencarian" })),
});

/**
 * Combined filter query DTO that includes pagination, sorting, date range, and search.
 * Composes all shared filter schemas into a single object.
 */
export const FilterQueryDto = t.Object({
  ...PaginationDto.properties,
  ...SortDto.properties,
  ...DateRangeDto.properties,
  ...SearchDto.properties,
});
