"use client";

import OwnerTeamSection from "@/components/page/private/owner/team/OwnerTeamSection";
import { useApi } from "@/hooks/useApi/useApi";

const TeamContainer = () => {
  const api = useApi();
  return <OwnerTeamSection />;
};

export default TeamContainer;
