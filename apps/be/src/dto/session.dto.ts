import { t } from "elysia";
import { PaginationDto, SortDto, SearchDto } from "./filter.dto";
//
export const SessionQueryDto = t.Object({
  ...SearchDto.properties,
  ...PaginationDto.properties,
  ...SortDto.properties,
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
  device: t.Optional(t.String({ description: "Filter berdasarkan perangkat" })),
});

export const SessionParamsDto = t.Object({
  id: t.String({ format: "uuid", description: "ID Sesssion" }),
});
