"use client";

import DashboardMemberSection from "@/components/page/private/member/dashboard/dashboard-section";

const DashboardMemberContainer = () => {
  return (
    <main className="w-full min-h-screen">
      <DashboardMemberSection
        template={{
          message: "Initial Dashboard Member",
          title: "Dashboard Member",
        }}
      />
    </main>
  );
};

export default DashboardMemberContainer;
