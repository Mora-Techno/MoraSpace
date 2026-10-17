'use client';

import type { ICompanyJoinCode } from '@repo/types/company.types';
import {
  ArrowRight,
  Building2,
  Check,
  Copy,
  ImagePlus,
  QrCode,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useRef, useState } from 'react';

import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from '@/components/atoms';
import { PageHeader } from '@/components/molecules/PageHeader';
import { COMPANY_ROLE_REGISTRY, MANAGED_COMPANY_ROLES } from '@/configs/company-roles.config';

import { CompanyJoinCodeModal } from '../dashboard/company/member/CompanyJoinCodeModal';

const TIER_STYLES: Record<string, string> = {
  free: 'bg-muted text-muted-foreground',
  pro: 'bg-primary/15 text-primary',
  enterprise: 'bg-amber-500/15 text-amber-600',
};

export interface CompanyProfileVM {
  name: string;
  logoUrl: string | null;
  tier: string;
  billingCycle: string;
  maxWorkstationUsers: number;
  startsText: string;
  endsText: string;
}

interface CompanySectionProps {
  service: {
    company: CompanyProfileVM | null;
    isLoading: boolean;
    uploadPending: boolean;
    onRoleChange: (slug: string) => void;
    onLogoSelect: (file: File) => void;
    joinCodeData?: ICompanyJoinCode | null;
    isJoinCodeLoading?: boolean;
    onRegenerateCode?: () => void;
    isRegeneratingCode?: boolean;
  };
  state: {
    selectedRole: string;
    setSelectedRole: (v: string) => void;
    qrModalOpen?: boolean;
    setQrModalOpen?: (open: boolean) => void;
  };
}

export function CompanySection({ service, state }: CompanySectionProps) {
  const {
    company,
    isLoading,
    uploadPending,
    onRoleChange,
    onLogoSelect,
    joinCodeData,
    isJoinCodeLoading = false,
    onRegenerateCode = () => {},
    isRegeneratingCode = false,
  } = service;
  const { selectedRole, setSelectedRole, qrModalOpen = false, setQrModalOpen = () => {} } = state;
  const fileRef = useRef<HTMLInputElement>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyCode = async () => {
    if (!joinCodeData?.inviteCode) return;
    try {
      await navigator.clipboard.writeText(joinCodeData.inviteCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {}
  };

  const handleCopyLink = async () => {
    if (!joinCodeData?.inviteUrl) return;
    try {
      await navigator.clipboard.writeText(joinCodeData.inviteUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {}
  };

  const handleRoleChange = (slug: string) => {
    setSelectedRole(slug);
    onRoleChange(slug);
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Company"
        description="Kelola profil perusahaan dan role pengguna di dalamnya."
      />

      {/* Profil perusahaan */}
      <Card>
        <CardHeader>
          <CardAction>
            <Building2 className="size-8 text-primary" />
          </CardAction>
          <CardTitle className="text-lg">Profil Perusahaan</CardTitle>
          <CardDescription>Informasi langganan dan detail workspace perusahaan.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-40" />
            </div>
          ) : company ? (
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Logo</dt>
                <dd className="mt-1 flex items-center gap-3">
                  {company.logoUrl ? (
                    <img
                      src={company.logoUrl}
                      alt={`Logo ${company.name}`}
                      className="size-10 rounded-lg border object-cover"
                    />
                  ) : (
                    <span className="flex size-10 items-center justify-center rounded-lg border bg-muted">
                      <Building2 className="size-5 text-muted-foreground" />
                    </span>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = '';
                      if (file) onLogoSelect(file);
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={uploadPending}
                    onClick={() => fileRef.current?.click()}
                  >
                    <ImagePlus className="size-3.5" />
                    {uploadPending ? 'Mengunggah…' : 'Ubah logo'}
                  </Button>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Nama Perusahaan</dt>
                <dd className="mt-1 font-medium">{company.name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Tier Langganan</dt>
                <dd className="mt-1">
                  <Badge variant="outline" className={TIER_STYLES[company.tier]}>
                    {company.tier}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Siklus Billing</dt>
                <dd className="mt-1 font-medium capitalize">{company.billingCycle}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Kuota Workstation</dt>
                <dd className="mt-1 font-medium">{company.maxWorkstationUsers} pengguna</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Mulai Berlangganan</dt>
                <dd className="mt-1 font-medium">{company.startsText}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Berakhir</dt>
                <dd className="mt-1 font-medium">{company.endsText}</dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">Data perusahaan tidak ditemukan.</p>
          )}
        </CardContent>
      </Card>

      {/* Kode Undangan & Akses Cepat Tim */}
      <Card>
        <CardHeader>
          <CardAction>
            <QrCode className="size-8 text-primary" />
          </CardAction>
          <CardTitle className="text-lg">Kode Undangan & QR Code</CardTitle>
          <CardDescription>
            Gunakan kode 8 karakter atau QR code ini untuk mengundang anggota baru bergabung
            langsung ke workspace perusahaan Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isJoinCodeLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ) : joinCodeData ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Kode 8 Karakter */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">
                    Kode Undangan (8 Karakter)
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center justify-between px-3.5 py-2 rounded-xl bg-accent/40 border border-border/60">
                      <span className="font-mono text-lg font-bold tracking-widest text-primary">
                        {joinCodeData.inviteCode}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium">Aktif</span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopyCode}
                      className="rounded-xl px-3 h-10 text-xs gap-1.5 font-medium shrink-0"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="size-3.5 text-emerald-500" />
                          Tersalin!
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5" />
                          Salin Kode
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Tautan Langsung */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="company-invite-url"
                    className="text-xs font-semibold text-muted-foreground"
                  >
                    Tautan Langsung (Direct Link)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="company-invite-url"
                      readOnly
                      value={joinCodeData.inviteUrl}
                      className="font-mono text-xs text-muted-foreground bg-muted/30 border-border/60 rounded-xl select-all h-10"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopyLink}
                      className="rounded-xl px-3 h-10 text-xs gap-1.5 font-medium shrink-0"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="size-3.5 text-emerald-500" />
                          Tersalin!
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5" />
                          Salin Link
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Action Buttons & Notice */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-border/40">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={() => setQrModalOpen(true)}
                    className="rounded-xl text-xs gap-1.5 font-medium h-9 shadow-xs"
                  >
                    <QrCode className="size-3.5" />
                    Lihat & Unduh QR Code
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onRegenerateCode}
                    disabled={isRegeneratingCode}
                    className="rounded-xl text-xs text-muted-foreground hover:text-foreground gap-1.5 h-9"
                  >
                    <RefreshCw className={`size-3.5 ${isRegeneratingCode ? 'animate-spin' : ''}`} />
                    Buat Kode Baru
                  </Button>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Anggota baru otomatis mendapatkan role{' '}
                  <strong className="text-foreground">Member</strong>.
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Kode undangan tidak tersedia.</p>
          )}
        </CardContent>
      </Card>

      <CompanyJoinCodeModal
        open={qrModalOpen}
        onOpenChange={setQrModalOpen}
        data={joinCodeData}
        isLoading={isJoinCodeLoading}
        onRegenerate={onRegenerateCode}
        isRegenerating={isRegeneratingCode}
      />

      <Card>
        <CardHeader>
          <CardAction>
            <ShieldCheck className="size-8 text-primary" />
          </CardAction>
          <CardTitle className="text-lg">Kelola Role</CardTitle>
          <CardDescription>Pilih role untuk melihat dan mengelola penggunanya.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedRole || undefined} onValueChange={handleRoleChange}>
            <SelectTrigger size="default" className="w-full sm:w-72">
              <SelectValue placeholder="Pilih role…" />
            </SelectTrigger>
            <SelectContent>
              {MANAGED_COMPANY_ROLES.map((role) => (
                <SelectItem key={role.slug} value={role.slug}>
                  <span className="flex items-center gap-2">
                    <role.icon className="size-4 text-muted-foreground" />
                    {role.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid gap-3 sm:grid-cols-2">
            {COMPANY_ROLE_REGISTRY.map((role) => {
              const Icon = role.icon;
              return (
                <div
                  key={role.slug}
                  className="flex items-start justify-between gap-3 rounded-xl border p-4"
                >
                  <div className="flex items-start gap-3">
                    <Icon className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-semibold">{role.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{role.description}</p>
                    </div>
                  </div>
                  {role.manageable ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 shrink-0 gap-1"
                      onClick={() => handleRoleChange(role.slug)}
                    >
                      Kelola
                      <ArrowRight className="size-3.5" />
                    </Button>
                  ) : null}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CompanySection;
