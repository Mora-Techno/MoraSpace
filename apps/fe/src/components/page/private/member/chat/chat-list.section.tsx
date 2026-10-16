'use client';

import type { ChatConversationPreview, ChatUserSearchResult } from '@repo/types';
import { MessageCircle, Plus, Search, Users, Wifi, WifiOff } from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Skeleton,
} from '@/components/atoms';
import type { ChatConnStatus } from '@/hooks/useChatSocket';

function timeLabel(iso?: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
  }
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

function initials(name?: string | null) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

interface ChatListSectionProps {
  service: {
    conversations: ChatConversationPreview[];
    users: ChatUserSearchResult[];
    isLoading: boolean;
    isError: boolean;
    isSearching: boolean;
    status: ChatConnStatus;
    isPersonal: boolean;
    openDirectPending: boolean;
    createGroupPending: boolean;
    onRetry: () => void;
    onOpenConversation: (id: string) => void;
    onStartDirect: (userId: string) => void;
    onSubmitGroup: (e: React.FormEvent) => void;
    onTogglePick: (id: string) => void;
    onBackToDashboard: () => void;
  };
  state: {
    filter: string;
    setFilter: (v: string) => void;
    showNew: boolean;
    setShowNew: (v: boolean) => void;
    showGroup: boolean;
    setShowGroup: (v: boolean) => void;
    userQuery: string;
    setUserQuery: (v: string) => void;
    groupName: string;
    setGroupName: (v: string) => void;
    picked: string[];
    setPicked: React.Dispatch<React.SetStateAction<string[]>>;
  };
}

export function ChatListSection({ service, state }: ChatListSectionProps) {
  const {
    conversations: filtered,
    users,
    isLoading,
    isError,
    isSearching,
    status,
    isPersonal,
    openDirectPending,
    createGroupPending,
    onRetry,
    onOpenConversation,
    onStartDirect,
    onSubmitGroup,
    onTogglePick,
    onBackToDashboard,
  } = service;
  const {
    filter,
    setFilter,
    showNew,
    setShowNew,
    showGroup,
    setShowGroup,
    userQuery,
    setUserQuery,
    groupName,
    setGroupName,
    picked,
  } = state;

  if (isPersonal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 max-w-md mx-auto">
        <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary shadow-xs">
          <MessageCircle className="size-8" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Chat Hanya Tersedia di Company Workspace</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Fitur obrolan dan kolaborasi tim dirancang untuk komunikasi dalam perusahaan. Silakan
          beralih ke Company Workspace melalui Workspace Switcher di header atas.
        </p>
        <Button onClick={onBackToDashboard} variant="outline" className="rounded-xl">
          Kembali ke Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
          <MessageCircle className="size-5" />
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Chat</h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            {status === 'open' ? (
              <>
                <Wifi className="size-3 text-emerald-500" /> Terhubung
              </>
            ) : (
              <>
                <WifiOff className="size-3 text-muted-foreground" /> Menghubungkan...
              </>
            )}
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setShowGroup(true)}>
          <Users className="size-4" /> Grup
        </Button>
        <Button size="sm" onClick={() => setShowNew(true)}>
          <Plus className="size-4" /> Baru
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Cari percakapan..."
          value={filter}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-border/60 p-8 text-center space-y-3">
          <p className="text-sm text-muted-foreground">Gagal memuat percakapan.</p>
          <Button size="sm" variant="outline" onClick={onRetry}>
            Coba lagi
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/60 p-10 text-center">
          <MessageCircle className="size-8 mx-auto text-muted-foreground/50" />
          <p className="mt-2 text-sm font-medium">Belum ada percakapan</p>
          <p className="text-xs text-muted-foreground">Mulai chat pribadi atau buat grup baru.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map((c) => {
            const name = c.type === 'DIRECT' ? c.peerName || c.name || 'Direct' : c.name || 'Grup';
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onOpenConversation(c.id)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-accent"
              >
                <Avatar className="size-10 shrink-0">
                  <AvatarFallback>{initials(name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">{name}</span>
                    {c.type === 'GROUP' && (
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {c.memberCount} anggota
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {c.lastMessage?.body || 'Belum ada pesan'}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[10px] text-muted-foreground">
                    {timeLabel(c.lastMessage?.createdAt)}
                  </span>
                  {c.unreadCount > 0 && (
                    <Badge className="h-5 min-w-5 justify-center rounded-full px-1.5 text-[10px]">
                      {c.unreadCount > 99 ? '99+' : c.unreadCount}
                    </Badge>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chat baru</DialogTitle>
            <DialogDescription>Pilih anggota satu company untuk diajak chat.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="chatUserSearch">Cari nama atau email</Label>
            <Input
              id="chatUserSearch"
              placeholder="nama..."
              value={userQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserQuery(e.target.value)}
            />
          </div>
          <div className="max-h-64 overflow-auto space-y-1">
            {isSearching ? (
              <Skeleton className="h-12 w-full rounded-lg" />
            ) : users.length === 0 ? (
              <p className="py-4 text-center text-xs text-muted-foreground">Tidak ada hasil.</p>
            ) : (
              users.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  disabled={openDirectPending}
                  onClick={() => onStartDirect(u.id)}
                  className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-accent disabled:opacity-50"
                >
                  <Avatar className="size-8">
                    <AvatarFallback>{initials(u.fullName)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{u.fullName}</p>
                    <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showGroup} onOpenChange={setShowGroup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Grup baru</DialogTitle>
            <DialogDescription>Beri nama dan pilih anggota awal.</DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmitGroup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">Nama grup</Label>
              <Input
                id="groupName"
                placeholder="cth: Squad Launching"
                value={groupName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGroupName(e.target.value)}
                maxLength={100}
              />
            </div>
            <div className="space-y-1 max-h-56 overflow-auto">
              {users.map((u) => (
                <label
                  key={u.id}
                  className="flex items-center gap-3 rounded-lg px-2.5 py-2 cursor-pointer hover:bg-accent"
                >
                  <input
                    type="checkbox"
                    checked={picked.includes(u.id)}
                    onChange={() => onTogglePick(u.id)}
                    className="rounded border-input"
                  />
                  <Avatar className="size-8">
                    <AvatarFallback>{initials(u.fullName)}</AvatarFallback>
                  </Avatar>
                  <span className="truncate text-sm">{u.fullName}</span>
                </label>
              ))}
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={!groupName.trim() || picked.length === 0 || createGroupPending}
              >
                {createGroupPending ? 'Membuat...' : `Buat grup (${picked.length})`}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ChatListSection;
