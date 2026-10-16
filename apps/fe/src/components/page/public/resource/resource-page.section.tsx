'use client';

import ResourceHeroSection from '@/components/page/public/resource/HeroSection';
import NavLayout from '@/core/layouts/nav.layout';

export function ResourcePageSection() {
  return (
    <NavLayout>
      <main className="w-full min-h-screen">
        <ResourceHeroSection
          template={{
            desc: 'Initial Resource',
            title: 'Resouce',
          }}
        />
      </main>
    </NavLayout>
  );
}

export default ResourcePageSection;
