import { t } from 'elysia';

export const StartPomodoroDto = t.Object({
  metadata: t.Optional(t.Record(t.String(), t.Any(), { description: 'Metadata sesi pomodoro' })),
});

export const StopPomodoroDto = t.Object({
  sessionId: t.Optional(t.String({ format: 'uuid', description: 'ID sesi pomodoro' })),
  duration: t.Optional(t.Numeric({ description: 'Durasi fokus dalam detik/menit' })),
});
