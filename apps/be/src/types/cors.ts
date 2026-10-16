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

  // 2. Collect allowed origins from FRONTEND_URL, FRONTEND_URL_STAGING, FRONTEND_URL_PROD, and CORS_ORIGINS
  const rawOrigins: string[] = [];

  const candidateOrigins = [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URL_STAGING,
    process.env.FRONTEND_URL_PROD,
    process.env.CORS_ORIGINS,
  ];

  for (const originStr of candidateOrigins) {
    if (originStr) {
      rawOrigins.push(
        ...originStr
          .split(',')
          .map((o) => o.trim().replace(/\/$/, ''))
          .filter(Boolean),
      );
    }
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
