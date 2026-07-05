import bcryptjs from "bcryptjs";
import prisma from "prisma/client";
import NotificationService from "@/service/NotificationService";
import { AUTH_EXPIRY } from "@/utils/authTokens";
import {
  generateOtp,
  generateSecureToken,
  getMagicLinkExpiry,
  getOtpExpiry,
} from "@/utils/authTokens";
import type {
  AuthSessionResponse,
  PickResetPassword,
  PickSendMagicLink,
  PickSendOtp,
  PickVerifyMagicLink,
  PickVerifyOtp,
  SafeAuthUser,
} from "@repo/types/auth.types";
import { createTokenPair, sanitizeUser } from "@/utils/authTokens";
import { resolveAuthUser } from "@/utils/memberContext";

class AuthService {
  public async createSession(
    userOrId: SafeAuthUser | string,
  ): Promise<AuthSessionResponse> {
    const user =
      typeof userOrId === "string" ? await resolveAuthUser(userOrId) : userOrId;

    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    const tokens = await createTokenPair(user);
    return {
      ...tokens,
      user: sanitizeUser(user),
    };
  }

  public async refreshAccessToken(
    refreshToken: string,
  ): Promise<AuthSessionResponse> {
    const tokens = await prisma.refreshToken.findMany({
      where: {
        revokedAt: null,
        expiredAt: { gt: new Date() },
      },
    });

    let matchedUserId: string | null = null;

    for (const token of tokens) {
      if (await bcryptjs.compare(refreshToken, token.token)) {
        matchedUserId = token.userId;
        break;
      }
    }

    if (!matchedUserId) {
      throw new Error("Refresh token tidak valid atau sudah kedaluwarsa");
    }

    const user = await resolveAuthUser(matchedUserId);
    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    return this.createSession(user);
  }

  public async revokeTokens(userId: string): Promise<void> {
    await prisma.$transaction([
      prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
      prisma.userSession.deleteMany({ where: { userId } }),
    ]);
  }

  public async sendMagicLink(input: PickSendMagicLink): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new Error("Akun tidak ditemukan");
    }

    const magicLinkToken = generateSecureToken();
    const magicLinkExpiresAt = getMagicLinkExpiry();

    await prisma.emailVerification.create({
      data: {
        userId: user.id,
        token: magicLinkToken,
        expiredAt: magicLinkExpiresAt,
      },
    });

    const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";
    const magicLink = `${frontendUrl}/auth/magic-link?token=${magicLinkToken}`;

    await NotificationService.send({
      recipient: user.email,
      subject: "Magic Link Login - Mora Workstation",
      body: `Klik link berikut untuk login (berlaku ${AUTH_EXPIRY.magicLinkMinutes} menit):\n\n${magicLink}`,
    });
  }

  public async verifyMagicLink(
    input: PickVerifyMagicLink,
  ): Promise<AuthSessionResponse> {
    const verification = await prisma.emailVerification.findFirst({
      where: {
        token: input.token,
        expiredAt: { gt: new Date() },
        verifiedAt: null,
      },
      orderBy: { expiredAt: "desc" },
    });

    if (!verification) {
      throw new Error("Magic link tidak valid atau sudah kedaluwarsa");
    }

    await prisma.$transaction([
      prisma.emailVerification.update({
        where: { id: verification.id },
        data: { verifiedAt: new Date() },
      }),
      prisma.user.update({
        where: { id: verification.userId },
        data: {
          emailVerifiedAt: new Date(),
          status: "active",
        },
      }),
    ]);

    const user = await resolveAuthUser(verification.userId);
    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    return this.createSession({ ...user, isVerify: true });
  }

  private async findUserByIdentifier(input: {
    email?: string;
    phone?: string;
  }) {
    if (input.email) {
      return prisma.user.findUnique({ where: { email: input.email } });
    }

    if (input.phone) {
      return prisma.user.findFirst({ where: { phone: input.phone } });
    }

    return null;
  }

  public async sendOtp(
    input: PickSendOtp,
  ): Promise<{ expiresInMinutes: number }> {
    if (!input.email && !input.phone) {
      throw new Error("Email atau nomor telepon wajib diisi");
    }

    const user = await this.findUserByIdentifier({
      email: input.email ?? undefined,
      phone: input.phone ?? undefined,
    });

    if (!user) {
      throw new Error("Akun tidak ditemukan");
    }

    const otp = generateOtp();
    const expOtp = getOtpExpiry();

    await prisma.emailVerification.create({
      data: {
        userId: user.id,
        token: otp,
        expiredAt: expOtp,
      },
    });

    const recipient = input.email ?? user.email;
    const channel = input.phone ? "SMS" : "Email";

    await NotificationService.send({
      recipient,
      subject: "Kode OTP Login - Mora Workstation",
      body:
        channel === "SMS"
          ? `Kode OTP Mora Workstation Anda: ${otp}. Berlaku ${AUTH_EXPIRY.otpMinutes} menit.`
          : `Kode OTP Anda: ${otp}\n\nBerlaku selama ${AUTH_EXPIRY.otpMinutes} menit. Jangan bagikan kode ini kepada siapapun.`,
    });

    return { expiresInMinutes: AUTH_EXPIRY.otpMinutes };
  }

  public async verifyOtp(input: PickVerifyOtp): Promise<AuthSessionResponse> {
    if (!input.email && !input.phone) {
      throw new Error("Email atau nomor telepon wajib diisi");
    }

    const user = await this.findUserByIdentifier({
      email: input.email ?? undefined,
      phone: input.phone ?? undefined,
    });

    if (!user) {
      throw new Error("Akun tidak ditemukan");
    }

    if (!input.otp) {
      throw new Error("OTP wajib diisi");
    }

    const verification = await prisma.emailVerification.findFirst({
      where: {
        userId: user.id,
        token: input.otp,
        expiredAt: { gt: new Date() },
        verifiedAt: null,
      },
      orderBy: { expiredAt: "desc" },
    });

    if (!verification) {
      throw new Error("Kode OTP tidak valid atau sudah kedaluwarsa");
    }

    await prisma.$transaction([
      prisma.emailVerification.update({
        where: { id: verification.id },
        data: { verifiedAt: new Date() },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerifiedAt: new Date(),
          status: "active",
        },
      }),
    ]);

    const authUser = await resolveAuthUser(user.id);
    if (!authUser) {
      throw new Error("User tidak ditemukan");
    }

    return this.createSession({ ...authUser, isVerify: true });
  }
}

export default new AuthService();
