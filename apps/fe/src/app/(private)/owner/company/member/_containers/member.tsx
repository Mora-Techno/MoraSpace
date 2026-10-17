'use client';

import type { WorkingStatus } from '@repo/types';
import { useMemo, useState } from 'react';

import OwnerCompanyMemberSection from '@/components/page/private/owner/dashboard/company/member/CompanyMemberSection';
import { useApi } from '@/hooks/useApi/useApi';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import { useDebounce } from '@/hooks/useDebounce';

export default function CompanyMemberContainer() {
  const api = useApi();
  const ns = useAppNameSpace();
  const title = 'Kelola Member';
  const desc = 'Kelola anggota workstation dari perusahaan Anda.';

  const [open, setOpen] = useState<boolean>(false);
  const [qrModalOpen, setQrModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const debounceSearch = useDebounce(searchTerm, 500);

  const { data: members = [], isLoading } = api.member.query.list();
  const updateMember = api.member.mutate.update();
  const deleteMember = api.member.mutate.delete();
  const createInvitation = api.invitation.mutate.create();
  const { data: allStatuses } = api.workingHours.query.memberStatus();

  const { data: joinCodeData, isLoading: isJoinCodeLoading } = api.company.query.getJoinCode();
  const regenerateJoinCode = api.company.mutate.regenerateJoinCode();

  // Bentuk runtime ListMembers = ICompanyMember + nested user; ratakan agar
  // section menerima fullName/email langsung (tipe AdminUser).
  const flatMembers = useMemo(
    () =>
      members.map((m: any) => ({
        ...m,
        fullName: m.fullName ?? m.user?.fullName ?? '',
        email: m.email ?? m.user?.email ?? '',
      })),
    [members],
  );

  const statusByKey = useMemo(() => {
    const map: Record<string, { status: WorkingStatus; statusLabel: string }> = {};
    const list = Array.isArray(allStatuses) ? allStatuses : allStatuses ? [allStatuses] : [];
    for (const s of list) {
      if (s?.userId) map[s.userId] = { status: s.status, statusLabel: s.statusLabel };
      if (s?.companyMemberId)
        map[s.companyMemberId] = { status: s.status, statusLabel: s.statusLabel };
    }
    return map;
  }, [allStatuses]);

  const handleUpdateStatus = (id: string, status: string) => {
    updateMember.mutate({ id, payload: { status } as any });
  };

  const handleDeleteMember = (id: string) => {
    deleteMember.mutate({ id });
  };

  const handleInvite = (email: string) => {
    createInvitation.mutate({ email }, { onSuccess: () => setOpen(false) });
  };

  const handleRegenerateCode = () => {
    regenerateJoinCode.mutate();
  };

  return (
    <OwnerCompanyMemberSection
      template={{
        description: desc,
        title: title,
      }}
      service={
        {
          member: flatMembers,
          isLoading,
          isPending: updateMember.isPending || deleteMember.isPending,
          handleUpdateStatus,
          handleDeleteMember,
          handleInvite,
          isInvitePending: createInvitation.isPending,
          statusByKey,
          joinCodeData,
          isJoinCodeLoading,
          handleRegenerateCode,
          isRegeneratePending: regenerateJoinCode.isPending,
        } as any
      }
      state={{
        alert: ns.alert,
        open,
        setOpen,
        searchTerm,
        setSearchTerm,
        qrModalOpen,
        setQrModalOpen,
      }}
    />
  );
}
