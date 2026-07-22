import DepartmentService from "@/service/DepartmentService";
import { HttpResponse } from "@/http";
import { getUser } from "@/utils/authTokens";
import {
  memberContextValidate,
  paramsValidate,
} from "@/validation/auth.validate";
import type { AppContext } from "@/contex";
import type {
  PickCreateDepartment,
  PickUpdateDepartment,
} from "@repo/types/department.types";

class DepartmentController {
  public async list(c: AppContext) {
    try {
      const user = getUser(c);

      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const result = await DepartmentService.list(
        user.companyId!,
        c.query as any,
      );
      return HttpResponse(c).ok(
        result.data,
        result.meta,
        "Berhasil mengambil daftar departemen",
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

      const data = await DepartmentService.getById(params.id, user.companyId!);
      if (!data) return HttpResponse(c).notFound("Departemen tidak ditemukan");

      return HttpResponse(c).ok(
        data,
        undefined,
        "Berhasil mengambil detail departemen",
      );
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async create(c: AppContext) {
    try {
      const user = getUser(c);
      const body = c.body as PickCreateDepartment;
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const data = await DepartmentService.create(user.companyId!, body);
      return HttpResponse(c).created(data, "Departemen berhasil dibuat");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async update(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const body = c.body as PickUpdateDepartment;
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await DepartmentService.update(
        params.id,
        user.companyId!,
        body,
      );
      if (!data) return HttpResponse(c).notFound("Departemen tidak ditemukan");

      return HttpResponse(c).ok(data, "Departemen berhasil diperbarui");
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

      const data = await DepartmentService.remove(params.id, user.companyId!);
      if (!data) return HttpResponse(c).notFound("Departemen tidak ditemukan");

      return HttpResponse(c).ok(data, "Departemen berhasil dihapus");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
}

export default new DepartmentController();
