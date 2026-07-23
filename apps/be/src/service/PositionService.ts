import prisma from "prisma/client";
import type {
  PickCreatePosition,
  PickUpdatePosition,
} from "@repo/types/position.types";

class PositionService {
  public async list(
    companyId: string,
    query: {
      search?: string;
      level?: number;
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

    if (query.level !== undefined) {
      where.level = query.level;
    }

    let orderBy: any = [{ level: "desc" }, { name: "asc" }];
    if (query.sortBy) {
      orderBy = { [query.sortBy]: query.sortOrder ?? "asc" };
    }

    const [totalData, data] = await prisma.$transaction([
      prisma.position.count({ where: where as any }),
      prisma.position.findMany({
        where: where as any,
        include: {
          _count: {
            select: { members: true },
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

  public async create(companyId: string, input: PickCreatePosition) {
    const position = await prisma.position.create({
      data: {
        companyId,
        name: input.name,
        level: input.level ?? 0,
        description: input.description ?? null,
      },
    });
    return position;
  }

  public async update(
    id: string,
    companyId: string,
    input: PickUpdatePosition,
  ) {
    const existing = await prisma.position.findFirst({
      where: { id, companyId },
    });
    if (!existing) return null;

    const position = await prisma.position.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.level !== undefined && { level: input.level }),
        ...(input.description !== undefined && {
          description: input.description,
        }),
      },
    });
    return position;
  }

  public async remove(id: string, companyId: string) {
    const existing = await prisma.position.findFirst({
      where: { id, companyId },
    });
    if (!existing) return null;

    await prisma.position.delete({ where: { id } });
    return existing;
  }
}

export default new PositionService();
