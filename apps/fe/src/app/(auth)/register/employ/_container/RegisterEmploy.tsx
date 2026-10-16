'use client';

import { useGoogleLogin } from '@react-oauth/google';
import type { PickRegister } from '@repo/types';
import { useState } from 'react';

import { RegisterFormSection } from '@/components/page/auth';
import { RegisterPageSection } from '@/components/page/auth/register-page.section';
import { useApi } from '@/hooks/useApi/useApi';
import { useTranslation } from '@/pkg/i18n';

export default function RegisterEmployContainer() {
  const { t } = useTranslation('auth');
  const api = useApi();

  const [formRegister, setFormRegister] = useState<PickRegister>({
    email: '',
    fullName: '',
    password: '',
    phone: '',
    companyRole: 'Member',
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const register = api.auth.mutate.register();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = formRegister;
    register.mutateAsync(payload).catch(() => {});
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
        title: t('register.employ_title'),
        subtitle: t('register.employ_subtitle'),
        altPrompt: t('register.as_company'),
        altHref: '/register/company',
        altLink: t('register.as_company_link'),
      }}
      service={{
        onGoogleLogin: googleLogin,
        form: (
          <RegisterFormSection
            service={{
              isPending: register.isPending,
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
