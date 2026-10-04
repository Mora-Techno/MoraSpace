import { Elysia } from 'elysia';
import { logger } from '@/utils/logger.utils';

export const errorPlugin = new Elysia().onError(({ request, code, error, set }) => {
  logger.error(
    {
      method: request.method,
      path: new URL(request.url).pathname,
      code,
      err: error,
    },
    'Request Failed',
  );

  const status = code === 'VALIDATION' ? 422 : code === 'PARSE' ? 400 : code === 'NOT_FOUND' ? 404 : 500;
  set.status = status;
  const message = status === 422 ? 'Data request tidak valid'
    : status === 400 ? 'Body request tidak valid'
    : status === 404 ? 'Endpoint tidak ditemukan'
    : 'Terjadi kesalahan pada server';
  return { status, message };
}).as('global');
