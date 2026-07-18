import type { AppContext } from '@/contex';
import { HttpResponse } from '@/http';
import { memberContextValidate, paramsValidate } from '@/validation/auth.validate';
import SessionService from '@/service/SessionService';
import { isTransportResponse } from '@/utils/transportResponse';
import { getUser } from '@/utils/authTokens';

class SessionController {
  public async list(c: AppContext) {
    try {
      const user = getUser(c);
      const page = Number(c.params) || 1;
      const limit = Number(c.query.limit) || 10;

      const authRespone = await memberContextValidate(user, c);

      if (authRespone) return authRespone;

      const queryService = await SessionService.listService(user, limit, page);

      if (!queryService) {
        return HttpResponse(c).badRequest();
      }
      if (isTransportResponse(queryService))
        return HttpResponse(c).ok(
          queryService.data,
          queryService.meta,
          'Berhasil mengambil session users',
        );
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
  public async getById(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };

      const authRespone = await memberContextValidate(user, c);

      if (authRespone) return authRespone;

      const queryService = await SessionService.getSessionByIdService(params.id);

      if (!queryService) {
        return HttpResponse(c).badRequest();
      }

      if (isTransportResponse(queryService))
        return HttpResponse(c).ok(queryService, 'Berhasil mengambil session berdasarkan id');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
  public async deleteSessionById(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };

      const authRespone = await memberContextValidate(user, c);
      if (authRespone) return authRespone;

      const paramsValidation = await paramsValidate(params.id, c);

      if (paramsValidation) return paramsValidation;

      const queryService = await SessionService.deleteSessionById(params.id);
      if (!queryService) {
        return HttpResponse(c).badRequest();
      }

      if (isTransportResponse(queryService))
        return HttpResponse(c).ok(queryService, 'Berhasil Delete History Session');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
  public async deleteSession(c: AppContext) {
    try {
      const user = getUser(c);

      const authRespone = await memberContextValidate(user, c);

      if (authRespone) return authRespone;

      const queryService = await SessionService.deleteAllSessionService(user.id);

      if (!queryService) {
        return HttpResponse(c).badRequest();
      }

      if (isTransportResponse(queryService))
        return HttpResponse(c).ok(queryService, 'Berhasil Menghapus Seluruh Session');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
}

export default new SessionController();
