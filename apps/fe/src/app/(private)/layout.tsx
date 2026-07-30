import { AppShell } from "@/core/layouts/app-shell.layout";
import PrivateProviders from "@/core/providers/private.provider";
import { MusicPlayerProvider } from "@/context/MusicPlayerContext";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MusicPlayerProvider>
      <PrivateProviders>
        <AppShell>{children}</AppShell>
      </PrivateProviders>
    </MusicPlayerProvider>
  );
}
