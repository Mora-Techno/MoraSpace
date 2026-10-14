import { Prisma } from '@/generated/client';
import prisma from 'prisma/client';

export class ChatForbiddenError extends Error {}

type ChatActor = {
  userId: string;
  companyId: string;
  companyMemberId: string;
};

const GROUP_MEMBER_CAP = 50;

class ChatService {
  private buildDirectKey(companyId: string, a: string, b: string) {
    const [x, y] = [a, b].sort();
    return `${companyId}:${x}:${y}`;
  }

  private isDuplicateKeyError(error: unknown) {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
  }

  private async activeMember(conversationId: string, actor: ChatActor) {
    const member = await prisma.conversationMember.findUnique({
      where: { conversationId_userId: { conversationId, userId: actor.userId } },
      include: { conversation: { select: { companyId: true } } },
    });
    if (!member || member.leftAt || member.conversation?.companyId !== actor.companyId) {
      throw new ChatForbiddenError('Anda bukan anggota aktif percakapan ini');
    }
    return member;
  }

  private async activeCompanyMember(companyId: string, userId: string) {
    const member = await prisma.companyMember.findUnique({
      where: { companyId_userId: { companyId, userId } },
    });
    if (member?.status !== 'active') {
      throw new ChatForbiddenError('Pengguna bukan anggota aktif company ini');
    }
    return member;
  }

  private toPreview(
    conversation: {
      id: string;
      companyId: string;
      type: 'DIRECT' | 'GROUP';
      directKey: string | null;
      name: string | null;
      description: string | null;
      createdById: string;
      seqCounter: number;
      archivedAt: Date | null;
      createdAt: Date;
      updatedAt: Date;
      messages: {
        id: string;
        body: string;
        seq: number;
        createdAt: Date;
        sender: { fullName: string };
      }[];
      _count: { members: number };
      members: { lastReadSeq: number }[];
    },
    unreadCount: number,
    peerName?: string,
  ) {
    const [lastMessage] = conversation.messages;
    return {
      ...conversation,
      lastMessage: lastMessage ? { ...lastMessage, senderName: lastMessage.sender.fullName } : null,
      unreadCount,
      memberCount: conversation._count.members,
      peerName,
    };
  }

  public async listConversations(
    actor: ChatActor,
    query: { search?: string; page?: number; limit?: number } = {},
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ConversationWhereInput = {
      companyId: actor.companyId,
      archivedAt: null,
      members: { some: { userId: actor.userId, leftAt: null } },
    };
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        {
          type: 'DIRECT',
          members: {
            some: {
              leftAt: null,
              user: { fullName: { contains: query.search, mode: 'insensitive' } },
            },
          },
        },
      ];
    }

    const [totalData, conversations] = await Promise.all([
      prisma.conversation.count({ where }),
      prisma.conversation.findMany({
        where,
        include: {
          messages: {
            orderBy: { seq: 'desc' },
            take: 1,
            select: {
              id: true,
              body: true,
              seq: true,
              createdAt: true,
              sender: { select: { fullName: true } },
            },
          },
          members: {
            where: { userId: actor.userId, leftAt: null },
            select: { lastReadSeq: true },
          },
          _count: { select: { members: { where: { leftAt: null } } } },
        },
        orderBy: { updatedAt: 'desc' },
        take: limit,
        skip,
      }),
    ]);

    const data = await Promise.all(
      conversations.map(async (conversation) => {
        const lastReadSeq = conversation.members[0]?.lastReadSeq ?? 0;
        // ponytail: N+1 count per percakapan, ganti agregasi tunggal jika list berat.
        const unreadCount = await prisma.message.count({
          where: { conversationId: conversation.id, seq: { gt: lastReadSeq } },
        });
        let peerName: string | undefined;
        if (conversation.type === 'DIRECT') {
          const peer = await prisma.conversationMember.findFirst({
            where: { conversationId: conversation.id, leftAt: null, userId: { not: actor.userId } },
            select: { user: { select: { fullName: true } } },
          });
          peerName = peer?.user.fullName;
        }
        return this.toPreview(conversation, unreadCount, peerName);
      }),
    );

    return {
      data,
      meta: { currentPage: page, limit, totalData, totalPage: Math.ceil(totalData / limit) },
    };
  }

  public async openDirect(actor: ChatActor, peerUserId: string) {
    if (peerUserId === actor.userId) {
      throw new Error('Tidak dapat membuka percakapan dengan diri sendiri');
    }
    const peer = await this.activeCompanyMember(actor.companyId, peerUserId);
    const directKey = this.buildDirectKey(actor.companyId, actor.userId, peerUserId);

    try {
      return await prisma.$transaction(async (tx) => {
        const conversation = await tx.conversation.create({
          data: {
            companyId: actor.companyId,
            type: 'DIRECT',
            directKey,
            createdById: actor.userId,
            members: {
              create: [
                { userId: actor.userId, companyMemberId: actor.companyMemberId, role: 'MEMBER' },
                { userId: peerUserId, companyMemberId: peer.id, role: 'MEMBER' },
              ],
            },
          },
          include: { members: { include: { user: { select: { fullName: true } } } } },
        });
        return conversation;
      });
    } catch (error) {
      if (!this.isDuplicateKeyError(error)) throw error;
      const existing = await prisma.conversation.findUnique({
        where: { directKey },
        include: { members: { include: { user: { select: { fullName: true } } } } },
      });
      if (!existing) throw error;
      const mine = existing.members.find((m) => m.userId === actor.userId);
      if (mine?.leftAt) {
        await prisma.conversationMember.update({
          where: { id: mine.id },
          data: { leftAt: null, joinedAt: new Date() },
        });
      }
      return existing;
    }
  }

  public async createGroup(
    actor: ChatActor,
    input: { name: string; description?: string; memberUserIds: string[] },
  ) {
    const name = input.name.trim();
    if (!name) throw new Error('Nama grup wajib diisi');
    const memberUserIds = [
      ...new Set(input.memberUserIds.filter((id) => id !== actor.userId)),
    ].slice(0, GROUP_MEMBER_CAP);
    const memberByUser = new Map<string, string>();
    if (memberUserIds.length > 0) {
      const found = await prisma.companyMember.findMany({
        where: { companyId: actor.companyId, userId: { in: memberUserIds }, status: 'active' },
        select: { id: true, userId: true },
      });
      if (found.length !== memberUserIds.length) {
        throw new ChatForbiddenError('Sebagian pengguna bukan anggota aktif company ini');
      }
      for (const m of found) memberByUser.set(m.userId, m.id);
    }
    return prisma.conversation.create({
      data: {
        companyId: actor.companyId,
        type: 'GROUP',
        name,
        description: input.description?.trim() || null,
        createdById: actor.userId,
        members: {
          create: [
            { userId: actor.userId, companyMemberId: actor.companyMemberId, role: 'OWNER' },
            ...memberUserIds.map((userId) => ({
              userId,
              companyMemberId: memberByUser.get(userId) as string,
              role: 'MEMBER' as const,
            })),
          ],
        },
      },
      include: { members: { include: { user: { select: { fullName: true } } } } },
    });
  }

  public async listMessages(
    conversationId: string,
    actor: ChatActor,
    query: { cursor?: number; limit?: number } = {},
  ) {
    await this.activeMember(conversationId, actor);
    const limit = Math.min(query.limit ?? 30, 100);
    const messages = await prisma.message.findMany({
      where: { conversationId, seq: { gt: query.cursor ?? 0 } },
      include: { sender: { select: { fullName: true } } },
      orderBy: { seq: 'asc' },
      take: limit,
    });
    const data = messages.map((m) => ({ ...m, senderName: m.sender.fullName }));
    return {
      data,
      nextCursor: messages.length === limit ? messages[messages.length - 1].seq : null,
    };
  }

  public async searchUsers(actor: ChatActor, query: { search?: string; limit?: number } = {}) {
    const members = await prisma.companyMember.findMany({
      where: {
        companyId: actor.companyId,
        status: 'active',
        userId: { not: actor.userId },
        ...(query.search
          ? {
              user: {
                OR: [
                  { fullName: { contains: query.search, mode: 'insensitive' } },
                  { email: { contains: query.search, mode: 'insensitive' } },
                ],
              },
            }
          : {}),
      },
      select: { user: { select: { id: true, fullName: true, email: true } } },
      orderBy: { user: { fullName: 'asc' } },
      take: Math.min(query.limit ?? 10, 20),
    });
    return members.map((m) => m.user);
  }

  public async listMembers(conversationId: string, actor: ChatActor) {
    await this.activeMember(conversationId, actor);
    const members = await prisma.conversationMember.findMany({
      where: { conversationId, leftAt: null },
      include: { user: { select: { fullName: true } } },
      orderBy: { joinedAt: 'asc' },
    });
    return members;
  }

  public async updateGroup(
    conversationId: string,
    actor: ChatActor,
    input: { name?: string; description?: string },
  ) {
    const me = await this.activeMember(conversationId, actor);
    if (me.role !== 'OWNER' && me.role !== 'ADMIN') {
      throw new ChatForbiddenError('Hanya OWNER/ADMIN yang boleh mengubah grup');
    }
    const data: { name?: string; description?: string | null } = {};
    if (input.name !== undefined) {
      const name = input.name.trim();
      if (!name) throw new Error('Nama grup wajib diisi');
      data.name = name;
    }
    if (input.description !== undefined) data.description = input.description.trim() || null;
    return prisma.conversation.update({ where: { id: conversationId }, data });
  }

  public async addMember(conversationId: string, actor: ChatActor, targetUserId: string) {
    const me = await this.activeMember(conversationId, actor);
    if (me.role !== 'OWNER' && me.role !== 'ADMIN') {
      throw new ChatForbiddenError('Hanya OWNER/ADMIN yang boleh menambah anggota');
    }
    const target = await this.activeCompanyMember(actor.companyId, targetUserId);
    const existing = await prisma.conversationMember.findUnique({
      where: { conversationId_userId: { conversationId, userId: targetUserId } },
    });
    if (existing && !existing.leftAt) throw new Error('Pengguna sudah menjadi anggota');
    if (existing) {
      return prisma.conversationMember.update({
        where: { id: existing.id },
        data: { leftAt: null, joinedAt: new Date(), role: 'MEMBER' },
      });
    }
    return prisma.conversationMember.create({
      data: {
        conversationId,
        userId: targetUserId,
        companyMemberId: target.id,
        role: 'MEMBER',
      },
    });
  }

  public async setMemberRole(
    conversationId: string,
    actor: ChatActor,
    targetUserId: string,
    role: 'ADMIN' | 'MEMBER',
  ) {
    const me = await this.activeMember(conversationId, actor);
    if (me.role !== 'OWNER') {
      throw new ChatForbiddenError('Hanya OWNER yang boleh mengubah role anggota');
    }
    if (targetUserId === actor.userId) {
      throw new Error('Gunakan transfer untuk memindahkan kepemilikan sendiri');
    }
    const target = await prisma.conversationMember.findUnique({
      where: { conversationId_userId: { conversationId, userId: targetUserId } },
    });
    if (!target || target.leftAt) throw new ChatForbiddenError('Target bukan anggota aktif');
    return prisma.conversationMember.update({ where: { id: target.id }, data: { role } });
  }

  public async removeMember(conversationId: string, actor: ChatActor, targetUserId: string) {
    const me = await this.activeMember(conversationId, actor);
    if (targetUserId === actor.userId) {
      throw new Error('Gunakan keluar grup untuk diri sendiri');
    }
    const target = await prisma.conversationMember.findUnique({
      where: { conversationId_userId: { conversationId, userId: targetUserId } },
    });
    if (!target || target.leftAt) throw new ChatForbiddenError('Target bukan anggota aktif');
    if (me.role === 'ADMIN' && target.role !== 'MEMBER') {
      throw new ChatForbiddenError('Admin tidak dapat mengeluarkan OWNER/ADMIN');
    }
    if (me.role !== 'OWNER' && me.role !== 'ADMIN') {
      throw new ChatForbiddenError('Hanya OWNER/ADMIN yang boleh mengeluarkan anggota');
    }
    return prisma.conversationMember.update({
      where: { id: target.id },
      data: { leftAt: new Date() },
    });
  }

  public async leave(conversationId: string, actor: ChatActor) {
    const me = await this.activeMember(conversationId, actor);
    if (me.role === 'OWNER') {
      const others = await prisma.conversationMember.count({
        where: { conversationId, leftAt: null, userId: { not: actor.userId } },
      });
      if (others > 0) {
        throw new Error('Pindahkan kepemilikan sebelum keluar dari grup');
      }
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { archivedAt: new Date() },
      });
    }
    await prisma.conversationMember.update({
      where: { id: me.id },
      data: { leftAt: new Date() },
    });
    return { archived: me.role === 'OWNER' };
  }

  public async transfer(conversationId: string, actor: ChatActor, newOwnerId: string) {
    const me = await this.activeMember(conversationId, actor);
    if (me.role !== 'OWNER') {
      throw new ChatForbiddenError('Hanya OWNER yang boleh memindahkan kepemilikan');
    }
    if (newOwnerId === actor.userId) throw new Error('Pemilik baru harus anggota lain');
    const target = await prisma.conversationMember.findUnique({
      where: { conversationId_userId: { conversationId, userId: newOwnerId } },
    });
    if (!target || target.leftAt) throw new ChatForbiddenError('Target bukan anggota aktif');
    return prisma.$transaction(async (tx) => {
      await tx.conversationMember.update({ where: { id: target.id }, data: { role: 'OWNER' } });
      await tx.conversationMember.update({ where: { id: me.id }, data: { role: 'ADMIN' } });
      return tx.conversationMember.findMany({
        where: { conversationId, leftAt: null },
        include: { user: { select: { fullName: true } } },
      });
    });
  }
}

export default new ChatService();
