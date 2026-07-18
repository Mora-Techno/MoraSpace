import type { JwtPayload } from '@repo/types/auth.types';
import prisma from 'prisma/client';

class SessionService {
  public async listService(users: JwtPayload, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [totalData, data] = await prisma.$transaction([
      prisma.userSession.count({
        where: {
          userId: users.id,
        },
      }),
      prisma.userSession.findMany({
        where: {
          userId: users.id,
        },
        orderBy: {
          expiredAt: 'asc',
        },
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
      throw new Error('id session tidak temukan');
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
      throw new Error('id session tidak temukan');
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
