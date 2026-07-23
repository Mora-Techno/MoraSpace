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
  public async list(
    companyMemberId: string,
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

    const where: Record<string, unknown> = { companyMemberId };

    if (query.search) {
      where.name = { contains: query.search, mode: "insensitive" };
    }

    const orderBy: Record<string, unknown> = {};
    if (query.sortBy) {
      orderBy[query.sortBy] = query.sortOrder ?? "asc";
    } else {
      orderBy.createdAt = "asc";
    }

    const [totalData, data] = await prisma.$transaction([
      prisma.playlist.count({ where: where as any }),
      prisma.playlist.findMany({
        where: where as any,
        orderBy,
        take: limit,
        skip: skip,
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
