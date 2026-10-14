import { CHAT_ENDPOINTS } from '../endpoints/chat.endpoints';
import type { TResponse } from '../types/response.types';
import type {
  ChatConversationPreview,
  ChatMemberInfo,
  ChatMessageInfo,
  ChatMessagesQuery,
  ChatConversationQuery,
  ChatUserSearchQuery,
  ChatUserSearchResult,
  IConversation,
  IConversationMember,
  PickCreateGroup,
  PickManageGroupMember,
  PickOpenDirect,
  PickTransferOwnership,
  PickUpdateGroup,
} from '../types/chat.types';
import { DeleteResponse, GetResponse, PatchResponse, PostResponse, withQuery } from './http';
import { toServiceResponse } from './service-response';

class ChatService {
  public async ListConversations(
    query?: ChatConversationQuery,
  ): Promise<TResponse<ChatConversationPreview[]>> {
    const res = await GetResponse<ChatConversationPreview[]>(
      withQuery(CHAT_ENDPOINTS.CONVERSATIONS, query),
    );
    return toServiceResponse(res, { message: 'Daftar percakapan berhasil diambil' });
  }

  public async OpenDirect(payload: PickOpenDirect): Promise<TResponse<IConversation>> {
    const res = await PostResponse<IConversation>(CHAT_ENDPOINTS.DIRECT, payload);
    return toServiceResponse(res, { message: 'Percakapan pribadi dibuka' });
  }

  public async CreateGroup(payload: PickCreateGroup): Promise<TResponse<IConversation>> {
    const res = await PostResponse<IConversation>(CHAT_ENDPOINTS.GROUPS, payload);
    return toServiceResponse(res, { message: 'Grup berhasil dibuat', statusCode: 201 });
  }

  public async ListMessages(
    id: string,
    query?: ChatMessagesQuery,
  ): Promise<TResponse<ChatMessageInfo[]>> {
    const res = await GetResponse<ChatMessageInfo[]>(withQuery(CHAT_ENDPOINTS.MESSAGES(id), query));
    return toServiceResponse(res, { message: 'Riwayat pesan berhasil diambil' });
  }

  public async SearchUsers(
    query?: ChatUserSearchQuery,
  ): Promise<TResponse<ChatUserSearchResult[]>> {
    const res = await GetResponse<ChatUserSearchResult[]>(
      withQuery(CHAT_ENDPOINTS.USERS_SEARCH, query),
    );
    return toServiceResponse(res, { message: 'Daftar pengguna berhasil diambil' });
  }

  public async ListMembers(id: string): Promise<TResponse<ChatMemberInfo[]>> {
    const res = await GetResponse<ChatMemberInfo[]>(CHAT_ENDPOINTS.MEMBERS(id));
    return toServiceResponse(res, { message: 'Daftar anggota berhasil diambil' });
  }

  public async UpdateGroup(
    id: string,
    payload: PickUpdateGroup,
  ): Promise<TResponse<IConversation>> {
    const res = await PatchResponse<IConversation>(CHAT_ENDPOINTS.GROUP_BY_ID(id), payload);
    return toServiceResponse(res, { message: 'Grup berhasil diperbarui' });
  }

  public async AddMember(
    id: string,
    payload: PickManageGroupMember,
  ): Promise<TResponse<IConversationMember>> {
    const res = await PostResponse<IConversationMember>(CHAT_ENDPOINTS.MEMBERS(id), payload);
    return toServiceResponse(res, { message: 'Anggota berhasil ditambahkan', statusCode: 201 });
  }

  public async SetMemberRole(
    id: string,
    payload: PickManageGroupMember,
  ): Promise<TResponse<IConversationMember>> {
    const res = await PatchResponse<IConversationMember>(CHAT_ENDPOINTS.MEMBERS(id), payload);
    return toServiceResponse(res, { message: 'Role anggota diperbarui' });
  }

  public async RemoveMember(id: string, userId: string): Promise<TResponse<IConversationMember>> {
    const res = await DeleteResponse<IConversationMember>(CHAT_ENDPOINTS.MEMBER_BY_ID(id, userId));
    return toServiceResponse(res, { message: 'Anggota dikeluarkan' });
  }

  public async Leave(id: string): Promise<TResponse<{ archived: boolean }>> {
    const res = await PostResponse<{ archived: boolean }>(CHAT_ENDPOINTS.LEAVE(id));
    return toServiceResponse(res, { message: 'Keluar dari percakapan' });
  }

  public async TransferOwnership(
    id: string,
    payload: PickTransferOwnership,
  ): Promise<TResponse<ChatMemberInfo[]>> {
    const res = await PostResponse<ChatMemberInfo[]>(CHAT_ENDPOINTS.TRANSFER(id), payload);
    return toServiceResponse(res, { message: 'Kepemilikan dipindahkan' });
  }
}

export default new ChatService();
