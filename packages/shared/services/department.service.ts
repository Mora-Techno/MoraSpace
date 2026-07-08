import { DEPARTMENT_ENDPOINTS } from "../endpoints/department.endpoints";
import type { IDepartment, PickCreateDepartment, PickUpdateDepartment } from "../types/department.types";
import type { TResponse } from "../types/response.types";
import { DeleteResponse, GetResponse, PatchResponse, PostResponse } from "./http";
import { toServiceResponse } from "./service-response";

class DepartmentService {
  public async ListDepartments(): Promise<TResponse<IDepartment[]>> {
    const res = await GetResponse<IDepartment[]>(DEPARTMENT_ENDPOINTS.LIST);
    return toServiceResponse(res, { message: "Daftar departemen berhasil diambil" });
  }

  public async CreateDepartment(payload: PickCreateDepartment): Promise<TResponse<IDepartment>> {
    const res = await PostResponse<IDepartment>(DEPARTMENT_ENDPOINTS.CREATE, payload);
    return toServiceResponse(res, { message: "Departemen berhasil dibuat", statusCode: 201 });
  }

  public async GetDepartment(id: string): Promise<TResponse<IDepartment>> {
    const res = await GetResponse<IDepartment>(DEPARTMENT_ENDPOINTS.BYID(id));
    return toServiceResponse(res, { message: "Detail departemen berhasil diambil" });
  }

  public async UpdateDepartment(id: string, payload: PickUpdateDepartment): Promise<TResponse<IDepartment>> {
    const res = await PatchResponse<IDepartment>(DEPARTMENT_ENDPOINTS.UPDATE(id), payload);
    return toServiceResponse(res, { message: "Departemen berhasil diperbarui" });
  }

  public async DeleteDepartment(id: string): Promise<TResponse<IDepartment>> {
    const res = await DeleteResponse<IDepartment>(DEPARTMENT_ENDPOINTS.DELETE(id));
    return toServiceResponse(res, { message: "Departemen berhasil dihapus" });
  }
}

export default new DepartmentService();
