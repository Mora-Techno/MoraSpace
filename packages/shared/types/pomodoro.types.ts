export interface IPomodoroSession {
  id: string;
  companyMemberId: string | null;
  userId?: string | null;
  metadata?: Record<string, unknown> | null;
  startedAt: string;
  endedAt: string | null;
  duration: number | null;
}

export type PomodoroQuery = {
  search?: string;
  page?: number;
  limit?: number;
  status?: 'active' | 'completed';
  startDate?: string;
  endDate?: string;
};

export type PickStartPomodoro = {
  metadata?: Record<string, unknown>;
};

export type PickStopPomodoro = {
  sessionId?: string;
  duration?: number;
};
