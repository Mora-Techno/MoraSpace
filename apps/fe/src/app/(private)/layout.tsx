import { AppShell } from '@/core/layouts/app-shell.layout';
import PrivateProviders from '@/core/providers/private.provider';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivateProviders>
      <AppShell>{children}</AppShell>
    </PrivateProviders>
  );
}
