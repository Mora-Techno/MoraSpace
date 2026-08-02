import type { PickApiID } from "@repo/types/api.types";
import {
  CALENDAR_ENDPOINTS,
  calendarEventById,
} from "../endpoints/calendar.endpoints";
import type {
  CalendarEvent,
  EventQuery,
  PickCreateEvent,
  PickUpdateEvent,
} from "../types/calendar.types";
import type { TResponse } from "../types/response.types";
import {
  DeleteResponse,
  GetResponse,
  PatchResponse,
  PostResponse,
  withQuery,
} from "./http";
import { toServiceResponse } from "./service-response";

class CalendarService {
  public async ListEvents(
    query?: EventQuery,
  ): Promise<TResponse<CalendarEvent[]>> {
    const res = await GetResponse<CalendarEvent[]>(
      withQuery(CALENDAR_ENDPOINTS.LIST, query),
    );
    return toServiceResponse(res, {
      message: "Daftar jadwal berhasil diambil",
    });
  }
  public async GetEvent(id: string): Promise<TResponse<CalendarEvent>> {
    const res = await GetResponse<CalendarEvent>(calendarEventById(id));
    return toServiceResponse(res, {
      message: "Detail jadwal berhasil diambil",
    });
  }
  public async CreateEvent(
    payload: PickCreateEvent,
  ): Promise<TResponse<CalendarEvent>> {
    const res = await PostResponse<CalendarEvent>(
      CALENDAR_ENDPOINTS.CREATE,
      payload,
    );
    return toServiceResponse(res, {
      message: "Jadwal berhasil dibuat",
      statusCode: 201,
    });
  }
  public async UpdateEvent(
    id: PickApiID,
    payload: PickUpdateEvent,
  ): Promise<TResponse<CalendarEvent>> {
    const res = await PatchResponse<CalendarEvent>(
      calendarEventById(id.id),
      payload,
    );
    return toServiceResponse(res, { message: "Jadwal berhasil diperbarui" });
  }
  public async DeleteEvent(id: PickApiID): Promise<TResponse<CalendarEvent>> {
    const res = await DeleteResponse<CalendarEvent>(calendarEventById(id.id));
    return toServiceResponse(res, { message: "Jadwal berhasil dihapus" });
  }
}
export default new CalendarService();
