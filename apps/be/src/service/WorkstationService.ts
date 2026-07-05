import bcryptjs from 'bcryptjs';
import prisma from 'prisma/client';
import { getWorkstationUserLimit } from '@/utils/tierLimits';
import { getCompanyTier } from '@/utils/planHelper';
import { toSafeAuthUser } from '@/utils/memberContext';
import type {
  PickCreateWorkstation,
  PickInviteMember,
  PickUpdateWorkstation,
} from '@repo/types/workstation.types';

class WorkstationService {
  private async getDefaultDepartment(companyId: string) {
    const existing = await prisma.department.findFirst({
      where: { companyId, name: 'General' },
    });

    if (existing) return existing;

    return prisma.department.create({
      data: {
        companyId,
        name: 'General',
        description: 'Default department',
      },
    });
  }

  private async getCompanyWithLimit(companyId: string) {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new Error('Company tidak ditemukan');
    }

    const tier = await getCompanyTier(companyId);

    return {
      company,
      tier,
      maxMembers: getWorkstationUserLimit(tier),
    };
  }

  public async list(companyId: string) {
    const { maxMembers } = await this.getCompanyWithLimit(companyId);

    const teams = await prisma.team.findMany({
      where: { department: { companyId } },
      include: {
        department: true,
        _count: { select: { members: true } },
      },
      orderBy: { name: 'asc' },
    });

    return teams.map((team) => ({
      id: team.id,
      name: team.name,
      companyId,
      createdById: team.leaderId,
      memberCount: team._count.members,
      maxMembers,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  }

  public async getById(id: string, companyId: string) {
    const { maxMembers } = await this.getCompanyWithLimit(companyId);

    const team = await prisma.team.findFirst({
      where: { id, department: { companyId } },
      include: {
        members: {
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
        },
        department: true,
      },
    });

    if (!team) return null;

    return {
      id: team.id,
      name: team.name,
      companyId,
      createdById: team.leaderId,
      memberCount: team.members.length,
      maxMembers,
      members: team.members.map((member) => ({
        id: member.id,
        workstationId: team.id,
        userId: member.companyMember.user.id,
        role: member.isLeader ? 'admin' : 'member',
        joinedAt: member.companyMember.joinedAt ?? new Date(),
        user: toSafeAuthUser(member.companyMember.user, member.companyMember),
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  public async create(companyId: string, createdById: string, input: PickCreateWorkstation) {
    await this.getCompanyWithLimit(companyId);
    const department = await this.getDefaultDepartment(companyId);

    const team = await prisma.team.create({
      data: {
        departmentId: department.id,
        name: input.name,
        leaderId: createdById,
      },
    });

    const { maxMembers } = await this.getCompanyWithLimit(companyId);

    return {
      id: team.id,
      name: team.name,
      companyId,
      createdById,
      memberCount: 0,
      maxMembers,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  public async update(id: string, companyId: string, input: PickUpdateWorkstation) {
    const existing = await prisma.team.findFirst({
      where: { id, department: { companyId } },
    });

    if (!existing) return null;

    const team = await prisma.team.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
      },
      include: { _count: { select: { members: true } } },
    });

    const { maxMembers } = await this.getCompanyWithLimit(companyId);

    return {
      id: team.id,
      name: team.name,
      companyId,
      createdById: team.leaderId,
      memberCount: team._count.members,
      maxMembers,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  public async remove(id: string, companyId: string) {
    const existing = await prisma.team.findFirst({
      where: { id, department: { companyId } },
    });

    if (!existing) return null;

    await prisma.team.delete({ where: { id } });
    return existing;
  }

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

  public async inviteMember(teamId: string, companyId: string, input: PickInviteMember) {
    const team = await prisma.team.findFirst({
      where: { id: teamId, department: { companyId } },
      include: {
        _count: { select: { members: true } },
        department: true,
      },
    });

    if (!team) {
      throw new Error('Workstation tidak ditemukan');
    }

    const tier = await getCompanyTier(companyId);
    const maxMembers = getWorkstationUserLimit(tier);

    if (team._count.members >= maxMembers) {
      throw new Error(
        `Batas anggota workstation tercapai (maks. ${maxMembers} untuk tier ${tier})`,
      );
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
            companyMemberId: (
              await this.ensureCompanyMember(companyId, existingUser.id)
            ).id,
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
            isLeader: input.role === 'admin',
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
        workstationId: teamId,
        userId: member.companyMember.user.id,
        role: member.isLeader ? 'admin' : 'member',
        joinedAt: member.companyMember.joinedAt ?? new Date(),
        user: toSafeAuthUser(member.companyMember.user, member.companyMember),
      };
    }

    const hashedPassword = await bcryptjs.hash(input.password, 10);

    const member = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: input.email,
          fullName: input.fullName,
          passwordHash: hashedPassword,
          status: 'active',
        },
      });

      const companyMember = await tx.companyMember.create({
        data: {
          companyId,
          userId: user.id,
          status: 'active',
          joinedAt: new Date(),
        },
      });

      return tx.teamMember.create({
        data: {
          teamId,
          companyMemberId: companyMember.id,
          isLeader: input.role === 'admin',
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
      workstationId: teamId,
      userId: member.companyMember.user.id,
      role: member.isLeader ? 'admin' : 'member',
      joinedAt: member.companyMember.joinedAt ?? new Date(),
      user: toSafeAuthUser(member.companyMember.user, member.companyMember),
    };
  }

  public async removeMember(teamId: string, companyId: string, userId: string) {
    const team = await prisma.team.findFirst({
      where: { id: teamId, department: { companyId } },
    });

    if (!team) return null;

    const companyMember = await prisma.companyMember.findUnique({
      where: { companyId_userId: { companyId, userId } },
    });

    if (!companyMember) return null;

    const member = await prisma.teamMember.findUnique({
      where: {
        teamId_companyMemberId: {
          teamId,
          companyMemberId: companyMember.id,
        },
      },
    });

    if (!member) return null;

    await prisma.teamMember.delete({ where: { id: member.id } });
    return member;
  }
}

export default new WorkstationService();
