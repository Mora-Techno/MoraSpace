import React from 'react';

import { PricingSection, type PricingSectionProps } from '@/components/page/public/pricing';
import type { SubscriptionTier } from '@/types/api/subscription';

export interface BillingSectionProps {
  service: {
    mySub?: any;
    plans?: any[];
    isPlansLoading?: boolean;
    handleCheckout?: (tier: SubscriptionTier | string) => void;
    handleCancel?: () => void;
    isCheckoutPending?: boolean;
    isCancelPending?: boolean;
  };
}

export const BillingSection: React.FC<BillingSectionProps> = ({ service }) => {
  return (
    <PricingSection
      template={{
        title: 'Billing & Paket Langganan',
        desc: 'Paket langganan workspace. v0.0.1: read-only — ganti paket via Super Admin.',
      }}
      currentTier={service?.mySub?.tier || 'free'}
      mySub={service?.mySub}
      onSelectPlan={service?.handleCheckout}
      isPrivate
    />
  );
};
