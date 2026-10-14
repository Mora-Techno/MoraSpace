'use client';

import type { WorkspaceItem } from '@repo/types';
import { Building2, Check, ChevronsUpDown, Loader2, User } from 'lucide-react';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/atoms';
import { useApi } from '@/hooks/useApi/useApi';
import { useChatSocket } from '@/hooks/useChatSocket';
import { cn } from '@/utils/classname';
import { loadAuthSession } from '@/utils/storage';

interface TokenClaims {
  id?: string;
  fullName?: string;
  email?: string;
  companyRole?: string;
  companyId?: string | null;
  workspaceType?: 'personal' | 'company';
}

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

interface WorkspaceSwitcherProps {
  className?: string;
  collapsed?: boolean;
}

export function WorkspaceSwitcher({ className, collapsed = false }: WorkspaceSwitcherProps) {
  const api = useApi();
  const { reconnect } = useChatSocket();
  const claims = readTokenClaims();
  const { data: workspacesData, isLoading } = api.auth.query.workspaces();
  const switchWorkspace = api.auth.mutate.switchWorkspace();

  const isPersonalActive = !claims?.companyId || claims?.workspaceType === 'personal';
  const activeCompany = workspacesData?.companies?.find(
    (c: WorkspaceItem) => c.id === claims?.companyId,
  );

  const currentWorkspaceName = isPersonalActive
    ? 'Personal Workspace'
    : activeCompany?.name || 'Company Workspace';

  const currentWorkspaceRole = isPersonalActive
    ? 'Individual'
    : activeCompany?.role || claims?.companyRole || 'Member';

  const handleSwitch = async (workspaceId: string) => {
    if (isPersonalActive && workspaceId === 'personal') return;
    if (!isPersonalActive && claims?.companyId === workspaceId) return;

    try {
      await switchWorkspace.mutateAsync({ workspaceId });
      reconnect();
    } catch (err) {
      console.error('Failed to switch workspace:', err);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={collapsed ? 'icon' : 'sm'}
          className={cn(
            'flex items-center gap-2 rounded-xl border-border/60 bg-background/50 hover:bg-accent/70 transition-all text-left font-normal shadow-xs',
            collapsed
              ? 'size-10 justify-center p-0'
              : 'h-10 px-3 py-1.5 min-w-[160px] max-w-[240px]',
            switchWorkspace.isPending && 'opacity-70 pointer-events-none',
            className,
          )}
          title={currentWorkspaceName}
        >
          {switchWorkspace.isPending ? (
            <Loader2 className="size-4 animate-spin text-primary shrink-0" />
          ) : isPersonalActive ? (
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <User className="size-4" />
            </div>
          ) : (
            <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <Building2 className="size-4" />
            </div>
          )}

          {!collapsed && (
            <div className="flex flex-1 flex-col overflow-hidden leading-tight">
              <span className="truncate text-xs font-semibold text-foreground">
                {currentWorkspaceName}
              </span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                {isPersonalActive ? (
                  <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
                ) : (
                  <span className="inline-block size-1.5 rounded-full bg-amber-500" />
                )}
                {currentWorkspaceRole}
              </span>
            </div>
          )}

          {!collapsed && (
            <ChevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground/70" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64 p-1.5 rounded-xl">
        <DropdownMenuLabel className="px-2 py-1.5 text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">
          Ganti Workspace
        </DropdownMenuLabel>

        {/* Personal Workspace Option */}
        <DropdownMenuItem
          onClick={() => handleSwitch('personal')}
          className={cn(
            'flex items-center gap-2.5 rounded-lg px-2.5 py-2 cursor-pointer transition-colors',
            isPersonalActive && 'bg-primary/10 font-medium text-primary',
          )}
        >
          <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary shrink-0">
            <User className="size-4" />
          </div>
          <div className="flex flex-1 flex-col">
            <span className="text-xs font-medium">Personal Workspace</span>
            <span className="text-[10px] text-muted-foreground">Tugas & catatan pribadi</span>
          </div>
          {isPersonalActive && <Check className="size-4 text-primary ml-auto" />}
        </DropdownMenuItem>

        {/* Companies Section */}
        {workspacesData?.companies && workspacesData.companies.length > 0 && (
          <>
            <DropdownMenuSeparator className="my-1.5" />
            <DropdownMenuLabel className="px-2 py-1 text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">
              Company
            </DropdownMenuLabel>

            {workspacesData.companies.map((company: WorkspaceItem) => {
              const isActive = !isPersonalActive && claims?.companyId === company.id;
              return (
                <DropdownMenuItem
                  key={company.id}
                  onClick={() => handleSwitch(company.id)}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg px-2.5 py-2 cursor-pointer transition-colors',
                    isActive && 'bg-primary/10 font-medium text-primary',
                  )}
                >
                  <div className="flex size-7 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                    <Building2 className="size-4" />
                  </div>
                  <div className="flex flex-1 flex-col overflow-hidden">
                    <span className="truncate text-xs font-medium">{company.name}</span>
                    <span className="text-[10px] text-muted-foreground">Role: {company.role}</span>
                  </div>
                  {isActive && <Check className="size-4 text-primary ml-auto" />}
                </DropdownMenuItem>
              );
            })}
          </>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-2 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin mr-1.5" /> Memuat...
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default WorkspaceSwitcher;
