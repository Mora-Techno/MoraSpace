import type { Prisma } from "@prisma/client";
import type { CompanyRole } from "@repo/types/company.types";
export interface roleType {
  name: CompanyRole;
  description: string;
  isSystem: true;
}

export async function ensureDefaultRoles(
  companyId: string,
  client: Prisma.TransactionClient,
) {
  const roleNames: roleType[] = [
    { name: "Owner", description: "Pemilik perusahaan", isSystem: true },
    { name: "Admin", description: "Administrator perusahaan", isSystem: true },
    { name: "Member", description: "Anggota perusahaan", isSystem: true },
  ];

  const roles = [];
  for (const role of roleNames) {
    const created = await client.role.create({
      data: {
        companyId,
        name: role.name,
        description: role.description,
        isSystem: role.isSystem,
      },
    });
    roles.push(created);
  }

  return roles;
}
