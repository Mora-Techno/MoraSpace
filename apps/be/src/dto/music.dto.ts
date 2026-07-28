import { t } from "elysia";
import { PaginationDto, SortDto, SearchDto } from "./filter.dto";

export const CreatePlaylistDto = t.Object({
  name: t.String({ minLength: 1, description: "Nama playlist" }),
  description: t.String({
    minLength: 1,
    description: "Keterangan Untuk PLaylist",
  }),
});

export const AddItemToPlaylistDto = t.Object({
  title: t.String({ minLength: 1, description: "Judul lagu" }),
  youtubeUrl: t.String({ minLength: 1, description: "URL YouTube" }),
});

export const MusicQueryDto = t.Object({
  ...SearchDto.properties,
  ...PaginationDto.properties,
  ...SortDto.properties,
});

export const PlaylistParamsDto = t.Object({
  id: t.String({ format: "uuid", description: "ID playlist" }),
});
