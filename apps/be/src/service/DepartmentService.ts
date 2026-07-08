import prisma from 'prisma/client';
import type { PickCreateDepartment, PickUpdateDepartment } from '@repo/types/department.types';

class DepartmentService {
  public async list(companyId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [totalData, data] = await prisma.$transaction([
      prisma.department.count({
        where: { companyId },
      }),
      prisma.department.findMany({
        where: { companyId },
        include: {
          manager: {
            select: { id: true, fullName: true, email: true, avatarUrl: true },
          },
          _count: {
            select: { members: true, teams: true },
          },
        },
        orderBy: { name: 'asc' },
        take: limit,
        skip: skip,
      }),
    ]);

    const totalPage = Math.ceil(totalData / limit);

    return {
      data,
      meta: {
        currentPage: page,
        limit,
        totalData,
        totalPage,
      },
    };
  }

  public async getById(id: string, companyId: string) {
    const department = await prisma.department.findFirst({
      where: { id, companyId },
      include: {
        manager: {
          select: { id: true, fullName: true, email: true, avatarUrl: true },
        },
        members: {
          include: {
            companyMember: {
              include: { user: true, position: true },
            },
          },
        },
        teams: true,
      },
    });
    return department;
  }

  public async create(companyId: string, input: PickCreateDepartment) {
    const department = await prisma.department.create({
      data: {
        companyId,
        name: input.name,
        description: input.description ?? null,
        managerId: input.managerId ?? null,
      },
    });
    return department;
  }

  public async update(id: string, companyId: string, input: PickUpdateDepartment) {
    const existing = await prisma.department.findFirst({ where: { id, companyId } });
    if (!existing) return null;

    const department = await prisma.department.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.managerId !== undefined && { managerId: input.managerId }),
      },
    });
    return department;
  }

  public async remove(id: string, companyId: string) {
    const existing = await prisma.department.findFirst({ where: { id, companyId } });
    if (!existing) return null;

    await prisma.department.delete({ where: { id } });
    return existing;
  }
}

export default new DepartmentService();
