'use client';

import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

import { isAuthRoute, isPublicRoute } from '@/configs/routes.config';
import { loadAuthSession } from '@/utils/storage';

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

    // Jika belum login dan berada di halaman yang bukan public/auth, hubungkan ke login
    // Catatan: untuk route (private)/* diproteksi lebih spesifik oleh PrivateProviders
    if (!authenticated && !onPublic && !onAuth) {
      router.replace('/login');
      return;
    }

    // Jika sudah login dan mencoba mengakses halaman auth (login/register), arahkan ke dashboard yang sesuai role
    if (authenticated && onAuth) {
      if (role === 'Admin') {
        router.replace('/admin/dashboard');
      } else if (role === 'Member') {
        router.replace('/member/dashboard');
      } else {
        router.replace('/home');
      }
      return;
    }
  }, [loading, authenticated, pathname, router, role]);

  if (loading) return null;

  return <>{children}</>;
}
