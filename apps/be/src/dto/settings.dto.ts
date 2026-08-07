import { t } from "elysia";

export const UpdateSettingsDto = t.Object({
  theme: t.Optional(
    t.String({ description: "Tema aplikasi (light/dark/system)" }),
  ),
  language: t.Optional(t.String({ description: "Bahasa aplikasi (en/id)" })),
  timezone: t.Optional(t.String({ description: "Zona waktu user" })),
  enableMusic: t.Optional(t.Boolean({ description: "Aktifkan musik" })),
  focusMode: t.Optional(t.Boolean({ description: "Aktifkan mode fokus" })),
  notificationEnabled: t.Optional(
    t.Boolean({ description: "Aktifkan notifikasi" }),
  ),
});

export const TestEmailDto = t.Object({
  email: t.String({ description: "Email Wajib Diisi" }),
});
