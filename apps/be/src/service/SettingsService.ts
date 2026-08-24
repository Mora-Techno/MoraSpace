import prisma from "prisma/client";
import type { PickUpdateSettings, TestEmail } from "@repo/types/settings.types";
import NotificationService from "./NotificationService";
function mapSettings(settings: {
  id: string;
  theme: string | null;
  language: string | null;
  timezone: string | null;
  enableMusic: boolean;
  focusMode: boolean;
  notificationEnabled: boolean;
}) {
  return {
    id: settings.id,
    theme: settings.theme,
    language: settings.language,
    timezone: settings.timezone,
    enableMusic: settings.enableMusic,
    focusMode: settings.focusMode,
    notificationEnabled: settings.notificationEnabled,
  };
}

class SettingsService {
  public async getByCompanyMember(
    companyMemberId: string | null,
    userId: string,
  ) {
    const where: Record<string, unknown> = companyMemberId
      ? { companyMemberId }
      : { userId };

    let settings = await prisma.userSetting.findFirst({
      where: where as any,
    });

    if (!settings) {
      return null;
    }

    return mapSettings(settings);
  }

  public async update(companyMemberId: string, payload: PickUpdateSettings) {
    const existing = await prisma.userSetting.findUnique({
      where: { companyMemberId },
    });

    if (!existing) {
      const settings = await prisma.userSetting.create({
        data: {
          companyMemberId,
          theme: payload.theme ?? null,
          language: payload.language ?? null,
          timezone: payload.timezone ?? null,
          enableMusic: payload.enableMusic ?? false,
          focusMode: payload.focusMode ?? false,
          notificationEnabled: payload.notificationEnabled ?? true,
        },
      });
      return mapSettings(settings);
    }

    const settings = await prisma.userSetting.update({
      where: { companyMemberId },
      data: {
        ...(payload.theme !== undefined ? { theme: payload.theme } : {}),
        ...(payload.language !== undefined
          ? { language: payload.language }
          : {}),
        ...(payload.timezone !== undefined
          ? { timezone: payload.timezone }
          : {}),
        ...(payload.enableMusic !== undefined
          ? { enableMusic: payload.enableMusic }
          : {}),
        ...(payload.focusMode !== undefined
          ? { focusMode: payload.focusMode }
          : {}),
        ...(payload.notificationEnabled !== undefined
          ? { notificationEnabled: payload.notificationEnabled }
          : {}),
      },
    });

    return mapSettings(settings);
  }
  public async TestEmail(payload: TestEmail) {
    const sender = await NotificationService.send({
      body: "Halo,\n\nIni adalah email uji coba (test email) dari sistem. Jika Anda menerima email ini, berarti fitur pengiriman email untuk akun Anda telah berfungsi dengan baik.\n\nAnda tidak perlu membalas email ini.\n\nTerima kasih,\nTim Support",
      recipient: payload.email,
      subject: "Tester Email Akun",
    });
    return sender;
  }
}

export default new SettingsService();
