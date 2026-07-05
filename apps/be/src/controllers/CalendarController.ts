import CalendarService from "@/service/CalendarService";
import { HttpResponse } from "@/http";
import type { AppContext } from "@/contex";
import type {
  PickCreateEvent,
  PickUpdateEvent,
} from "@repo/types/calendar.types";
import { JwtPayload } from "@repo/types/auth.types";
import { CreateEventValidation } from "@/validation/calender.validate";
import {
  paramsValidate,
  memberContextValidate,
} from "@/validation/auth.validate";

class CalendarController {
  public async list(c: AppContext) {
    try {
      const user = c.user as JwtPayload;

      const authRespone = await memberContextValidate(user, c);
      if (authRespone) return authRespone;

      const data = await CalendarService.list(user.companyId!, c.query);
      if (!data) {
        return HttpResponse(c).badRequest();
      }
      return HttpResponse(c).ok(data, "Berhasil mengambil jadwal kalender");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async create(c: AppContext) {
    try {
      const user = c.user as JwtPayload;
      const input = c.body as PickCreateEvent;

      const authRespone = await memberContextValidate(user, c);
      if (authRespone) return authRespone;

      const validateRespone = await CreateEventValidation(input, c);
      if (validateRespone) return validateRespone;

      const data = await CalendarService.create(
        user.companyId!,
        user.companyMemberId!,
        input,
      );

      if (!data) {
        return HttpResponse(c).badRequest();
      }
      return HttpResponse(c).created(data, "Jadwal berhasil ditambahkan");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async update(c: AppContext) {
    try {
      const user = c.user as JwtPayload;
      const input = c.body as PickUpdateEvent;
      const params = c.params as { id: string };

      const authRespone = await memberContextValidate(user, c);
      if (authRespone) return authRespone;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await CalendarService.update(
        params.id,
        user.companyId!,
        input,
      );
      if (!data) {
        return HttpResponse(c).notFound("Jadwal tidak ditemukan");
      }
      return HttpResponse(c).ok(data, "Jadwal berhasil diperbarui");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async remove(c: AppContext) {
    try {
      const user = c.user as JwtPayload;
      const params = c.params as { id: string };

      const authRespone = await memberContextValidate(user, c);
      if (authRespone) return authRespone;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await CalendarService.remove(params.id, user.companyId!);

      if (!data) return HttpResponse(c).notFound("Jadwal tidak ditemukan");
      return HttpResponse(c).ok(data, "Jadwal berhasil dihapus");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
}

export default new CalendarController();
