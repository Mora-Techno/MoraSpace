'use client';

import { useGoogleLogin } from '@react-oauth/google';
import type { PickRegisterCompany } from '@repo/types';
import { useState } from 'react';

import { CompanyRegisterFormSection } from '@/components/page/auth';
import { RegisterPageSection } from '@/components/page/auth/register-page.section';
import { useApi } from '@/hooks/useApi/useApi';
import { useTranslation } from '@/pkg/i18n';

export default function RegisterCompanyContainer() {
  const { t } = useTranslation('auth');
  const api = useApi();

  const [formRegister, setFormRegister] = useState<PickRegisterCompany>({
    email: '',
    fullName: '',
    password: '',
    companyName: '',
    tier: 'free',
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const registerCompany = api.company.mutate.registerCompany();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = formRegister;
    registerCompany.mutateAsync(payload).catch(() => {});
  };

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (_codeResponse) => {
      console.log('login google');
    },
    onError: (err) => {
      console.log('Google Login Failed', err);
    },
  });

  return (
    <RegisterPageSection
      template={{
        title: t('register.company_title'),
        subtitle: t('register.company_subtitle'),
        altPrompt: t('register.as_employ'),
        altHref: '/register/employ',
        altLink: t('register.as_employ_link'),
      }}
      service={{
        onGoogleLogin: googleLogin,
        form: (
          <CompanyRegisterFormSection
            service={{
              isPending: registerCompany.isPending,
              onSubmit: handleSubmit,
            }}
            state={{
              formRegister: formRegister,
              setFormRegister: setFormRegister,
              showPassword: showPassword,
              setShowPassword: setShowPassword,
            }}
          />
        ),
      }}
    />
  );
}
