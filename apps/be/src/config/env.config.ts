import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.string(),
  PORT: z.string(),
  JWT_SECRET: z.string(),
  FRONTEND_URL: z.string().url(),
  INTERNAL_API_SECRET: z.string(),
  RESEND_API_KEY: z.string(),
  RESEND_FROM_EMAIL: z.string(),
  STRIPE_SECRET_KEY: z.string().optional().default(''),
  STRIPE_WEBHOOK_SECRET: z.string().optional().default(''),
  XENDIT_SECRET_KEY: z.string().optional().default(''),
  XENDIT_WEBHOOK_TOKEN: z.string().optional().default(''),
  SUBSCRIPTION_PRO_MONTHLY_USD: z.string().optional().default('500'),
  SUBSCRIPTION_PRO_YEARLY_USD: z.string().optional().default('5000'),
  SUBSCRIPTION_PRO_MONTHLY_IDR: z.string().optional().default('79000'),
  SUBSCRIPTION_PRO_YEARLY_IDR: z.string().optional().default('790000'),
  SUBSCRIPTION_ENTERPRISE_MONTHLY_USD: z.string().optional().default('2500'),
  SUBSCRIPTION_ENTERPRISE_YEARLY_USD: z.string().optional().default('25000'),
  SUBSCRIPTION_ENTERPRISE_MONTHLY_IDR: z.string().optional().default('399000'),
  SUBSCRIPTION_ENTERPRISE_YEARLY_IDR: z.string().optional().default('3990000'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error(' Invalid Env Variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
