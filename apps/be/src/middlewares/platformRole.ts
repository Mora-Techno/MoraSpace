import type { AppContext } from "@/contex";

export type PlatformRole = "USER" | "DEVELOPER" | "SUPER_ADMIN";

/**
 * Middleware that guards routes by **Platform Role** (global/SaaS level).
 *
 * This is Layer 1 of the Dual-Layer Authorization System.
 * It checks `c.user.platformRole` from the JWT payload and does NOT
 * query the database or touch `Company` / `CompanyMember`.
 */
export const requirePlatformRole = (allowedRoles: PlatformRole[]) => ({
  beforeHandle: (c: AppContext) => {
    const user = c.user as { platformRole?: string } | undefined;

    if (!user) {
      return c.json(
        { status: 401, message: "Unauthorized. Token tidak ditemukan." },
        401,
      );
    }

    if (
      !user.platformRole ||
      !allowedRoles.includes(user.platformRole as PlatformRole)
    ) {
      return c.json(
        {
          status: 403,
          message: "Access denied. Global platform authorization required.",
        },
        403,
      );
    }
  },
});
