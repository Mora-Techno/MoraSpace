import { randomBytes } from "node:crypto";
import type { CompanyRole } from "@repo/types/company.types";
import type {
  AuthTokensResponse,
  SafeAuthUser,
  PlatformRole,
} from "@repo/types/auth.types";
import type { JwtPayload } from "@repo/types/auth.types";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "./jwt.utils";
import prisma from "prisma/client";
import bcryptjs from "bcryptjs";
import type { AppContext } from "@/contex";

const OTP_EXPIRY_MINUTES = 5;
const MAGIC_LINK_EXPIRY_MINUTES = 15;
const REFRESH_TOKEN_EXPIRY_DAYS = 7;
const ACCESS_TOKEN_EXPIRY_MINUTES = 15;

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateSecureToken(): string {
  return randomBytes(32).toString("hex");
}

export function getOtpExpiry(): Date {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + OTP_EXPIRY_MINUTES);
  return expiry;
}

export function getMagicLinkExpiry(): Date {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + MAGIC_LINK_EXPIRY_MINUTES);
  return expiry;
}

export function getRefreshTokenExpiry(): Date {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);
  return expiry;
}

function getAccessTokenExpiry(): Date {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + ACCESS_TOKEN_EXPIRY_MINUTES);
  return expiry;
}

export const AUTH_EXPIRY = {
  accessToken: "15m",
  refreshTokenDays: REFRESH_TOKEN_EXPIRY_DAYS,
  otpMinutes: OTP_EXPIRY_MINUTES,
  magicLinkMinutes: MAGIC_LINK_EXPIRY_MINUTES,
} as const;

export function sanitizeUser(user: {
  id: string;
  email: string;
  phone?: string | null;
  fullName: string;
  platformRole: PlatformRole;
  companyRole: CompanyRole;
  companyId?: string | null;
  companyMemberId?: string | null;
  isVerify?: boolean | null;
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return user;
}

export function buildPayload(user: SafeAuthUser): JwtPayload {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    platformRole: user.platformRole,
    companyRole: user.companyRole,
    companyId: user.companyId,
    companyMemberId: user.companyMemberId ?? null,
  };
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: AUTH_EXPIRY.accessToken,
  });
}

export async function createTokenPair(
  user: SafeAuthUser,
): Promise<AuthTokensResponse> {
  const payload = buildPayload(user);
  const accessToken = signAccessToken(payload);
  const refreshToken = generateSecureToken();
  const hashedRefreshToken = await bcryptjs.hash(refreshToken, 10);

  await prisma.$transaction([
    prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: hashedRefreshToken,
        expiredAt: getRefreshTokenExpiry(),
      },
    }),
    prisma.userSession.create({
      data: {
        userId: user.id,
        accessToken,
        expiredAt: getAccessTokenExpiry(),
      },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    }),
  ]);

  return {
    accessToken,
    refreshToken,
    expiresIn: AUTH_EXPIRY.accessToken,
  };
}

export function getUser(c: AppContext): JwtPayload {
  return c.user as JwtPayload;
}
