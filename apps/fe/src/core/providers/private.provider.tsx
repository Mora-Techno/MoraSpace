"use client";

import { usePathname, useRouter } from "next/navigation";
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

function checkRoleAccess(pathname: string, role: string | null | undefined) {
  const normalizedRole = role?.toLowerCase() ?? null;
  if (pathname.startsWith("/owner")) {
    return normalizedRole === "owner";
  }
  if (pathname.startsWith("/member")) {
    return normalizedRole !== "owner";
  }
  return true;
}

export default function PrivateProviders({
  children,
}: {
  children: React.ReactNode;
}) {
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
            router.replace("/login");
          }
          return;
        }

        const isRecentlyUpdated =
          stored.accessToken &&
          stored.updatedAt &&
          Date.now() - stored.updatedAt < 5 * 60 * 1000;

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

  // Role-based route guard — hanya jalankan sekali setelah session siap,
  // pathname tidak diikutkan agar tidak redirect tiap navigasi
  useEffect(() => {
    if (!isReady || !isAuthenticated) return;

    if (!checkRoleAccess(pathname, role)) {
      const normalizedRole = role?.toLowerCase();
      const redirectTo =
        normalizedRole === "owner" ? "/owner/dashboard" : "/member/dashboard";
      router.replace(redirectTo);
    }
    // Hanya depend pada isReady & isAuthenticated (single-run setelah bootstrap)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, isAuthenticated]);

  return <>{isReady && isAuthenticated ? children : null}</>;
}
