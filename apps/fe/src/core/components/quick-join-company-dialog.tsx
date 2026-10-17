'use client';

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  KeyRound,
  Loader2,
  QrCode,
  ShieldAlert,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from '@/components/atoms';
import { useApi } from '@/hooks/useApi/useApi';

interface QuickJoinCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoin: (code: string) => Promise<unknown>;
  isPending: boolean;
}

export const QuickJoinCompanyDialog: React.FC<QuickJoinCompanyDialogProps> = ({
  open,
  onOpenChange,
  onJoin,
  isPending,
}) => {
  const router = useRouter();
  const api = useApi();
  const [code, setCode] = useState<string>('');

  const normalizedCode = code.trim().toUpperCase();
  const hasValidLength = normalizedCode.length >= 6;

  const {
    data: preview,
    isLoading: isPreviewLoading,
    error: previewError,
  } = api.company.query.previewJoinCompany(normalizedCode, hasValidLength);

  const errorMessage =
    previewError && typeof previewError === 'object' && 'message' in previewError
      ? String((previewError as any).message)
      : previewError
        ? 'Kode tidak valid atau perusahaan tidak aktif'
        : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasValidLength || isPending || isPreviewLoading || Boolean(errorMessage)) return;

    try {
      await onJoin(normalizedCode);
      onOpenChange(false);
      setCode('');
    } catch {}
  };

  const handleOpenFullPage = () => {
    onOpenChange(false);
    const target = normalizedCode ? `/join?code=${encodeURIComponent(normalizedCode)}` : '/join';
    router.push(target);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) setCode('');
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-w-md p-6 rounded-2xl">
        <DialogHeader className="text-left space-y-1.5">
          <div className="flex items-center gap-2 text-primary font-medium text-xs tracking-wide uppercase">
            <QrCode className="size-3.5" />
            Workspace Switcher
          </div>
          <DialogTitle className="text-lg font-bold tracking-tight">
            Gabung ke Perusahaan
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Masukkan kode 8-karakter undangan perusahaan untuk langsung bergabung dan beralih ke
            workspace tim.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Input Code */}
          <div className="space-y-1.5">
            <Label
              htmlFor="quickJoinCodeInput"
              className="text-xs font-semibold text-muted-foreground"
            >
              Kode Undangan (8 Karakter)
            </Label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="quickJoinCodeInput"
                type="text"
                autoFocus
                maxLength={12}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                placeholder="Contoh: 7K9M2P4X"
                disabled={isPending}
                className="pl-10 font-mono text-base tracking-widest uppercase font-semibold h-11 rounded-xl bg-background/80 border-border/80 focus:ring-2 focus:ring-primary/20"
              />
              {isPreviewLoading && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  <Loader2 className="size-4 animate-spin text-primary" />
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && hasValidLength && !isPreviewLoading && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive">
              <ShieldAlert className="size-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Company Preview Card */}
          {preview && !isPreviewLoading && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20 animate-in fade-in zoom-in-95">
              <div className="flex size-10 items-center justify-center rounded-lg bg-background border border-border/60 shrink-0 overflow-hidden shadow-xs">
                {preview.logo ? (
                  <Image
                    src={preview.logo}
                    alt={preview.name}
                    width={40}
                    height={40}
                    className="size-full object-cover"
                  />
                ) : (
                  <Building2 className="size-5 text-primary" />
                )}
              </div>
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs truncate text-foreground">
                    {preview.name}
                  </span>
                  <CheckCircle2 className="size-3 text-emerald-500 shrink-0" />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1">
                    <Users className="size-2.5 text-muted-foreground" />
                    {preview.memberCount} anggota
                  </span>
                  <span>•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Aktif</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-col gap-2 pt-2">
            <Button
              type="submit"
              disabled={!hasValidLength || isPending || isPreviewLoading || Boolean(errorMessage)}
              className="w-full h-10 rounded-xl text-xs font-medium gap-2 shadow-sm"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Sedang Bergabung...
                </>
              ) : (
                <>
                  Gabung & Beralih ke Workspace
                  <ArrowRight className="size-3.5" />
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleOpenFullPage}
              disabled={isPending}
              className="w-full text-[11px] text-muted-foreground hover:text-foreground h-8"
            >
              Scan QR Code atau buka halaman penuh
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuickJoinCompanyDialog;
