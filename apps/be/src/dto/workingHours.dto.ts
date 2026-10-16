import { t } from 'elysia';

export const WorkingHoursStatusQueryDto = t.Object({
  memberId: t.Optional(t.String()),
});
