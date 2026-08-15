"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi/useApi";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import CompanySettingsSection from "@/components/page/private/owner/dashboard/company/settings/CompanySettingsSection";

export default function CompanySettingsContainer() {
  const api = useApi();
  const ns = useAppNameSpace();

  const { data: company, isLoading } = api.company.query.getMe();

  const updateProfile = api.company.mutate.updateProfile();

  const [formUpdate, setFormUpdate] = useState({
    logo: "",
    country: "",
  });

  useEffect(() => {
    if (company) {
      const comp = company as any;
      setFormUpdate({
        logo: comp.logo || "",
        country: comp.country || "",
      });
    }
  }, [company]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(formUpdate);
  };

  return (
    <CompanySettingsSection
      service={{
        handleSubmit,
        isPending: updateProfile.isPending,
        isLoading,
      }}
      state={{
        formUpdate,
        setFormUpdate,
      }}
    />
  );
}
