import bcryptjs from "bcryptjs";
import prisma from "prisma/client";
import { getWorkstationUserLimit } from "@/utils/tierLimits";
import { getPeriodEnd } from "@/config/subscriptionPlans";
import type {
  PickCreateAdmin,
  PickRegisterCompany,
  PickUpdateCompanySubscription,
} from "@repo/types/company.types";
import { sanitizeUser } from "@/utils/authTokens";
import {
  resolveAuthUser,
  toSafeAuthUser,
  uniqueCompanySlug,
} from "@/utils/memberContext";
import {
  ensurePlan,
  getCompanyTier,
  inferBillingCycle,
} from "@/utils/planHelper";
import { ensureDefaultRoles } from "@/utils/roleHelper";

class CompanyService {
  public async registerLeader(input: PickRegisterCompany) {
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      throw new Error("Email sudah terdaftar");
    }

    const hashedPassword = await bcryptjs.hash(input.password, 10);
    const tier = input.tier ?? "free";
    const now = new Date();
    const slug = await uniqueCompanySlug(input.companyName);

    const result = await prisma.$transaction(async (tx) => {
      const leader = await tx.user.create({
        data: {
          email: input.email,
          fullName: input.fullName,
          passwordHash: hashedPassword,
          status: "active",
          emailVerifiedAt: now,
        },
      });

      const company = await tx.company.create({
        data: {
          name: input.companyName,
          slug,
          ownerId: leader.id,
        },
      });

      const roles = await ensureDefaultRoles(company.id, tx);
      const ownerRole = roles.find((role) => role.name === "Owner");

      const member = await tx.companyMember.create({
        data: {
          companyId: company.id,
          userId: leader.id,
          status: "active",
          joinedAt: now,
        },
      });

      if (ownerRole) {
        await tx.memberRole.create({
          data: {
            companyMemberId: member.id,
            roleId: ownerRole.id,
          },
        });
      }

      await tx.companySetting.create({
        data: {
          companyId: company.id,
          workingHourStart: new Date("1970-01-01T09:00:00.000Z"),
          workingHourEnd: new Date("1970-01-01T18:00:00.000Z"),
          workDays: "mon,tue,wed,thu,fri",
          allowRemote: true,
          allowMusic: true,
          language: "id",
          timezone: "Asia/Jakarta",
        },
      });

      await tx.companyPolicy.create({
        data: { companyId: company.id },
      });

      await tx.department.create({
        data: {
          companyId: company.id,
          name: "General",
          description: "Default department",
        },
      });

      const plan = await ensurePlan(tier, tx);
      const periodEnd = getPeriodEnd("monthly", now);
      const subscription = await tx.subscription.create({
        data: {
          companyId: company.id,
          planId: plan.id,
          status: "active",
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
        },
      });

      await tx.company.update({
        where: { id: company.id },
        data: { subscriptionId: subscription.id },
      });

      return { company, leader, member };
    });

    const leader = await resolveAuthUser(result.leader.id, result.company.id);
    if (!leader) {
      throw new Error("Leader tidak ditemukan");
    }

    return {
      company: {
        id: result.company.id,
        name: result.company.name,
        tier,
        billingCycle: "monthly" as const,
        subscriptionStartsAt: now,
        subscriptionEndsAt: getPeriodEnd("monthly", now),
        leaderId: result.company.ownerId,
        stripeCustomerId: null,
        xenditCustomerId: null,
        createdAt: result.company.createdAt,
        updatedAt: result.company.updatedAt,
        maxWorkstationUsers: getWorkstationUserLimit(tier),
      },
      leader: sanitizeUser(leader),
    };
  }

  public async createAdmin(companyId: string, input: PickCreateAdmin) {
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      throw new Error("Email sudah terdaftar");
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new Error("Company tidak ditemukan");
    }

    const hashedPassword = await bcryptjs.hash(input.password, 10);
    const adminRole = await prisma.role.findFirst({
      where: { companyId, name: { equals: "Admin", mode: "insensitive" } },
    });

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: input.email,
          fullName: input.fullName,
          passwordHash: hashedPassword,
          status: "active",
        },
      });

      const member = await tx.companyMember.create({
        data: {
          companyId,
          userId: user.id,
          status: "active",
          joinedAt: new Date(),
        },
      });

      if (adminRole) {
        await tx.memberRole.create({
          data: {
            companyMemberId: member.id,
            roleId: adminRole.id,
          },
        });
      }

      return { user, member };
    });

    const authUser = toSafeAuthUser(result.user, {
      id: result.member.id,
      companyId,
      roles: adminRole ? [{ role: { name: adminRole.name } }] : [],
      company: { ownerId: company.ownerId },
    });

    return sanitizeUser(authUser);
  }

  public async listAdmins(companyId: string) {
    const members = await prisma.companyMember.findMany({
      where: {
        companyId,
        roles: {
          some: {
            role: { name: { equals: "Admin", mode: "insensitive" } },
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        roles: { include: { role: true } },
        company: { select: { ownerId: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return members.map((member) => {
      const authUser = toSafeAuthUser(
        {
          ...member.user,
          phone: null,
          emailVerifiedAt: null,
        },
        member,
      );

      return {
        id: authUser.id,
        email: authUser.email,
        fullName: authUser.fullName,
        companyRole: authUser.companyRole,
        companyId: authUser.companyId,
        createdAt:
          authUser.createdAt?.toISOString() ?? new Date().toISOString(),
        updatedAt:
          authUser.updatedAt?.toISOString() ?? new Date().toISOString(),
      };
    });
  }

  public async getById(companyId: string) {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        currentSubscription: true,
        _count: { select: { members: true } },
      },
    });

    if (!company) return null;

    const teamCount = await prisma.team.count({
      where: { department: { companyId } },
    });

    const tier = await getCompanyTier(companyId);
    const billingCycle = inferBillingCycle(company.currentSubscription);

    return {
      id: company.id,
      name: company.name,
      tier,
      billingCycle,
      subscriptionStartsAt:
        company.currentSubscription?.currentPeriodStart ?? company.createdAt,
      subscriptionEndsAt: company.currentSubscription?.currentPeriodEnd ?? null,
      leaderId: company.ownerId,
      leader: {
        id: company.owner.id,
        email: company.owner.email,
        fullName: company.owner.fullName,
        companyRole: "leader" as const,
      },
      stripeCustomerId: null,
      xenditCustomerId: null,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
      maxWorkstationUsers: getWorkstationUserLimit(tier),
      _count: {
        workstations: teamCount,
        members: company._count.members,
      },
    };
  }

  public async updateSubscription(
    companyId: string,
    input: PickUpdateCompanySubscription,
  ) {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: { currentSubscription: true },
    });

    if (!company) return null;

    const now = new Date();
    const billingCycle = input.billingCycle ?? "monthly";
    const plan = await ensurePlan(input.tier);
    const periodEnd = getPeriodEnd(billingCycle, now);

    return prisma.$transaction(async (tx) => {
      const subscription = company.currentSubscription
        ? await tx.subscription.update({
            where: { id: company.currentSubscription.id },
            data: {
              planId: plan.id,
              status: "active",
              currentPeriodStart: now,
              currentPeriodEnd: periodEnd,
            },
          })
        : await tx.subscription.create({
            data: {
              companyId,
              planId: plan.id,
              status: "active",
              currentPeriodStart: now,
              currentPeriodEnd: periodEnd,
            },
          });

      return tx.company.update({
        where: { id: companyId },
        data: { subscriptionId: subscription.id },
      });
    });
  }
}

export default new CompanyService();
