import prisma from "prisma/client";
import type { PickUpdateSettings } from "@repo/types/settings.types";

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
  public async getByCompanyMember(companyMemberId: string) {
    let settings = await prisma.userSetting.findUnique({
      where: { companyMemberId },
    });

    if (!settings) {
      settings = await prisma.userSetting.create({
        data: { companyMemberId },
      });
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
}

export default new SettingsService();
