export type WorkingStatus = 'working' | 'out_of_hours';

export interface MemberWorkingStatus {
  companyMemberId: string;
  userId: string;
  status: WorkingStatus;
  statusLabel: string;
  nextWorkingDate: string | null;
  timezone: string;
}

export interface UrgentQuotaStatus {
  usedToday: number;
  dailyLimit: number;
  remainingToday: number;
}

export interface OwnerMetricsSummary {
  urgentCountToday: number;
  urgentCountThisWeek: number;
  outOfHoursMessagesCount: number;
  appOpenedOutOfHoursCount: number;
  dailyLimit: number;
}

export type WorkingHoursStatusQuery = {
  memberId?: string;
};
