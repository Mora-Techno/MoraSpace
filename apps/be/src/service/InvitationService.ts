import { randomUUID } from "node:crypto";
import prisma from "prisma/client";
import type { PickCreateInvitation } from "@repo/types/invitation.types";

class InvitationService {
  public async list(
    companyId: string,
    query: {
      search?: string;
      status?: "pending" | "accepted" | "expired";
      positionId?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    } = {},
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { companyId };

    if (query.search) {
      where.email = { contains: query.search, mode: "insensitive" };
    }

    if (query.status === "accepted") {
      where.acceptedAt = { not: null };
    } else if (query.status === "pending") {
      where.acceptedAt = null;
      where.expiredAt = { gt: new Date() };
    } else if (query.status === "expired") {
      where.acceptedAt = null;
      where.expiredAt = { lt: new Date() };
    }

    if (query.positionId) {
      where.positionId = query.positionId;
    }

    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate)
        (where.createdAt as Record<string, unknown>).gte = new Date(
          query.startDate,
        );
      if (query.endDate)
        (where.createdAt as Record<string, unknown>).lte = new Date(
          query.endDate,
        );
    }

    const [totalData, data] = await prisma.$transaction([
      prisma.invitation.count({ where: where as any }),
      prisma.invitation.findMany({
        where: where as any,
        include: {
          inviter: {
            select: { id: true, fullName: true, email: true },
          },
          position: true,
          role: true,
        },
        orderBy: { expiredAt: "desc" },
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

  public async create(
    companyId: string,
    inviterId: string,
    input: PickCreateInvitation,
  ) {
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
      throw new Error("Undangan tidak valid atau sudah kedaluwarsa");
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("User tidak ditemukan");
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
          status: "active",
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
