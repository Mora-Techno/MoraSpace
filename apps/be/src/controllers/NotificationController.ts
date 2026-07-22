import NotificationService from "@/service/NotificationService";
import { HttpResponse } from "@/http";
import type { AppContext } from "@/contex";
import type {
  NotificationLogQuery,
  PickSendNotification,
} from "@repo/types/notification.types";
import { getUser } from "@/utils/authTokens";
import {
  memberContextValidate,
  paramsValidate,
  unauthorizedValidate,
} from "@/validation/auth.validate";
import { SendNotifValidation } from "@/validation/notification.validate";

class NotificationController {
  public async send(c: AppContext) {
    try {
      const user = getUser(c);
      const input = c.body as PickSendNotification;

      const authRespone = await unauthorizedValidate(user, c);
      if (authRespone) return authRespone;

      const validateRespone = await SendNotifValidation(c, input);
      if (validateRespone) return validateRespone;

      const data = await NotificationService.send(input);
      if (!data) {
        return HttpResponse(c).badRequest();
      }

      return HttpResponse(c).ok(data, "Email berhasil dikirim");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async listLogs(c: AppContext) {
    try {
      const user = getUser(c);

      const authRespone = await unauthorizedValidate(user, c);
      if (authRespone) return authRespone;

      const result = await NotificationService.listLogs(c.query as any);
      return HttpResponse(c).ok(
        result.data,
        result.meta,
        "Berhasil mengambil riwayat notifikasi",
      );
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async listInApp(c: AppContext) {
    try {
      const user = getUser(c);

      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const result = await NotificationService.listInApp(
        user.companyMemberId!,
        c.query as any,
      );
      return HttpResponse(c).ok(
        result.data,
        result.meta,
        "Berhasil mengambil daftar notifikasi",
      );
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async markRead(c: AppContext) {
    try {
      const user = getUser(c);
      const params = c.params as { id: string };
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const validateParams = await paramsValidate(params.id, c);
      if (validateParams) return validateParams;

      const data = await NotificationService.markRead(
        params.id,
        user.companyMemberId!,
      );
      if (!data) return HttpResponse(c).notFound("Notifikasi tidak ditemukan");

      return HttpResponse(c).ok(data, "Notifikasi ditandai sudah dibaca");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async markAllRead(c: AppContext) {
    try {
      const user = getUser(c);
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const data = await NotificationService.markAllRead(user.companyMemberId!);
      return HttpResponse(c).ok(data, "Semua notifikasi ditandai sudah dibaca");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async listQueue(c: AppContext) {
    try {
      const user = getUser(c);

      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const result = await NotificationService.listQueue(c.query as any);
      return HttpResponse(c).ok(
        result.data,
        result.meta,
        "Berhasil mengambil antrean notifikasi",
      );
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
}

export default new NotificationController();
