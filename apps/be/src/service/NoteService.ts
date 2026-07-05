import prisma from 'prisma/client';
import type { PickCreateNote, PickUpdateNote } from '@repo/types/note.types';

class NoteService {
  public async list(companyMemberId: string) {
    return prisma.note.findMany({
      where: { companyMemberId },
      select: {
        id: true,
        title: true,
        content: true,
      },
      orderBy: { title: 'asc' },
    });
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
