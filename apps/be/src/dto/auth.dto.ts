import { t } from 'elysia';

export const LoginDto = t.Object({
  email: t.String({ format: 'email', description: 'Email pengguna' }),
  password: t.String({ minLength: 6, description: 'Password' }),
});

export const RegisterDto = t.Object({
  email: t.String({ format: 'email', description: 'Email pengguna' }),
  fullName: t.String({ minLength: 1, description: 'Nama lengkap' }),
  password: t.String({ minLength: 6, description: 'Password' }),
  phone: t.Optional(t.String({ minLength: 10, description: 'Nomor telepon (opsional)' })),
  companyRole: t.Optional(
    t.Union([t.Literal('Owner'), t.Literal('Admin'), t.Literal('Member')], {
      description: 'Role company (default: Owner)',
    }),
  ),
});

export const RefreshTokenDto = t.Object({
  refreshToken: t.String({ minLength: 1, description: 'Refresh token' }),
});

export const SendMagicLinkDto = t.Object({
  email: t.String({ format: 'email', description: 'Email pengguna' }),
});

export const VerifyMagicLinkDto = t.Object({
  token: t.String({ minLength: 1, description: 'Token magic link' }),
});

export const SendOtpDto = t.Object({
  email: t.Optional(t.String({ format: 'email', description: 'Email pengguna' })),
  phone: t.Optional(t.String({ minLength: 10, description: 'Nomor telepon (mobile)' })),
});

export const VerifyOtpDto = t.Object({
  email: t.Optional(t.String({ format: 'email', description: 'Email pengguna' })),
  phone: t.Optional(t.String({ minLength: 10, description: 'Nomor telepon (mobile)' })),
  otp: t.String({
    minLength: 6,
    maxLength: 6,
    description: 'Kode OTP 6 digit',
  }),
});

export const ForgotPasswordDto = t.Object({
  email: t.String({ format: 'email', description: 'Email pengguna' }),
});

export const ResetPasswordDto = t.Object({
  token: t.String({ minLength: 1, description: 'Token reset password' }),
  password: t.String({ minLength: 6, description: 'Password baru' }),
});
