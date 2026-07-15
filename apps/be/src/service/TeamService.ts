import prisma from 'prisma/client';
import type { PickCreateTeam, PickUpdateTeam, PickAddTeamMember } from '@repo/types/team.types';
import { toSafeAuthUser } from '@/utils/memberContext';
import bcryptjs from 'bcryptjs';
import { getCompanyTier } from '@/utils/planHelper';
import { getWorkstationUserLimit } from '@/utils/tierLimits';
import type { PickInviteMember } from '@repo/types/workstation.types';

class TeamService {
  private async ensureCompanyMember(companyId: string, userId: string) {
    const existing = await prisma.companyMember.findUnique({
      where: { companyId_userId: { companyId, userId } },
    });

    if (existing) return existing;

    return prisma.companyMember.create({
      data: {
        companyId,
        userId,
        status: 'active',
        joinedAt: new Date(),
      },
    });
  }

  public async list(companyId: string, departmentId?: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const whereClause: any = {
      department: { companyId },
    };
    if (departmentId) {
      whereClause.departmentId = departmentId;
    }
    const [totalData, data] = await prisma.$transaction([
      prisma.team.count({
        where: whereClause,
      }),
      prisma.team.findMany({
        where: whereClause,
        include: {
          leader: {
            select: { id: true, fullName: true, email: true, avatarUrl: true },
          },
          department: {
            select: { id: true, name: true },
          },
          _count: {
            select: { members: true },
          },
        },
        orderBy: { name: 'asc' },
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

  public async create(companyId: string, input: PickCreateTeam) {
    const department = await prisma.department.findFirst({
      where: { id: input.departmentId, companyId },
    });
    if (!department) throw new Error('Departemen tidak ditemukan di perusahaan ini');

    const team = await prisma.team.create({
      data: {
        departmentId: input.departmentId,
        name: input.name,
        description: input.description ?? null,
        leaderId: input.leaderId ?? null,
      },
    });
    return team;
  }

  public async update(id: string, companyId: string, input: PickUpdateTeam) {
    const existing = await prisma.team.findFirst({
      where: { id, department: { companyId } },
    });
    if (!existing) return null;

    const team = await prisma.team.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.description !== undefined && {
          description: input.description,
        }),
        ...(input.leaderId !== undefined && { leaderId: input.leaderId }),
      },
    });
    return team;
  }

  public async remove(id: string, companyId: string) {
    const existing = await prisma.team.findFirst({
      where: { id, department: { companyId } },
    });
    if (!existing) return null;

    await prisma.team.delete({ where: { id } });
    return existing;
  }

  public async listMembers(teamId: string, companyId: string, page = 1, limit = 10) {
    const team = await prisma.team.findFirst({
      where: { id: teamId, department: { companyId } },
    });
    if (!team) return null;

    const skip = (page - 1) * limit;
    const [totalData, data] = await prisma.$transaction([
      prisma.teamMember.count({
        where: { teamId },
      }),
      prisma.teamMember.findMany({
        where: { teamId },
        include: {
          companyMember: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                  avatarUrl: true,
                },
              },
              position: true,
            },
          },
        },
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

  public async addMember(teamId: string, companyId: string, input: PickAddTeamMember) {
    const team = await prisma.team.findFirst({
      where: { id: teamId, department: { companyId } },
    });
    if (!team) throw new Error('Tim tidak ditemukan');

    const member = await prisma.companyMember.findFirst({
      where: { id: input.companyMemberId, companyId },
    });
    if (!member) throw new Error('Anggota tidak ditemukan di perusahaan ini');

    const teamMember = await prisma.teamMember.upsert({
      where: {
        teamId_companyMemberId: {
          teamId,
          companyMemberId: input.companyMemberId,
        },
      },
      update: {
        isLeader: input.isLeader ?? false,
      },
      create: {
        teamId,
        companyMemberId: input.companyMemberId,
        isLeader: input.isLeader ?? false,
      },
    });
    return teamMember;
  }

  public async removeMember(teamId: string, memberId: string, companyId: string) {
    const team = await prisma.team.findFirst({
      where: { id: teamId, department: { companyId } },
    });
    if (!team) return null;

    const existing = await prisma.teamMember.findFirst({
      where: {
        teamId,
        OR: [{ id: memberId }, { companyMemberId: memberId }],
      },
    });
    if (!existing) return null;

    await prisma.teamMember.delete({ where: { id: existing.id } });
    return existing;
  }
  public async inviteMember(teamId: string, companyId: string, input: PickInviteMember) {
    const team = await prisma.team.findFirst({
      where: { id: teamId, department: { companyId } },
      include: {
        _count: { select: { members: true } },
        department: true,
      },
    });

    if (!team) {
      throw new Error('Team tidak ditemukan');
    }

    const tier = await getCompanyTier(companyId);
    const maxMembers = getWorkstationUserLimit(tier);

    if (team._count.members >= maxMembers) {
      throw new Error(`Batas anggota team tercapai (maks. ${maxMembers} untuk tier ${tier})`);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      const otherMembership = await prisma.companyMember.findFirst({
        where: {
          userId: existingUser.id,
          companyId: { not: companyId },
        },
      });

      if (otherMembership) {
        throw new Error('Email sudah terdaftar di company lain');
      }

      const alreadyMember = await prisma.teamMember.findUnique({
        where: {
          teamId_companyMemberId: {
            teamId,
            companyMemberId: (await this.ensureCompanyMember(companyId, existingUser.id)).id,
          },
        },
      });

      if (alreadyMember) {
        throw new Error('Pengguna sudah menjadi anggota workstation ini');
      }

      const member = await prisma.$transaction(async (tx) => {
        const companyMember = await this.ensureCompanyMember(companyId, existingUser.id);

        return tx.teamMember.create({
          data: {
            teamId,
            companyMemberId: companyMember.id,
            isLeader: input.role === 'Admin',
          },
          include: {
            companyMember: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    fullName: true,
                  },
                },
                roles: { include: { role: true } },
                company: { select: { ownerId: true } },
              },
            },
          },
        });
      });

      return {
        id: member.id,
        teamId: teamId,
        userId: member.companyMember.user.id,
        role: member.isLeader ? 'Admin' : 'Member',
        joinedAt: member.companyMember.joinedAt ?? new Date(),
        user: toSafeAuthUser(member.companyMember.user, member.companyMember),
      };
    }
  }
}

export default new TeamService();
