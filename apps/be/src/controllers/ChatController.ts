import type { AppContext } from '@/contex';
import { HttpResponse } from '@/http';
import ChatService, { ChatForbiddenError } from '@/service/ChatService';
import { getUser } from '@/utils/authTokens';
import { memberContextValidate, paramsValidate } from '@/validation/auth.validate';

function actorOf(c: AppContext) {
  const user = getUser(c);
  return {
    user,
    actor: {
      userId: user.id,
      companyId: user.companyId as string,
      companyMemberId: user.companyMemberId as string,
    },
  };
}

function chatError(c: AppContext, error: unknown, fallback: string) {
  if (error instanceof ChatForbiddenError) {
    return HttpResponse(c).forbidden(error.message);
  }
  const message = error instanceof Error ? error.message : fallback;
  return HttpResponse(c).badRequest(message);
}

class ChatController {
  public async listConversations(c: AppContext) {
    try {
      const { user, actor } = actorOf(c);
      const invalid = await memberContextValidate(user, c);
      if (invalid) return invalid;
      const result = await ChatService.listConversations(actor, c.query as never);
      return HttpResponse(c).ok(result.data, result.meta, 'Daftar percakapan');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async openDirect(c: AppContext) {
    try {
      const { user, actor } = actorOf(c);
      const invalid = await memberContextValidate(user, c);
      if (invalid) return invalid;
      const body = c.body as { userId: string };
      const data = await ChatService.openDirect(actor, body.userId);
      return HttpResponse(c).ok(data, undefined, 'Percakapan pribadi dibuka');
    } catch (error) {
      return chatError(c, error, 'Gagal membuka percakapan');
    }
  }

  public async createGroup(c: AppContext) {
    try {
      const { user, actor } = actorOf(c);
      const invalid = await memberContextValidate(user, c);
      if (invalid) return invalid;
      const data = await ChatService.createGroup(actor, c.body as never);
      return HttpResponse(c).created(data, 'Grup berhasil dibuat');
    } catch (error) {
      return chatError(c, error, 'Gagal membuat grup');
    }
  }

  public async listMessages(c: AppContext) {
    try {
      const { user, actor } = actorOf(c);
      const invalid = await memberContextValidate(user, c);
      if (invalid) return invalid;
      const params = c.params as { id: string };
      const invalidParams = await paramsValidate(params.id, c);
      if (invalidParams) return invalidParams;
      const data = await ChatService.listMessages(params.id, actor, c.query as never);
      return HttpResponse(c).ok(data.data, { nextCursor: data.nextCursor }, 'Riwayat pesan');
    } catch (error) {
      return chatError(c, error, 'Gagal mengambil riwayat');
    }
  }

  public async searchUsers(c: AppContext) {
    try {
      const { user, actor } = actorOf(c);
      const invalid = await memberContextValidate(user, c);
      if (invalid) return invalid;
      const data = await ChatService.searchUsers(actor, c.query as never);
      return HttpResponse(c).ok(data, undefined, 'Daftar pengguna');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async listMembers(c: AppContext) {
    try {
      const { user, actor } = actorOf(c);
      const invalid = await memberContextValidate(user, c);
      if (invalid) return invalid;
      const params = c.params as { id: string };
      const invalidParams = await paramsValidate(params.id, c);
      if (invalidParams) return invalidParams;
      const data = await ChatService.listMembers(params.id, actor);
      return HttpResponse(c).ok(data, undefined, 'Daftar anggota');
    } catch (error) {
      return chatError(c, error, 'Gagal mengambil anggota');
    }
  }

  public async updateGroup(c: AppContext) {
    try {
      const { user, actor } = actorOf(c);
      const invalid = await memberContextValidate(user, c);
      if (invalid) return invalid;
      const params = c.params as { id: string };
      const invalidParams = await paramsValidate(params.id, c);
      if (invalidParams) return invalidParams;
      const data = await ChatService.updateGroup(params.id, actor, c.body as never);
      return HttpResponse(c).ok(data, undefined, 'Grup berhasil diperbarui');
    } catch (error) {
      return chatError(c, error, 'Gagal memperbarui grup');
    }
  }

  public async addMember(c: AppContext) {
    try {
      const { user, actor } = actorOf(c);
      const invalid = await memberContextValidate(user, c);
      if (invalid) return invalid;
      const params = c.params as { id: string };
      const invalidParams = await paramsValidate(params.id, c);
      if (invalidParams) return invalidParams;
      const body = c.body as { userId: string };
      const data = await ChatService.addMember(params.id, actor, body.userId);
      return HttpResponse(c).created(data, 'Anggota berhasil ditambahkan');
    } catch (error) {
      return chatError(c, error, 'Gagal menambah anggota');
    }
  }

  public async setMemberRole(c: AppContext) {
    try {
      const { user, actor } = actorOf(c);
      const invalid = await memberContextValidate(user, c);
      if (invalid) return invalid;
      const params = c.params as { id: string };
      const invalidParams = await paramsValidate(params.id, c);
      if (invalidParams) return invalidParams;
      const body = c.body as { userId: string; role: 'ADMIN' | 'MEMBER' };
      const data = await ChatService.setMemberRole(params.id, actor, body.userId, body.role);
      return HttpResponse(c).ok(data, undefined, 'Role anggota diperbarui');
    } catch (error) {
      return chatError(c, error, 'Gagal mengubah role');
    }
  }

  public async removeMember(c: AppContext) {
    try {
      const { user, actor } = actorOf(c);
      const invalid = await memberContextValidate(user, c);
      if (invalid) return invalid;
      const params = c.params as { id: string; userId: string };
      const invalidParams =
        (await paramsValidate(params.id, c)) ?? (await paramsValidate(params.userId, c));
      if (invalidParams) return invalidParams;
      const data = await ChatService.removeMember(params.id, actor, params.userId);
      return HttpResponse(c).ok(data, undefined, 'Anggota dikeluarkan');
    } catch (error) {
      return chatError(c, error, 'Gagal mengeluarkan anggota');
    }
  }

  public async leave(c: AppContext) {
    try {
      const { user, actor } = actorOf(c);
      const invalid = await memberContextValidate(user, c);
      if (invalid) return invalid;
      const params = c.params as { id: string };
      const invalidParams = await paramsValidate(params.id, c);
      if (invalidParams) return invalidParams;
      const data = await ChatService.leave(params.id, actor);
      return HttpResponse(c).ok(data, undefined, 'Keluar dari percakapan');
    } catch (error) {
      return chatError(c, error, 'Gagal keluar');
    }
  }

  public async transfer(c: AppContext) {
    try {
      const { user, actor } = actorOf(c);
      const invalid = await memberContextValidate(user, c);
      if (invalid) return invalid;
      const params = c.params as { id: string };
      const invalidParams = await paramsValidate(params.id, c);
      if (invalidParams) return invalidParams;
      const body = c.body as { newOwnerId: string };
      const data = await ChatService.transfer(params.id, actor, body.newOwnerId);
      return HttpResponse(c).ok(data, undefined, 'Kepemilikan dipindahkan');
    } catch (error) {
      return chatError(c, error, 'Gagal memindahkan kepemilikan');
    }
  }
}

export default new ChatController();
