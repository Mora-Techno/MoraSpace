'use client';

import type { WorkspaceItem } from '@repo/types';
import { useMemo } from 'react';

import { useApi } from '@/hooks/useApi/useApi';
import { useChatSocket } from '@/hooks/useChatSocket';
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

export function useWorkspaceSwitcher() {
  const api = useApi();
  const { reconnect } = useChatSocket();
  const { data: workspacesData, isLoading } = api.auth.query.workspaces();
  const switchWorkspace = api.auth.mutate.switchWorkspace();

  const claims = useMemo(
    () => readTokenClaims(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [workspacesData, switchWorkspace.isPending, switchWorkspace.isSuccess],
  );

  const companies: WorkspaceItem[] = workspacesData?.companies ?? [];
  const isPersonalActive = !claims?.companyId || claims?.workspaceType === 'personal';
  const activeCompany = companies.find((c) => c.id === claims?.companyId) ?? null;

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

  return {
    companies,
    isPersonalActive,
    activeCompanyId: claims?.companyId ?? null,
    currentWorkspaceName,
    currentWorkspaceRole,
    isLoading,
    isPending: switchWorkspace.isPending,
    handleSwitch,
  };
}
