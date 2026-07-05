import jwt from "jsonwebtoken";
import { JwtPayload } from "@repo/types/auth.types";
import { env } from "@/config/env.config";

export const verifyToken = () => ({
  beforeHandle: async (c: any) => {
    try {
      const authHeader = c.request.headers.get("authorization");
      const token = authHeader?.split(" ")[1];

      if (!token) {
        return c.json(
          { status: 401, message: "Akses ditolak. Token belum diberikan." },
          401,
        );
      }

      if (!env.JWT_SECRET) {
        console.error("JWT_SECRET is not defined in environment variables");
        return c.json(
          { status: 500, message: "Kesalahan konfigurasi server." },
          500,
        );
      }

      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      if (decoded.tokenType && decoded.tokenType !== "access") {
        return c.json({ status: 403, message: "Tipe token tidak valid." }, 403);
      }
      c.user = decoded;
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return c.json(
          { status: 401, message: "Token telah kedaluwarsa." },
          401,
        );
      } else if (error.name === "JsonWebTokenError") {
        return c.json({ status: 403, message: "Token tidak valid." }, 403);
      } else {
        console.error("JWT verification error:", error);
        return c.json({ status: 500, message: "Verifikasi token gagal." }, 500);
      }
    }
  },
});

export const requireRole = (roles: string[]) => ({
  beforeHandle: (c: any) => {
    if (!c.user || !roles.includes(c.user.role)) {
      return c.json(
        { status: 403, message: "Akses ditolak. Role tidak sesuai." },
        403,
      );
    }
  },
});
