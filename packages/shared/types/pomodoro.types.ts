export interface IPomodoroSession {
  id: string;
  companyMemberId: string;
  startedAt: string;
  endedAt: string | null;
  duration: number | null;
}

export type PickStartPomodoro = {
  metadata?: Record<string, unknown>;
};

export type PickStopPomodoro = {
  sessionId?: string;
  duration?: number;
};
