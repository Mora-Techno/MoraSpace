"use client";
import { useGsapStagger } from "@/hooks/useGsapStagger";
import DashboardMemberSection from "@/components/page/private/member/dashboard/dashboard-section";

export default function DashboardContainer() {
  const gridRef = useGsapStagger<HTMLDivElement>([]);

  return (
    <DashboardMemberSection
      template={{
        gridRef: gridRef,
        message: "",
        title: "",
      }}
    />
  );
}
