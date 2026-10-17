'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ChatSocketProvider } from '@/hooks/useChatSocket';
import { clearTokens, saveTokens } from '@/server/auth-cookie';
import Api from '@/services/api';
import { clearAuthSession, loadAuthSession, syncAuthFromRefreshResponse } from '@/utils/storage';

async function restoreAuthSession(refreshToken: string) {
  try {
    const response = await Api.Auth.RefreshToken({ refreshToken });

    if (!response?.data) {
      clearAuthSession();
      await clearTokens().catch(() => {});
      return false;
    }

    const data = response.data;
    const accessToken = data.accessToken;
    const newRefreshToken = data.refreshToken || refreshToken;
    const role =
      (data.user as Record<string, any>)?.companyRole ??
      (data.user as Record<string, any>)?.role ??
      (data as Record<string, any>)?.role;

    if (accessToken && newRefreshToken) {
      await saveTokens({
        role: role,
        accessToken: accessToken,
        refreshToken: newRefreshToken,
      });
      syncAuthFromRefreshResponse(data, {
        refreshToken: newRefreshToken,
        role: role,
        updatedAt: Date.now(),
      });
      return true;
    }

    clearAuthSession();
    await clearTokens().catch(() => {});
    return false;
  } catch {
    clearAuthSession();
    await clearTokens().catch(() => {});
    return false;
  }
}

function getStoredPlatformRole(): string | null {
  const session = loadAuthSession();
  if (session?.platformRole) return session.platformRole;
  if (!session?.accessToken) return null;
  try {
    const payload = JSON.parse(atob(session.accessToken.split('.')[1]));
    return payload?.platformRole ?? null;
  } catch {
    return null;
  }
}

function checkRoleAccess(
  pathname: string,
  role: string | null | undefined,
  platformRole?: string | null,
) {
  const normalizedRole = role?.toLowerCase() ?? null;
  const normalizedPlatformRole = platformRole?.toUpperCase() ?? null;

  if (pathname.startsWith('/developer')) {
    return normalizedPlatformRole === 'DEVELOPER' || normalizedPlatformRole === 'SUPER_ADMIN';
  }
  if (pathname.startsWith('/owner')) {
    return normalizedRole === 'owner';
  }
  if (pathname.startsWith('/member')) {
    return normalizedRole !== 'owner';
  }
  return true;
}

export default function PrivateProviders({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function bootstrapSession() {
      try {
        const stored = loadAuthSession();

        if (!stored?.refreshToken) {
          if (!cancelled) {
            setIsAuthenticated(false);
            setIsReady(true);

            if (window.location.pathname !== '/login') {
              router.replace('/login');
            }
          }
          return;
        }

        const isRecentlyUpdated =
          stored.accessToken && stored.updatedAt && Date.now() - stored.updatedAt < 5 * 60 * 1000;

        if (isRecentlyUpdated) {
          if (!cancelled) {
            setRole(stored.role ?? null);
            setIsAuthenticated(true);
            setIsReady(true);
          }
          return;
        }

        const ok = await restoreAuthSession(stored.refreshToken);
        if (cancelled) return;

        const refreshed = loadAuthSession();

        setRole(refreshed?.role ?? null);
        setIsAuthenticated(ok);
        setIsReady(true);

        if (!ok && window.location.pathname !== '/login') {
          router.replace('/login');
        }
      } catch {
        if (!cancelled) {
          setIsAuthenticated(false);
          setIsReady(true);
          if (window.location.pathname !== '/login') {
            router.replace('/login');
          }
        }
      }
    }

    void bootstrapSession();
    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    if (!isReady || !isAuthenticated) return;

    // Baca fresh dari storage: switch workspace persist session baru (sinkron)
    // sebelum router.replace, sedangkan state role hanya di-set saat bootstrap.
    const freshRole = loadAuthSession()?.role ?? role;
    if (freshRole !== role) setRole(freshRole);

    const platformRole = getStoredPlatformRole();
    if (!checkRoleAccess(pathname, freshRole, platformRole)) {
      const normalizedRole = freshRole?.toLowerCase();
      const redirectTo = normalizedRole === 'owner' ? '/owner/dashboard' : '/member/dashboard';
      router.replace(redirectTo);
    }
  }, [isReady, isAuthenticated, pathname, role, router]);

  useEffect(() => {
    if (!isReady || !isAuthenticated) return;
    if (typeof window === 'undefined') return;
    const sessionKey = 'mora_off_hours_app_opened';
    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, '1');
      void Api.WorkingHours.RecordAppOpened().catch(() => {});
    }
  }, [isReady, isAuthenticated]);

  return (
    <ChatSocketProvider>
      <>{isReady && isAuthenticated ? children : null}</>
    </ChatSocketProvider>
  );
}
