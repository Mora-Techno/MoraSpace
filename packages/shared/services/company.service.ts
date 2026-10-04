import { ADMIN_COMPANY_ENDPOINTS, COMPANY_ENDPOINTS } from '../endpoints/company.endpoints';
import type {
  AdminCompanyItem,
  AdminUser,
  CompanyProfile,
  CompanyQuery,
  ICompanySetting,
  PickCreateAdmin,
  PickCreateCompanyAdmin,
  PickRegisterCompany,
  PickUpdateCompanyProfile,
  PickUpdateCompanySettings,
  PickUpdateCompanySubscription,
} from '../types/company.types';
import type { TResponse } from '../types/response.types';
import {
  DeleteResponse,
  GetResponse,
  PatchResponse,
  PostResponse,
  PublicPostResponse,
  withQuery,
} from './http';
import { toServiceResponse } from './service-response';

class CompanyService {
  public async RegisterCompany(payload: PickRegisterCompany): Promise<TResponse<CompanyProfile>> {
    const res = await PublicPostResponse<CompanyProfile>(COMPANY_ENDPOINTS.REGISTER, payload);
    return toServiceResponse(res, {
      message: 'Company berhasil didaftarkan',
      statusCode: 201,
    });
  }
  public async CreateAdmin(payload: PickCreateAdmin): Promise<TResponse<AdminUser>> {
    const res = await PostResponse<AdminUser>(COMPANY_ENDPOINTS.CREATE_ADMIN, payload);
    return toServiceResponse(res, {
      message: 'Admin berhasil dibuat',
      statusCode: 201,
    });
  }
  public async DeleteAdmin(id: string): Promise<TResponse<AdminUser>> {
    const res = await DeleteResponse<AdminUser>(COMPANY_ENDPOINTS.DELETE_ADMIN(id));
    return toServiceResponse(res, {
      message: 'Admin berhasil dihapus',
      statusCode: 200,
    });
  }
  public async ListAdmins(query?: CompanyQuery): Promise<TResponse<AdminUser[]>> {
    const res = await GetResponse<AdminUser[]>(withQuery(COMPANY_ENDPOINTS.LIST_ADMINS, query));
    return toServiceResponse(res, {
      message: 'Daftar admin berhasil diambil',
    });
  }
  public async GetCompanyProfile(): Promise<TResponse<CompanyProfile>> {
    const res = await GetResponse<CompanyProfile>(COMPANY_ENDPOINTS.ME);
    return toServiceResponse(res, {
      message: 'Profil company berhasil diambil',
    });
  }
  public async UpdateCompanyProfile(
    payload: PickUpdateCompanyProfile,
  ): Promise<TResponse<CompanyProfile>> {
    const res = await PatchResponse<CompanyProfile>(COMPANY_ENDPOINTS.UPDATE_PROFILE, payload);
    return toServiceResponse(res, {
      message: 'Profil company berhasil diperbarui',
    });
  }

  public async UpdateCompanySubscription(
    payload: PickUpdateCompanySubscription,
  ): Promise<TResponse<CompanyProfile>> {
    const res = await PatchResponse<CompanyProfile>(COMPANY_ENDPOINTS.UPDATE_SUBSCRIPTION, payload);
    return toServiceResponse(res, {
      message: 'Langganan company berhasil diperbarui',
    });
  }

  public async GetCompanySettings(): Promise<TResponse<ICompanySetting>> {
    const res = await GetResponse<ICompanySetting>(COMPANY_ENDPOINTS.GET_SETTINGS);
    return toServiceResponse(res, {
      message: 'Pengaturan company berhasil diambil',
    });
  }

  public async UpdateCompanySettings(
    payload: PickUpdateCompanySettings,
  ): Promise<TResponse<ICompanySetting>> {
    const res = await PatchResponse<ICompanySetting>(COMPANY_ENDPOINTS.UPDATE_SETTINGS, payload);
    return toServiceResponse(res, {
      message: 'Pengaturan company berhasil diperbarui',
    });
  }

  public async AdminListCompanies(query?: CompanyQuery): Promise<TResponse<AdminCompanyItem[]>> {
    const res = await GetResponse<AdminCompanyItem[]>(
      withQuery(ADMIN_COMPANY_ENDPOINTS.LIST, query),
    );
    return toServiceResponse(res, {
      message: 'Daftar company berhasil diambil',
    });
  }

  public async AdminCreateCompany(
    payload: PickCreateCompanyAdmin,
  ): Promise<TResponse<CompanyProfile>> {
    const res = await PostResponse<CompanyProfile>(ADMIN_COMPANY_ENDPOINTS.CREATE, payload);
    return toServiceResponse(res, {
      message: 'Company berhasil dibuat',
      statusCode: 201,
    });
  }

  public async AdminSuspendCompany(id: string): Promise<TResponse<unknown>> {
    const res = await PatchResponse<unknown>(ADMIN_COMPANY_ENDPOINTS.SUSPEND(id), {});
    return toServiceResponse(res, {
      message: 'Company di-suspend',
    });
  }

  public async AdminActivateCompany(id: string): Promise<TResponse<unknown>> {
    const res = await PatchResponse<unknown>(ADMIN_COMPANY_ENDPOINTS.ACTIVATE(id), {});
    return toServiceResponse(res, {
      message: 'Company diaktifkan',
    });
  }

  public async AdminSetCompanyPlan(
    id: string,
    payload: PickUpdateCompanySubscription,
  ): Promise<TResponse<unknown>> {
    const res = await PatchResponse<unknown>(ADMIN_COMPANY_ENDPOINTS.SET_PLAN(id), payload);
    return toServiceResponse(res, {
      message: 'Plan company diperbarui',
    });
  }
}

export default new CompanyService();
