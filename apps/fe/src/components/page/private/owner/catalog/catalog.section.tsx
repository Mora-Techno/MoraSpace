import React, { useState } from "react";
import { Check, X, Music, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/molecules/PageHeader";
import { Button, Card, Input } from "@/components/atoms";
import type { TrackCatalog } from "@repo/types";

export interface CatalogReviewSectionProps {
  service: {
    pendingTracks: TrackCatalog[];
    isLoading: boolean;
    handleApprove: (id: string) => void;
    handleReject: (id: string, reason: string) => void;
    isApprovePending: boolean;
    isRejectPending: boolean;
  };
}

export const CatalogReviewSection: React.FC<CatalogReviewSectionProps> = ({
  service: {
    pendingTracks,
    isLoading,
    handleApprove,
    handleReject,
    isApprovePending,
    isRejectPending,
  },
}) => {
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const onConfirmReject = (id: string) => {
    if (!rejectReason.trim()) return;
    handleReject(id, rejectReason.trim());
    setRejectingId(null);
    setRejectReason("");
  };

  return (
    <div className="w-full space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-1">
        <span className="w-fit px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400 rounded-md">
          Layer 1 Platform Role
        </span>
        <PageHeader
          title="Review Track Catalog"
          description="Kurasi musik latar sebelum dipublikasikan ke seluruh workspace secara global."
        />
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-sm text-neutral-400">
          Memuat pengajuan track...
        </div>
      ) : pendingTracks.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 border-dashed text-center">
          <Music className="w-10 h-10 text-neutral-400 mb-3 opacity-60" />
          <h4 className="font-semibold text-sm">Tidak ada antrean kurasi</h4>
          <p className="text-xs text-neutral-500 mt-1">
            Semua track YouTube yang diajukan telah selesai ditinjau.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingTracks.map((track) => (
            <Card key={track.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-sm">{track.title}</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">Video ID: {track.youtubeVideoId}</p>
                  </div>
                  {track.youtubeUrl && (
                    <a
                      href={track.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-neutral-400 hover:text-red-500 transition"
                      title="Buka YouTube"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {rejectingId === track.id ? (
                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-col gap-2">
                  <Input
                    placeholder="Alasan penolakan..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setRejectingId(null)}
                    >
                      Batal
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onConfirmReject(track.id)}
                      disabled={isRejectPending}
                    >
                      Konfirmasi Tolak
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setRejectingId(track.id)}
                    className="gap-1 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <X className="w-3.5 h-3.5" /> Tolak
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(track.id)}
                    disabled={isApprovePending}
                    className="gap-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Check className="w-3.5 h-3.5" /> Setujui
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
