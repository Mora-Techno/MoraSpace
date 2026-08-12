import CompanyService from "@/service/CompanyService";
import AuthService from "@/service/AuthService";
import { HttpResponse } from "@/http";
import type {
  PickCreateAdmin,
  PickRegisterCompany,
  PickUpdateCompanyProfile,
  PickUpdateCompanySubscription,
} from "@repo/types/company.types";
import type { AppContext } from "@/contex";
import {
  paramsValidate,
  unauthorizedValidate,
} from "@/validation/auth.validate";
import { CreateAdminValidate } from "@/validation/company.validate";
import { getUser } from "@/utils/authTokens";

class CompanyController {
  public async register(c: AppContext) {
    try {
      const body = c.body as PickRegisterCompany;
      const data = await CompanyService.registerLeader(body);
      const queryService = await AuthService.createSession(data.leader.id);

      return HttpResponse(c).created(
        { company: data.company, leader: data.leader, ...queryService },
        "Company dan akun leader berhasil dibuat",
      );
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  // ROLE Leader
  public async createAdmin(c: AppContext) {
    try {
      const user = getUser(c);
      const input = c.body as PickCreateAdmin;

      const authRespone = await unauthorizedValidate(user, c);
      if (authRespone) return authRespone;

      const validateRespone = await CreateAdminValidate(c, input);
      if (validateRespone) return validateRespone;

      if (!user.companyId) {
        return HttpResponse(c).notFound("Company tidak ditemukan");
      }

      const queryService = await CompanyService.createAdmin(
        user.companyId,
        input,
      );

      if (!queryService) {
        return HttpResponse(c).badRequest();
      }

      return HttpResponse(c).created(queryService, "Admin berhasil dibuat");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async deleteAdmin(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };

      const authRespone = await unauthorizedValidate(user, c);
      const validateParams = await paramsValidate(params.id, c);

      if (validateParams) return validateParams;

      if (authRespone) return authRespone;

      if (!user.companyId) {
        return HttpResponse(c).notFound("Company tidak ditemukan");
      }

      const queryService = await CompanyService.deleteAdmin(
        user.companyId,
        params.id,
      );

      if (!queryService) {
        return HttpResponse(c).badRequest();
      }

      return HttpResponse(c).ok(queryService, "Admin Berhasil dihapus");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  // ROLE [leader, admin]
  public async listAdmins(c: AppContext) {
    try {
      const user = getUser(c);

      const authRespone = await unauthorizedValidate(user, c);
      if (authRespone) return authRespone;

      if (!user.companyId) {
        return HttpResponse(c).notFound("Company tidak ditemukan");
      }

      const result = await CompanyService.listAdmins(
        user.companyId,
        c.query as any,
      );

      return HttpResponse(c).ok(
        result.data,
        result.meta,
        "Berhasil mengambil daftar admin",
      );
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async getProfile(c: AppContext) {
    try {
      const user = getUser(c);

      const authRespone = await unauthorizedValidate(user, c);
      if (authRespone) return authRespone;

      if (!user.companyId) {
        return HttpResponse(c).notFound("Company tidak ditemukan");
      }

      const data = await CompanyService.getById(user.companyId);
      if (!data) return HttpResponse(c).notFound("Company tidak ditemukan");

      return HttpResponse(c).ok(
        data,
        undefined,
        "Berhasil mengambil profil company",
      );
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async updateProfile(c: AppContext) {
    try {
      const user = getUser(c);
      const body = c.body as PickUpdateCompanyProfile;

      const authRespone = await unauthorizedValidate(user, c);
      if (authRespone) return authRespone;

      if (!user.companyId) {
        return HttpResponse(c).notFound("Company tidak ditemukan");
      }

      const data = await CompanyService.updateProfile(user.companyId, body);

      if (!data) return HttpResponse(c).notFound("Company tidak ditemukan");

      return HttpResponse(c).ok(data, "Profil company berhasil diperbarui");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  // Role owner
  public async updateSubscription(c: AppContext) {
    try {
      const user = getUser(c);
      const body = c.body as PickUpdateCompanySubscription;

      const authRespone = await unauthorizedValidate(user, c);
      if (authRespone) return authRespone;

      if (!user.companyId) {
        return HttpResponse(c).notFound("Company tidak ditemukan");
      }

      const data = await CompanyService.updateSubscription(
        user.companyId,
        body,
      );

      if (!data) return HttpResponse(c).notFound("Company tidak ditemukan");

      return HttpResponse(c).ok(data, "Langganan berhasil diperbarui");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
}

export default new CompanyController();
