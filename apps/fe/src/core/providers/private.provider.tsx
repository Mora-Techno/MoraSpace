"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import {
  clearAuthSession,
  loadAuthSession,
  syncAuthFromRefreshResponse,
} from "@/utils/storage";

async function restoreAuthSession() {
  const stored = loadAuthSession();
  const respone = await fetch("/auth/api/v1/refresh", {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      stored?.refreshToken ? { refreshToken: stored.refreshToken } : {},
    ),
  });
  if (!respone.ok) {
    clearAuthSession();
    return false;
  }
  const json = (await respone.json().catch(() => null)) as {
    data?: unknown;
  } | null;

  syncAuthFromRefreshResponse(json?.data, stored);
  return true;
}

export default function PrivateProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function bootstrapSession() {
      try {
        const ok = await restoreAuthSession();
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

  return <> {isReady && isAuthenticated ? children : null}</>;
}
