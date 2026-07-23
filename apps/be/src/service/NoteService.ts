import prisma from "prisma/client";
import type { PickCreateNote, PickUpdateNote } from "@repo/types/note.types";

class NoteService {
  public async list(
    companyMemberId: string,
    query: {
      search?: string;
      folderId?: string;
      startDate?: string;
      endDate?: string;
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
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { content: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query.folderId) {
      where.folderId = query.folderId;
    }

    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate)
        (where.createdAt as Record<string, unknown>).gte = new Date(
          query.startDate,
        );
      if (query.endDate)
        (where.createdAt as Record<string, unknown>).lte = new Date(
          query.endDate,
        );
    }

    const orderBy: Record<string, unknown> = {};
    if (query.sortBy) {
      orderBy[query.sortBy] = query.sortOrder ?? "asc";
    } else {
      orderBy.createdAt = "asc";
    }

    const [totalData, data] = await prisma.$transaction([
      prisma.note.count({ where: where as any }),
      prisma.note.findMany({
        where: where as any,
        select: {
          id: true,
          title: true,
          content: true,
        },
        orderBy,
        skip: skip,
        take: limit,
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

  public async getById(id: string, companyMemberId: string) {
    return prisma.note.findFirst({
      where: { id, companyMemberId },
    });
  }

  public async create(companyMemberId: string, input: PickCreateNote) {
    return prisma.note.create({
      data: {
        companyMemberId,
        title: input.title,
        content: input.content,
      },
    });
  }

  public async update(
    id: string,
    companyMemberId: string,
    input: PickUpdateNote,
  ) {
    const existing = await prisma.note.findFirst({
      where: { id, companyMemberId },
    });
    if (!existing) return null;

    return prisma.note.update({ where: { id }, data: input });
  }

  public async remove(id: string, companyMemberId: string) {
    const existing = await prisma.note.findFirst({
      where: { id, companyMemberId },
    });
    if (!existing) return null;

    await prisma.note.delete({ where: { id } });
    return existing;
  }
}

export default new NoteService();
