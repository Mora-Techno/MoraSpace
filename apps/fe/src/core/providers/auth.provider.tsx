"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { isAuthRoute, isPublicRoute } from "@/configs/routes.config";
import { loadAuthSession } from "@/utils/storage";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = React.useState(true);
  const [authenticated, setAuthenticated] = React.useState(false);
  const [role, setRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    function checkSession() {
      const stored = loadAuthSession();
      if (stored?.refreshToken) {
        setAuthenticated(true);
        setRole(stored.role ?? null);
      } else {
        setAuthenticated(false);
        setRole(null);
      }
      setLoading(false);
    }

    checkSession();
  }, [pathname]);

  React.useEffect(() => {
    if (loading || !pathname) return;

    const onPublic = isPublicRoute(pathname);
    const onAuth = isAuthRoute(pathname);

    if (!authenticated && !onPublic && !onAuth) {
      router.replace("/login");
      return;
    }

    // if (authenticated) {
    //   if (role === "admin") {
    //     router.replace("/admin/dashboard");
    //   } else if (role === "member") {
    //     router.replace("/member/dashboard");
    //   } else {
    //     router.replace("/home");
    //   }
    //   return;
    // }
  }, [loading, authenticated, pathname, router, role]);

  if (loading) return null;

  return <>{children}</>;
}
