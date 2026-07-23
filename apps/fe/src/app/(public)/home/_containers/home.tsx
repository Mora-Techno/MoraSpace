"use client";

import {
  CtaSection,
  FeaturesSection,
  HeroSection,
  ShowcaseSection,
  StatsSection,
} from "@/components/page/public";
import NavLayout from "@/core/layouts/nav.layout";
export default function ContainerHome() {
  return (
    <NavLayout>
      <div className="landing-dark min-h-screen bg-background pt-24 ">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <ShowcaseSection />
        <CtaSection />
      </div>
    </NavLayout>
  );
}
