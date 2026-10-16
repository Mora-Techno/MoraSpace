'use client';

import type { PickUpdateCompanyProfile } from '@repo/types';
import { useState } from 'react';

import { AddDocSection } from '@/components/page/netral/add-doc.section';
import { useApi } from '@/hooks/useApi/useApi';

const AddDocContainer = () => {
  const api = useApi();

  const [form, setForm] = useState<PickUpdateCompanyProfile>({
    logo: '',
    country: '',
  });

  const updateProfile = api.company.mutate.updateProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {} as PickUpdateCompanyProfile;
    if (form.logo) payload.logo = form.logo;
    if (form.country) payload.country = form.country;
    if (!payload.logo && !payload.country) return;
    updateProfile.mutateAsync(payload).catch(() => {});
  };

  return (
    <AddDocSection
      service={{ isPending: updateProfile.isPending, onSubmit: handleSubmit }}
      state={{ form, setForm }}
    />
  );
};

export default AddDocContainer;
