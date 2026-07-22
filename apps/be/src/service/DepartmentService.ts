import prisma from "prisma/client";
import type {
  PickCreateDepartment,
  PickUpdateDepartment,
} from "@repo/types/department.types";

class DepartmentService {
  public async list(
    companyId: string,
    query: {
      search?: string;
      managerId?: string;
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

    const where: Record<string, unknown> = { companyId };

    if (query.search) {
      where.name = { contains: query.search, mode: "insensitive" };
    }

    if (query.managerId) {
      where.managerId = query.managerId;
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
      orderBy.name = "asc";
    }

    const [totalData, data] = await prisma.$transaction([
      prisma.department.count({ where: where as any }),
      prisma.department.findMany({
        where: where as any,
        include: {
          manager: {
            select: { id: true, fullName: true, email: true, avatarUrl: true },
          },
          _count: {
            select: { members: true, teams: true },
          },
        },
        orderBy,
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

  public async update(
    id: string,
    companyId: string,
    input: PickUpdateDepartment,
  ) {
    const existing = await prisma.department.findFirst({
      where: { id, companyId },
    });
    if (!existing) return null;

    const department = await prisma.department.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.description !== undefined && {
          description: input.description,
        }),
        ...(input.managerId !== undefined && { managerId: input.managerId }),
      },
    });
    return department;
  }

  public async remove(id: string, companyId: string) {
    const existing = await prisma.department.findFirst({
      where: { id, companyId },
    });
    if (!existing) return null;

    await prisma.department.delete({ where: { id } });
    return existing;
  }
}

export default new DepartmentService();
