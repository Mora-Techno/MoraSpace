import { NOTIFICATION_ENDPOINTS } from "../endpoints/notification.endpoints";
import type {
  NotificationLog,
  NotificationLogQuery,
  PickSendNotification,
} from "../types/notification.types";
import type { TResponse } from "../types/response.types";
import { GetResponse, PostResponse, withQuery } from "./http";
import { toServiceResponse } from "./service-response";
class NotificationService {
  public async SendNotification(
    payload: PickSendNotification,
  ): Promise<TResponse<NotificationLog>> {
    const res = await PostResponse<NotificationLog>(
      NOTIFICATION_ENDPOINTS.SEND,
      payload,
    );
    return toServiceResponse(res, {
      message: "Notifikasi berhasil dikirim",
      statusCode: 201,
    });
  }
  public async ListNotificationLogs(
    query?: NotificationLogQuery,
  ): Promise<TResponse<NotificationLog[]>> {
    const res = await GetResponse<NotificationLog[]>(
      withQuery(NOTIFICATION_ENDPOINTS.LOGS, query),
    );
    return toServiceResponse(res, {
      message: "Riwayat notifikasi berhasil diambil",
    });
  }
}
export default new NotificationService();
