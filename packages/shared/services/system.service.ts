import { SYSTEM_ENDPOINTS } from "../endpoints";
import type { TResponse } from "../types/response.types";
import { GetResponse } from "./http";
import { toServiceResponse } from "./service-response";

class SystemService {
  public async Ping(): Promise<TResponse<{ pinged: boolean }>> {
    const res = await GetResponse<{ pinged: boolean }>(SYSTEM_ENDPOINTS.PING);
    return toServiceResponse(res, { message: "Ping result" });
  }
}

export default new SystemService();
