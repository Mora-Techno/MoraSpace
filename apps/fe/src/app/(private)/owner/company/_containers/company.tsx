'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { CompanySection } from '@/components/page/private/owner/company/company.section';
import { useApi } from '@/hooks/useApi/useApi';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';

function formatDate(value: Date | string | null | undefined): string {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Presigned PUT tak bisa batasi ukuran — validasi di klien sebelum minta URL.
const MAX_LOGO_BYTES = 2 * 1024 * 1024;

export default function CompanyContainer() {
  const router = useRouter();
  const ns = useAppNameSpace();
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const api = useApi();
  const { data: company, isLoading, refetch } = api.company.query.getMe();
  const { data: joinCodeData, isLoading: isJoinCodeLoading } = api.company.query.getJoinCode();
  const presignLogo = api.company.mutate.presignLogo();
  const updateProfile = api.company.mutate.updateProfile();
  const regenerateJoinCode = api.company.mutate.regenerateJoinCode();

  const handleLogoSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      ns.alert.toast({ title: 'Validasi', message: 'File harus gambar', icon: 'warning' });
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      ns.alert.toast({ title: 'Validasi', message: 'Logo maksimal 2MB', icon: 'warning' });
      return;
    }
    setUploading(true);
    try {
      const presign = await presignLogo.mutateAsync({ contentType: file.type });
      const put = await fetch(presign.data.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!put.ok) throw new Error('Upload ke storage gagal');
      await updateProfile.mutateAsync({ logo: presign.data.publicUrl });
      refetch();
      ns.alert.toast({ title: 'Berhasil', message: 'Logo perusahaan diperbarui', icon: 'success' });
    } catch (error) {
      ns.alert.toast({
        title: 'Gagal',
        message: error instanceof Error ? error.message : 'Gagal mengunggah logo',
        icon: 'error',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRegenerateCode = () => {
    regenerateJoinCode.mutate();
  };

  return (
    <CompanySection
      service={{
        company: company
          ? {
              name: company.name,
              logoUrl: company.logo ?? null,
              tier: company.tier,
              billingCycle: company.billingCycle,
              maxWorkstationUsers: company.maxWorkstationUsers,
              startsText: formatDate(company.subscriptionStartsAt),
              endsText: formatDate(company.subscriptionEndsAt),
            }
          : null,
        isLoading,
        uploadPending: uploading,
        onRoleChange: (slug) => router.push(`/owner/company/${slug}`),
        onLogoSelect: handleLogoSelect,
        joinCodeData: joinCodeData ?? null,
        isJoinCodeLoading,
        onRegenerateCode: handleRegenerateCode,
        isRegeneratingCode: regenerateJoinCode.isPending,
      }}
      state={{ selectedRole, setSelectedRole, qrModalOpen, setQrModalOpen }}
    />
  );
}
