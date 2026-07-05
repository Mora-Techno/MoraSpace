import { SESSION_ENDPOINT } from "../endpoints";
import { TResponse } from "../types/response.types";
import { Session } from "../types/session.type";
import { DeleteResponse, GetResponse } from "./http";
import { toServiceResponse } from "./service-response";

class SessionService {
  public async ListSession(): Promise<TResponse<Session[]>> {
    const res = await GetResponse<Session[]>(SESSION_ENDPOINT.LIST);
    return toServiceResponse(res, {
      message: "Daftar Session Berhasil",
      statusCode: 200,
    });
  }
  public async SessionById(id: string): Promise<TResponse<Session>> {
    const res = await GetResponse<Session>(SESSION_ENDPOINT.BYID(id));
    return toServiceResponse(res, {
      message: "Detail Session berhasil di ambil",
      statusCode: 200,
    });
  }
  public async DeleteSessionById(id: string): Promise<TResponse<Session>> {
    const res = await DeleteResponse<Session>(SESSION_ENDPOINT.DELETE(id));
    return toServiceResponse(res, {
      message: "Session Berhasil Dihapus Berdasarkan ID",
      statusCode: 200,
    });
  }
  public async DeleteSessionAll(): Promise<TResponse<Session[]>> {
    const res = await DeleteResponse<Session[]>(SESSION_ENDPOINT.DELETEALL);
    return toServiceResponse(res, {
      message: "Session berhasil dihapus semua",
      statusCode: 200,
    });
  }
}

export default new SessionService();
