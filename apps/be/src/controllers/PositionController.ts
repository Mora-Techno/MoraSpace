import PositionService from "@/service/PositionService";
import { HttpResponse } from "@/http";
import { getUser } from "@/utils/authTokens";
import {
  memberContextValidate,
  paramsValidate,
} from "@/validation/auth.validate";
import type { AppContext } from "@/contex";
import type {
  PickCreatePosition,
  PickUpdatePosition,
} from "@repo/types/position.types";

class PositionController {
  public async list(c: AppContext) {
    try {
      const user = getUser(c);

      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const result = await PositionService.list(
        user.companyId!,
        c.query as any,
      );
      return HttpResponse(c).ok(
        result.data,
        result.meta,
        "Berhasil mengambil daftar jabatan",
      );
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async create(c: AppContext) {
    try {
      const user = getUser(c);
      const body = c.body as PickCreatePosition;
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const data = await PositionService.create(user.companyId!, body);
      return HttpResponse(c).created(data, "Jabatan berhasil dibuat");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async update(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const body = c.body as PickUpdatePosition;
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await PositionService.update(
        params.id,
        user.companyId!,
        body,
      );
      if (!data) return HttpResponse(c).notFound("Jabatan tidak ditemukan");

      return HttpResponse(c).ok(data, "Jabatan berhasil diperbarui");
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

      const data = await PositionService.remove(params.id, user.companyId!);
      if (!data) return HttpResponse(c).notFound("Jabatan tidak ditemukan");

      return HttpResponse(c).ok(data, "Jabatan berhasil dihapus");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
}

export default new PositionController();
