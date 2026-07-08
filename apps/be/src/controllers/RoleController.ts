import RoleService from "@/service/RoleService";
import { HttpResponse } from "@/http";
import { getUser } from "@/utils/authTokens";
import { memberContextValidate, paramsValidate } from "@/validation/auth.validate";
import type { AppContext } from "@/contex";
import type { PickCreateRole, PickUpdateRole, PickUpdateRolePermissions } from "@repo/types/role.types";

class RoleController {
  public async listRoles(c: AppContext) {
    try {
      const user = getUser(c);
      const page = Number((c.query as any)?.page) || Number((c.params as any)?.page) || Number(c.params) || 1;
      const limit = Number(c.query.limit) || 10;

      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const result = await RoleService.listRoles(user.companyId!, page, limit);
      return HttpResponse(c).ok(result.data, result.meta, "Berhasil mengambil daftar role");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async createRole(c: AppContext) {
    try {
      const user = getUser(c);
      const body = c.body as PickCreateRole;
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const data = await RoleService.createRole(user.companyId!, body);
      return HttpResponse(c).created(data, "Role berhasil dibuat");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async updateRole(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const body = c.body as PickUpdateRole;
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await RoleService.updateRole(params.id, user.companyId!, body);
      if (!data) return HttpResponse(c).notFound("Role tidak ditemukan");

      return HttpResponse(c).ok(data, "Role berhasil diperbarui");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async removeRole(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await RoleService.removeRole(params.id, user.companyId!);
      if (!data) return HttpResponse(c).notFound("Role tidak ditemukan");

      return HttpResponse(c).ok(data, "Role berhasil dihapus");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Gagal menghapus role";
      return HttpResponse(c).badRequest(msg);
    }
  }

  public async getRolePermissions(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await RoleService.getRolePermissions(params.id, user.companyId!);
      if (!data) return HttpResponse(c).notFound("Role tidak ditemukan");

      return HttpResponse(c).ok(data, undefined, "Berhasil mengambil permission role");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async updateRolePermissions(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const body = c.body as PickUpdateRolePermissions;
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await RoleService.updateRolePermissions(params.id, user.companyId!, body.permissionIds);
      if (!data) return HttpResponse(c).notFound("Role tidak ditemukan");

      return HttpResponse(c).ok(data, "Permission role berhasil diperbarui");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async listMasterPermissions(c: AppContext) {
    try {
      const user = getUser(c);
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const data = await RoleService.listMasterPermissions();
      return HttpResponse(c).ok(data, undefined, "Berhasil mengambil master permission");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
}

export default new RoleController();
