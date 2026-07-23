import { t } from "elysia";
import { PaginationDto, SortDto, SearchDto } from "./filter.dto";

export const CreatePlaylistDto = t.Object({
  title: t.String({ minLength: 1, description: "Nama playlist" }),
  url: t.String({ format: "uri", description: "URL musik atau playlist" }),
});

export const MusicQueryDto = t.Object({
  ...SearchDto.properties,
  ...PaginationDto.properties,
  ...SortDto.properties,
});

export const PlaylistParamsDto = t.Object({
  id: t.String({ format: "uuid", description: "ID playlist" }),
});
