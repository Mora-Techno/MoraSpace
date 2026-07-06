/** Mirror Prisma model `MusicPlaylist` */
export interface IMusicPlaylist {
  id: string;
  title: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMusicPlayListItem {
  id: string;
  playlistId: string;
  title: string;
  youtubeUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export type MusicPlaylist = Pick<IMusicPlaylist, "id" | "title" | "url"> & {
  createdAt: string;
};

export type PickCreatePlaylist = Pick<IMusicPlaylist, "title" | "url">;
export type PlaylistParams = Pick<IMusicPlaylist, "id">;
