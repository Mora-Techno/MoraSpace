import prisma from "prisma/client";

class PomodoroService {
  public async start(
    companyMemberId: string,
    _metadata?: Record<string, unknown>,
  ) {
    const session = await prisma.pomodoroSession.create({
      data: {
        companyMemberId,
        startedAt: new Date(),
      },
    });
    return session;
  }

  public async pause(companyMemberId: string) {
    const active = await prisma.pomodoroSession.findFirst({
      where: { companyMemberId, endedAt: null },
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

  public async resume(companyMemberId: string) {
    return this.start(companyMemberId);
  }

  public async stop(
    companyMemberId: string,
    sessionId?: string,
    durationInput?: number,
  ) {
    const active = sessionId
      ? await prisma.pomodoroSession.findUnique({ where: { id: sessionId } })
      : await prisma.pomodoroSession.findFirst({
          where: { companyMemberId, endedAt: null },
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

  public async getToday(companyMemberId: string) {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const sessions = await prisma.pomodoroSession.findMany({
      where: {
        companyMemberId,
        startedAt: { gte: startOfToday },
      },
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

  public async getStatistics(companyMemberId: string) {
    const sessions = await prisma.pomodoroSession.findMany({
      where: { companyMemberId },
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
    companyMemberId: string,
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

    const where: Record<string, unknown> = { companyMemberId };

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
        orderBy: { startedAt: "desc" },
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
