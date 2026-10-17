'use client';

import { Code2, Home, LogOut, Settings } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/atoms';
import { useApi } from '@/hooks/useApi/useApi';
import { loadAuthSession } from '@/utils/storage';

interface TokenClaims {
  fullName?: string;
  email?: string;
  companyRole?: string;
  platformRole?: string;
}

// Klaim dibaca dari JWT lokal (tanpa endpoint baru) — nama/email/role sudah ada di token.
function readTokenClaims(): TokenClaims | null {
  try {
    const token = loadAuthSession()?.accessToken;
    if (!token) return null;
    const payload = token.split('.')[1];
    if (!payload) return null;
    return JSON.parse(atob(payload)) as TokenClaims;
  } catch {
    return null;
  }
}

function initialsOf(name?: string, email?: string): string {
  const source = name?.trim() || email?.trim() || '?';
  const parts = source.split(/\s+/);
  if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export default function ProfileDropdown() {
  const api = useApi();
  const router = useRouter();
  const pathname = usePathname();
  const settingsRoute = pathname.includes('/owner/') ? '/owner/settings' : '/member/settings';

  const claims = readTokenClaims();
  const logout = api.auth.mutate.logout();
  const { data: company } = api.company.query.getMe();

  const displayName = claims?.fullName || 'Pengguna';
  const displayEmail = claims?.email || '-';
  const displayRole = claims?.companyRole || loadAuthSession()?.role || '-';
  const companyName = (company as { name?: string } | undefined)?.name || '-';
  const platformRole = claims?.platformRole || loadAuthSession()?.platformRole;
  const isDeveloper = platformRole === 'DEVELOPER' || platformRole === 'SUPER_ADMIN';
  const isDeveloperArea = pathname.startsWith('/developer');

  const handleToggleDeveloper = () => {
    if (isDeveloperArea) {
      const target =
        loadAuthSession()?.role?.toLowerCase() === 'owner'
          ? '/owner/dashboard'
          : '/member/dashboard';
      router.push(target);
    } else {
      router.push('/developer/dashboard');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Menu profil"
          className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Avatar className="size-[38px]">
            <AvatarFallback className="bg-primary/10 font-bold text-primary">
              {initialsOf(claims?.fullName, claims?.email)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarFallback className="bg-primary/10 font-bold text-primary">
                {initialsOf(claims?.fullName, claims?.email)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{displayName}</p>
              <p className="truncate text-xs text-muted-foreground">{displayEmail}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="space-y-1.5 px-2 py-2 text-xs">
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">Perusahaan</span>
            <span className="max-w-[150px] truncate font-medium">{companyName}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">Role</span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">
              {displayRole}
            </span>
          </div>
          {isDeveloper && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Platform Role</span>
              <span className="rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 font-semibold text-[10px]">
                {platformRole}
              </span>
            </div>
          )}
        </div>
        <DropdownMenuSeparator />
        {isDeveloper && (
          <DropdownMenuItem
            onClick={handleToggleDeveloper}
            className="cursor-pointer gap-2 text-purple-600 dark:text-purple-400 font-medium"
          >
            {isDeveloperArea ? <Home className="size-4" /> : <Code2 className="size-4" />}
            {isDeveloperArea ? 'Kembali ke Workspace' : 'Developer Console'}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => router.push(settingsRoute)}
          className="cursor-pointer gap-2"
        >
          <Settings className="size-4" />
          Pengaturan
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="cursor-pointer gap-2 text-destructive focus:text-destructive"
        >
          <LogOut className="size-4" />
          {logout.isPending ? 'Keluar...' : 'Keluar'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
