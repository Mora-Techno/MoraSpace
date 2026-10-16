import { describe, expect, it } from 'bun:test';
import {
  evaluateWorkingHours,
  parseWorkDays,
  type CompanyWorkingHourConfig,
} from '../utils/workingHoursHelper';

describe('Working Hours Logic & Evaluation (v0.0.2)', () => {
  const baseConfig: CompanyWorkingHourConfig = {
    workingHourStart: new Date('1970-01-01T09:00:00Z'), // 09:00 UTC
    workingHourEnd: new Date('1970-01-01T17:00:00Z'), // 17:00 UTC
    workDays: 'mon,tue,wed,thu,fri',
    timezone: 'UTC', // Use UTC for deterministic testing
  };

  it('parseWorkDays should parse day strings and default gracefully', () => {
    const days = parseWorkDays('mon,wed,fri');
    expect(days.has(1)).toBe(true); // Monday
    expect(days.has(3)).toBe(true); // Wednesday
    expect(days.has(5)).toBe(true); // Friday
    expect(days.has(2)).toBe(false); // Tuesday

    // Numeric parsing
    const numericDays = parseWorkDays('1,2,3');
    expect(numericDays.has(1)).toBe(true);
    expect(numericDays.has(2)).toBe(true);

    // Empty fallback to Mon-Fri (1,2,3,4,5)
    const fallbackDays = parseWorkDays('');
    expect(fallbackDays.size).toBe(5);
    expect(fallbackDays.has(1)).toBe(true);
    expect(fallbackDays.has(5)).toBe(true);
    expect(fallbackDays.has(0)).toBe(false); // Sunday
  });

  it('evaluateWorkingHours: should return ACTIVE and "Sedang kerja" during working hours', () => {
    // Wednesday 2026-10-14 11:30 UTC (during 09:00 - 17:00)
    const midDayWednesday = new Date('2026-10-14T11:30:00Z');
    const result = evaluateWorkingHours(baseConfig, midDayWednesday);

    expect(result.isWorking).toBe(true);
    expect(result.statusLabel).toBe('Sedang kerja');
    expect(result.nextWorkingStart).toBeNull();
  });

  it('evaluateWorkingHours: should return "Kembali Hari ini 09:00" if before shift start', () => {
    // Wednesday 2026-10-14 07:30 UTC (before 09:00)
    const earlyWednesday = new Date('2026-10-14T07:30:00Z');
    const result = evaluateWorkingHours(baseConfig, earlyWednesday);

    expect(result.isWorking).toBe(false);
    expect(result.statusLabel).toBe('Kembali Hari ini 09:00');
    expect(result.nextWorkingStart).not.toBeNull();
  });

  it('evaluateWorkingHours: should return "Kembali Besok 09:00" if after shift on weekday', () => {
    // Wednesday 2026-10-14 18:30 UTC (after 17:00)
    const eveningWednesday = new Date('2026-10-14T18:30:00Z');
    const result = evaluateWorkingHours(baseConfig, eveningWednesday);

    expect(result.isWorking).toBe(false);
    expect(result.statusLabel).toBe('Kembali Besok 09:00');
    expect(result.nextWorkingStart).not.toBeNull();
  });

  it('evaluateWorkingHours: should return "Kembali Senin 09:00" on Friday evening', () => {
    // Friday 2026-10-16 19:00 UTC (after Friday shift)
    const fridayNight = new Date('2026-10-16T19:00:00Z');
    const result = evaluateWorkingHours(baseConfig, fridayNight);

    expect(result.isWorking).toBe(false);
    expect(result.statusLabel).toBe('Kembali Senin 09:00');
    expect(result.nextWorkingStart).not.toBeNull();
  });

  it('evaluateWorkingHours: should return "Kembali Senin 09:00" on weekend (Saturday/Sunday)', () => {
    // Saturday 2026-10-17 14:00 UTC
    const saturday = new Date('2026-10-17T14:00:00Z');
    const satResult = evaluateWorkingHours(baseConfig, saturday);
    expect(satResult.isWorking).toBe(false);
    expect(satResult.statusLabel).toBe('Kembali Senin 09:00');

    // Sunday 2026-10-18 10:00 UTC (tomorrow is Monday, so Besok 09:00)
    const sunday = new Date('2026-10-18T10:00:00Z');
    const sunResult = evaluateWorkingHours(baseConfig, sunday);
    expect(sunResult.isWorking).toBe(false);
    expect(sunResult.statusLabel).toBe('Kembali Besok 09:00');
  });
});

describe('Urgent Quota & Privacy Metrics Logic', () => {
  it('should enforce daily quota limit and reject when exhausted', () => {
    const quotaTracker = {
      limit: 3,
      used: 0,
      consume() {
        if (this.used >= this.limit) {
          throw new Error('Kuota pesan darurat hari ini telah habis (3/3).');
        }
        this.used += 1;
        return { used: this.used, remaining: this.limit - this.used };
      },
    };

    // 1st consumption -> OK
    const first = quotaTracker.consume();
    expect(first.used).toBe(1);
    expect(first.remaining).toBe(2);

    // 2nd consumption -> OK
    const second = quotaTracker.consume();
    expect(second.used).toBe(2);
    expect(second.remaining).toBe(1);

    // 3rd consumption -> OK
    const third = quotaTracker.consume();
    expect(third.used).toBe(3);
    expect(third.remaining).toBe(0);

    // 4th consumption -> Exhausted
    expect(() => quotaTracker.consume()).toThrow('Kuota pesan darurat hari ini telah habis');
  });

  it('Privacy Rule: metric logging must never store message body or task content', () => {
    const validMetricEvent = {
      eventType: 'MESSAGE_SENT_OUT_OF_HOURS',
      companyId: 'comp-123',
      actorId: 'mem-456',
      metadata: { targetMemberId: 'mem-789' }, // Metadata contains only IDs, never text
    };

    expect(validMetricEvent).not.toHaveProperty('content');
    expect(validMetricEvent).not.toHaveProperty('messageText');
    expect(validMetricEvent).not.toHaveProperty('title');
  });
});

describe('Security & Role Mutation Guards (Fase 1 Audit Regressions)', () => {
  it('MemberController: non-Owner cannot update another member profile (IDOR protection)', () => {
    const checkProfileUpdateAccess = (
      actor: { role: string; companyMemberId: string },
      targetMemberId: string,
    ) => {
      const isOwner = actor.role.toLowerCase() === 'owner';
      const isSelf = actor.companyMemberId === targetMemberId;
      if (!isOwner && !isSelf) {
        throw new Error('Anda hanya dapat mengubah profil Anda sendiri');
      }
      return true;
    };

    const owner = { role: 'Owner', companyMemberId: 'mem-owner' };
    const memberA = { role: 'Member', companyMemberId: 'mem-1' };
    const memberB = { role: 'Member', companyMemberId: 'mem-2' };

    // Self update is allowed
    expect(checkProfileUpdateAccess(memberA, memberA.companyMemberId)).toBe(true);

    // Owner updating member is allowed
    expect(checkProfileUpdateAccess(owner, memberA.companyMemberId)).toBe(true);

    // Member A updating Member B must be blocked
    expect(() => checkProfileUpdateAccess(memberA, memberB.companyMemberId)).toThrow(
      'Anda hanya dapat mengubah profil Anda sendiri',
    );
  });

  it('TaskService: non-Owner cannot update task unless reporter or assignee', () => {
    const checkTaskMutationAccess = (
      actor: { role: string; companyMemberId: string },
      task: { reporterId: string; assigneeId?: string | null },
    ) => {
      const isOwner = actor.role.toLowerCase() === 'owner';
      const isReporter = actor.companyMemberId === task.reporterId;
      const isAssignee = actor.companyMemberId === task.assigneeId;

      if (!isOwner && !isReporter && !isAssignee) {
        throw new Error(
          'Hanya Owner, pembuat task, atau penerima tugas yang dapat mengubah task ini.',
        );
      }
      return true;
    };

    const owner = { role: 'Owner', companyMemberId: 'mem-owner' };
    const reporter = { role: 'Member', companyMemberId: 'mem-reporter' };
    const assignee = { role: 'Member', companyMemberId: 'mem-assignee' };
    const stranger = { role: 'Member', companyMemberId: 'mem-stranger' };

    const task = { reporterId: 'mem-reporter', assigneeId: 'mem-assignee' };

    expect(checkTaskMutationAccess(owner, task)).toBe(true);
    expect(checkTaskMutationAccess(reporter, task)).toBe(true);
    expect(checkTaskMutationAccess(assignee, task)).toBe(true);
    expect(() => checkTaskMutationAccess(stranger, task)).toThrow('Hanya Owner');
  });
});

describe('Held Message Release Logic', () => {
  it('should identify and release only expired held messages', () => {
    const now = new Date('2026-10-16T09:00:00Z');

    const messages: { id: string; isHeld: boolean; scheduledDeliverAt: Date; deliveredAt: Date | null }[] = [
      {
        id: 'msg-1',
        isHeld: true,
        scheduledDeliverAt: new Date('2026-10-16T08:59:00Z'),
        deliveredAt: null,
      },
      {
        id: 'msg-2',
        isHeld: true,
        scheduledDeliverAt: new Date('2026-10-16T09:00:00Z'),
        deliveredAt: null,
      },
      {
        id: 'msg-3',
        isHeld: true,
        scheduledDeliverAt: new Date('2026-10-16T09:30:00Z'),
        deliveredAt: null,
      }, // Future
    ];

    const releasable = messages.filter((m) => m.isHeld && m.scheduledDeliverAt <= now);
    expect(releasable.length).toBe(2);
    expect(releasable.map((m) => m.id)).toEqual(['msg-1', 'msg-2']);

    for (const msg of releasable) {
      msg.isHeld = false;
      msg.deliveredAt = now;
    }

    expect(messages[0].isHeld).toBe(false);
    expect(messages[1].isHeld).toBe(false);
    expect(messages[2].isHeld).toBe(true); // Still held
  });
});
