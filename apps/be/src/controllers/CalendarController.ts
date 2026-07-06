import CalendarService from "@/service/CalendarService";
import { HttpResponse } from "@/http";
import type { AppContext } from "@/contex";
import type {
  PickCreateEvent,
  PickUpdateEvent,
} from "@repo/types/calendar.types";
import { CreateEventValidation } from "@/validation/calender.validate";
import {
  paramsValidate,
  memberContextValidate,
} from "@/validation/auth.validate";
import { isTransportResponse } from "@/utils/transportResponse";
import { getUser } from "@/utils/authTokens";

class CalendarController {
  public async list(c: AppContext) {
    try {
      const user = getUser(c);

      const authRespone = await memberContextValidate(user, c);
      if (authRespone) return authRespone;

      const queryService = await CalendarService.list(user.companyId!, c.query);
      if (!queryService) {
        return HttpResponse(c).badRequest();
      }
      if (isTransportResponse(queryService))
        return HttpResponse(c).ok(
          queryService,
          "Berhasil mengambil jadwal kalender",
        );
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async create(c: AppContext) {
    try {
      const user = getUser(c);
      const input = c.body as PickCreateEvent;

      const authRespone = await memberContextValidate(user, c);
      if (authRespone) return authRespone;

      const validateRespone = await CreateEventValidation(input, c);
      if (validateRespone) return validateRespone;

      const queryService = await CalendarService.create(
        user.companyId!,
        user.companyMemberId!,
        input,
      );

      if (!queryService) {
        return HttpResponse(c).badRequest();
      }
      if (isTransportResponse(queryService))
        return HttpResponse(c).created(
          queryService,
          "Jadwal berhasil ditambahkan",
        );
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async update(c: AppContext) {
    try {
      const user = getUser(c);
      const input = c.body as PickUpdateEvent;
      const params = c.params as { id: string };

      const authRespone = await memberContextValidate(user, c);
      if (authRespone) return authRespone;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const queryService = await CalendarService.update(
        params.id,
        user.companyId!,
        input,
      );
      if (!queryService) {
        return HttpResponse(c).notFound("Jadwal tidak ditemukan");
      }
      if (isTransportResponse(queryService))
        return HttpResponse(c).ok(queryService, "Jadwal berhasil diperbarui");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async remove(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };

      const authRespone = await memberContextValidate(user, c);
      if (authRespone) return authRespone;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const queryService = await CalendarService.remove(
        params.id,
        user.companyId!,
      );

      if (!queryService)
        return HttpResponse(c).notFound("Jadwal tidak ditemukan");
      if (isTransportResponse(queryService))
        return HttpResponse(c).ok(queryService, "Jadwal berhasil dihapus");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
}

export default new CalendarController();
