import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const requiredString = z.string().trim().min(1, 'This field is required');


const requiredKeys = [
  "AUTH_SECRET_KEY",
  "NEXT_INTERNAL_API_SECRET",
  "GOOGLE_CLIENT_SECRET",
  "NEXT_CLOUDFLARE_ACCOUNT_ID",
  "NEXT_ACCESS_KEY_ID",
  "NEXT_SECRET_ACCESS_KEY",
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_BACKEND_URL",
  "NEXT_PUBLIC_BASEPATH",
  "NEXT_PUBLIC_GOOGLE_CLIENT_ID",
  "NEXT_PUBLIC_GATE_API",
  "NEXT_PUBLIC_VERSION_API",
  "NEXT_PUBLIC_INTERNAL_API_SECRET",
  "NEXT_PUBLIC_R2_URL",
] as const;

const missingKeys = requiredKeys.filter(
  (key) => !process.env[key]?.trim()
);

console.error("[ENV CHECK] Missing keys:", missingKeys);

export const env = createEnv({
  // Server Environment Variables Configuration
  server: {
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    AUTH_SECRET_KEY: z.string().default('default_build_auth_secret_key'),
    NEXT_INTERNAL_API_SECRET: z
      .string()
      .default('7c829b0d1e2f3a4b5c6d7e8f9a0b1c2d3e4fxa6b7c8d9e0f1a2b3c4d5e6f7a8b'),
    GOOGLE_CLIENT_SECRET: z.string().default('default_google_secret'),
    NEXT_CLOUDFLARE_ACCOUNT_ID: z.string().default('23ad70705473f1205500a8ceb2f70f92'),
    NEXT_ACCESS_KEY_ID: z.string().default('4169985b67402440958aa9b30fb2fa7e'),
    NEXT_SECRET_ACCESS_KEY: z
      .string()
      .default('130cc7ec470d3b5d43ddef14016fc5b57bad9ac5cfc6587e5b7d50405e209d99'),
  },

  // Client Environment Variables Configuration
  client: {
    NEXT_PUBLIC_APP_URL: z
      .string()
      .url()
      .default('https://moraspace-staging.muliaandiki.workers.dev'),
    NEXT_PUBLIC_BACKEND_URL: z.string().url().default('https://api-space-v1.mora.my.id'),
    NEXT_PUBLIC_BASEPATH: z.string().default('/home'),
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().default('qweqwe'),
    NEXT_PUBLIC_GATE_API: z.string().default('/api'),
    NEXT_PUBLIC_VERSION_API: z.string().default('/v1'),
    NEXT_PUBLIC_INTERNAL_API_SECRET: z
      .string()
      .default('7c829b0d1e2f3a4b5c6d7e8f9a0b1c2d3e4fxa6b7c8d9e0f1a2b3c4d5e6f7a8b'),
    NEXT_PUBLIC_R2_URL: z
      .string()
      .url()
      .default('https://pub-7d1a189f820b45b79672171df36ba921.r2.dev'),
  },

  // Runtime Environment Variables Configuration
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    AUTH_SECRET_KEY: process.env.AUTH_SECRET_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_BASEPATH: process.env.NEXT_PUBLIC_BASEPATH,
    NEXT_PUBLIC_R2_URL: process.env.NEXT_PUBLIC_R2_URL,
    NEXT_CLOUDFLARE_ACCOUNT_ID: process.env.NEXT_CLOUDFLARE_ACCOUNT_ID,
    NEXT_ACCESS_KEY_ID: process.env.NEXT_ACCESS_KEY_ID,
    NEXT_SECRET_ACCESS_KEY: process.env.NEXT_SECRET_ACCESS_KEY,
    NEXT_INTERNAL_API_SECRET: process.env.NEXT_INTERNAL_API_SECRET,
    NEXT_PUBLIC_INTERNAL_API_SECRET: process.env.NEXT_PUBLIC_INTERNAL_API_SECRET,
    NEXT_PUBLIC_GATE_API: process.env.NEXT_PUBLIC_GATE_API,
    NEXT_PUBLIC_VERSION_API: process.env.NEXT_PUBLIC_VERSION_API,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },

  // Skip Validation for the following Environment Variables
  skipValidation:
    !!process.env.SKIP_ENV_VALIDATION ||
    process.env.CI === 'true' ||
    process.env.npm_lifecycle_event === 'build' ||
    process.env.npm_lifecycle_event === 'cf:build:staging' ||
    process.env.npm_lifecycle_event === 'cf:build:prod',
  // Make empty strings from Environment Variables as undefined
  emptyStringAsUndefined: true,
  onValidationError: (issues) => {
    const formatted = issues
      .map(
        (i) =>
          `${Array.isArray(i.path) ? i.path.join('.') : String(i.path ?? 'unknown')}: ${i.message}`,
      )
      .join(', ');
    console.error('❌ Invalid environment variables:', formatted);
    throw new Error(`Invalid environment variables: ${formatted}`);
  },
});
