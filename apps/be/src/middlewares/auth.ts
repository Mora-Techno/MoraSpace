import jwt from 'jsonwebtoken';
import type { JwtPayload } from '@repo/types/auth.types';
import { env } from '@/config/env.config';
import prisma from 'prisma/client';

export const verifyToken = () => ({
  beforeHandle: async (c: any) => {
    try {
      const authHeader = c.request.headers.get('authorization');
      const token = authHeader?.split(' ')[1];

      if (!token) {
        return c.json({ status: 401, message: 'Akses ditolak. Token belum diberikan.' }, 401);
      }

      if (!env.JWT_SECRET) {
        console.error('JWT_SECRET is not defined in environment variables');
        return c.json({ status: 500, message: 'Kesalahan konfigurasi server.' }, 500);
      }

      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      if (decoded.tokenType && decoded.tokenType !== 'access') {
        return c.json({ status: 403, message: 'Tipe token tidak valid.' }, 403);
      }
      const session = await prisma.userSession.findFirst({
        where: { userId: decoded.id, accessToken: token, expiredAt: { gt: new Date() } },
        select: { id: true },
      });
      if (!session) {
        return c.json({ status: 401, message: 'Sesi telah berakhir. Silakan login kembali.' }, 401);
      }
      // v0.0.1 kill switch: member company yang di-suspend ditolak (SUPER_ADMIN bypass).
      if (decoded.companyId && decoded.platformRole !== 'SUPER_ADMIN') {
        const company = await prisma.company.findUnique({
          where: { id: decoded.companyId },
          select: { status: true },
        });
        if (company?.status === 'suspended') {
          return c.json(
            { status: 403, message: 'Company dinonaktifkan. Hubungi administrator.' },
            403,
          );
        }
      }
      c.user = decoded;
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        return c.json({ status: 401, message: 'Token telah kedaluwarsa.' }, 401);
      }
      if (error.name === 'JsonWebTokenError') {
        return c.json({ status: 403, message: 'Token tidak valid.' }, 403);
      }
      console.error('JWT verification error:', error);
      return c.json({ status: 500, message: 'Verifikasi token gagal.' }, 500);
    }
  },
});

export const requireRole = (roles: string[]) => ({
  beforeHandle: (c: any) => {
    if (!c.user || !roles.includes(c.user.companyRole)) {
      return c.json({ status: 403, message: 'Akses ditolak. Role tidak sesuai.' }, 403);
    }
  },
});
