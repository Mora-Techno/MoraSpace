'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { JoinCompanySection } from '@/components/page/netral/join-company.section';
import { useApi } from '@/hooks/useApi/useApi';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import { loadAuthSession } from '@/utils/storage';

export const JoinCompanyContainer = () => {
  const api = useApi();
  const ns = useAppNameSpace();
  const searchParams = useSearchParams();

  const initialCode = (searchParams.get('code') || '').toUpperCase().trim();
  const [code, setCode] = useState<string>(initialCode);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(loadAuthSession()?.accessToken));
  }, []);

  const {
    data: preview,
    isLoading: isPreviewLoading,
    error: previewError,
  } = api.company.query.previewJoinCompany(code, code.length >= 6);

  const joinCompany = api.company.mutate.joinCompany();

  const handleJoin = () => {
    if (!code || code.length < 6) return;
    joinCompany.mutate({ code });
  };

  const handleLogin = () => {
    const redirectUrl = code ? `/join?code=${encodeURIComponent(code)}` : '/join';
    ns.router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
  };

  const handleRegister = () => {
    const redirectUrl = code ? `/join?code=${encodeURIComponent(code)}` : '/join';
    ns.router.push(`/register?redirect=${encodeURIComponent(redirectUrl)}`);
  };

  const handleBack = () => {
    if (isLoggedIn) {
      ns.router.push('/member/dashboard');
    } else {
      ns.router.push('/');
    }
  };

  return (
    <JoinCompanySection
      template={{
        title: 'Gabung Perusahaan',
        subtitle:
          'Masukkan kode atau pindai QR code undangan untuk bergabung ke ruang kerja tim Anda.',
      }}
      service={{
        preview: preview ?? null,
        isPreviewLoading,
        previewError,
        isLoggedIn,
        isPending: joinCompany.isPending,
        onJoin: handleJoin,
        onLogin: handleLogin,
        onRegister: handleRegister,
        onBack: handleBack,
      }}
      state={{
        code,
        setCode,
      }}
    />
  );
};

export default JoinCompanyContainer;
