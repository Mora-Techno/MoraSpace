"use client";

import { useSubscription } from "@/hooks/useApi/subscription/useSubcription";
import type { SubscriptionTier } from "@/types/api/subscription";
import { BillingSection } from "@/components/page/private/owner/billing/billing.section";

export default function BillingContainer() {
  const { query, mutate } = useSubscription();
  const { data: mySub } = query.get();
  const { data: plans = [], isLoading: isPlansLoading } = query.getPlans();
  const createCheckout = mutate.create();
  const cancelSub = mutate.cancel();

  const handleCheckout = (tier: SubscriptionTier) => {
    createCheckout.mutate({
      tier,
      provider: "stripe",
      billingCycle: "monthly",
    });
  };

  const handleCancel = () => {
    if (confirm("Apakah kamu yakin ingin membatalkan langganan aktif?")) {
      cancelSub.mutate();
    }
  };

  return (
    <BillingSection
      service={{
        mySub,
        plans,
        isPlansLoading,
        handleCheckout,
        handleCancel,
        isCheckoutPending: createCheckout.isPending,
        isCancelPending: cancelSub.isPending,
      }}
    />
  );
}
