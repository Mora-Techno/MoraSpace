import prisma from 'prisma/client';
import type {
  IModule,
  ModuleQuery,
  PickCreateModule,
  PickUpdateModule,
} from '@repo/types/module.types';

class ModuleService {
  public async list(companyId: string | null, userId: string, query?: ModuleQuery) {
    const where: Record<string, unknown> = {};

    if (companyId) {
      where.companyId = companyId;
    } else {
      where.userId = userId;
      where.companyId = null;
    }

    if (query?.type) {
      where.type = query.type;
    }

    if (query?.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const modules = await prisma.module.findMany({
      where: where as any,
      include: {
        creatorMember: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
        _count: {
          select: {
            tasks: true,
            todos: true,
            notes: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return modules;
  }

  public async getById(id: string, companyId: string | null, userId: string) {
    const where: Record<string, unknown> = { id };
    if (companyId) {
      where.companyId = companyId;
    } else {
      where.userId = userId;
      where.companyId = null;
    }

    const moduleItem = await prisma.module.findFirst({
      where: where as any,
      include: {
        creatorMember: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
        _count: {
          select: {
            tasks: true,
            todos: true,
            notes: true,
          },
        },
      },
    });

    if (!moduleItem) {
      throw new Error('Modul tidak ditemukan');
    }

    return moduleItem;
  }

  public async create(
    companyId: string | null,
    companyMemberId: string | null,
    userId: string,
    userRole: string | undefined,
    input: PickCreateModule,
  ) {
    if (companyId) {
      const isOwnerOrAdmin = userRole === 'Owner' || userRole === 'Admin';
      if (!isOwnerOrAdmin) {
        throw new Error('Hanya Owner yang dapat membuat modul perusahaan');
      }
    }

    if (!input.name || !input.name.trim()) {
      throw new Error('Nama modul wajib diisi');
    }

    const created = await prisma.module.create({
      data: {
        name: input.name.trim(),
        description: input.description?.trim() || null,
        color: input.color || '#3b82f6',
        icon: input.icon || null,
        type: input.type,
        companyId: companyId ?? null,
        creatorMemberId: companyMemberId ?? null,
        userId: companyId ? null : userId,
      },
      include: {
        creatorMember: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
        _count: {
          select: {
            tasks: true,
            todos: true,
            notes: true,
          },
        },
      },
    });

    return created;
  }

  public async update(
    id: string,
    companyId: string | null,
    userId: string,
    userRole: string | undefined,
    input: PickUpdateModule,
  ) {
    const existing = await this.getById(id, companyId, userId);

    if (companyId) {
      const isOwnerOrAdmin = userRole === 'Owner' || userRole === 'Admin';
      if (!isOwnerOrAdmin) {
        throw new Error('Hanya Owner yang dapat mengubah modul perusahaan');
      }
    }

    const updated = await prisma.module.update({
      where: { id: existing.id },
      data: {
        ...(input.name !== undefined ? { name: input.name.trim() } : {}),
        ...(input.description !== undefined
          ? { description: input.description.trim() || null }
          : {}),
        ...(input.color !== undefined ? { color: input.color } : {}),
        ...(input.icon !== undefined ? { icon: input.icon } : {}),
      },
      include: {
        creatorMember: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
        _count: {
          select: {
            tasks: true,
            todos: true,
            notes: true,
          },
        },
      },
    });

    return updated;
  }

  public async delete(
    id: string,
    companyId: string | null,
    userId: string,
    userRole: string | undefined,
  ) {
    const existing = await this.getById(id, companyId, userId);

    if (companyId) {
      const isOwnerOrAdmin = userRole === 'Owner' || userRole === 'Admin';
      if (!isOwnerOrAdmin) {
        throw new Error('Hanya Owner yang dapat menghapus modul perusahaan');
      }
    }

    await prisma.module.delete({
      where: { id: existing.id },
    });

    return { id };
  }
}

export default new ModuleService();
