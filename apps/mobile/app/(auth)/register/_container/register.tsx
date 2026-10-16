'use client';
import type { PickRegister } from '@repo/types';
import { router } from 'expo-router';
import { useState } from 'react';

import { type RegisterMode, RegisterSection } from '@/components/section/auth/register-section';
import { useApi } from '@/hooks/service/useApi';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';

const RegisterContainer = () => {
  const api = useApi();
  const ns = useAppNameSpace();
  const [mode, setMode] = useState<RegisterMode>('individual');
  const [companyName, setCompanyName] = useState('');
  const [form, setForm] = useState<PickRegister>({
    email: '',
    fullName: '',
    password: '',
    phone: '',
    companyRole: 'Member',
  });

  const register = api.auth.mutate.register();
  const registerCompany = api.company.mutate.registerCompany();
  const isPending = register.isPending || registerCompany.isPending;

  const handleSubmit = () => {
    if (!form.fullName || !form.email || !form.password) {
      ns.alert.toast({
        title: 'Validasi',
        message: 'Nama, email, dan password wajib diisi',
        icon: 'warning',
      });
      return;
    }
    if (mode === 'company') {
      if (!companyName.trim()) {
        ns.alert.toast({ title: 'Validasi', message: 'Nama company wajib diisi', icon: 'warning' });
        return;
      }
      registerCompany.mutate(
        {
          companyName: companyName.trim(),
          email: form.email,
          fullName: form.fullName,
          password: form.password,
        },
        { onSuccess: () => router.push('/(auth)/login/page') },
      );
      return;
    }
    register.mutate(form);
  };

  return (
    <RegisterSection
      service={{ isPending, onSubmit: handleSubmit }}
      state={{
        mode,
        setMode,
        companyName,
        setCompanyName,
        fullName: form.fullName,
        setFullName: (v) => setForm((p) => ({ ...p, fullName: v })),
        email: form.email,
        setEmail: (v) => setForm((p) => ({ ...p, email: v })),
        password: form.password,
        setPassword: (v) => setForm((p) => ({ ...p, password: v })),
      }}
    />
  );
};

export default RegisterContainer;
