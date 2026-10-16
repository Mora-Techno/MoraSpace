'use client';

import PricingSection from '@/components/page/public/pricing/HeroSection';
import NavLayout from '@/core/layouts/nav.layout';

export function PricingPageSection() {
  return (
    <NavLayout>
      <main className="w-full min-h-screen">
        <PricingSection
          template={{
            desc: 'Initial Pricing',
            title: 'Pricing',
          }}
        />
      </main>
    </NavLayout>
  );
}

export default PricingPageSection;
