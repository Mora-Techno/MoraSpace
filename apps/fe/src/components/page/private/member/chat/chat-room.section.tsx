'use client';

import type { ChatMemberInfo, ChatUserSearchResult, WorkingStatus } from '@repo/types';
import { format } from 'date-fns';
import {
  ArrowDown,
  ArrowLeft,
  Check,
  CheckCheck,
  Clock,
  Loader2,
  RotateCcw,
  Send,
  Users,
  WifiOff,
  Zap,
} from 'lucide-react';
import type { RefObject } from 'react';

import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Input,
  Label,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Skeleton,
  Textarea,
  WorkingStatusBadge,
} from '@/components/atoms';
import type { ChatConnStatus, LocalChatMessage } from '@/hooks/useChatSocket';

function initials(name?: string | null) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

interface ChatRoomSectionProps {
  service: {
    isPersonal: boolean;
    isLoading: boolean;
    isError: boolean;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    flat: LocalChatMessage[];
    members: ChatMemberInfo[];
    availableCandidates: ChatUserSearchResult[];
    title: string;
    isGroup: boolean;
    memberCount: number;
    conversationName?: string | null;
    conversationDescription?: string | null;
    status: ChatConnStatus;
    userId: string | null;
    typers: { userId: string; fullName?: string }[];
    peerReadSeq: number | null;
    peerStatus: { status: WorkingStatus; statusLabel: string } | null;
    urgentQuota: { remainingToday: number; dailyLimit: number } | null;
    isUrgent: boolean;
    onToggleUrgent: () => void;
    newCount: number;
    canManage: boolean;
    isOwner: boolean;
    updateGroupPending: boolean;
    addMemberPending: boolean;
    setMemberRolePending: boolean;
    removeMemberPending: boolean;
    transferPending: boolean;
    leavePending: boolean;
    onRetry: () => void;
    onBack: () => void;
    onBackToList: () => void;
    onBackToDashboard: () => void;
    onOpenInfo: () => void;
    onScroll: () => void;
    onLoadOlder: () => void;
    onScrollToBottom: () => void;
    onInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSend: () => void;
    onKey: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    onBlurStop: () => void;
    onRetryMessage: (clientMessageId: string) => void;
    onSaveGroup: (e: React.FormEvent) => void;
    onAddMember: (userId: string) => void;
    onSetRole: (userId: string, toAdmin: boolean) => void;
    onRemoveMember: (userId: string) => void;
    onTransfer: () => void;
    onLeave: () => void;
  };
  state: {
    draft: string;
    setDraft: (v: string) => void;
    showInfo: boolean;
    setShowInfo: (v: boolean) => void;
    editName: string;
    setEditName: (v: string) => void;
    editDesc: string;
    setEditDesc: (v: string) => void;
    addQuery: string;
    setAddQuery: (v: string) => void;
    transferTo: string;
    setTransferTo: (v: string) => void;
    scrollRef: RefObject<HTMLDivElement | null>;
  };
}

export function ChatRoomSection({ service, state }: ChatRoomSectionProps) {
  const {
    isPersonal,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    flat,
    members,
    availableCandidates,
    title,
    isGroup,
    memberCount,
    conversationName,
    conversationDescription,
    status,
    userId,
    typers,
    peerReadSeq,
    peerStatus,
    urgentQuota,
    isUrgent,
    onToggleUrgent,
    newCount,
    canManage,
    isOwner,
    updateGroupPending,
    addMemberPending,
    setMemberRolePending,
    removeMemberPending,
    transferPending,
    leavePending,
    onRetry,
    onBack,
    onBackToList,
    onBackToDashboard,
    onOpenInfo,
    onScroll,
    onLoadOlder,
    onScrollToBottom,
    onInput,
    onSend,
    onKey,
    onBlurStop,
    onRetryMessage,
    onSaveGroup,
    onAddMember,
    onSetRole,
    onRemoveMember,
    onTransfer,
    onLeave,
  } = service;
  const {
    draft,
    setDraft,
    showInfo,
    setShowInfo,
    editName,
    setEditName,
    editDesc,
    setEditDesc,
    addQuery,
    setAddQuery,
    transferTo,
    setTransferTo,
    scrollRef,
  } = state;

  if (isPersonal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 max-w-md mx-auto">
        <p className="text-base font-semibold mb-2">Chat Tidak Tersedia di Personal Workspace</p>
        <p className="text-sm text-muted-foreground mb-6">
          Percakapan tim hanya dapat diakses dalam Company Workspace. Silakan beralih ke Company
          Workspace melalui Workspace Switcher.
        </p>
        <Button onClick={onBackToDashboard} variant="outline" className="rounded-xl">
          Kembali ke Dashboard
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-3xl mx-auto rounded-xl border border-border/60 p-10 text-center space-y-3">
        <p className="text-sm font-medium">Tidak dapat membuka percakapan</p>
        <p className="text-xs text-muted-foreground">Mungkin sudah keluar atau akses dicabut.</p>
        <Button size="sm" variant="outline" onClick={onBackToList}>
          Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-[calc(100dvh-10rem)] md:h-[calc(100dvh-12rem)]">
      <div className="flex items-center gap-2 pb-3 border-b border-border/50">
        <Button size="icon" variant="ghost" onClick={onBack} aria-label="Kembali">
          <ArrowLeft className="size-4" />
        </Button>
        <Avatar className="size-9">
          <AvatarFallback>{initials(title)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold">{title}</p>
            {!isGroup && peerStatus && (
              <WorkingStatusBadge
                status={peerStatus.status}
                statusLabel={peerStatus.statusLabel}
                compact
              />
            )}
          </div>
          <p className="text-[11px] text-muted-foreground">
            {typers.length > 0
              ? `${typers.map((t) => t.fullName || 'Seseorang').join(', ')} mengetik...`
              : isGroup
                ? `${memberCount} anggota`
                : status === 'open'
                  ? 'Terhubung'
                  : 'Menghubungkan...'}
          </p>
        </div>
        {status !== 'open' && (
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <WifiOff className="size-3" /> offline
          </span>
        )}
        {isGroup && (
          <Button size="icon" variant="ghost" onClick={onOpenInfo} aria-label="Info grup">
            <Users className="size-4" />
          </Button>
        )}
      </div>

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex-1 overflow-auto py-3 space-y-1.5 px-0.5"
      >
        {hasNextPage && (
          <div className="flex justify-center py-1">
            <Button size="sm" variant="ghost" disabled={isFetchingNextPage} onClick={onLoadOlder}>
              {isFetchingNextPage ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                'Muat lebih lama'
              )}
            </Button>
          </div>
        )}
        {flat.length === 0 && (
          <p className="py-10 text-center text-xs text-muted-foreground">
            Belum ada pesan. Mulai percakapan di bawah.
          </p>
        )}
        {flat.map((m) => {
          const mine = m.senderId === userId;
          const failed = m.sendStatus === 'failed';
          const sending = m.sendStatus === 'sending';
          const read =
            mine && !sending && !failed && peerReadSeq != null && peerReadSeq >= m.seq && m.seq > 0;
          return (
            <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] ${mine ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}
              >
                {!mine && isGroup && (
                  <span className="text-[10px] font-medium text-muted-foreground px-1">
                    {m.senderName || 'Anggota'}
                  </span>
                )}
                <div
                  className={`rounded-2xl px-3 py-1.5 text-sm whitespace-pre-wrap break-words ${
                    mine
                      ? failed
                        ? 'bg-destructive/15 text-foreground border border-destructive/30'
                        : m.isHeld
                          ? 'bg-primary/80 border border-primary/40 text-primary-foreground'
                          : 'bg-primary text-primary-foreground'
                      : 'bg-accent text-foreground'
                  }`}
                >
                  {m.body}
                </div>
                <div className="flex items-center gap-1.5 px-1 flex-wrap">
                  {m.isHeld && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                      <Clock className="size-3" /> Akan sampai saat jam kerja
                    </span>
                  )}
                  {m.isUrgent && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-500 bg-rose-500/10 px-1 rounded">
                      <Zap className="size-2.5" /> Mendesak
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    {m.seq > 0 ? format(new Date(m.createdAt), 'HH:mm') : ''}
                    {sending && <Loader2 className="size-3 animate-spin" />}
                    {failed && (
                      <button
                        type="button"
                        onClick={() => onRetryMessage(m.clientMessageId)}
                        className="flex items-center gap-0.5 text-destructive hover:underline"
                      >
                        <RotateCcw className="size-3" /> Gagal, coba lagi
                      </button>
                    )}
                    {!sending && !failed && mine && !m.isHeld && read && (
                      <CheckCheck className="size-3.5 text-sky-500" />
                    )}
                    {!sending && !failed && mine && !m.isHeld && !read && m.seq > 0 && (
                      <Check className="size-3.5" />
                    )}
                    {!sending && !failed && mine && !m.isHeld && m.seq === 0 && (
                      <Clock className="size-3" />
                    )}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {newCount > 0 && (
        <button
          type="button"
          onClick={onScrollToBottom}
          className="mx-auto mb-2 flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground shadow"
        >
          <ArrowDown className="size-3.5" /> {newCount} pesan baru
        </button>
      )}

      {!isGroup && peerStatus?.status === 'out_of_hours' && (
        <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-muted/60 border border-border/40 text-xs mb-1">
          <div className="flex items-center gap-1.5 min-w-0 text-muted-foreground">
            <Clock className="size-3.5 shrink-0" />
            <span className="truncate">
              Rekan di luar jam kerja. Pesan akan sampai{' '}
              <span className="font-semibold text-foreground">
                {peerStatus.statusLabel.replace(/^Kembali\s*/i, '')}
              </span>
            </span>
          </div>
          <Button
            type="button"
            size="sm"
            variant={isUrgent ? 'default' : 'outline'}
            disabled={!!urgentQuota && urgentQuota.remainingToday <= 0 && !isUrgent}
            onClick={onToggleUrgent}
            className={`h-7 px-2.5 text-[11px] gap-1 shrink-0 font-medium rounded-lg transition-all ${
              isUrgent
                ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-600 shadow-sm'
                : 'hover:border-amber-500/50 hover:text-amber-600 dark:hover:text-amber-400'
            }`}
          >
            <Zap className="size-3" />
            <span>
              {isUrgent
                ? 'Mendesak Aktif'
                : `Mendesak (${urgentQuota?.remainingToday ?? 3}/${urgentQuota?.dailyLimit ?? 3})`}
            </span>
          </Button>
        </div>
      )}

      <div className="flex items-end gap-2 pt-2 border-t border-border/50">
        <Textarea
          value={draft}
          onChange={onInput}
          onKeyDown={onKey}
          onBlur={onBlurStop}
          placeholder={status === 'open' ? 'Tulis pesan... (Enter kirim)' : 'Menghubungkan...'}
          disabled={status !== 'open'}
          rows={1}
          className="min-h-10 max-h-32 resize-none"
          aria-label="Tulis pesan"
        />
        <Button
          size="icon"
          onClick={onSend}
          disabled={!draft.trim() || status !== 'open'}
          aria-label="Kirim"
        >
          <Send className="size-4" />
        </Button>
      </div>

      {isGroup && (
        <Sheet open={showInfo} onOpenChange={setShowInfo}>
          <SheetContent side="right" className="w-full sm:max-w-sm overflow-auto">
            <SheetHeader>
              <SheetTitle>Info grup</SheetTitle>
              <SheetDescription>Kelola grup dan anggota sesuai role.</SheetDescription>
            </SheetHeader>
            <div className="space-y-5 py-4">
              {canManage ? (
                <form onSubmit={onSaveGroup} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="grpName">Nama grup</Label>
                    <Input
                      id="grpName"
                      value={editName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEditName(e.target.value)
                      }
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="grpDesc">Deskripsi</Label>
                    <Textarea
                      id="grpDesc"
                      value={editDesc}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setEditDesc(e.target.value)
                      }
                      rows={2}
                      maxLength={500}
                    />
                  </div>
                  <Button size="sm" type="submit" disabled={updateGroupPending}>
                    {updateGroupPending ? 'Menyimpan...' : 'Simpan'}
                  </Button>
                </form>
              ) : (
                <div>
                  <p className="text-sm font-medium">{conversationName}</p>
                  {conversationDescription && (
                    <p className="text-xs text-muted-foreground mt-1">{conversationDescription}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Anggota ({members.length})
                </p>
                {members.map((m) => (
                  <div key={m.id} className="flex items-center gap-2">
                    <Avatar className="size-8">
                      <AvatarFallback>{initials(m.user?.fullName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs font-medium">
                        {m.user?.fullName}
                        {m.userId === userId ? ' (Saya)' : ''}
                      </p>
                      <Badge variant="outline" className="text-[10px] h-5">
                        {m.role}
                      </Badge>
                    </div>
                    {isOwner && m.userId !== userId && (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={setMemberRolePending}
                        onClick={() => onSetRole(m.userId, m.role !== 'ADMIN')}
                      >
                        {m.role === 'ADMIN' ? 'Turunkan' : 'Angkat'}
                      </Button>
                    )}
                    {canManage && m.userId !== userId && (isOwner || m.role === 'MEMBER') && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        disabled={removeMemberPending}
                        onClick={() => onRemoveMember(m.userId)}
                      >
                        Keluarkan
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {canManage && (
                <div className="space-y-2">
                  <Label htmlFor="addMember">Tambah anggota</Label>
                  <Input
                    id="addMember"
                    placeholder="Cari nama..."
                    value={addQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setAddQuery(e.target.value)
                    }
                  />
                  <div className="space-y-1 max-h-40 overflow-auto">
                    {availableCandidates.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-accent"
                      >
                        <span className="flex-1 truncate text-xs">{u.fullName}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={addMemberPending}
                          onClick={() => onAddMember(u.id)}
                        >
                          Tambah
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isOwner && (
                <div className="space-y-2">
                  <Label htmlFor="transferTo">Pindahkan kepemilikan</Label>
                  <div className="flex gap-2">
                    <select
                      id="transferTo"
                      value={transferTo}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setTransferTo(e.target.value)
                      }
                      className="flex-1 rounded-md border border-input bg-background px-2 py-1.5 text-xs"
                    >
                      <option value="">Pilih anggota...</option>
                      {members
                        .filter((m) => m.userId !== userId)
                        .map((m) => (
                          <option key={m.id} value={m.userId}>
                            {m.user?.fullName} ({m.role})
                          </option>
                        ))}
                    </select>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!transferTo || transferPending}
                      onClick={onTransfer}
                    >
                      Pindah
                    </Button>
                  </div>
                </div>
              )}

              <Button size="sm" variant="destructive" disabled={leavePending} onClick={onLeave}>
                Keluar grup
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}

export default ChatRoomSection;
