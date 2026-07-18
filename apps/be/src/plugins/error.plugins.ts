import { Elysia } from 'elysia';
import { logger } from '@/utils/logger.utils';

export const errorPlugin = new Elysia().onError(({ request, code, error }) => {
  logger.error(
    {
      method: request.method,
      path: new URL(request.url).pathname,
      code,
      err: error,
    },
    'Request Failed',
  );
});
