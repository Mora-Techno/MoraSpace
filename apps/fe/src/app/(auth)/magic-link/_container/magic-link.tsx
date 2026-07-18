'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useLayoutEffect } from 'react';

import MagicLinkSection from '@/components/page/auth/magic-link/MagicLinkSection';
import { useApi } from '@/hooks/useApi/useApi';

const MagicLinkContainer = () => {
  const api = useApi();
  const useMagicLink = api.auth.mutate.verifyMagicLink();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleVerifyMagicLink = () => {
    if (!token) return null;
    useMagicLink.mutateAsync({
      token,
    });
  };

  useEffect(() => {
    handleVerifyMagicLink();
  }, [token, searchParams]);

  return (
    <main className="w-full min-h-screen">
      <MagicLinkSection
        initial={{
          title: 'Email Berhasil Diverifikasi',
          desc: 'Magic Link berhasil diverifikasi. Anda akan diarahkan ke dashboard dalam beberapa detik.',
        }}
      />
    </main>
  );
};

export default MagicLinkContainer;
