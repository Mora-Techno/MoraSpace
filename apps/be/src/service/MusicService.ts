import prisma from "prisma/client";
import type { PickCreatePlaylist } from "@repo/types/music.types";

function mapPlaylistItem(item: {
  id: string;
  title: string;
  youtubeUrl: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: item.id,
    title: item.title,
    youtubeUrl: item.youtubeUrl,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

function mapPlaylist(playlist: {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  items?: {
    id: string;
    title: string;
    youtubeUrl: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}) {
  return {
    id: playlist.id,
    name: playlist.name,
    description: playlist.description,
    items: playlist.items?.map(mapPlaylistItem) ?? [],
    createdAt: playlist.createdAt.toISOString(),
    updatedAt: playlist.updatedAt.toISOString(),
  };
}

class MusicService {
  public async list(
    companyMemberId: string | null,
    userId: string,
    query: {
      search?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {},
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = companyMemberId
      ? { companyMemberId }
      : { userId };

    if (query.search) {
      where.name = { contains: query.search, mode: "insensitive" };
    }

    const orderBy: Record<string, unknown>[] = [];
    if (query.sortBy) {
      orderBy.push({ [query.sortBy]: query.sortOrder ?? "asc" });
    } else {
      orderBy.push({ createdAt: "asc" });
    }

    const [totalData, data] = await prisma.$transaction([
      prisma.playlist.count({ where: where as any }),
      prisma.playlist.findMany({
        where: where as any,
        orderBy: orderBy as any,
        take: limit,
        skip: skip,
        include: { items: true },
      }),
    ]);

    const totalPage = Math.ceil(totalData / limit);

    return {
      data: data,
      meta: {
        currentPage: page,
        limit: limit,
        totalData: totalData,
        totalPage: totalPage,
      },
    };
  }

  public async create(
    companyMemberId: string | null,
    userId: string,
    input: PickCreatePlaylist,
  ) {
    const data: Record<string, unknown> = {
      name: input.name,
      description: input.description,
    };
    if (companyMemberId) {
      data.companyMemberId = companyMemberId;
    } else {
      data.userId = userId;
    }

    const playlist = await prisma.playlist.create({
      data: data as any,
      include: { items: true },
    });

    return mapPlaylist(playlist);
  }

  public async addItem(
    playlistId: string,
    companyMemberId: string | null,
    userId: string,
    input: { title: string; youtubeUrl: string },
  ) {
    const where: Record<string, unknown> = companyMemberId
      ? { id: playlistId, companyMemberId }
      : { id: playlistId, userId };

    const existing = await prisma.playlist.findFirst({
      where: where as any,
    });
    if (!existing) return null;

    const item = await prisma.playlistItem.create({
      data: {
        playlistId,
        title: input.title,
        youtubeUrl: input.youtubeUrl,
      },
    });

    return {
      id: item.id,
      playlistId: item.playlistId,
      title: item.title,
      youtubeUrl: item.youtubeUrl,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }

  public async removeItem(
    itemId: string,
    playlistId: string,
    companyMemberId: string | null,
    userId: string,
  ) {
    const playlistWhere: Record<string, unknown> = companyMemberId
      ? { id: playlistId, companyMemberId }
      : { id: playlistId, userId };

    const existing = await prisma.playlist.findFirst({
      where: playlistWhere as any,
    });
    if (!existing) return null;

    const item = await prisma.playlistItem.findFirst({
      where: { id: itemId, playlistId },
    });
    if (!item) return null;

    await prisma.playlistItem.delete({ where: { id: itemId } });
    return {
      id: item.id,
      playlistId: item.playlistId,
      title: item.title,
      youtubeUrl: item.youtubeUrl,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }

  public async remove(
    id: string,
    companyMemberId: string | null,
    userId: string,
  ) {
    const where: Record<string, unknown> = companyMemberId
      ? { id, companyMemberId }
      : { id, userId };

    const existing = await prisma.playlist.findFirst({
      where: where as any,
      include: { items: true },
    });
    if (!existing) return null;

    await prisma.playlist.delete({ where: { id } });
    return mapPlaylist(existing);
  }
}

export default new MusicService();
