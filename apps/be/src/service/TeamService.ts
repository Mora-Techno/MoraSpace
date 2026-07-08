import prisma from 'prisma/client';
import type { PickCreateTeam, PickUpdateTeam, PickAddTeamMember } from '@repo/types/team.types';

class TeamService {
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
        ...(input.description !== undefined && { description: input.description }),
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
                select: { id: true, fullName: true, email: true, avatarUrl: true },
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
}

export default new TeamService();
