'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import NextTopLoader from 'nextjs-toploader';
import React from 'react';

import { PWAUpdatePrompt } from '@/components/pwa/PWAUpdatePrompt';
import { env } from '@/configs';
import { AuthProvider } from '@/core/providers/auth.provider';
import { LenisProvider } from '@/core/providers/lenis.provinder';
import { ThemeProvider } from '@/core/providers/theme.provider';
import { AlertProvinder } from '@/hooks/useAlert/costum-alert';
import { I18nProvider } from '@/pkg/i18n';
import { ReactQueryClientProvider } from '@/pkg/react-query/query-client.pkg';
import Api from '@/services/api';

import { composeProviders } from './composeProvinders';

const Providers = composeProviders([
  I18nProvider,
  ({ children }) => (
    <GoogleOAuthProvider clientId={env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  ),
  AuthProvider,
  ThemeProvider,
  AlertProvinder,
  LenisProvider,
  ReactQueryClientProvider,
]);

export function AppProviders({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    Api.System.Ping().catch((err) => {
      console.warn('Smart warming ping failed:', err);
    });
  }, []);

  return (
    <Providers>
      <PWAUpdatePrompt />
      <NextTopLoader
        color="#428aff"
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={200}
        zIndex={99999}
      />
      {children}
      {process.env.NODE_ENV === 'development' ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </Providers>
  );
}
