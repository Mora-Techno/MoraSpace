import Elysia from "elysia";
import SettingsController from "@/controllers/SettingsController";
import { TestEmailDto, UpdateSettingsDto } from "@/dto/settings.dto";
import type { AppContext } from "@/contex";
import { verifyToken } from "@/middlewares/auth";

class SettingsRouter {
  public settingsRouter;

  constructor() {
    this.settingsRouter = new Elysia({
      prefix: "/settings",
      tags: ["Settings"],
    });
    this.routes();
  }

  private routes() {
    this.settingsRouter.get("/", (c: AppContext) => SettingsController.get(c), {
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: "Ambil pengaturan user",
        description:
          "Mengambil pengaturan milik company member yang sedang login.",
        tags: ["Settings"],
      },
    });

    this.settingsRouter.patch(
      "/",
      (c: AppContext) => SettingsController.update(c),
      {
        body: UpdateSettingsDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Perbarui pengaturan user",
          description:
            "Memperbarui pengaturan (tema, bahasa, timezone, musik, fokus, notifikasi) milik user yang sedang login.",
          tags: ["Settings"],
        },
      },
    );
    this.settingsRouter.post(
      "/send-mailer",
      (c: AppContext) => SettingsController.TestingEmail(c),
      {
        body: TestEmailDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Testing Send mail",
          description: "Mengirim Email Testing Ke User",
          tags: ["Settings"],
        },
      },
    );
  }
}

export default new SettingsRouter().settingsRouter;
