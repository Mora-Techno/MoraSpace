import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { ThemeProvider } from '@/core/providers/theme.provinder';
import { AlertProvinder } from '@/hooks/useAlert/costum-alert';
import { ReactQueryClientProvider } from '@/pkg/react-query/query-client.pkg';
import { persistor, store } from '@/stores/store';
import React, { useEffect } from 'react';
import Api from '@/service/props.service';

import { composeProviders } from './composeProvinder';

const Providers = composeProviders([
  ({ children }) => <Provider store={store}>{children}</Provider>,
  ({ children }) => <PersistGate persistor={persistor}>{children}</PersistGate>,
  ReactQueryClientProvider,
  ThemeProvider,
  AlertProvinder,
]);

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    Api.System.Ping().catch((err) => {
      console.warn('Smart warming ping failed:', err);
    });
  }, []);

  return <Providers>{children}</Providers>;
}
