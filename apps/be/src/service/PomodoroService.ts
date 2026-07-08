import prisma from 'prisma/client';

class PomodoroService {
  public async start(companyMemberId: string, _metadata?: Record<string, unknown>) {
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
      orderBy: { startedAt: 'desc' },
    });
    if (!active) throw new Error('Tidak ada sesi pomodoro yang aktif');

    const now = new Date();
    const duration = Math.round((now.getTime() - active.startedAt.getTime()) / 1000);

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

  public async stop(companyMemberId: string, sessionId?: string, durationInput?: number) {
    const active = sessionId
      ? await prisma.pomodoroSession.findUnique({ where: { id: sessionId } })
      : await prisma.pomodoroSession.findFirst({
          where: { companyMemberId, endedAt: null },
          orderBy: { startedAt: 'desc' },
        });

    if (!active) throw new Error('Sesi pomodoro tidak ditemukan');

    const now = new Date();
    const duration =
      durationInput ?? Math.round((now.getTime() - active.startedAt.getTime()) / 1000);

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
      orderBy: { startedAt: 'desc' },
    });

    const totalDurationSeconds = sessions.reduce((acc, curr) => acc + (curr.duration ?? 0), 0);

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
    const totalDurationSeconds = sessions.reduce((acc, curr) => acc + (curr.duration ?? 0), 0);

    return {
      totalSessions,
      totalDurationSeconds,
      totalDurationMinutes: Math.round(totalDurationSeconds / 60),
      totalDurationHours: Number((totalDurationSeconds / 3600).toFixed(2)),
    };
  }
}

export default new PomodoroService();
