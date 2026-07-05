import { COMPANY_ENDPOINTS } from "../endpoints/company.endpoints";
import type {
  AdminUser,
  CompanyProfile,
  PickCreateAdmin,
  PickRegisterCompany,
  PickUpdateCompanySubscription,
} from "../types/company.types";
import type { TResponse } from "../types/response.types";
import {
  GetResponse,
  PatchResponse,
  PostResponse,
  PublicPostResponse,
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
  public async ListAdmins(): Promise<TResponse<AdminUser[]>> {
    const res = await GetResponse<AdminUser[]>(COMPANY_ENDPOINTS.LIST_ADMINS);
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
