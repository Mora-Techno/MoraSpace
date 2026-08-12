import { SETTINGS_ENDPOINTS } from "../endpoints/settings.endpoints";
import type { TResponse } from "../types/response.types";
import type {
  PickUpdateSettings,
  Settings,
  TestEmail,
} from "../types/settings.types";
import { GetResponse, PatchResponse, PostResponse } from "./http";
import { toServiceResponse } from "./service-response";
class SettingsService {
  public async GetSettings(): Promise<TResponse<Settings>> {
    const res = await GetResponse<Settings>(SETTINGS_ENDPOINTS.GET);
    return toServiceResponse(res, {
      message: "Pengaturan berhasil diambil",
    });
  }
  public async UpdateSettings(
    payload: PickUpdateSettings,
  ): Promise<TResponse<Settings>> {
    const res = await PatchResponse<Settings>(
      SETTINGS_ENDPOINTS.UPDATE,
      payload,
    );
    return toServiceResponse(res, {
      message: "Pengaturan berhasil diperbarui",
    });
  }
  public async TestingEmail(
    payload: TestEmail,
  ): Promise<TResponse<{ email: string }>> {
    const res = await PostResponse<{ email: string }>(
      SETTINGS_ENDPOINTS.SEND_EMAIL,
      payload,
    );
    return toServiceResponse(res, {
      message: "Testing Email Berhasil Dilakukan",
    });
  }
}
export default new SettingsService();
