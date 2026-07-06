import NotificationService from "@/service/NotificationService";
import { HttpResponse } from "@/http";
import type { AppContext } from "@/contex";
import type {
  NotificationLogQuery,
  PickSendNotification,
} from "@repo/types/notification.types";
import { getUser } from "@/utils/authTokens";
import { unauthorizedValidate } from "@/validation/auth.validate";
import { SendNotifValidation } from "@/validation/notification.validate";
import { isTransportResponse } from "@/utils/transportResponse";

class NotificationController {
  public async send(c: AppContext) {
    try {
      const user = getUser(c);
      const input = c.body as PickSendNotification;

      const authRespone = await unauthorizedValidate(user, c);
      if (authRespone) return authRespone;

      const validateRespone = await SendNotifValidation(c, input);
      if (validateRespone) return validateRespone;

      const queryService = await NotificationService.send(input);
      if (!queryService) {
        return HttpResponse(c).badRequest();
      }

      if (isTransportResponse(queryService))
        return HttpResponse(c).ok(queryService, "Email berhasil dikirim");
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async listLogs(c: AppContext) {
    try {
      const user = getUser(c);

      const authRespone = await unauthorizedValidate(user, c);
      if (authRespone) return authRespone;

      const queryService = await NotificationService.listLogs({
        status: c.query.status as NotificationLogQuery["status"],
        limit: c.query.limit ? Number(c.query.limit) : undefined,
      });

      if (isTransportResponse(queryService))
        return HttpResponse(c).ok(
          queryService,
          "Berhasil mengambil riwayat notifikasi",
        );
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
}

export default new NotificationController();
