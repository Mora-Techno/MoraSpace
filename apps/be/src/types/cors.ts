const isLocal = process.env.APP_ENV === "local";

export const corsOrigins = isLocal
  ? ["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"]
  : (process.env.CORS_ORIGINS?.split(",").map((v) => v.trim()) ?? []);
