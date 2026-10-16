'use client';

import {
  AudienceStrip,
  BottomCtaSection,
  CollaborationSection,
  FaqSection,
  FocusSection,
  HeroSection,
  PersonalWorkspaceSection,
  PhilosophySection,
  RoadmapSection,
  StepsSection,
  WorkflowSection,
} from '@/components/page/public/home';
import NavLayout from '@/core/layouts/nav.layout';

export function HomePageSection() {
  return (
    <NavLayout>
      <div className="min-h-screen bg-background text-foreground pt-16 md:pt-20">
        <HeroSection />
        <WorkflowSection />
        <CollaborationSection />
        <PersonalWorkspaceSection />
        <StepsSection />
        <PhilosophySection />
        <FocusSection />
        <AudienceStrip />
        <RoadmapSection />
        <FaqSection />
        <BottomCtaSection />
      </div>
    </NavLayout>
  );
}

export default HomePageSection;
