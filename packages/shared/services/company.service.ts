import { COMPANY_ENDPOINTS } from "../endpoints/company.endpoints";
import type {
  AdminUser,
  CompanyProfile,
  CompanyQuery,
  PickCreateAdmin,
  PickRegisterCompany,
  PickUpdateCompanyProfile,
  PickUpdateCompanySubscription,
} from "../types/company.types";
import type { TResponse } from "../types/response.types";
import {
  GetResponse,
  PatchResponse,
  PostResponse,
  PublicPostResponse,
  withQuery,
} from "./http";
import { toServiceResponse } from "./service-response";

class CompanyService {
  public async RegisterCompany(
    payload: PickRegisterCompany,
  ): Promise<TResponse<CompanyProfile>> {
    const res = await PublicPostResponse<CompanyProfile>(
      COMPANY_ENDPOINTS.REGISTER,
      payload,
    );
    return toServiceResponse(res, {
      message: "Company berhasil didaftarkan",
      statusCode: 201,
    });
  }
  public async CreateAdmin(
    payload: PickCreateAdmin,
  ): Promise<TResponse<AdminUser>> {
    const res = await PostResponse<AdminUser>(
      COMPANY_ENDPOINTS.CREATE_ADMIN,
      payload,
    );
    return toServiceResponse(res, {
      message: "Admin berhasil dibuat",
      statusCode: 201,
    });
  }
  public async ListAdmins(
    query?: CompanyQuery,
  ): Promise<TResponse<AdminUser[]>> {
    const res = await GetResponse<AdminUser[]>(
      withQuery(COMPANY_ENDPOINTS.LIST_ADMINS, query),
    );
    return toServiceResponse(res, {
      message: "Daftar admin berhasil diambil",
    });
  }
  public async GetCompanyProfile(): Promise<TResponse<CompanyProfile>> {
    const res = await GetResponse<CompanyProfile>(COMPANY_ENDPOINTS.ME);
    return toServiceResponse(res, {
      message: "Profil company berhasil diambil",
    });
  }
  public async UpdateCompanyProfile(
    payload: PickUpdateCompanyProfile,
  ): Promise<TResponse<CompanyProfile>> {
    const res = await PatchResponse<CompanyProfile>(
      COMPANY_ENDPOINTS.UPDATE_PROFILE,
      payload,
    );
    return toServiceResponse(res, {
      message: "Profil company berhasil diperbarui",
    });
  }

  public async UpdateCompanySubscription(
    payload: PickUpdateCompanySubscription,
  ): Promise<TResponse<CompanyProfile>> {
    const res = await PatchResponse<CompanyProfile>(
      COMPANY_ENDPOINTS.UPDATE_SUBSCRIPTION,
      payload,
    );
    return toServiceResponse(res, {
      message: "Langganan company berhasil diperbarui",
    });
  }
}

export default new CompanyService();
