import Elysia from "elysia";
import AuthController from "@/controllers/AuthController";
import {
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  SendMagicLinkDto,
  SendOtpDto,
  VerifyMagicLinkDto,
  VerifyOtpDto,
} from "@/dto/auth.dto";
import { AppContext } from "@/contex";

class AuthRouter {
  public authRouter;

  constructor() {
    this.authRouter = new Elysia({ prefix: "/auth" });
    this.routes();
  }

  private routes() {
    this.authRouter.post(
      "/register",
      (c: AppContext) => AuthController.register(c),
      {
        body: RegisterDto,
        detail: {
          summary: "Registrasi akun baru",
          description: "Mendaftarkan pengguna baru ke sistem.",
          tags: ["Auth"],
        },
      },
    );
    this.authRouter.post("/login", (c: AppContext) => AuthController.login(c), {
      body: LoginDto,
      detail: {
        summary: "Login pengguna",
        description:
          "Autentikasi dengan email dan password. Mengembalikan accessToken + refreshToken.",
        tags: ["Auth"],
      },
    });
    this.authRouter.post(
      "/refresh",
      (c: AppContext) => AuthController.refresh(c),
      {
        body: RefreshTokenDto,
        detail: {
          summary: "Refresh access token",
          description:
            "Menukar refresh token dengan pasangan access + refresh token baru.",
          tags: ["Auth"],
        },
      },
    );
    this.authRouter.post(
      "/magic-link/send",
      (c: AppContext) => AuthController.sendMagicLink(c),
      {
        body: SendMagicLinkDto,
        detail: {
          summary: "Kirim magic link login",
          description: "Mengirim link login sekali pakai ke email pengguna.",
          tags: ["Auth"],
        },
      },
    );
    this.authRouter.post(
      "/magic-link/verify",
      (c: AppContext) => AuthController.verifyMagicLink(c),
      {
        body: VerifyMagicLinkDto,
        detail: {
          summary: "Verifikasi magic link",
          description: "Menukar token magic link menjadi session JWT.",
          tags: ["Auth"],
        },
      },
    );
    this.authRouter.post(
      "/logout",
      (c: AppContext) => AuthController.logout(c),
      {
        detail: {
          summary: "Logout pengguna",
          description:
            "Membatalkan access dan refresh token. Membutuhkan header Authorization Bearer.",
          tags: ["Auth"],
        },
      },
    );
    this.authRouter.post(
      "/otp/send",
      (c: AppContext) => AuthController.sendOtp(c),
      {
        body: SendOtpDto,
        detail: {
          summary: "Kirim OTP (mobile/email)",
          description:
            "Mengirim kode OTP 6 digit via email atau nomor telepon terdaftar.",
          tags: ["Auth"],
        },
      },
    );
    this.authRouter.post(
      "/otp/verify",
      (c: AppContext) => AuthController.verifyOtp(c),
      {
        body: VerifyOtpDto,
        detail: {
          summary: "Verifikasi OTP",
          description: "Memverifikasi OTP dan mengembalikan session JWT.",
          tags: ["Auth"],
        },
      },
    );
  }
}
export default new AuthRouter().authRouter;
