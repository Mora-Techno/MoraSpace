'use client';

import type { PickForgotPassword } from '@repo/types';
import type React from 'react';
import { useState } from 'react';

import ForgotPasswordSection from '@/components/page/auth/ForgotPassword/ForgotPasswordSection';
import { useApi } from '@/hooks/useApi/useApi';

const ForgotPasswordContainer = () => {
  const api = useApi();
  const useForgotPassword = api.auth.mutate.forgotPassword();

  const [formSendMagicLink, setFormSendMagicLink] = useState<PickForgotPassword>({
    email: '',
  });

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = formSendMagicLink;
    useForgotPassword.mutate(payload);
  };

  return (
    <ForgotPasswordSection
      service={{
        isPending: useForgotPassword.isPending,
        onForgotPassword: handleForgotPassword,
      }}
      state={{
        formSendMagicLink: formSendMagicLink,
        setFormSendMagicLink: setFormSendMagicLink,
      }}
    />
  );
};

export default ForgotPasswordContainer;
