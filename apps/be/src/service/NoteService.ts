import prisma from 'prisma/client';
import type { PickCreateNote, PickUpdateNote } from '@repo/types/note.types';

class NoteService {
  public async list(companyMemberId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [totalData, data] = await prisma.$transaction([
      prisma.note.count({
        where: {
          companyMemberId,
        },
      }),
      prisma.note.findMany({
        where: {
          companyMemberId,
        },
        select: {
          id: true,
          title: true,
          content: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
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

  public async update(id: string, companyMemberId: string, input: PickUpdateNote) {
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
