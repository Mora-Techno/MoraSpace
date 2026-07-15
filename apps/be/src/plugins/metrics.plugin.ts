import { Elysia } from 'elysia';
import { logger } from '@/utils/logger.utils';

export const metricsPlugin = new Elysia().onAfterHandle(({ request, startedAt }: any) => {
  const duration = Math.round(performance.now() - startedAt);

  logger.debug(
    {
      endpoint: new URL(request.url).pathname,
      duration,
    },
    'Metrics',
  );
});
