import prisma from "prisma/client";

class PomodoroService {
  private buildWhere(
    companyMemberId: string | null,
    userId: string,
  ): Record<string, unknown> {
    return companyMemberId ? { companyMemberId } : { userId };
  }

  public async start(
    companyMemberId: string | null,
    userId: string,
    _metadata?: Record<string, unknown>,
  ) {
    const data: Record<string, unknown> = {
      startedAt: new Date(),
    };
    if (companyMemberId) {
      data.companyMemberId = companyMemberId;
    } else {
      data.userId = userId;
    }

    const session = await prisma.pomodoroSession.create({
      data: data as any,
    });
    return session;
  }

  public async pause(companyMemberId: string | null, userId: string) {
    const where = this.buildWhere(companyMemberId, userId);
    const active = await prisma.pomodoroSession.findFirst({
      where: { ...where, endedAt: null } as any,
      orderBy: { startedAt: "desc" },
    });
    if (!active) throw new Error("Tidak ada sesi pomodoro yang aktif");

    const now = new Date();
    const duration = Math.round(
      (now.getTime() - active.startedAt.getTime()) / 1000,
    );

    const session = await prisma.pomodoroSession.update({
      where: { id: active.id },
      data: {
        endedAt: now,
        duration,
      },
    });
    return session;
  }

  public async resume(companyMemberId: string | null, userId: string) {
    return this.start(companyMemberId, userId);
  }

  public async stop(
    companyMemberId: string | null,
    userId: string,
    sessionId?: string,
    durationInput?: number,
  ) {
    const where = this.buildWhere(companyMemberId, userId);
    const active = sessionId
      ? await prisma.pomodoroSession.findUnique({ where: { id: sessionId } })
      : await prisma.pomodoroSession.findFirst({
          where: { ...where, endedAt: null } as any,
          orderBy: { startedAt: "desc" },
        });

    if (!active) throw new Error("Sesi pomodoro tidak ditemukan");

    const now = new Date();
    const duration =
      durationInput ??
      Math.round((now.getTime() - active.startedAt.getTime()) / 1000);

    const session = await prisma.pomodoroSession.update({
      where: { id: active.id },
      data: {
        endedAt: now,
        duration,
      },
    });
    return session;
  }

  public async getToday(companyMemberId: string | null, userId: string) {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const where = this.buildWhere(companyMemberId, userId);
    const sessions = await prisma.pomodoroSession.findMany({
      where: {
        ...where,
        startedAt: { gte: startOfToday },
      } as any,
      orderBy: { startedAt: "desc" },
    });

    const totalDurationSeconds = sessions.reduce(
      (acc, curr) => acc + (curr.duration ?? 0),
      0,
    );

    return {
      sessions,
      totalDurationSeconds,
      totalDurationMinutes: Math.round(totalDurationSeconds / 60),
    };
  }

  public async getStatistics(companyMemberId: string | null, userId: string) {
    const where = this.buildWhere(companyMemberId, userId);
    const sessions = await prisma.pomodoroSession.findMany({
      where: where as any,
    });

    const totalSessions = sessions.length;
    const totalDurationSeconds = sessions.reduce(
      (acc, curr) => acc + (curr.duration ?? 0),
      0,
    );

    return {
      totalSessions,
      totalDurationSeconds,
      totalDurationMinutes: Math.round(totalDurationSeconds / 60),
      totalDurationHours: Number((totalDurationSeconds / 3600).toFixed(2)),
    };
  }

  public async list(
    companyMemberId: string | null,
    userId: string,
    query: {
      search?: string;
      status?: "active" | "completed" | "cancelled";
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    } = {},
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = companyMemberId
      ? { companyMemberId }
      : { userId };

    if (query.status === "active") {
      where.endedAt = null;
    } else if (query.status === "completed") {
      where.endedAt = { not: null };
    }

    if (query.startDate || query.endDate) {
      where.startedAt = {};
      if (query.startDate)
        (where.startedAt as Record<string, unknown>).gte = new Date(
          query.startDate,
        );
      if (query.endDate)
        (where.startedAt as Record<string, unknown>).lte = new Date(
          query.endDate,
        );
    }

    const [totalData, data] = await prisma.$transaction([
      prisma.pomodoroSession.count({ where: where as any }),
      prisma.pomodoroSession.findMany({
        where: where as any,
        orderBy: [{ startedAt: "desc" }],
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
}

export default new PomodoroService();
