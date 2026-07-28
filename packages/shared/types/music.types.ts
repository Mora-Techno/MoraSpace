/** Mirror Prisma model `MusicPlaylist` */
export interface IMusicPlaylist {
  id: string;
  name: string;
  companyMemberId?: string;
  description: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
  items: IMusicPlayListItem[];
}

export interface IMusicPlayListItem {
  id: string;
  playlistId: string;
  trackCatalogId?: string | null;
  title: string;
  youtubeUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export type MusicPlaylist = Pick<
  IMusicPlaylist,
  "id" | "name" | "description" | "createdAt" | "updatedAt"
> & {
  items: IMusicPlayListItem[];
};

export type MusicQuery = {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type PickCreatePlaylist = Pick<IMusicPlaylist, "name" | "description">;
export type PickAddMusicItem = Pick<IMusicPlayListItem, "trackCatalogId">;
export type PlaylistParams = Pick<IMusicPlaylist, "id">;
