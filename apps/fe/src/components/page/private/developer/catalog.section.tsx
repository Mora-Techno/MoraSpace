'use client';

import type { TrackCatalog } from '@repo/types';
import {
  Check,
  Disc3,
  ExternalLink,
  Loader2,
  Music,
  Pause,
  Play,
  Plus,
  Radio,
  Search,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import Image from 'next/image';
import React, { useMemo, useState } from 'react';

import {
  Badge,
  Button,
  Card,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from '@/components/atoms';
import { PageHeader } from '@/components/molecules/PageHeader';
import { cn } from '@/utils/classname';

export interface DeveloperCatalogSectionProps {
  service: {
    pendingTracks: TrackCatalog[];
    allTracks: TrackCatalog[];
    isLoading: boolean;
    isApprovePending: boolean;
    isRejectPending: boolean;
    isDeletePending: boolean;
    isSubmitPending: boolean;
    currentPlayingId: string | null;
    isPlaying: boolean;
    onApprove: (id: string) => void;
    onReject: (id: string, reason?: string) => void;
    onDelete: (id: string) => void;
    onSubmit: (title: string, youtubeUrl: string) => Promise<void> | void;
    onPlayTrack: (track: TrackCatalog) => void;
  };
}

function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtube.com')) {
      return parsed.searchParams.get('v');
    }
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.slice(1);
    }
    return null;
  } catch {
    return null;
  }
}

export const DeveloperCatalogSection: React.FC<DeveloperCatalogSectionProps> = ({ service }) => {
  const {
    pendingTracks,
    allTracks,
    isLoading,
    isApprovePending,
    isRejectPending,
    isDeletePending,
    isSubmitPending,
    currentPlayingId,
    isPlaying,
    onApprove,
    onReject,
    onDelete,
    onSubmit,
    onPlayTrack,
  } = service;

  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>(
    'pending',
  );
  const [search, setSearch] = useState('');

  // Add Track Modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [addError, setAddError] = useState('');

  // Reject Modal state
  const [rejectingTrack, setRejectingTrack] = useState<TrackCatalog | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const extractedNewVideoId = useMemo(() => extractYouTubeId(newUrl), [newUrl]);

  // Derived lists
  const approvedTracks = useMemo(
    () => allTracks.filter((t) => t.status === 'APPROVED'),
    [allTracks],
  );
  const rejectedTracks = useMemo(
    () => allTracks.filter((t) => t.status === 'REJECTED'),
    [allTracks],
  );

  const displayedTracks = useMemo(() => {
    let base: TrackCatalog[] = [];
    if (activeTab === 'pending') base = pendingTracks;
    else if (activeTab === 'approved') base = approvedTracks;
    else if (activeTab === 'rejected') base = rejectedTracks;
    else base = allTracks;

    if (!search.trim()) return base;
    const q = search.toLowerCase();
    return base.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.youtubeVideoId.toLowerCase().includes(q) ||
        (t.submittedBy && t.submittedBy.toLowerCase().includes(q)),
    );
  }, [activeTab, pendingTracks, approvedTracks, rejectedTracks, allTracks, search]);

  const handleSubmitNewTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    if (!newTitle.trim()) {
      setAddError('Judul track wajib diisi');
      return;
    }
    if (!newUrl.trim() || !extractedNewVideoId) {
      setAddError(
        'URL YouTube tidak valid. Gunakan format youtube.com/watch?v=... atau youtu.be/...',
      );
      return;
    }

    try {
      await onSubmit(newTitle.trim(), newUrl.trim());
      setNewTitle('');
      setNewUrl('');
      setIsAddOpen(false);
    } catch (err: any) {
      setAddError(err?.message || 'Gagal menambahkan track');
    }
  };

  const handleConfirmReject = () => {
    if (!rejectingTrack) return;
    onReject(rejectingTrack.id, rejectReason.trim() || undefined);
    setRejectingTrack(null);
    setRejectReason('');
  };

  return (
    <div className="w-full space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 rounded-full border border-purple-200 dark:border-purple-800">
              <Sparkles className="size-3" />
              Layer 1 • Platform Console
            </span>
            <Badge variant="outline" className="text-xs font-mono">
              Track Catalog Manager
            </Badge>
          </div>
          <PageHeader
            title="Kurasi & Manajemen Track Musik"
            description="Kelola pustaka audio latar YouTube global untuk dinikmati seluruh pengguna di semua workspace."
          />
        </div>

        <Button
          onClick={() => {
            setAddError('');
            setIsAddOpen(true);
          }}
          className="gap-2 text-xs h-9 bg-primary text-primary-foreground shrink-0 shadow-sm"
        >
          <Plus className="size-4" />
          <span>Tambah Track Baru</span>
        </Button>
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0',
              activeTab === 'pending'
                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 font-semibold'
                : 'text-muted-foreground hover:bg-muted/60',
            )}
          >
            <span>Antrean Review</span>
            {pendingTracks.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold">
                {pendingTracks.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('approved')}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0',
              activeTab === 'approved'
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-semibold'
                : 'text-muted-foreground hover:bg-muted/60',
            )}
          >
            <span>Katalog Aktif (Approved)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
              {approvedTracks.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rejected')}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0',
              activeTab === 'rejected'
                ? 'bg-destructive/15 text-destructive font-semibold'
                : 'text-muted-foreground hover:bg-muted/60',
            )}
          >
            <span>Ditolak</span>
            {rejectedTracks.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-destructive/20 text-destructive">
                {rejectedTracks.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0',
              activeTab === 'all'
                ? 'bg-primary/15 text-primary font-semibold'
                : 'text-muted-foreground hover:bg-muted/60',
            )}
          >
            <span>Semua Track</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-muted text-muted-foreground">
              {allTracks.length}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari lagu / video ID..."
            className="pl-8 h-8 text-xs bg-background/50"
          />
        </div>
      </div>

      {/* Track Grid / List */}
      {isLoading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="size-6 animate-spin text-primary" />
          <p className="text-xs">Memuat data track catalog...</p>
        </div>
      ) : displayedTracks.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 border-dashed text-center">
          <Music className="size-10 text-muted-foreground/40 mb-3" />
          <h4 className="font-semibold text-sm">Tidak ada track yang ditampilkan</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            {search.trim()
              ? `Tidak ditemukan track dengan kata kunci "${search}".`
              : activeTab === 'pending'
                ? 'Seluruh antrean kurasi telah ditinjau dan bersih.'
                : 'Belum ada track dalam kategori ini. Silakan tambahkan track baru.'}
          </p>
          {activeTab === 'pending' && pendingTracks.length === 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('approved')}
              className="mt-4 text-xs gap-1.5"
            >
              <Radio className="size-3.5 text-emerald-600" />
              <span>Lihat Katalog Aktif</span>
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedTracks.map((track) => {
            const isThisTrackPlaying = currentPlayingId === track.id && isPlaying;
            const videoId = track.youtubeVideoId || extractYouTubeId(track.youtubeUrl);
            const thumbnailUrl = videoId
              ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
              : null;

            return (
              <Card
                key={track.id}
                className={cn(
                  'p-4 flex flex-col justify-between border-border/60 bg-card/60 backdrop-blur-md hover:border-border transition-all overflow-hidden',
                  isThisTrackPlaying && 'border-primary/50 shadow-sm ring-1 ring-primary/20',
                )}
              >
                <div>
                  <div className="flex gap-3.5 items-start">
                    {/* Thumbnail / Play Button overlay */}
                    <div className="relative size-20 rounded-xl overflow-hidden bg-muted shrink-0 group border border-border/40">
                      {thumbnailUrl ? (
                        <Image
                          src={thumbnailUrl}
                          alt={track.title}
                          width={120}
                          height={80}
                          unoptimized
                          className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="size-full flex items-center justify-center bg-primary/10 text-primary">
                          <Disc3 className="size-7" />
                        </div>
                      )}

                      {/* Play overlay button */}
                      <button
                        type="button"
                        onClick={() => onPlayTrack(track)}
                        className={cn(
                          'absolute inset-0 flex items-center justify-center transition-colors',
                          isThisTrackPlaying
                            ? 'bg-black/50 text-white'
                            : 'bg-black/30 opacity-0 group-hover:opacity-100 text-white',
                        )}
                        title={isThisTrackPlaying ? 'Jeda' : 'Putar Preview'}
                      >
                        {isThisTrackPlaying ? (
                          <Pause className="size-6 fill-current" />
                        ) : (
                          <Play className="size-6 fill-current ml-0.5" />
                        )}
                      </button>
                    </div>

                    {/* Metadata */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full',
                            track.status === 'APPROVED' &&
                              'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
                            track.status === 'PENDING' &&
                              'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
                            track.status === 'REJECTED' &&
                              'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
                          )}
                        >
                          {track.status}
                        </span>

                        {track.youtubeUrl && (
                          <a
                            href={track.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition p-1 rounded-md hover:bg-muted"
                            title="Buka di YouTube"
                          >
                            <ExternalLink className="size-3.5" />
                          </a>
                        )}
                      </div>

                      <h4 className="font-semibold text-sm line-clamp-2 leading-snug">
                        {track.title}
                      </h4>

                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-0.5">
                        <span className="font-mono text-[10px] truncate">
                          ID: {track.youtubeVideoId || '-'}
                        </span>
                        {track.submittedBy && (
                          <>
                            <span>•</span>
                            <span className="truncate">Oleh: {track.submittedBy}</span>
                          </>
                        )}
                      </div>

                      {track.rejectionReason && (
                        <p className="text-[11px] text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-1.5 rounded border border-rose-200/50 dark:border-rose-900/50 mt-1 line-clamp-2">
                          <span className="font-medium">Alasan:</span> {track.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions bottom bar */}
                <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onPlayTrack(track)}
                    className="gap-1.5 text-xs h-8 text-muted-foreground hover:text-foreground"
                  >
                    {isThisTrackPlaying ? (
                      <>
                        <Pause className="size-3.5 text-primary" />
                        <span className="text-primary font-medium">Sedang Diputar</span>
                      </>
                    ) : (
                      <>
                        <Play className="size-3.5" />
                        <span>Preview Musik</span>
                      </>
                    )}
                  </Button>

                  <div className="flex items-center gap-1.5">
                    {track.status === 'PENDING' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setRejectingTrack(track)}
                          className="h-8 text-xs text-rose-600 border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950"
                          disabled={isRejectPending}
                        >
                          <X className="size-3.5 mr-1" />
                          Tolak
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => onApprove(track.id)}
                          className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                          disabled={isApprovePending}
                        >
                          <Check className="size-3.5 mr-1" />
                          Setujui
                        </Button>
                      </>
                    )}

                    {track.status === 'APPROVED' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(track.id)}
                        className="h-8 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        disabled={isDeletePending}
                        title="Hapus dari katalog"
                      >
                        <Trash2 className="size-3.5 mr-1" />
                        Hapus
                      </Button>
                    )}

                    {track.status === 'REJECTED' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(track.id)}
                        className="h-8 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        disabled={isDeletePending}
                        title="Hapus riwayat penolakan"
                      >
                        <Trash2 className="size-3.5 mr-1" />
                        Hapus
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal: Tambah Track Baru */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSubmitNewTrack}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Music className="size-5 text-primary" />
                <span>Tambah Track ke Katalog Global</span>
              </DialogTitle>
              <DialogDescription className="text-xs">
                Lagu yang ditambahkan oleh Platform Developer akan langsung berstatus APPROVED dan
                dapat disetel oleh seluruh user di semua role.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Judul Track</label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Joe Hisaishi - One Summer's Day (Spirited Away)"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">URL YouTube</label>
                <Input
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="text-xs"
                />
                <span className="text-[10px] text-muted-foreground">
                  Mendukung link standar YouTube maupun tautan singkat youtu.be
                </span>
              </div>

              {/* Live Preview Thumbnail */}
              {extractedNewVideoId && (
                <div className="rounded-xl border border-border/60 bg-muted/40 p-2.5 flex items-center gap-3">
                  <Image
                    src={`https://img.youtube.com/vi/${extractedNewVideoId}/mqdefault.jpg`}
                    alt="Preview"
                    width={64}
                    height={64}
                    unoptimized
                    className="size-16 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="size-3" /> YouTube ID Valid
                    </p>
                    <p className="text-[10px] font-mono text-muted-foreground truncate">
                      Video ID: {extractedNewVideoId}
                    </p>
                  </div>
                </div>
              )}

              {addError && (
                <p className="text-xs text-destructive bg-destructive/10 p-2 rounded-lg border border-destructive/20">
                  {addError}
                </p>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <DialogClose asChild>
                <Button type="button" variant="outline" size="sm" className="text-xs">
                  Batal
                </Button>
              </DialogClose>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitPending}
                className="text-xs bg-primary text-primary-foreground gap-1.5"
              >
                {isSubmitPending && <Loader2 className="size-3.5 animate-spin" />}
                <span>Publikasikan ke Katalog</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Konfirmasi Tolak Track */}
      <Dialog
        open={Boolean(rejectingTrack)}
        onOpenChange={(open) => !open && setRejectingTrack(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold text-destructive flex items-center gap-2">
              <X className="size-4" />
              <span>Tolak Pengajuan Track</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Lagu &quot;{rejectingTrack?.title}&quot; akan ditolak dan tidak akan dipublikasikan ke
              katalog global.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-3">
            <label className="text-xs font-medium text-foreground">
              Alasan Penolakan (Opsional)
            </label>
            <Input
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Contoh: Kualitas audio kurang baik / duplikasi / hak cipta"
              className="text-xs"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRejectingTrack(null)}
              className="text-xs"
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleConfirmReject}
              disabled={isRejectPending}
              className="text-xs gap-1.5"
            >
              {isRejectPending && <Loader2 className="size-3.5 animate-spin" />}
              <span>Konfirmasi Tolak</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
