import { ROLE_ENDPOINTS } from "../endpoints/role.endpoints";
import type { TResponse } from "../types/response.types";
import type {
  IPermission,
  IRole,
  PermissionQuery,
  PickCreateRole,
  PickUpdateRole,
  PickUpdateRolePermissions,
  RoleQuery,
} from "../types/role.types";
import {
  DeleteResponse,
  GetResponse,
  PatchResponse,
  PostResponse,
  withQuery,
} from "./http";
import { toServiceResponse } from "./service-response";

class RoleService {
  public async ListRoles(query?: RoleQuery): Promise<TResponse<IRole[]>> {
    const res = await GetResponse<IRole[]>(
      withQuery(ROLE_ENDPOINTS.LIST, query),
    );
    return toServiceResponse(res, { message: "Daftar role berhasil diambil" });
  }

  public async CreateRole(payload: PickCreateRole): Promise<TResponse<IRole>> {
    const res = await PostResponse<IRole>(ROLE_ENDPOINTS.CREATE, payload);
    return toServiceResponse(res, {
      message: "Role berhasil dibuat",
      statusCode: 201,
    });
  }

  public async UpdateRole(
    id: string,
    payload: PickUpdateRole,
  ): Promise<TResponse<IRole>> {
    const res = await PatchResponse<IRole>(ROLE_ENDPOINTS.UPDATE(id), payload);
    return toServiceResponse(res, { message: "Role berhasil diperbarui" });
  }

  public async DeleteRole(id: string): Promise<TResponse<IRole>> {
    const res = await DeleteResponse<IRole>(ROLE_ENDPOINTS.DELETE(id));
    return toServiceResponse(res, { message: "Role berhasil dihapus" });
  }

  public async GetRolePermissions(
    id: string,
  ): Promise<TResponse<IPermission[]>> {
    const res = await GetResponse<IPermission[]>(
      ROLE_ENDPOINTS.PERMISSIONS(id),
    );
    return toServiceResponse(res, {
      message: "Permission role berhasil diambil",
    });
  }

  public async UpdateRolePermissions(
    id: string,
    payload: PickUpdateRolePermissions,
  ): Promise<TResponse<IRole>> {
    const res = await PostResponse<IRole>(
      ROLE_ENDPOINTS.UPDATE_PERMISSIONS(id),
      payload,
    );
    return toServiceResponse(res, {
      message: "Permission role berhasil diperbarui",
    });
  }

  public async ListMasterPermissions(
    query?: PermissionQuery,
  ): Promise<TResponse<IPermission[]>> {
    const res = await GetResponse<IPermission[]>(
      withQuery(ROLE_ENDPOINTS.MASTER_PERMISSIONS, query),
    );
    return toServiceResponse(res, {
      message: "Master permission berhasil diambil",
    });
  }
}

export default new RoleService();
