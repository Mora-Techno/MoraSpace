import prisma from "prisma/client";
import type { PickCreatePlaylist } from "@repo/types/music.types";

function mapPlaylist(playlist: {
  id: string;
  name: string;
  items: { title: string; youtubeUrl: string }[];
}) {
  const firstItem = playlist.items[0];
  return {
    id: playlist.id,
    title: firstItem?.title ?? playlist.name,
    url: firstItem?.youtubeUrl ?? "",
    createdAt: new Date().toISOString(),
  };
}

class MusicService {
  public async list(companyMemberId: string) {
    const playlists = await prisma.playlist.findMany({
      where: { companyMemberId },
      include: { items: true },
      orderBy: { name: "asc" },
    });

    return playlists.map(mapPlaylist);
  }

  public async create(companyMemberId: string, input: PickCreatePlaylist) {
    const playlist = await prisma.playlist.create({
      data: {
        companyMemberId,
        name: input.title,
        items: {
          create: {
            title: input.title,
            youtubeUrl: input.url,
          },
        },
      },
      include: { items: true },
    });

    return mapPlaylist(playlist);
  }

  public async remove(id: string, companyMemberId: string) {
    const existing = await prisma.playlist.findFirst({
      where: { id, companyMemberId },
      include: { items: true },
    });
    if (!existing) return null;

    await prisma.playlist.delete({ where: { id } });
    return mapPlaylist(existing);
  }
}

export default new MusicService();
