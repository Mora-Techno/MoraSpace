import type { SubscriptionTier } from '@repo/types/company.types';

export const WORKSTATION_USER_LIMITS: Record<SubscriptionTier, number> = {
  free: 4,
  pro: 8,
  enterprise: 16,
};

export function getWorkstationUserLimit(tier: SubscriptionTier): number {
  return WORKSTATION_USER_LIMITS[tier];
}
