export const getCorsOrigin = (requestOrigin: string): boolean => {
  if (!requestOrigin) return true;

  const normalizedOrigin = requestOrigin.trim().replace(/\/$/, '');

  // 1. Allow local development origins when in local/dev environment
  const isLocalEnv =
    process.env.APP_ENV === 'local' ||
    process.env.APP_ENV === 'dev' ||
    process.env.APP_ENV === 'development' ||
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'dev';

  if (
    isLocalEnv &&
    /^(http:\/\/localhost(:\d+)?|http:\/\/127\.0\.0\.1(:\d+)?|http:\/\/192\.168\.\d+\.\d+(:\d+)?)/.test(
      normalizedOrigin,
    )
  ) {
    return true;
  }

  // 2. Collect allowed origins from both FRONTEND_URL and CORS_ORIGINS
  const rawOrigins: string[] = [];

  if (process.env.FRONTEND_URL) {
    rawOrigins.push(...process.env.FRONTEND_URL.split(',').map((o) => o.trim().replace(/\/$/, '')));
  }

  if (process.env.CORS_ORIGINS) {
    rawOrigins.push(...process.env.CORS_ORIGINS.split(',').map((o) => o.trim().replace(/\/$/, '')));
  }

  // Allow all if '*' is specified
  if (rawOrigins.includes('*')) {
    return true;
  }

  // Exact match check
  if (rawOrigins.includes(normalizedOrigin)) {
    return true;
  }

  // Wildcard subdomain matching (e.g. *.workers.dev or *.mora.my.id)
  for (const allowed of rawOrigins) {
    if (allowed.includes('*')) {
      const regexStr = `^${allowed.replace(/\./g, '\\.').replace(/\*/g, '.*')}$`;
      if (new RegExp(regexStr).test(normalizedOrigin)) {
        return true;
      }
    }
  }

  return false;
};
