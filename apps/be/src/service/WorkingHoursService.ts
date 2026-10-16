import prisma from 'prisma/client';
import { evaluateWorkingHours } from '@/utils/workingHoursHelper';
import type {
  MemberWorkingStatus,
  OwnerMetricsSummary,
  UrgentQuotaStatus,
} from '@repo/types/workingHours.types';

class WorkingHoursService {
  private async getCompanyConfig(companyId: string) {
    const setting = await prisma.companySetting.findUnique({
      where: { companyId },
    });

    if (setting) {
      return {
        workingHourStart: setting.workingHourStart,
        workingHourEnd: setting.workingHourEnd,
        workDays: setting.workDays,
        timezone: setting.timezone ?? 'Asia/Jakarta',
      };
    }

    // Default 09:00 - 18:00 Mon-Fri WIB
    return {
      workingHourStart: new Date('1970-01-01T09:00:00.000Z'),
      workingHourEnd: new Date('1970-01-01T18:00:00.000Z'),
      workDays: 'mon,tue,wed,thu,fri',
      timezone: 'Asia/Jakarta',
    };
  }

  public async getMemberStatus(
    companyId: string,
    memberId: string,
  ): Promise<MemberWorkingStatus | null> {
    let member = await prisma.companyMember.findUnique({
      where: { id: memberId },
      select: { id: true, userId: true, companyId: true, status: true },
    });

    if (!member) {
      member = await prisma.companyMember.findFirst({
        where: { userId: memberId, companyId },
        select: { id: true, userId: true, companyId: true, status: true },
      });
    }

    if (!member || member.companyId !== companyId || member.status !== 'active') {
      return null;
    }

    const config = await this.getCompanyConfig(companyId);
    const evalResult = evaluateWorkingHours(config);

    return {
      companyMemberId: member.id,
      userId: member.userId,
      status: evalResult.isWorking ? 'working' : 'out_of_hours',
      statusLabel: evalResult.statusLabel,
      nextWorkingDate: evalResult.nextWorkingStart?.toISOString() ?? null,
      timezone: evalResult.timezone,
    };
  }

  public async getAllMembersStatus(companyId: string): Promise<MemberWorkingStatus[]> {
    const members = await prisma.companyMember.findMany({
      where: { companyId, status: 'active' },
      select: { id: true, userId: true },
    });

    const config = await this.getCompanyConfig(companyId);
    const evalResult = evaluateWorkingHours(config);

    return members.map((m) => ({
      companyMemberId: m.id,
      userId: m.userId,
      status: evalResult.isWorking ? 'working' : 'out_of_hours',
      statusLabel: evalResult.statusLabel,
      nextWorkingDate: evalResult.nextWorkingStart?.toISOString() ?? null,
      timezone: evalResult.timezone,
    }));
  }

  public async getUrgentQuota(
    companyId: string,
    companyMemberId: string,
  ): Promise<UrgentQuotaStatus> {
    const policy = await prisma.companyPolicy.findUnique({
      where: { companyId },
      select: { urgentMessageLimitPerDay: true },
    });

    const dailyLimit = policy?.urgentMessageLimitPerDay ?? 3;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const usage = await prisma.urgentQuotaUsage.findUnique({
      where: {
        companyMemberId_usageDate: {
          companyMemberId,
          usageDate: today,
        },
      },
    });

    const usedToday = usage?.count ?? 0;
    const remainingToday = Math.max(0, dailyLimit - usedToday);

    return {
      usedToday,
      dailyLimit,
      remainingToday,
    };
  }

  public async checkAndConsumeUrgentQuota(
    companyId: string,
    companyMemberId: string,
  ): Promise<UrgentQuotaStatus> {
    const quota = await this.getUrgentQuota(companyId, companyMemberId);

    if (quota.remainingToday <= 0) {
      throw new Error(
        `Batas pemakaian pesan mendesak hari ini (${quota.dailyLimit}) telah tercapai.`,
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const updated = await prisma.urgentQuotaUsage.upsert({
      where: {
        companyMemberId_usageDate: {
          companyMemberId,
          usageDate: today,
        },
      },
      create: {
        companyId,
        companyMemberId,
        usageDate: today,
        count: 1,
      },
      update: {
        count: { increment: 1 },
      },
    });

    await this.recordMetricEvent(companyId, companyMemberId, 'URGENT_BUTTON_USED');

    return {
      usedToday: updated.count,
      dailyLimit: quota.dailyLimit,
      remainingToday: Math.max(0, quota.dailyLimit - updated.count),
    };
  }

  public async recordMetricEvent(
    companyId: string,
    companyMemberId: string | null,
    eventType:
      | 'MESSAGE_SENT_OUT_OF_HOURS'
      | 'URGENT_BUTTON_USED'
      | 'WORKING_STATUS_VIEWED'
      | 'APP_OPENED_OUT_OF_HOURS',
  ) {
    try {
      await prisma.metricEvent.create({
        data: {
          companyId,
          companyMemberId,
          eventType,
        },
      });
    } catch {
      // Best-effort metrics, do not break caller flow
    }
  }

  public async getOwnerMetricsSummary(companyId: string): Promise<OwnerMetricsSummary> {
    const policy = await prisma.companyPolicy.findUnique({
      where: { companyId },
      select: { urgentMessageLimitPerDay: true },
    });
    const dailyLimit = policy?.urgentMessageLimitPerDay ?? 3;

    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const weekAgo = new Date(now.getTime() - 7 * 86400 * 1000);

    const [urgentToday, urgentWeek, outOfHoursMsgs, appOpened] = await Promise.all([
      prisma.metricEvent.count({
        where: {
          companyId,
          eventType: 'URGENT_BUTTON_USED',
          createdAt: { gte: startOfToday },
        },
      }),
      prisma.metricEvent.count({
        where: {
          companyId,
          eventType: 'URGENT_BUTTON_USED',
          createdAt: { gte: weekAgo },
        },
      }),
      prisma.metricEvent.count({
        where: {
          companyId,
          eventType: 'MESSAGE_SENT_OUT_OF_HOURS',
          createdAt: { gte: weekAgo },
        },
      }),
      prisma.metricEvent.count({
        where: {
          companyId,
          eventType: 'APP_OPENED_OUT_OF_HOURS',
          createdAt: { gte: weekAgo },
        },
      }),
    ]);

    return {
      urgentCountToday: urgentToday,
      urgentCountThisWeek: urgentWeek,
      outOfHoursMessagesCount: outOfHoursMsgs,
      appOpenedOutOfHoursCount: appOpened,
      dailyLimit,
    };
  }
}

export default new WorkingHoursService();
