"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

import { KpiCards } from "@/components/organisms/KpiCards";
import { ProductivityChart } from "@/components/organisms/ProductivityChart";
import { TaskDistributionChart } from "@/components/organisms/TaskDistributionChart";
import { BillingWidget } from "@/components/organisms/BillingWidget";
import { PendingApprovalsWidget } from "@/components/organisms/PendingApprovalsWidget";
import { ActivityFeedWidget } from "@/components/organisms/ActivityFeedWidget";
import { AiInsightsBanner } from "@/components/molecules/AiInsightsBanner";
import { OwnerDashboardTemplate } from "@/components/templates/OwnerDashboardTemplate";

gsap.registerPlugin(useGSAP);

export default function OwnerDashboardContainer() {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const widgets = gridRef.current?.querySelectorAll(".gsap-widget");
      if (!widgets?.length) return;

      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.6 },
      });

      tl.fromTo(
        widgets,
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.1 },
      );
    },
    { scope: gridRef },
  );

  return (
    <OwnerDashboardTemplate
      gridRef={gridRef}
      kpiCards={<KpiCards />}
      aiInsightsBanner={<AiInsightsBanner />}
      productivityChart={<ProductivityChart />}
      taskDistributionChart={<TaskDistributionChart />}
      billingWidget={<BillingWidget />}
      pendingApprovalsWidget={<PendingApprovalsWidget />}
      activityFeedWidget={<ActivityFeedWidget />}
    />
  );
}
