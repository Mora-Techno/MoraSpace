import type { Prisma } from '@prisma/client';
import type { BillingCycle, SubscriptionTier } from '@repo/types/company.types';
import { getPlan } from '@/config/subscriptionPlans';
import prisma from 'prisma/client';

type PrismaClientLike = Prisma.TransactionClient | typeof prisma;

export function mapPlanNameToTier(name: string): SubscriptionTier {
  const normalized = name.toLowerCase();
  if (normalized.includes('enterprise')) return 'enterprise';
  if (normalized.includes('pro')) return 'pro';
  return 'free';
}

export async function ensurePlan(tier: SubscriptionTier, client: PrismaClientLike = prisma) {
  const config = getPlan(tier);
  const existing = await client.plan.findFirst({
    where: { name: { equals: config.name, mode: 'insensitive' } },
  });

  if (existing) return existing;

  return client.plan.create({
    data: {
      name: config.name,
      priceMonthly: config.prices.monthly.usd,
      priceYearly: config.prices.yearly.usd,
      maxMembers: config.maxWorkstationUsers,
      features: {
        tier,
        billingCycles: ['monthly', 'yearly'],
        featureList: config.features,
      },
    },
  });
}

export async function getCompanyTier(companyId: string): Promise<SubscriptionTier> {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      currentSubscription: { include: { plan: true } },
      subscriptions: {
        where: { status: 'active' },
        include: { plan: true },
        orderBy: { currentPeriodEnd: 'desc' },
        take: 1,
      },
    },
  });

  const plan =
    company?.currentSubscription?.plan ?? company?.subscriptions[0]?.plan ?? null;

  return plan ? mapPlanNameToTier(plan.name) : 'free';
}

export function inferBillingCycle(
  subscription: { currentPeriodStart: Date | null; currentPeriodEnd: Date | null } | null,
): BillingCycle {
  if (!subscription?.currentPeriodStart || !subscription.currentPeriodEnd) {
    return 'monthly';
  }

  const diffMs =
    subscription.currentPeriodEnd.getTime() - subscription.currentPeriodStart.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays > 120 ? 'yearly' : 'monthly';
}
