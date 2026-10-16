'use client';

import { useEffect, useState } from 'react';

import CompanySettingsSection from '@/components/page/private/owner/dashboard/company/settings/CompanySettingsSection';
import { useApi } from '@/hooks/useApi/useApi';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';

export default function CompanySettingsContainer() {
  const api = useApi();
  const ns = useAppNameSpace();

  const { data: company, isLoading: isCompanyLoading } = api.company.query.getMe();
  const { data: settings, isLoading: isSettingsLoading } = api.company.query.getSettings();
  const { data: metrics } = api.workingHours.query.ownerMetrics('7d');

  const updateProfile = api.company.mutate.updateProfile();
  const updateSettings = api.company.mutate.updateSettings();

  const [formUpdate, setFormUpdate] = useState<{
    logo: string;
    country: string;
    workingHourStart?: string;
    workingHourEnd?: string;
    workDays: string;
    respectWorkingHours?: boolean;
    queueNotification?: boolean;
    urgentMessageLimitPerDay?: number;
  }>({
    logo: '',
    country: '',
    workingHourStart: '09:00',
    workingHourEnd: '17:00',
    workDays: 'mon,tue,wed,thu,fri',
    respectWorkingHours: true,
    queueNotification: true,
    urgentMessageLimitPerDay: 3,
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
        workDays: s.workDays || prev.workDays,
        respectWorkingHours: s.respectWorkingHours ?? prev.respectWorkingHours,
        queueNotification: s.queueNotification ?? prev.queueNotification,
        urgentMessageLimitPerDay: s.urgentMessageLimitPerDay ?? prev.urgentMessageLimitPerDay ?? 3,
      }));
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({ logo: formUpdate.logo, country: formUpdate.country });
    updateSettings.mutate({
      workingHourStart: formUpdate.workingHourStart,
      workingHourEnd: formUpdate.workingHourEnd,
      workDays: formUpdate.workDays,
      respectWorkingHours: formUpdate.respectWorkingHours,
      queueNotification: formUpdate.queueNotification,
      urgentMessageLimitPerDay: formUpdate.urgentMessageLimitPerDay,
    });
  };

  return (
    <CompanySettingsSection
      service={{
        handleSubmit,
        isPending: updateProfile.isPending || updateSettings.isPending,
        isLoading: isCompanyLoading || isSettingsLoading,
        metrics,
      }}
      state={{
        formUpdate,
        setFormUpdate,
      }}
    />
  );
}
