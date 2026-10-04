import { Elysia } from 'elysia';
import { randomUUID } from 'node:crypto';
import { logger } from '@/utils/logger.utils';

export const loggerPlugin = new Elysia()

  .derive(() => ({
    requestId: randomUUID(),
    startedAt: performance.now(),
  }))

  .onBeforeHandle(({ request, requestId }) => {
    logger.debug(
      {
        requestId,
        method: request.method,
        path: new URL(request.url).pathname,
      },
      'Incoming Request',
    );
  })

  .onAfterHandle(({ request, requestId, startedAt, set, response }) => {
    const duration = Math.round(performance.now() - startedAt);

    logger.info(
      {
        requestId,
        method: request.method,
        path: new URL(request.url).pathname,
        status: response instanceof Response ? response.status : set.status,
        duration,
      },
      'Request Completed',
    );
  })
  .as('global');
