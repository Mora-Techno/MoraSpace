import { AppContext } from "@/contex";
import { HttpResponse } from "@/http";
import {
  memberContextValidate,
  paramsValidate,
} from "@/validation/auth.validate";
import { JwtPayload } from "@repo/types/auth.types";
import SessionService from "@/service/SessionService";
import { isTransportResponse } from "@/utils/transportResponse";

class SessionController {
  public async list(c: AppContext) {
    try {
      const user = c.user as JwtPayload;
      const page = Number(c.params) || 1;
      const limit = Number(c.query.limit) || 10;

      const authRespone = await memberContextValidate(user, c);

      if (authRespone) return authRespone;

      const listSessionQuery = await SessionService.listService(
        user,
        limit,
        page,
      );

      if (!listSessionQuery) {
        return HttpResponse(c).badRequest();
      }
      if (isTransportResponse(listSessionQuery))
        return HttpResponse(c).ok(
          listSessionQuery,
          "Berhasil mengambil session users",
        );
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
  public async getById(c: AppContext) {
    try {
      const user = c.user as JwtPayload;
      const params = c.params as { id: string };

      const authRespone = await memberContextValidate(user, c);

      if (authRespone) return authRespone;

      const getSessionByIdQuery = await SessionService.getSessionByIdService(
        params.id,
      );

      if (!getSessionByIdQuery) {
        return HttpResponse(c).badRequest();
      }

      return HttpResponse(c).ok(
        getSessionByIdQuery,
        "Berhasil mengambil session berdasarkan id",
      );
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
  public async deleteSessionById(c: AppContext) {
    try {
      const user = c.user as JwtPayload;
      const params = c.params as { id: string };

      const authRespone = await memberContextValidate(user, c);
      if (authRespone) return authRespone;

      const paramsValidation = await paramsValidate(params.id, c);

      if (paramsValidation) return paramsValidation;

      const deleteService = await SessionService.deleteSessionById(params.id);
      if (!deleteService) {
        return HttpResponse(c).badRequest();
      }

      return HttpResponse(c).ok(
        deleteService,
        "Berhasil Delete History Session",
      );
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
  public async deleteSession(c: AppContext) {
    try {
      const user = c.user as JwtPayload;

      const authRespone = await memberContextValidate(user, c);

      if (authRespone) return authRespone;

      const deleteService = await SessionService.deleteAllSessionService(
        user.id,
      );

      if (!deleteService) {
        return HttpResponse(c).badRequest();
      }

      return HttpResponse(c).ok(
        deleteService,
        "Berhasil Menghapus Seluruh Session",
      );
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
}

export default new SessionController();
