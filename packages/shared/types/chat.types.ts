// v1.x Chat — 1-to-1 & grup, company-scoped.
// Kebijakan riwayat: anggota aktif boleh baca; keluar/dikeluarkan → 403 + stop event.
// Role conversation (OWNER/ADMIN/MEMBER) terpisah dari company Owner/Member.

export type ConversationType = 'DIRECT' | 'GROUP';
export type ConversationRole = 'OWNER' | 'ADMIN' | 'MEMBER';

export interface IConversation {
  id: string;
  companyId: string;
  type: ConversationType;
  directKey: string | null;
  name: string | null;
  description: string | null;
  createdById: string;
  seqCounter: number;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IConversationMember {
  id: string;
  conversationId: string;
  userId: string;
  companyMemberId: string;
  role: ConversationRole;
  joinedAt: string;
  leftAt: string | null;
  lastReadSeq: number;
  createdAt: string;
  updatedAt: string;
}

export interface IChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderMemberId: string;
  clientMessageId: string;
  seq: number;
  body: string;
  createdAt: string;
}

export interface ChatMemberInfo extends IConversationMember {
  user: { id: string; fullName: string };
  senderName?: string;
}

export interface ChatMessageInfo extends IChatMessage {
  senderName?: string;
}

export interface ChatConversationPreview extends IConversation {
  lastMessage: ChatMessageInfo | null;
  unreadCount: number;
  memberCount: number;
  peerName?: string;
}

export interface ChatMessagesPage {
  data: ChatMessageInfo[];
  nextCursor: number | null;
}

export interface PickOpenDirect {
  userId: string;
}

export interface PickCreateGroup {
  name: string;
  description?: string;
  memberUserIds: string[];
}

export interface PickUpdateGroup {
  name?: string;
  description?: string;
}

export interface PickManageGroupMember {
  userId: string;
  role?: ConversationRole;
}

export interface PickTransferOwnership {
  newOwnerId: string;
}

export interface ChatConversationQuery {
  search?: string;
  page?: number;
  limit?: number;
}

export interface ChatMessagesQuery {
  cursor?: number;
  limit?: number;
}

export interface ChatUserSearchQuery {
  search?: string;
  limit?: number;
}

export interface ChatUserSearchResult {
  id: string;
  fullName: string;
  email: string;
}

export interface PickMarkRead {
  seq: number;
}

// Kontrak event WebSocket (Phase 3). seq/id dari server adalah kebenaran.
export interface ChatWsSendPayload {
  conversationId: string;
  clientMessageId: string;
  body: string;
}

export interface ChatWsAckPayload {
  clientMessageId: string;
  message: ChatMessageInfo;
}

export interface ChatWsTypingPayload {
  conversationId: string;
  userId: string;
  fullName?: string;
  isTyping: boolean;
}

export interface ChatWsReadPayload {
  conversationId: string;
  userId: string;
  seq: number;
}

export interface ChatWsMembershipPayload {
  conversationId: string;
  userId: string;
  change: 'joined' | 'left' | 'removed' | 'role';
  role?: ConversationRole;
}
