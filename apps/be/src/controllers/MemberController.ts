import MemberService from "@/service/MemberService";
import { HttpResponse } from "@/http";
import { getUser } from "@/utils/authTokens";
import {
  memberContextValidate,
  paramsValidate,
} from "@/validation/auth.validate";
import type { AppContext } from "@/contex";
import type {
  PickUpdateCompanyMember,
  PickUpdateMemberProfile,
  PickUpdateMemberContacts,
} from "@repo/types/member.types";

class MemberController {
  public async list(c: AppContext) {
    try {
      const user = getUser(c);

      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const result = await MemberService.list(user.companyId!, c.query as any);
      return HttpResponse(c).ok(
        result.data,
        result.meta,
        "Berhasil mengambil daftar anggota",
      );
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async getById(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await MemberService.getById(params.id, user.companyId!);
      if (!data) return HttpResponse(c).notFound("Anggota tidak ditemukan");

      return HttpResponse(c).ok(
        data,
        undefined,
        "Berhasil mengambil detail anggota",
      );
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async update(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const body = c.body as PickUpdateCompanyMember;
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await MemberService.update(params.id, user.companyId!, body);
      if (!data) return HttpResponse(c).notFound("Anggota tidak ditemukan");

      return HttpResponse(c).ok(data, "Anggota berhasil diperbarui");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async remove(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await MemberService.remove(params.id, user.companyId!);
      if (!data) return HttpResponse(c).notFound("Anggota tidak ditemukan");

      return HttpResponse(c).ok(data, "Anggota berhasil dihapus");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async getProfile(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await MemberService.getProfile(params.id, user.companyId!);
      if (!data) return HttpResponse(c).notFound("Anggota tidak ditemukan");

      return HttpResponse(c).ok(
        data,
        undefined,
        "Berhasil mengambil profil anggota",
      );
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async updateProfile(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const body = c.body as PickUpdateMemberProfile;
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await MemberService.updateProfile(
        params.id,
        user.companyId!,
        body,
      );
      if (!data) return HttpResponse(c).notFound("Anggota tidak ditemukan");

      return HttpResponse(c).ok(data, "Profil anggota berhasil diperbarui");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async getContacts(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await MemberService.getContacts(params.id, user.companyId!);
      if (!data) return HttpResponse(c).notFound("Anggota tidak ditemukan");

      return HttpResponse(c).ok(
        data,
        undefined,
        "Berhasil mengambil kontak anggota",
      );
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async updateContacts(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const body = c.body as PickUpdateMemberContacts;
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await MemberService.updateContacts(
        params.id,
        user.companyId!,
        body,
      );
      if (!data) return HttpResponse(c).notFound("Anggota tidak ditemukan");

      return HttpResponse(c).ok(data, "Kontak anggota berhasil diperbarui");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
}

export default new MemberController();
