import { ROLE_ENDPOINTS } from '../endpoints/role.endpoints';
import type { TResponse } from '../types/response.types';
import type {
  IRole,
  PickCreateRole,
  PickUpdateRole,
  PickUpdateRolePermissions,
} from '../types/role.types';
import { DeleteResponse, GetResponse, PatchResponse, PostResponse } from './http';
import { toServiceResponse } from './service-response';

class RoleService {
  public async ListRoles(): Promise<TResponse<IRole[]>> {
    const res = await GetResponse<IRole[]>(ROLE_ENDPOINTS.LIST);
    return toServiceResponse(res, { message: 'Daftar role berhasil diambil' });
  }

  public async CreateRole(payload: PickCreateRole): Promise<TResponse<IRole>> {
    const res = await PostResponse<IRole>(ROLE_ENDPOINTS.CREATE, payload);
    return toServiceResponse(res, { message: 'Role berhasil dibuat', statusCode: 201 });
  }

  public async UpdateRole(id: string, payload: PickUpdateRole): Promise<TResponse<IRole>> {
    const res = await PatchResponse<IRole>(ROLE_ENDPOINTS.UPDATE(id), payload);
    return toServiceResponse(res, { message: 'Role berhasil diperbarui' });
  }

  public async DeleteRole(id: string): Promise<TResponse<IRole>> {
    const res = await DeleteResponse<IRole>(ROLE_ENDPOINTS.DELETE(id));
    return toServiceResponse(res, { message: 'Role berhasil dihapus' });
  }

  public async GetRolePermissions(id: string): Promise<TResponse<any[]>> {
    const res = await GetResponse<any[]>(ROLE_ENDPOINTS.PERMISSIONS(id));
    return toServiceResponse(res, { message: 'Permission role berhasil diambil' });
  }

  public async UpdateRolePermissions(
    id: string,
    payload: PickUpdateRolePermissions,
  ): Promise<TResponse<IRole>> {
    const res = await PostResponse<IRole>(ROLE_ENDPOINTS.UPDATE_PERMISSIONS(id), payload);
    return toServiceResponse(res, { message: 'Permission role berhasil diperbarui' });
  }

  public async ListMasterPermissions(): Promise<TResponse<any[]>> {
    const res = await GetResponse<any[]>(ROLE_ENDPOINTS.MASTER_PERMISSIONS);
    return toServiceResponse(res, { message: 'Master permission berhasil diambil' });
  }
}

export default new RoleService();
