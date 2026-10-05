'use client';

import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi/useApi';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import CompanySettingsSection from '@/components/page/private/owner/dashboard/company/settings/CompanySettingsSection';

export default function CompanySettingsContainer() {
  const api = useApi();
  const ns = useAppNameSpace();

  const { data: company, isLoading: isCompanyLoading } = api.company.query.getMe();
  const { data: settings, isLoading: isSettingsLoading } = api.company.query.getSettings();

  const updateProfile = api.company.mutate.updateProfile();
  const updateSettings = api.company.mutate.updateSettings();

  const [formUpdate, setFormUpdate] = useState<{
    logo: string;
    country: string;
    workingHourStart?: string;
    workingHourEnd?: string;
    respectWorkingHours?: boolean;
    queueNotification?: boolean;
  }>({
    logo: '',
    country: '',
    workingHourStart: '09:00',
    workingHourEnd: '17:00',
    respectWorkingHours: true,
    queueNotification: true,
  });

  useEffect(() => {
    if (company) {
      const comp = company as any;
      setFormUpdate((prev) => ({
        ...prev,
        logo: comp.logo || '',
        country: comp.country || '',
      }));
    }
  }, [company]);

  useEffect(() => {
    if (settings) {
      const s = settings as any;
      setFormUpdate((prev) => ({
        ...prev,
        workingHourStart: s.workingHourStart || prev.workingHourStart,
        workingHourEnd: s.workingHourEnd || prev.workingHourEnd,
        respectWorkingHours: s.respectWorkingHours ?? prev.respectWorkingHours,
        queueNotification: s.queueNotification ?? prev.queueNotification,
      }));
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({ logo: formUpdate.logo, country: formUpdate.country });
    updateSettings.mutate({
      workingHourStart: formUpdate.workingHourStart,
      workingHourEnd: formUpdate.workingHourEnd,
      respectWorkingHours: formUpdate.respectWorkingHours,
      queueNotification: formUpdate.queueNotification,
    });
  };

  return (
    <CompanySettingsSection
      service={{
        handleSubmit,
        isPending: updateProfile.isPending || updateSettings.isPending,
        isLoading: isCompanyLoading || isSettingsLoading,
      }}
      state={{
        formUpdate,
        setFormUpdate,
      }}
    />
  );
}
