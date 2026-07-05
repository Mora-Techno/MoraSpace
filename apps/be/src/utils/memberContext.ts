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
  if (userId === ownerId) return 'leader';

  const normalized = roleNames.map((name) => name.toLowerCase());
  if (normalized.includes('admin')) return 'admin';
  if (normalized.includes('owner')) return 'leader';
  return 'employee';
}

export function toSafeAuthUser(
  user: {
    id: string;
    email: string;
    phone?: string | null;
    fullName: string;
    emailVerifiedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
  },
  member?: {
    id: string;
    companyId: string;
    roles: { role: { name: string } }[];
    company: { ownerId: string };
  } | null,
): SafeAuthUser {
  const companyRole = member
    ? resolveCompanyRole(
        user.id,
        member.company.ownerId,
        member.roles.map((item) => item.role.name),
      )
    : 'employee';

  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    fullName: user.fullName,
    companyRole,
    companyId: member?.companyId ?? null,
    companyMemberId: member?.id ?? null,
    isVerify: Boolean(user.emailVerifiedAt),
    createdAt: user.createdAt ?? new Date(),
    updatedAt: user.updatedAt ?? new Date(),
  };
}

export async function resolveAuthUser(
  userId: string,
  companyId?: string | null,
): Promise<SafeAuthUser | null> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

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

  return toSafeAuthUser(user, member);
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
