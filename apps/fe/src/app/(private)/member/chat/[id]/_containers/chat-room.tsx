'use client';

import { format } from 'date-fns';
import { ArrowDown, ArrowLeft, Check, CheckCheck, Clock, Loader2, RotateCcw, Send, Users, WifiOff } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

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
} from '@/components/atoms';
import { useApi } from '@/hooks/useApi/useApi';
import { type LocalChatMessage,useChatSocket } from '@/hooks/useChatSocket';
import { useDebounce } from '@/hooks/useDebounce';

function initials(name?: string | null) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function ChatRoomContainer({ id }: { id: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const base = pathname.startsWith('/owner') ? '/owner/member/chat' : '/member/chat';
  const api = useApi();
  const {
    status,
    userId,
    subscribe,
    unsubscribe,
    sendMessage,
    retryMessage,
    sendTyping,
    sendRead,
    typing,
    peerReads,
  } = useChatSocket();

  const messagesQuery = api.chat.query.messages(id);
  const { data: members = [] } = api.chat.query.members(id);
  const { data: conversations = [] } = api.chat.query.conversations();
  const { data: users = [] } = api.chat.query.userSearch(undefined);
  const updateGroup = api.chat.mutate.updateGroup();
  const addMember = api.chat.mutate.addMember();
  const setMemberRole = api.chat.mutate.setMemberRole();
  const removeMember = api.chat.mutate.removeMember();
  const leaveConversation = api.chat.mutate.leave();
  const transferOwnership = api.chat.mutate.transferOwnership();

  const [draft, setDraft] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [addQuery, setAddQuery] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const debouncedAddQuery = useDebounce(addQuery, 400);
  const { data: addCandidates = [] } = api.chat.query.userSearch(
    debouncedAddQuery ? { search: debouncedAddQuery } : undefined,
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const stickRef = useRef(true);
  const lastSeenRef = useRef(0);
  const lastTypeRef = useRef(0);
  const [newCount, setNewCount] = useState(0);

  const conversation = conversations.find((c) => c.id === id);
  const myMember = members.find((m) => m.userId === userId);
  const isGroup = conversation?.type === 'GROUP';
  const title = isGroup
    ? conversation?.name || 'Grup'
    : conversation?.peerName || conversation?.name || 'Direct';
  const canManage = myMember?.role === 'OWNER' || myMember?.role === 'ADMIN';
  const isOwner = myMember?.role === 'OWNER';

  const flat = useMemo(() => {
    const pages = messagesQuery.data?.pages ?? [];
    return [...pages].reverse().flatMap((p) => p.data) as LocalChatMessage[];
  }, [messagesQuery.data]);

  const maxSeq = useMemo(() => flat.reduce((m, x) => Math.max(m, x.seq), 0), [flat]);

  useEffect(() => {
    subscribe(id);
    return () => unsubscribe(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Tandai dibaca saat halaman terbuka & terlihat.
  useEffect(() => {
    if (!maxSeq || document.visibilityState !== 'visible') return;
    sendRead(id, maxSeq);
  }, [id, maxSeq, sendRead]);
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible' && maxSeq) sendRead(id, maxSeq);
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, [id, maxSeq, sendRead]);

  // Auto-scroll + pil pesan baru.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (stickRef.current) {
      el.scrollTop = el.scrollHeight;
      lastSeenRef.current = maxSeq;
      setNewCount(0);
    } else if (maxSeq > lastSeenRef.current) {
      const fresh = flat.filter((m) => m.seq > lastSeenRef.current && m.senderId !== userId).length;
      setNewCount(fresh);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flat.length, maxSeq]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    stickRef.current = nearBottom;
    if (nearBottom) {
      lastSeenRef.current = maxSeq;
      setNewCount(0);
    }
    if (el.scrollTop < 200 && messagesQuery.hasNextPage && !messagesQuery.isFetchingNextPage) {
      const prevHeight = el.scrollHeight;
      const prevTop = el.scrollTop;
      void messagesQuery.fetchNextPage().then(() => {
        requestAnimationFrame(() => {
          const node = scrollRef.current;
          if (node) node.scrollTop = node.scrollHeight - prevHeight + prevTop;
        });
      });
    }
  };

  const scrollBottom = () => {
    const el = scrollRef.current;
    if (!el) return;
    stickRef.current = true;
    lastSeenRef.current = maxSeq;
    setNewCount(0);
    el.scrollTop = el.scrollHeight;
  };

  const stopTyping = () => {
    sendTyping(id, false);
    lastTypeRef.current = 0;
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(e.target.value);
    const now = Date.now();
    if (now - lastTypeRef.current > 3000) {
      lastTypeRef.current = now;
      sendTyping(id, true);
    }
  };

  const handleSend = () => {
    if (!draft.trim()) return;
    const cmid = sendMessage(id, draft);
    if (cmid) {
      setDraft('');
      stopTyping();
      stickRef.current = true;
      requestAnimationFrame(() => {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
      });
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const native = e.nativeEvent as KeyboardEvent & { isComposing?: boolean };
    if (native.isComposing) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => () => stopTyping(), [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const typers = (typing[id] ?? []).filter((t) => t.userId !== userId);
  const peerRead = peerReads[id];

  const openInfo = () => {
    setEditName(conversation?.name || '');
    setEditDesc(conversation?.description || '');
    setShowInfo(true);
  };

  const saveGroup = (e: React.FormEvent) => {
    e.preventDefault();
    updateGroup.mutate({ id, payload: { name: editName.trim() || undefined, description: editDesc.trim() } });
  };

  if (messagesQuery.isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (messagesQuery.isError) {
    return (
      <div className="w-full max-w-3xl mx-auto rounded-xl border border-border/60 p-10 text-center space-y-3">
        <p className="text-sm font-medium">Tidak dapat membuka percakapan</p>
        <p className="text-xs text-muted-foreground">Mungkin sudah keluar atau akses dicabut.</p>
        <Button size="sm" variant="outline" onClick={() => router.push(base)}>
          Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-[calc(100dvh-10rem)] md:h-[calc(100dvh-12rem)]">
      <div className="flex items-center gap-2 pb-3 border-b border-border/50">
        <Button size="icon" variant="ghost" onClick={() => router.push(base)} aria-label="Kembali">
          <ArrowLeft className="size-4" />
        </Button>
        <Avatar className="size-9">
          <AvatarFallback>{initials(title)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-semibold">{title}</p>
          <p className="text-[11px] text-muted-foreground">
            {typers.length > 0
              ? `${typers.map((t) => t.fullName || 'Seseorang').join(', ')} mengetik...`
              : isGroup
                ? `${members.length} anggota`
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
          <Button size="icon" variant="ghost" onClick={openInfo} aria-label="Info grup">
            <Users className="size-4" />
          </Button>
        )}
      </div>

      <div ref={scrollRef} onScroll={onScroll} className="flex-1 overflow-auto py-3 space-y-1.5 px-0.5">
        {messagesQuery.hasNextPage && (
          <div className="flex justify-center py-1">
            <Button
              size="sm"
              variant="ghost"
              disabled={messagesQuery.isFetchingNextPage}
              onClick={() => void messagesQuery.fetchNextPage()}
            >
              {messagesQuery.isFetchingNextPage ? (
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
          const read = mine && !sending && !failed && peerRead != null && peerRead.seq >= m.seq && m.seq > 0;
          return (
            <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${mine ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
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
                        : 'bg-primary text-primary-foreground'
                      : 'bg-accent text-foreground'
                  }`}
                >
                  {m.body}
                </div>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground px-1">
                  {m.seq > 0 ? format(new Date(m.createdAt), 'HH:mm') : ''}
                  {sending && <Loader2 className="size-3 animate-spin" />}
                  {failed && (
                    <button
                      type="button"
                      onClick={() => retryMessage(id, m.clientMessageId)}
                      className="flex items-center gap-0.5 text-destructive hover:underline"
                    >
                      <RotateCcw className="size-3" /> Gagal, coba lagi
                    </button>
                  )}
                  {!sending && !failed && mine && read && <CheckCheck className="size-3.5 text-sky-500" />}
                  {!sending && !failed && mine && !read && m.seq > 0 && <Check className="size-3.5" />}
                  {!sending && !failed && mine && m.seq === 0 && <Clock className="size-3" />}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {newCount > 0 && (
        <button
          type="button"
          onClick={scrollBottom}
          className="mx-auto mb-2 flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground shadow"
        >
          <ArrowDown className="size-3.5" /> {newCount} pesan baru
        </button>
      )}

      <div className="flex items-end gap-2 pt-2 border-t border-border/50">
        <Textarea
          value={draft}
          onChange={handleInput}
          onKeyDown={handleKey}
          onBlur={stopTyping}
          placeholder={status === 'open' ? 'Tulis pesan... (Enter kirim)' : 'Menghubungkan...'}
          disabled={status !== 'open'}
          rows={1}
          className="min-h-10 max-h-32 resize-none"
          aria-label="Tulis pesan"
        />
        <Button size="icon" onClick={handleSend} disabled={!draft.trim() || status !== 'open'} aria-label="Kirim">
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
                <form onSubmit={saveGroup} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="grpName">Nama grup</Label>
                    <Input
                      id="grpName"
                      value={editName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditName(e.target.value)}
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="grpDesc">Deskripsi</Label>
                    <Textarea
                      id="grpDesc"
                      value={editDesc}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditDesc(e.target.value)}
                      rows={2}
                      maxLength={500}
                    />
                  </div>
                  <Button size="sm" type="submit" disabled={updateGroup.isPending}>
                    {updateGroup.isPending ? 'Menyimpan...' : 'Simpan'}
                  </Button>
                </form>
              ) : (
                <div>
                  <p className="text-sm font-medium">{conversation?.name}</p>
                  {conversation?.description && (
                    <p className="text-xs text-muted-foreground mt-1">{conversation.description}</p>
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
                        disabled={setMemberRole.isPending}
                        onClick={() =>
                          setMemberRole.mutate({
                            id,
                            payload: {
                              userId: m.userId,
                              role: m.role === 'ADMIN' ? 'MEMBER' : 'ADMIN',
                            },
                          })
                        }
                      >
                        {m.role === 'ADMIN' ? 'Turunkan' : 'Angkat'}
                      </Button>
                    )}
                    {canManage && m.userId !== userId && (isOwner || m.role === 'MEMBER') && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        disabled={removeMember.isPending}
                        onClick={() => removeMember.mutate({ id, userId: m.userId })}
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddQuery(e.target.value)}
                  />
                  <div className="space-y-1 max-h-40 overflow-auto">
                    {addCandidates
                      .filter((u) => !members.some((m) => m.userId === u.id))
                      .map((u) => (
                        <div key={u.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-accent">
                          <span className="flex-1 truncate text-xs">{u.fullName}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={addMember.isPending}
                            onClick={() => addMember.mutate({ id, payload: { userId: u.id } })}
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
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTransferTo(e.target.value)}
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
                      disabled={!transferTo || transferOwnership.isPending}
                      onClick={() =>
                        transferOwnership.mutate(
                          { id, payload: { newOwnerId: transferTo } },
                          { onSuccess: () => setTransferTo('') },
                        )
                      }
                    >
                      Pindah
                    </Button>
                  </div>
                </div>
              )}

              <Button
                size="sm"
                variant="destructive"
                disabled={leaveConversation.isPending}
                onClick={() =>
                  leaveConversation.mutate(
                    { id },
                    { onSuccess: () => router.push(base) },
                  )
                }
              >
                Keluar grup
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
