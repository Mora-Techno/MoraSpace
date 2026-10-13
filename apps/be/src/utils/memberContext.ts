import type { CompanyRole } from '@repo/types/company.types';
import type { SafeAuthUser } from '@repo/types/auth.types';
import prisma from 'prisma/client';

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function uniqueCompanySlug(base: string): Promise<string> {
  let slug = slugify(base) || 'company';
  let counter = 0;

  while (await prisma.company.findUnique({ where: { slug } })) {
    counter += 1;
    slug = `${slugify(base) || 'company'}-${counter}`;
  }

  return slug;
}

export function resolveCompanyRole(
  userId: string,
  ownerId: string,
  roleNames: string[],
): CompanyRole {
  if (userId === ownerId) return 'Owner';

  const normalized = roleNames.map((name) => name.toLowerCase());
  if (normalized.includes('owner')) return 'Owner';
  // v0.0.1: hanya Owner & Member — role lain (Admin/Chief legacy) = Member.
  return 'Member';
}

export function toSafeAuthUser(
  user: {
    id: string;
    email: string;
    phone?: string | null;
    fullName: string;
    platformRole?: string;
    emailVerifiedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
  },
  member?: {
    id: string;
    companyId: string;
    roles?: { role: { name: string } }[];
    company: { ownerId: string };
  } | null,
  workspaceType?: 'personal' | 'company',
): SafeAuthUser {
  const resolvedType = workspaceType ?? (member ? 'company' : 'personal');
  const companyRole =
    member && resolvedType === 'company'
      ? resolveCompanyRole(
          user.id,
          member.company.ownerId,
          member.roles!.map((item) => item.role.name),
        )
      : 'Individual';

  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    fullName: user.fullName,
    platformRole: user.platformRole as SafeAuthUser['platformRole'],
    companyRole,
    companyId: resolvedType === 'company' ? (member?.companyId ?? null) : null,
    companyMemberId: resolvedType === 'company' ? (member?.id ?? null) : null,
    workspaceType: resolvedType,
    isVerify: Boolean(user.emailVerifiedAt),
    createdAt: user.createdAt ?? new Date(),
    updatedAt: user.updatedAt ?? new Date(),
  };
}

export async function resolveAuthUser(
  userId: string,
  companyId?: string | null,
  forcePersonal = false,
): Promise<SafeAuthUser | null> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  if (forcePersonal || companyId === 'personal') {
    return toSafeAuthUser(user, null, 'personal');
  }

  const member = companyId
    ? await prisma.companyMember.findUnique({
        where: { companyId_userId: { companyId, userId } },
        include: {
          roles: { include: { role: true } },
          company: { select: { ownerId: true } },
        },
      })
    : await prisma.companyMember.findFirst({
        where: { userId, status: 'active' },
        include: {
          roles: { include: { role: true } },
          company: { select: { ownerId: true } },
        },
        orderBy: { joinedAt: 'asc' },
      });

  return toSafeAuthUser(user, member, member ? 'company' : 'personal');
}

export async function listUserWorkspaces(userId: string) {
  const members = await prisma.companyMember.findMany({
    where: { userId, status: 'active' },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          logo: true,
          slug: true,
          ownerId: true,
        },
      },
      roles: {
        include: {
          role: { select: { name: true } },
        },
      },
    },
    orderBy: { joinedAt: 'asc' },
  });

  const companies = members.map((m) => ({
    id: m.company.id,
    name: m.company.name,
    type: 'company' as const,
    role: resolveCompanyRole(
      userId,
      m.company.ownerId,
      m.roles.map((r) => r.role.name),
    ),
    slug: m.company.slug,
    logo: m.company.logo,
    companyMemberId: m.id,
  }));

  const personal = {
    id: 'personal',
    name: 'Personal Workspace',
    type: 'personal' as const,
    role: 'Individual',
    companyMemberId: null,
  };

  return {
    personal,
    companies,
  };
}

export async function requireCompanyMember(
  userId: string,
  companyId: string,
): Promise<NonNullable<Awaited<ReturnType<typeof prisma.companyMember.findUnique>>>> {
  const member = await prisma.companyMember.findUnique({
    where: { companyId_userId: { companyId, userId } },
    include: {
      roles: { include: { role: true } },
      company: { select: { ownerId: true } },
    },
  });

  if (!member) {
    throw new Error('Anggota company tidak ditemukan');
  }

  return member;
}
