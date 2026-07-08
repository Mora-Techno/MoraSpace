import { randomUUID } from 'node:crypto';
import prisma from 'prisma/client';
import type { PickCreateInvitation } from '@repo/types/invitation.types';

class InvitationService {
  public async list(companyId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [totalData, data] = await prisma.$transaction([
      prisma.invitation.count({
        where: { companyId },
      }),
      prisma.invitation.findMany({
        where: { companyId },
        include: {
          inviter: {
            select: { id: true, fullName: true, email: true },
          },
          position: true,
          role: true,
        },
        orderBy: { expiredAt: 'desc' },
        take: limit,
        skip: skip,
      }),
    ]);

    const totalPage = Math.ceil(totalData / limit);

    return {
      data,
      meta: {
        currentPage: page,
        limit,
        totalData,
        totalPage,
      },
    };
  }

  public async create(companyId: string, inviterId: string, input: PickCreateInvitation) {
    const token = randomUUID();
    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + 7); // 7 days expiry

    const invitation = await prisma.invitation.create({
      data: {
        companyId,
        email: input.email,
        invitedBy: inviterId,
        positionId: input.positionId ?? null,
        roleId: input.roleId ?? null,
        token,
        expiredAt,
      },
      include: {
        inviter: { select: { fullName: true, email: true } },
        position: true,
        role: true,
      },
    });
    return invitation;
  }

  public async accept(token: string, userId: string) {
    const invitation = await prisma.invitation.findFirst({
      where: {
        token,
        expiredAt: { gt: new Date() },
        acceptedAt: null,
      },
    });
    if (!invitation) {
      throw new Error('Undangan tidak valid atau sudah kedaluwarsa');
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User tidak ditemukan');
    }

    const existingMember = await prisma.companyMember.findFirst({
      where: { companyId: invitation.companyId, userId },
    });

    if (existingMember) {
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { acceptedAt: new Date() },
      });
      return existingMember;
    }

    const member = await prisma.$transaction(async (tx) => {
      const newMember = await tx.companyMember.create({
        data: {
          companyId: invitation.companyId,
          userId,
          positionId: invitation.positionId,
          status: 'active',
          joinedAt: new Date(),
        },
      });

      if (invitation.roleId) {
        await tx.memberRole.create({
          data: {
            companyMemberId: newMember.id,
            roleId: invitation.roleId,
          },
        });
      }

      await tx.invitation.update({
        where: { id: invitation.id },
        data: { acceptedAt: new Date() },
      });

      return newMember;
    });

    return member;
  }

  public async reject(token: string) {
    const invitation = await prisma.invitation.findFirst({
      where: { token, acceptedAt: null },
    });
    if (!invitation) return null;

    await prisma.invitation.delete({ where: { id: invitation.id } });
    return invitation;
  }

  public async remove(id: string, companyId: string) {
    const invitation = await prisma.invitation.findFirst({
      where: { id, companyId },
    });
    if (!invitation) return null;

    await prisma.invitation.delete({ where: { id } });
    return invitation;
  }
}

export default new InvitationService();
