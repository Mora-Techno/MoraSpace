const isLocal =
  process.env.APP_ENV === "local" || process.env.NODE_ENV === "development";

export const getCorsOrigin = (requestOrigin: string) => {
  if (isLocal) {
    return /^(http:\/\/localhost:|http:\/\/127\.0\.0\.1:|http:\/\/192\.168\.)/.test(
      requestOrigin,
    );
  }

  const allowedOrigins =
    process.env.CORS_ORIGINS?.split(",").map((v) =>
      v.trim().replace(/\/$/, ""),
    ) ?? [];
  return allowedOrigins.includes(requestOrigin);
};
