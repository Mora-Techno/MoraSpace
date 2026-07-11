import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import type { CompanyRole } from "@repo/types/company.types";
import { HttpResponse } from "@/http";
import {
  PickLogin,
  PickRegister,
  PickRefreshToken,
  PickSendMagicLink,
  PickVerifyMagicLink,
  PickVerifyOtp,
  PickSendOtp,
  JwtPayload,
  PickLogout,
} from "@repo/types/auth.types";
import AuthService from "@/service/AuthService";
import prisma from "prisma/client";
import {
  AUTH_EXPIRY,
  generateSecureToken,
  getMagicLinkExpiry,
  sanitizeUser,
} from "@/utils/authTokens";
import type { AppContext } from "@/contex";
import NotificationService from "@/service/NotificationService";

class AuthController {
  public async register(c: AppContext) {
    try {
      const auth = c.body as PickRegister;

      if (!auth.email || !auth.fullName || !auth.password) {
        return HttpResponse(c).badRequest("Semua field wajib diisi");
      }

      const isAlreadyRegistered = await prisma.user.findUnique({
        where: { email: auth.email },
      });

      if (isAlreadyRegistered) {
        return HttpResponse(c).badRequest("Email sudah terdaftar");
      }

      if (auth.phone) {
        const phoneTaken = await prisma.user.findFirst({
          where: { phone: auth.phone },
        });
        if (phoneTaken) {
          return HttpResponse(c).badRequest("Nomor telepon sudah terdaftar");
        }
      }

      const magicLinkToken = generateSecureToken();
      const magicLinkExpiresAt = getMagicLinkExpiry();
      const hashedPassword = await bcryptjs.hash(auth.password, 10);

      const newUser = await prisma.user.create({
        data: {
          email: auth.email,
          fullName: auth.fullName,
          passwordHash: hashedPassword,
          phone: auth.phone ?? null,
          status: "pending",
        },
      });

      const safeUser = {
        id: newUser.id,
        email: newUser.email,
        phone: newUser.phone,
        fullName: newUser.fullName,
        companyRole: (auth.companyRole ?? "Member") as CompanyRole,
        companyId: null,
        companyMemberId: null,
        isVerify: false,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      };

      const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";
      const magicLink = `${frontendUrl}/magic-link?token=${magicLinkToken}`;
      await prisma.emailVerification.create({
        data: {
          token: magicLinkToken,
          expiredAt: magicLinkExpiresAt,
          userId: newUser.id,
        },
      });

      await NotificationService.send({
        body: `Klik link berikut untuk aktivasi Akun (berlaku ${AUTH_EXPIRY.magicLinkMinutes} menit):\n\n${magicLink}`,
        recipient: newUser.email,
        subject: "Aktivasi Email Akun Space",
      });

      return HttpResponse(c).created(
        sanitizeUser(safeUser),
        "Akun berhasil didaftarkan",
      );
    } catch (error) {
      console.error(error);
      return HttpResponse(c).internalError(error);
    }
  }

  public async login(c: AppContext) {
    try {
      const auth = c.body as PickLogin;

      if (!auth.email || !auth.password) {
        return HttpResponse(c).badRequest("Semua field wajib diisi");
      }

      const user = await prisma.user.findUnique({
        where: { email: auth.email },
      });
      if (!user) return HttpResponse(c).notFound("Akun tidak ditemukan");

      const validatePassword = await bcryptjs.compare(
        auth.password,
        user.passwordHash,
      );
      if (!validatePassword) {
        return HttpResponse(c).badRequest("Email atau password salah");
      }

      const session = await AuthService.createSession(user.id);

      return HttpResponse(c).ok(session, undefined, "Login berhasil");
    } catch (error) {
      console.error(error);
      return HttpResponse(c).internalError(error);
    }
  }

  public async refresh(c: AppContext) {
    try {
      const { refreshToken } = c.body as PickRefreshToken;

      if (!refreshToken) {
        return HttpResponse(c).badRequest("Refresh token wajib diisi");
      }

      const session = await AuthService.refreshAccessToken(refreshToken);
      return HttpResponse(c).ok(
        session,
        undefined,
        "Token berhasil diperbarui",
      );
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Gagal memperbarui token";
      return HttpResponse(c).unauthorized(message);
    }
  }

  public async sendMagicLink(c: AppContext) {
    try {
      const body = c.body as PickSendMagicLink;

      if (!body.email) {
        return HttpResponse(c).badRequest("Email wajib diisi");
      }

      await AuthService.sendMagicLink(body);
      return HttpResponse(c).ok(
        { email: body.email },
        undefined,
        "Magic link berhasil dikirim ke email",
      );
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Gagal mengirim magic link";
      return HttpResponse(c).badRequest(message);
    }
  }

  public async verifyMagicLink(c: AppContext) {
    try {
      const body = c.body as PickVerifyMagicLink;

      if (!body.token) {
        return HttpResponse(c).badRequest("Token wajib diisi");
      }

      const session = await AuthService.verifyMagicLink(body);
      return HttpResponse(c).ok(
        session,
        undefined,
        "Magic link berhasil diverifikasi",
      );
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Magic link tidak valid";
      return HttpResponse(c).unauthorized(message);
    }
  }

  public async sendOtp(c: AppContext) {
    try {
      const body = c.body as PickSendOtp;

      if (!body.email && !body.phone) {
        return HttpResponse(c).badRequest(
          "Email atau nomor telepon wajib diisi",
        );
      }

      const result = await AuthService.sendOtp(body);
      return HttpResponse(c).ok(
        {
          ...result,
          sentTo: body.phone ? "phone" : "email",
        },
        undefined,
        "OTP berhasil dikirim",
      );
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Gagal mengirim OTP";
      return HttpResponse(c).badRequest(message);
    }
  }

  public async verifyOtp(c: AppContext) {
    try {
      const body = c.body as PickVerifyOtp;

      if (!body.email && !body.phone) {
        return HttpResponse(c).badRequest(
          "Email atau nomor telepon wajib diisi",
        );
      }

      if (!body.otp) {
        return HttpResponse(c).badRequest("OTP wajib diisi");
      }

      const session = await AuthService.verifyOtp(body);
      return HttpResponse(c).ok(
        session,
        undefined,
        "OTP berhasil diverifikasi",
      );
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "OTP tidak valid";
      return HttpResponse(c).unauthorized(message);
    }
  }

  public async logout(c: AppContext) {
    try {
      const authHeader = c.request.headers.get("authorization");
      const token = authHeader?.split(" ")[1];

      if (!token) {
        return HttpResponse(c).unauthorized("Token tidak ditemukan");
      }

      if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not set");

      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
      const { id }: PickLogout = decoded;

      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) return HttpResponse(c).notFound("Akun tidak ditemukan");

      await AuthService.revokeTokens(id);
      return HttpResponse(c).ok(null, undefined, "Logout berhasil");
    } catch (error) {
      console.error(error);
      return HttpResponse(c).unauthorized("Token tidak valid");
    }
  }
}

export default new AuthController();
