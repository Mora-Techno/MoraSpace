import { NOTIFICATION_ENDPOINTS } from "../endpoints/notification.endpoints";
import type {
  NotificationInApp,
  NotificationInAppQuery,
  NotificationLog,
  NotificationLogQuery,
  NotificationQueueQuery,
  PickSendNotification,
} from "../types/notification.types";
import type { TResponse } from "../types/response.types";
import { GetResponse, PatchResponse, PostResponse, withQuery } from "./http";
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

  public async ListInAppNotifications(
    query?: NotificationInAppQuery,
  ): Promise<TResponse<NotificationInApp[]>> {
    const res = await GetResponse<NotificationInApp[]>(
      withQuery(NOTIFICATION_ENDPOINTS.LIST, query),
    );
    return toServiceResponse(res, {
      message: "Daftar notifikasi berhasil diambil",
    });
  }

  public async GetNotification(
    id: string,
  ): Promise<TResponse<NotificationInApp>> {
    const res = await GetResponse<NotificationInApp>(
      NOTIFICATION_ENDPOINTS.GET(id),
    );
    return toServiceResponse(res, {
      message: "Detail notifikasi berhasil diambil",
    });
  }

  public async MarkRead(id: string): Promise<TResponse<NotificationInApp>> {
    const res = await PatchResponse<NotificationInApp>(
      NOTIFICATION_ENDPOINTS.MARK_READ(id),
      {},
    );
    return toServiceResponse(res, {
      message: "Notifikasi ditandai sudah dibaca",
    });
  }

  public async MarkAllRead(): Promise<TResponse<unknown>> {
    const res = await PatchResponse<unknown>(
      NOTIFICATION_ENDPOINTS.MARK_ALL_READ,
      {},
    );
    return toServiceResponse(res, {
      message: "Semua notifikasi ditandai sudah dibaca",
    });
  }

  public async ListQueue(
    query?: NotificationQueueQuery,
  ): Promise<TResponse<NotificationLog[]>> {
    const res = await GetResponse<NotificationLog[]>(
      withQuery(NOTIFICATION_ENDPOINTS.QUEUE, query),
    );
    return toServiceResponse(res, {
      message: "Antrean notifikasi berhasil diambil",
    });
  }
}

export default new NotificationService();
