import { POMODORO_ENDPOINTS } from "../endpoints/pomodoro.endpoints";
import type { IPomodoroSession, PickStartPomodoro, PickStopPomodoro } from "../types/pomodoro.types";
import type { TResponse } from "../types/response.types";
import { GetResponse, PostResponse } from "./http";
import { toServiceResponse } from "./service-response";

class PomodoroService {
  public async StartSession(payload?: PickStartPomodoro): Promise<TResponse<IPomodoroSession>> {
    const res = await PostResponse<IPomodoroSession>(POMODORO_ENDPOINTS.START, payload ?? {});
    return toServiceResponse(res, { message: "Sesi pomodoro dimulai", statusCode: 201 });
  }

  public async PauseSession(): Promise<TResponse<IPomodoroSession>> {
    const res = await PostResponse<IPomodoroSession>(POMODORO_ENDPOINTS.PAUSE, {});
    return toServiceResponse(res, { message: "Sesi pomodoro dijeda" });
  }

  public async ResumeSession(): Promise<TResponse<IPomodoroSession>> {
    const res = await PostResponse<IPomodoroSession>(POMODORO_ENDPOINTS.RESUME, {});
    return toServiceResponse(res, { message: "Sesi pomodoro dilanjutkan" });
  }

  public async StopSession(payload?: PickStopPomodoro): Promise<TResponse<IPomodoroSession>> {
    const res = await PostResponse<IPomodoroSession>(POMODORO_ENDPOINTS.STOP, payload ?? {});
    return toServiceResponse(res, { message: "Sesi pomodoro dihentikan" });
  }

  public async GetTodayFocus(): Promise<TResponse<any>> {
    const res = await GetResponse<any>(POMODORO_ENDPOINTS.TODAY);
    return toServiceResponse(res, { message: "Data fokus hari ini berhasil diambil" });
  }

  public async GetStatistics(): Promise<TResponse<any>> {
    const res = await GetResponse<any>(POMODORO_ENDPOINTS.STATISTICS);
    return toServiceResponse(res, { message: "Statistik fokus berhasil diambil" });
  }
}

export default new PomodoroService();
