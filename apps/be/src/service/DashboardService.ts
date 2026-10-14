import prisma from 'prisma/client';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

class DashboardService {
  public async ownerOverview(companyId: string) {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - WEEK_MS);

    const [
      memberGroups,
      taskTotal,
      taskCompleted,
      taskOverdue,
      statusGroups,
      statuses,
      deepWork,
      company,
    ] = await Promise.all([
      prisma.companyMember.groupBy({
        by: ['status'],
        where: { companyId },
        _count: { id: true },
      }),
      prisma.task.count({ where: { companyId } }),
      prisma.task.count({ where: { companyId, completedAt: { not: null } } }),
      prisma.task.count({ where: { companyId, completedAt: null, dueDate: { lt: now } } }),
      prisma.task.groupBy({
        by: ['statusId'],
        where: { companyId },
        _count: { id: true },
      }),
      prisma.taskStatus.findMany({
        where: { companyId },
        select: { id: true, name: true, color: true },
      }),
      prisma.pomodoroSession.aggregate({
        _sum: { duration: true },
        where: {
          startedAt: { gte: weekAgo },
          companyMember: { companyId },
        },
      }),
      prisma.company.findUnique({
        where: { id: companyId },
        select: {
          currentSubscription: {
            select: {
              status: true,
              currentPeriodEnd: true,
              plan: { select: { name: true, maxMembers: true } },
            },
          },
        },
      }),
    ]);

    const memberTotal = memberGroups.reduce((n, g) => n + g._count.id, 0);
    const memberActive = memberGroups.find((g) => g.status === 'active')?._count.id ?? 0;
    const statusById = new Map(statuses.map((s) => [s.id, s]));
    const byStatus = statusGroups.map((g) => ({
      name: statusById.get(g.statusId)?.name ?? 'Lainnya',
      color: statusById.get(g.statusId)?.color ?? null,
      count: g._count.id,
    }));

    const activities = await prisma.taskActivity.findMany({
      where: { task: { companyId } },
      include: {
        task: { select: { title: true } },
        companyMember: { select: { user: { select: { fullName: true } } } },
        user: { select: { fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const sub = company?.currentSubscription;
    return {
      members: {
        total: memberTotal,
        active: memberActive,
        maxMembers: sub?.plan.maxMembers ?? null,
      },
      tasks: {
        total: taskTotal,
        active: taskTotal - taskCompleted,
        overdue: taskOverdue,
        completed: taskCompleted,
        doneRate: taskTotal === 0 ? 0 : Math.round((taskCompleted / taskTotal) * 1000) / 10,
        byStatus,
      },
      deepWorkMinutes: Math.floor((deepWork._sum.duration ?? 0) / 60),
      plan: sub
        ? { tier: sub.plan.name, status: sub.status, renewsAt: sub.currentPeriodEnd }
        : null,
      recentActivity: activities.map((a) => ({
        id: a.id,
        action: a.action,
        actorName: a.companyMember?.user.fullName ?? a.user?.fullName ?? 'Sistem',
        taskTitle: a.task.title,
        createdAt: a.createdAt,
      })),
    };
  }
}

export default new DashboardService();
