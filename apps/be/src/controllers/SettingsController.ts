import type { AppContext } from "@/contex";
import { HttpResponse } from "@/http";
import SettingsService from "@/service/SettingsService";
import { getUser } from "@/utils/authTokens";
import { personalContextValidate } from "@/validation/auth.validate";
import type { PickUpdateSettings } from "@repo/types/settings.types";

class SettingsController {
  public async get(c: AppContext) {
    try {
      const user = getUser(c);

      const authResponse = await personalContextValidate(user, c);
      if (authResponse) return authResponse;

      const companyMemberId = user.companyMemberId;
      if (!companyMemberId) {
        return HttpResponse(c).badRequest(
          "Konteks anggota company tidak ditemukan",
        );
      }

      const settings =
        await SettingsService.getByCompanyMember(companyMemberId);
      if (!settings) {
        return HttpResponse(c).notFound("Pengaturan tidak ditemukan");
      }

      return HttpResponse(c).ok(
        settings,
        undefined,
        "Pengaturan berhasil diambil",
      );
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async update(c: AppContext) {
    try {
      const user = getUser(c);
      const input = c.body as PickUpdateSettings;

      const authResponse = await personalContextValidate(user, c);
      if (authResponse) return authResponse;

      const companyMemberId = user.companyMemberId;
      if (!companyMemberId) {
        return HttpResponse(c).badRequest(
          "Konteks anggota company tidak ditemukan",
        );
      }

      const settings = await SettingsService.update(companyMemberId, input);
      if (!settings) {
        return HttpResponse(c).badRequest();
      }

      return HttpResponse(c).ok(
        settings,
        undefined,
        "Pengaturan berhasil diperbarui",
      );
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
}

export default new SettingsController();
