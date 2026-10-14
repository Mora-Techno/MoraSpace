import Elysia from 'elysia';
import ChatController from '@/controllers/ChatController';
import {
  ChatConversationQueryDto,
  ChatMemberParamsDto,
  ChatMessagesQueryDto,
  ChatParamsDto,
  ChatUserSearchQueryDto,
  CreateGroupDto,
  ManageGroupMemberDto,
  OpenDirectDto,
  TransferOwnershipDto,
  UpdateGroupDto,
} from '@/dto/chat.dto';
import type { AppContext } from '@/contex';
import { verifyToken } from '@/middlewares/auth';

const authed = [verifyToken().beforeHandle];

class ChatRouter {
  public chatRouter;

  constructor() {
    this.chatRouter = new Elysia({ prefix: '/chat', tags: ['Chat'] });
    this.routes();
  }

  private routes() {
    this.chatRouter.get('/conversations', (c: AppContext) => ChatController.listConversations(c), {
      query: ChatConversationQueryDto,
      beforeHandle: authed,
      detail: { summary: 'Daftar percakapan', tags: ['Chat'] },
    });
    this.chatRouter.post('/direct', (c: AppContext) => ChatController.openDirect(c), {
      body: OpenDirectDto,
      beforeHandle: authed,
      detail: { summary: 'Buka/buat percakapan pribadi', tags: ['Chat'] },
    });
    this.chatRouter.post('/groups', (c: AppContext) => ChatController.createGroup(c), {
      body: CreateGroupDto,
      beforeHandle: authed,
      detail: { summary: 'Buat grup', tags: ['Chat'] },
    });
    this.chatRouter.get(
      '/conversations/:id/messages',
      (c: AppContext) => ChatController.listMessages(c),
      {
        params: ChatParamsDto,
        query: ChatMessagesQueryDto,
        beforeHandle: authed,
        detail: { summary: 'Riwayat pesan (cursor seq)', tags: ['Chat'] },
      },
    );
    this.chatRouter.get('/users/search', (c: AppContext) => ChatController.searchUsers(c), {
      query: ChatUserSearchQueryDto,
      beforeHandle: authed,
      detail: { summary: 'Cari pengguna satu company', tags: ['Chat'] },
    });
    this.chatRouter.get(
      '/conversations/:id/members',
      (c: AppContext) => ChatController.listMembers(c),
      {
        params: ChatParamsDto,
        beforeHandle: authed,
        detail: { summary: 'Daftar anggota percakapan', tags: ['Chat'] },
      },
    );
    this.chatRouter.patch('/groups/:id', (c: AppContext) => ChatController.updateGroup(c), {
      params: ChatParamsDto,
      body: UpdateGroupDto,
      beforeHandle: authed,
      detail: { summary: 'Ubah nama/deskripsi grup (OWNER/ADMIN)', tags: ['Chat'] },
    });
    this.chatRouter.post(
      '/conversations/:id/members',
      (c: AppContext) => ChatController.addMember(c),
      {
        params: ChatParamsDto,
        body: ManageGroupMemberDto,
        beforeHandle: authed,
        detail: { summary: 'Tambah anggota (OWNER/ADMIN)', tags: ['Chat'] },
      },
    );
    this.chatRouter.patch(
      '/conversations/:id/members',
      (c: AppContext) => ChatController.setMemberRole(c),
      {
        params: ChatParamsDto,
        body: ManageGroupMemberDto,
        beforeHandle: authed,
        detail: { summary: 'Ubah role anggota (OWNER)', tags: ['Chat'] },
      },
    );
    this.chatRouter.delete(
      '/conversations/:id/members/:userId',
      (c: AppContext) => ChatController.removeMember(c),
      {
        params: ChatMemberParamsDto,
        beforeHandle: authed,
        detail: { summary: 'Keluarkan anggota', tags: ['Chat'] },
      },
    );
    this.chatRouter.post('/conversations/:id/leave', (c: AppContext) => ChatController.leave(c), {
      params: ChatParamsDto,
      beforeHandle: authed,
      detail: { summary: 'Keluar dari percakapan', tags: ['Chat'] },
    });
    this.chatRouter.post(
      '/conversations/:id/transfer',
      (c: AppContext) => ChatController.transfer(c),
      {
        params: ChatParamsDto,
        body: TransferOwnershipDto,
        beforeHandle: authed,
        detail: { summary: 'Pindahkan kepemilikan (OWNER)', tags: ['Chat'] },
      },
    );
  }
}

export default new ChatRouter().chatRouter;
