'use client';

import type { ICompanyJoinCode } from '@repo/types/company.types';
import { Check, Copy, Download, Info, Loader2, QrCode, RefreshCw, Sparkles } from 'lucide-react';
import QRCode from 'qrcode';
import React, { useEffect, useState } from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from '@/components/atoms';

interface CompanyJoinCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: ICompanyJoinCode | null;
  isLoading: boolean;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export const CompanyJoinCodeModal: React.FC<CompanyJoinCodeModalProps> = ({
  open,
  onOpenChange,
  data,
  isLoading,
  onRegenerate,
  isRegenerating,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showConfirmRegen, setShowConfirmRegen] = useState(false);

  useEffect(() => {
    if (!data?.qrCodeData) return;

    QRCode.toDataURL(data.qrCodeData, {
      width: 320,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR Code:', err));
  }, [data?.qrCodeData]);

  const handleCopyCode = async () => {
    if (!data?.inviteCode) return;
    try {
      await navigator.clipboard.writeText(data.inviteCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {}
  };

  const handleCopyLink = async () => {
    if (!data?.inviteUrl) return;
    try {
      await navigator.clipboard.writeText(data.inviteUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {}
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `qr-gabung-${(data?.companyName || 'company').toLowerCase().replace(/\s+/g, '-')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleConfirmRegenerate = () => {
    onRegenerate();
    setShowConfirmRegen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) setShowConfirmRegen(false);
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-w-lg p-6 sm:p-7 rounded-2xl">
        <DialogHeader className="text-left space-y-1.5">
          <div className="flex items-center gap-2 text-primary font-medium text-xs tracking-wide uppercase">
            <Sparkles className="size-3.5" />
            Undangan Instan
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight">
            Kode Undangan & QR Code
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Anggota tim dapat memindai QR code atau memasukkan 8-karakter kode untuk langsung
            bergabung ke <span className="font-semibold text-foreground">{data?.companyName}</span>.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-sm text-muted-foreground gap-3">
            <Loader2 className="size-6 animate-spin text-primary" />
            <span>Menyiapkan kode undangan...</span>
          </div>
        ) : (
          <div className="space-y-5 pt-2">
            {/* QR Card Container */}
            <div className="flex flex-col items-center justify-center p-5 rounded-xl border border-border/60 bg-muted/30">
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrDataUrl}
                  alt="QR Code Gabung Perusahaan"
                  className="size-48 rounded-lg shadow-sm border border-border/40 bg-white p-1"
                />
              ) : (
                <div className="size-48 flex items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <QrCode className="size-12 opacity-40" />
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownloadQr}
                disabled={!qrDataUrl}
                className="mt-3.5 text-xs gap-1.5 rounded-lg font-medium"
              >
                <Download className="size-3.5" />
                Download Gambar QR
              </Button>
            </div>

            {/* 8-Character Code Box */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Kode Undangan (8 Karakter)
              </Label>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center justify-between px-4 py-2.5 rounded-xl bg-accent/40 border border-border/60">
                  <span className="font-mono text-xl font-bold tracking-widest text-primary">
                    {data?.inviteCode || '--------'}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-medium">Aktif</span>
                </div>
                <Button
                  type="button"
                  variant="default"
                  onClick={handleCopyCode}
                  className="rounded-xl px-4 h-11 text-xs gap-1.5 font-medium shrink-0"
                >
                  {copiedCode ? (
                    <>
                      <Check className="size-3.5 text-emerald-300" />
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

            {/* Direct Link Input */}
            <div className="space-y-1.5">
              <Label
                htmlFor="invite-link-input"
                className="text-xs font-semibold text-muted-foreground"
              >
                Tautan Langsung (Direct Link)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="invite-link-input"
                  readOnly
                  value={data?.inviteUrl || ''}
                  className="font-mono text-xs text-muted-foreground bg-muted/30 border-border/60 rounded-xl select-all"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopyLink}
                  className="rounded-xl px-3.5 h-10 text-xs gap-1.5 font-medium shrink-0"
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

            {/* Notice */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-primary/5 border border-primary/15 text-[11px] text-muted-foreground leading-relaxed">
              <Info className="size-4 text-primary shrink-0 mt-0.5" />
              <span>
                Anggota yang bergabung lewat kode atau QR ini otomatis memiliki role{' '}
                <strong className="text-foreground">Member</strong>. Batas kuota workstation berlaku
                sesuai tier paket perusahaan Anda.
              </span>
            </div>

            {/* Regenerate Section */}
            <div className="pt-2 border-t border-border/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {showConfirmRegen ? (
                <div className="w-full flex items-center justify-between gap-2 p-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-xs">
                  <span className="text-destructive font-medium text-[11px]">
                    Kode & link lama akan segera hangus. Lanjutkan?
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowConfirmRegen(false)}
                      className="h-7 text-xs px-2"
                    >
                      Batal
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleConfirmRegenerate}
                      disabled={isRegenerating}
                      className="h-7 text-xs px-2.5"
                    >
                      {isRegenerating ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        'Ya, Buat Baru'
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <span className="text-[11px] text-muted-foreground">
                    Perlu mengganti kode yang sudah tersebar?
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfirmRegen(true)}
                    disabled={isRegenerating}
                    className="text-xs text-muted-foreground hover:text-foreground gap-1.5 self-start sm:self-auto"
                  >
                    <RefreshCw className={`size-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                    Buat Kode Baru
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CompanyJoinCodeModal;
