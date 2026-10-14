'use client';

import { PricingSection } from '@/components/page/public/pricing';
import { useSubscription } from '@/hooks/useApi/subscription/useSubcription';
import type { SubscriptionTier } from '@/types/api/subscription';

export default function BillingContainer() {
  const { query, mutate } = useSubscription();
  const { data: mySub } = query.get();
  const createCheckout = mutate.create();
  const cancelSub = mutate.cancel();

  const handleCheckout = (tier: string) => {
    createCheckout.mutate({
      tier: tier as SubscriptionTier,
      provider: 'stripe',
      billingCycle: 'monthly',
    });
  };

  const handleCancel = () => {
    if (confirm('Apakah kamu yakin ingin membatalkan langganan aktif?')) {
      cancelSub.mutate();
    }
  };

  const activeTier = mySub?.subscription?.tier || mySub?.company?.tier || 'free';
  const activeStatus = mySub?.subscription?.status || 'active';
  const periodEnd = mySub?.subscription?.currentPeriodEnd || mySub?.company?.subscriptionEndsAt;

  const subSummary = mySub
    ? {
        tier: activeTier,
        status: activeStatus,
        currentPeriodEnd: periodEnd,
      }
    : null;

  return (
    <PricingSection
      template={{
        title: 'Billing & Paket Langganan',
        desc: 'Kelola dan tinjau paket workspace Anda. Pilih kapasitas yang tepat untuk ritme produktivitas tim.',
      }}
      currentTier={activeTier}
      mySub={subSummary}
      onSelectPlan={handleCheckout}
      isPrivate
    />
  );
}
