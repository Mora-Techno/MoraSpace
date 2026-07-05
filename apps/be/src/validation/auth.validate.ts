import { AppContext } from '@/contex';
import { JwtPayload } from '@repo/types/auth.types';
import { HttpResponse } from '@/http';

export async function unauthorizedValidate(user: JwtPayload, c: AppContext) {
  if (!user) {
    return HttpResponse(c).unauthorized();
  }
}

export async function memberContextValidate(user: JwtPayload, c: AppContext) {
  const unauthorized = await unauthorizedValidate(user, c);
  if (unauthorized) return unauthorized;

  if (!user.companyMemberId) {
    return HttpResponse(c).badRequest('Konteks anggota company tidak ditemukan');
  }

  if (!user.companyId) {
    return HttpResponse(c).badRequest('Company context tidak ditemukan');
  }
}

export async function paramsValidate(id: string, c: AppContext) {
  if (!id) {
    return HttpResponse(c).notFound('params tidak ditemukan');
  }
}
