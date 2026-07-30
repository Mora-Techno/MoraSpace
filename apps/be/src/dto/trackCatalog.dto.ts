import { t } from "elysia";
import { PaginationDto, SortDto, SearchDto } from "./filter.dto";

export const SubmitTrackDto = t.Object({
  title: t.String({ minLength: 1, description: "Judul lagu" }),
  youtubeUrl: t.String({ minLength: 1, description: "URL YouTube" }),
});

export const ReviewTrackDto = t.Object({
  rejectionReason: t.Optional(
    t.String({ description: "Alasan penolakan (wajib diisi saat reject)" }),
  ),
});

export const TrackCatalogQueryDto = t.Object({
  ...SearchDto.properties,
  ...PaginationDto.properties,
  ...SortDto.properties,
  status: t.Optional(
    t.Union(
      [t.Literal("PENDING"), t.Literal("APPROVED"), t.Literal("REJECTED")],
      { description: "Filter berdasarkan status track" },
    ),
  ),
});

export const TrackCatalogParamsDto = t.Object({
  id: t.String({ format: "uuid", description: "ID track catalog" }),
});
