import prisma from 'prisma/client';
import type {
  PickUpdateCompanyMember,
  PickUpdateMemberProfile,
  PickUpdateMemberContacts,
} from '@repo/types/member.types';

class MemberService {
  public async list(companyId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [totalData, data] = await prisma.$transaction([
      prisma.companyMember.count({
        where: { companyId },
      }),
      prisma.companyMember.findMany({
        where: { companyId },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatarUrl: true,
              phone: true,
              status: true,
            },
          },
          position: true,
          employmentType: true,
          profile: true,
          contacts: true,
        },
        orderBy: { createdAt: 'desc' },
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

  public async getById(id: string, companyId: string) {
    const member = await prisma.companyMember.findFirst({
      where: { id, companyId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
            phone: true,
            status: true,
          },
        },
        position: true,
        employmentType: true,
        profile: true,
        contacts: true,
        departmentLinks: {
          include: { department: true },
        },
        teamLinks: {
          include: { team: true },
        },
        roles: {
          include: { role: true },
        },
      },
    });
    return member;
  }

  public async update(id: string, companyId: string, input: PickUpdateCompanyMember) {
    const existing = await prisma.companyMember.findFirst({ where: { id, companyId } });
    if (!existing) return null;

    const member = await prisma.companyMember.update({
      where: { id },
      data: {
        ...(input.employeeCode !== undefined && { employeeCode: input.employeeCode }),
        ...(input.positionId !== undefined && { positionId: input.positionId }),
        ...(input.employmentTypeId !== undefined && { employmentTypeId: input.employmentTypeId }),
        ...(input.status !== undefined && { status: input.status as any }),
        ...(input.joinedAt !== undefined && {
          joinedAt: input.joinedAt ? new Date(input.joinedAt) : null,
        }),
        ...(input.resignedAt !== undefined && {
          resignedAt: input.resignedAt ? new Date(input.resignedAt) : null,
        }),
      },
      include: {
        user: {
          select: { id: true, fullName: true, email: true, avatarUrl: true },
        },
        position: true,
        employmentType: true,
      },
    });
    return member;
  }

  public async remove(id: string, companyId: string) {
    const existing = await prisma.companyMember.findFirst({ where: { id, companyId } });
    if (!existing) return null;

    await prisma.companyMember.delete({ where: { id } });
    return existing;
  }

  public async getProfile(id: string, companyId: string) {
    const member = await prisma.companyMember.findFirst({ where: { id, companyId } });
    if (!member) return null;

    const profile = await prisma.memberProfile.findUnique({
      where: { companyMemberId: id },
    });
    return profile ?? {};
  }

  public async updateProfile(id: string, companyId: string, input: PickUpdateMemberProfile) {
    const member = await prisma.companyMember.findFirst({ where: { id, companyId } });
    if (!member) return null;

    const profile = await prisma.memberProfile.upsert({
      where: { companyMemberId: id },
      create: {
        companyMemberId: id,
        gender: input.gender ?? null,
        birthday: input.birthday ? new Date(input.birthday) : null,
        address: input.address ?? null,
        emergencyContact: input.emergencyContact ?? null,
        bio: input.bio ?? null,
      },
      update: {
        ...(input.gender !== undefined && { gender: input.gender }),
        ...(input.birthday !== undefined && {
          birthday: input.birthday ? new Date(input.birthday) : null,
        }),
        ...(input.address !== undefined && { address: input.address }),
        ...(input.emergencyContact !== undefined && { emergencyContact: input.emergencyContact }),
        ...(input.bio !== undefined && { bio: input.bio }),
      },
    });
    return profile;
  }

  public async getContacts(id: string, companyId: string) {
    const member = await prisma.companyMember.findFirst({ where: { id, companyId } });
    if (!member) return null;

    const contacts = await prisma.memberContact.findMany({
      where: { companyMemberId: id },
    });
    return contacts;
  }

  public async updateContacts(id: string, companyId: string, input: PickUpdateMemberContacts) {
    const member = await prisma.companyMember.findFirst({ where: { id, companyId } });
    if (!member) return null;

    await prisma.$transaction([
      prisma.memberContact.deleteMany({ where: { companyMemberId: id } }),
      prisma.memberContact.createMany({
        data: input.contacts.map((c) => ({
          companyMemberId: id,
          type: c.type,
          value: c.value,
        })),
      }),
    ]);

    return prisma.memberContact.findMany({ where: { companyMemberId: id } });
  }
}

export default new MemberService();
