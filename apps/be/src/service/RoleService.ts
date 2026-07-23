import prisma from "prisma/client";
import type { PickCreateRole, PickUpdateRole } from "@repo/types/role.types";

class RoleService {
  public async listRoles(
    companyId: string,
    query: {
      search?: string;
      isSystem?: "true" | "false";
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {},
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { companyId };

    if (query.search) {
      where.name = { contains: query.search, mode: "insensitive" };
    }

    if (query.isSystem !== undefined) {
      where.isSystem = query.isSystem === "true";
    }

    let orderBy: any = [{ isSystem: "desc" }, { name: "asc" }];
    if (query.sortBy) {
      orderBy = { [query.sortBy]: query.sortOrder ?? "asc" };
    }

    const [totalData, data] = await prisma.$transaction([
      prisma.role.count({ where: where as any }),
      prisma.role.findMany({
        where: where as any,
        include: {
          permissions: {
            include: { permission: true },
          },
          _count: {
            select: { members: true },
          },
        },
        orderBy,
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

  public async listMasterPermissions(
    query: {
      search?: string;
      module?: string;
      page?: number;
      limit?: number;
    } = {},
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { module: { contains: query.search, mode: "insensitive" } },
        { action: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query.module) {
      where.module = query.module;
    }

    const [totalData, data] = await prisma.$transaction([
      prisma.permission.count({ where: where as any }),
      prisma.permission.findMany({
        where: where as any,
        orderBy: [{ module: "asc" }, { action: "asc" }],
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

  public async createRole(companyId: string, input: PickCreateRole) {
    const role = await prisma.role.create({
      data: {
        companyId,
        name: input.name,
        description: input.description ?? null,
        isSystem: false,
      },
    });
    return role;
  }

  public async updateRole(
    id: string,
    companyId: string,
    input: PickUpdateRole,
  ) {
    const existing = await prisma.role.findFirst({ where: { id, companyId } });
    if (!existing) return null;

    const role = await prisma.role.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.description !== undefined && {
          description: input.description,
        }),
      },
    });
    return role;
  }

  public async removeRole(id: string, companyId: string) {
    const existing = await prisma.role.findFirst({ where: { id, companyId } });
    if (!existing) return null;

    if (existing.isSystem) {
      throw new Error("Peran sistem bawaan tidak dapat dihapus");
    }

    await prisma.role.delete({ where: { id } });
    return existing;
  }

  public async getRolePermissions(roleId: string, companyId: string) {
    const role = await prisma.role.findFirst({
      where: { id: roleId, companyId },
    });
    if (!role) return null;

    const permissions = await prisma.rolePermission.findMany({
      where: { roleId },
      include: { permission: true },
    });
    return permissions.map((rp) => rp.permission);
  }

  public async updateRolePermissions(
    roleId: string,
    companyId: string,
    permissionIds: string[],
  ) {
    const role = await prisma.role.findFirst({
      where: { id: roleId, companyId },
    });
    if (!role) return null;

    await prisma.$transaction([
      prisma.rolePermission.deleteMany({ where: { roleId } }),
      prisma.rolePermission.createMany({
        data: permissionIds.map((pid) => ({
          roleId,
          permissionId: pid,
        })),
        skipDuplicates: true,
      }),
    ]);

    const updated = await prisma.rolePermission.findMany({
      where: { roleId },
      include: { permission: true },
    });
    return updated.map((rp) => rp.permission);
  }
}

export default new RoleService();
