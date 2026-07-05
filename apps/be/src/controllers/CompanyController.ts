import CompanyService from "@/service/CompanyService";
import AuthService from "@/service/AuthService";
import { HttpResponse } from "@/http";
import type {
  PickCreateAdmin,
  PickRegisterCompany,
  PickUpdateCompanySubscription,
} from "@repo/types/company.types";
import type { AppContext } from "@/contex";
import { JwtPayload } from "@repo/types/auth.types";
import { unauthorizedValidate } from "@/validation/auth.validate";
import { CreateAdminValidate } from "@/validation/company.validate";

class CompanyController {
  public async register(c: AppContext) {
    try {
      const body = c.body as PickRegisterCompany;
      const data = await CompanyService.registerLeader(body);
      const session = await AuthService.createSession(data.leader.id);

      return HttpResponse(c).created(
        { company: data.company, leader: data.leader, ...session },
        "Company dan akun leader berhasil dibuat",
      );
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  // ROLE Leader
  public async createAdmin(c: AppContext) {
    try {
      const user = c.user as JwtPayload;
      const input = c.body as PickCreateAdmin;

      const authRespone = await unauthorizedValidate(user, c);
      if (authRespone) return authRespone;

      const validateRespone = await CreateAdminValidate(c, input);
      if (validateRespone) return validateRespone;

      if (!user.companyId) {
        return HttpResponse(c).notFound("Company tidak ditemukan");
      }

      const data = await CompanyService.createAdmin(user.companyId, input);

      if (!data) {
        return HttpResponse(c).badRequest();
      }

      return HttpResponse(c).created(data, "Admin berhasil dibuat");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  // ROLE [leader, admin]
  public async listAdmins(c: AppContext) {
    try {
      const user = c.user as JwtPayload;

      const authRespone = await unauthorizedValidate(user, c);
      if (authRespone) return authRespone;

      if (!user.companyId) {
        return HttpResponse(c).notFound("Company tidak ditemukan");
      }

      const data = await CompanyService.listAdmins(user.companyId);

      if (!data) {
        return HttpResponse(c).badRequest();
      }
      return HttpResponse(c).ok(
        data,

        "Berhasil mengambil daftar admin",
      );
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async getProfile(c: AppContext) {
    try {
      const user = c.user as JwtPayload;

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

  // Role [Admin]
  public async updateSubscription(c: AppContext) {
    try {
      const user = c.user as JwtPayload;
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
