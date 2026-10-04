import prisma from 'prisma/client';
import CompanyService from './CompanyService';
import { inferBillingCycle, mapPlanNameToTier } from '@/utils/planHelper';
import type { PickUpdateCompanySubscription, SubscriptionTier } from '@repo/types/company.types';

export interface CreateCompanyAdminInput {
  name: string;
  ownerEmail: string;
  ownerFullName: string;
  ownerPassword?: string;
  tier?: SubscriptionTier;
}

/**
 * v0.0.1 Layer 1 — Super Admin ops (manual onboarding beta, kill switch).
 * Guarded by requirePlatformRole(["SUPER_ADMIN"]) at route level.
 */
class AdminCompanyService {
  public async list(query: { search?: string; page?: number; limit?: number } = {}) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { slug: { contains: query.search, mode: 'insensitive' } },
        { owner: { email: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    const [totalData, companies] = await prisma.$transaction([
      prisma.company.count({ where: where as any }),
      prisma.company.findMany({
        where: where as any,
        include: {
          owner: { select: { id: true, email: true, fullName: true } },
          _count: { select: { members: true } },
          currentSubscription: { include: { plan: true } },
          // ponytail: max() di JS, bukan raw SQL — skala beta, ganti aggregate bila berat.
          members: { select: { user: { select: { lastLoginAt: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
    ]);

    const data = companies.map((company) => {
      const logins = company.members.map((m) => m.user.lastLoginAt?.getTime() ?? 0).filter(Boolean);
      return {
        id: company.id,
        name: company.name,
        slug: company.slug,
        status: company.status,
        suspendedAt: company.suspendedAt,
        owner: company.owner,
        memberCount: company._count.members,
        lastLoginAt: logins.length > 0 ? new Date(Math.max(...logins)) : null,
        tier: company.currentSubscription?.plan
          ? mapPlanNameToTier(company.currentSubscription.plan.name)
          : ('free' as const),
        billingCycle: inferBillingCycle(
          company.currentSubscription
            ? {
                currentPeriodStart: company.currentSubscription.currentPeriodStart,
                currentPeriodEnd: company.currentSubscription.currentPeriodEnd,
              }
            : null,
        ),
        createdAt: company.createdAt,
      };
    });

    return {
      data,
      meta: {
        currentPage: page,
        limit,
        totalData,
        totalPage: Math.ceil(totalData / limit),
      },
    };
  }

  // Reuse registerLeader — satu-satunya jalur pembuatan company + default (role/status/plan).
  public create(input: CreateCompanyAdminInput) {
    return CompanyService.registerLeader({
      email: input.ownerEmail,
      fullName: input.ownerFullName,
      password: input.ownerPassword ?? crypto.randomUUID(),
      companyName: input.name,
      tier: input.tier ?? 'free',
    });
  }

  public suspend(id: string) {
    return prisma.company.update({
      where: { id },
      data: { status: 'suspended', suspendedAt: new Date() },
    });
  }

  public activate(id: string) {
    return prisma.company.update({
      where: { id },
      data: { status: 'active', suspendedAt: null },
    });
  }

  // Reuse updateSubscription — assign plan manual tanpa self-serve checkout.
  public setPlan(id: string, input: PickUpdateCompanySubscription) {
    return CompanyService.updateSubscription(id, input);
  }
}

export default new AdminCompanyService();
