"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { clearTokens, saveTokens } from "@/server/auth-cookie";
import Api from "@/services/api";
import {
  clearAuthSession,
  loadAuthSession,
  syncAuthFromRefreshResponse,
} from "@/utils/storage";

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

export default function PrivateProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function bootstrapSession() {
      try {
        const stored = loadAuthSession();

        if (!stored?.refreshToken) {
          if (!cancelled) {
            setIsAuthenticated(false);
            setIsReady(true);
            router.replace("/login");
          }
          return;
        }

        // Jika session baru saja diperbarui (misal setelah login), langsung izinkan masuk tanpa memanggil RefreshToken ulang
        const isRecentlyUpdated =
          stored.accessToken &&
          stored.updatedAt &&
          Date.now() - stored.updatedAt < 5 * 60 * 1000;

        if (isRecentlyUpdated) {
          if (!cancelled) {
            setIsAuthenticated(true);
            setIsReady(true);
          }
          return;
        }

        const ok = await restoreAuthSession(stored.refreshToken);
        if (cancelled) return;

        setIsAuthenticated(ok);
        setIsReady(true);

        if (!ok) {
          router.replace("/login");
        }
      } catch {
        if (!cancelled) {
          setIsAuthenticated(false);
          setIsReady(true);
          router.replace("/login");
        }
      }
    }

    void bootstrapSession();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return <>{isReady && isAuthenticated ? children : null}</>;
}
