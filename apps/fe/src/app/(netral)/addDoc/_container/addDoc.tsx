'use client';

import { PickUpdateCompanyProfile } from '@repo/types';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { GhibliCard } from '@/components/molecules/GhibliCard';
import { ActionButton, DecoratedInput } from '@/components/wrapper';
import { LanguageDropdown } from '@/core/components/language.dropdown';
import { useApi } from '@/hooks/useApi/useApi';
import { useTranslation } from '@/pkg/i18n';

const AddDocContainer = () => {
  const { t } = useTranslation('netral');
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
    <main className="relative flex min-h-screen items-center justify-center p-4 w-full">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <LanguageDropdown />
      </div>
      <GhibliCard className="w-full max-w-md" hover={false}>
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <Image
            alt="icon"
            src={'/images/logo.png'}
            width={46}
            height={46}
            className="rounded-full"
          />
          <span className="text-lg font-semibold">{t('addDoc.brand')}</span>
          <h1 className="font-serif text-2xl font-semibold">{t('addDoc.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('addDoc.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="logo" className="text-sm font-medium">
              {t('addDoc.logo_label')}
            </label>
            <DecoratedInput
              id="logo"
              type="text"
              value={form.logo ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, logo: e.target.value }))}
              placeholder={t('addDoc.logo_placeholder')}
              className="w-full rounded-xl border border-input bg-background/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="country" className="text-sm font-medium">
              {t('addDoc.country_label')}
            </label>
            <DecoratedInput
              id="country"
              type="text"
              value={form.country ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
              placeholder={t('addDoc.country_placeholder')}
              className="w-full rounded-xl border border-input bg-background/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <ActionButton
            type="submit"
            className="ghibli-btn w-full"
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? t('addDoc.submitting') : t('addDoc.submit_btn')}
          </ActionButton>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">{t('addDoc.hint')}</p>
        <Link href={'/login'} className="block mt-2">
          <ActionButton size={'sm'} type="button" variant={'outline'} className="ghibli-btn w-full">
            {t('addDoc.skip')}
          </ActionButton>
        </Link>
      </GhibliCard>
    </main>
  );
};

export default AddDocContainer;
