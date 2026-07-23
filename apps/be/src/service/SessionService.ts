import type { JwtPayload } from "@repo/types/auth.types";
import prisma from "prisma/client";

class SessionService {
  public async listService(
    users: JwtPayload,
    query: {
      search?: string;
      startDate?: string;
      endDate?: string;
      device?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {},
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { userId: users.id };

    if (query.search) {
      where.OR = [
        { device: { contains: query.search, mode: "insensitive" } },
        { browser: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query.device) {
      where.device = { contains: query.device, mode: "insensitive" };
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
      orderBy.expiredAt = "asc";
    }

    const [totalData, data] = await prisma.$transaction([
      prisma.userSession.count({ where: where as any }),
      prisma.userSession.findMany({
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
  public async getSessionByIdService(id: string) {
    if (!id) {
      throw new Error("id session tidak temukan");
    }
    const sessionQuery = await prisma.userSession.findUnique({
      where: {
        id: id,
      },
    });
    return { sessionQuery };
  }
  public async deleteSessionById(id: string) {
    if (!id) {
      throw new Error("id session tidak temukan");
    }
    const query = await prisma.userSession.delete({
      where: {
        id: id,
      },
    });
    return { query };
  }
  public async deleteAllSessionService(id: string) {
    const sessionQuery = await prisma.userSession.deleteMany({
      where: {
        userId: id,
      },
    });

    return { sessionQuery };
  }
}

export default new SessionService();
