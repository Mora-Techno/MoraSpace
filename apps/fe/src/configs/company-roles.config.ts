import {
  Crown,
  ShieldCheck,
  User,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import type { CompanyRole } from "@repo/types/company.types";

export type CompanyRoleOption = {
  /** Nilai asli dari shared types (CompanyRole). */
  value: CompanyRole;
  /** Slug untuk route manajemen: /owner/company/[slug]. */
  slug: string;
  label: string;
  description: string;
  icon: LucideIcon;
  /**
   * Apakah role ini sudah bisa dikelola dari area Company owner.
   * Saat ini hanya "Admin" yang didukung end-to-end (list + create).
   */
  manageable: boolean;
};

/**
 * Registry role perusahaan untuk dropdown manajemen di area Owner.
 * Role yang `manageable: false` ditampilkan hanya sebagai referensi
 * (belum ada endpoint/flow khusus di aplikasi).
 */
export const COMPANY_ROLE_REGISTRY: CompanyRoleOption[] = [
  {
    value: "Owner",
    slug: "owner",
    label: "Owner",
    description:
      "Pemilik & penanggung jawab perusahaan. Tidak dapat dikelola dari sini.",
    icon: Crown,
    manageable: false,
  },
  {
    value: "Admin",
    slug: "admin",
    label: "Admin",
    description:
      "Membantu mengelola pengaturan, anggota, dan konten perusahaan.",
    icon: ShieldCheck,
    manageable: true,
  },
  {
    value: "Member",
    slug: "member",
    label: "Member",
    description: "Anggota tim/workstation perusahaan.",
    icon: User,
    manageable: false,
  },
  {
    value: "Developer",
    slug: "developer",
    label: "Developer",
    description: "Akses teknis dan integrasi dengan sistem eksternal.",
    icon: Wrench,
    manageable: false,
  },
];

/** Role yang tersedia di dropdown kelola (endpoint sudah tersedia). */
export const MANAGED_COMPANY_ROLES: CompanyRoleOption[] =
  COMPANY_ROLE_REGISTRY.filter((role) => role.manageable);

export function getCompanyRoleBySlug(
  slug: string,
): CompanyRoleOption | undefined {
  return COMPANY_ROLE_REGISTRY.find((role) => role.slug === slug);
}
