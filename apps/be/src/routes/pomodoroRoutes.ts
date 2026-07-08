import Elysia from "elysia";
import PomodoroController from "@/controllers/PomodoroController";
import { StartPomodoroDto, StopPomodoroDto } from "@/dto/pomodoro.dto";
import { AppContext } from "@/contex";
import { verifyToken } from "@/middlewares/auth";

class PomodoroRouter {
  public pomodoroRouter;

  constructor() {
    this.pomodoroRouter = new Elysia({
      prefix: "/pomodoro",
      tags: ["Pomodoro & Focus"],
    });
    this.routes();
  }

  private routes() {
    this.pomodoroRouter.post(
      "/start",
      (c: AppContext) => PomodoroController.start(c),
      {
        body: StartPomodoroDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Mulai sesi pomodoro",
          description: "Memulai sesi timer fokus baru.",
          tags: ["Pomodoro & Focus"],
        },
      },
    );
    this.pomodoroRouter.post(
      "/pause",
      (c: AppContext) => PomodoroController.pause(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Jeda sesi pomodoro",
          description: "Menjeda sesi timer fokus yang sedang berjalan.",
          tags: ["Pomodoro & Focus"],
        },
      },
    );
    this.pomodoroRouter.post(
      "/resume",
      (c: AppContext) => PomodoroController.resume(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Lanjutkan sesi pomodoro",
          description: "Melanjutkan sesi timer fokus.",
          tags: ["Pomodoro & Focus"],
        },
      },
    );
    this.pomodoroRouter.post(
      "/stop",
      (c: AppContext) => PomodoroController.stop(c),
      {
        body: StopPomodoroDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Hentikan sesi pomodoro",
          description: "Mengakhiri dan mencatat durasi fokus sesi pomodoro.",
          tags: ["Pomodoro & Focus"],
        },
      },
    );
    this.pomodoroRouter.get(
      "/today",
      (c: AppContext) => PomodoroController.getToday(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Statistik fokus hari ini",
          description: "Melihat total durasi dan daftar sesi fokus yang dilakukan hari ini.",
          tags: ["Pomodoro & Focus"],
        },
      },
    );
    this.pomodoroRouter.get(
      "/statistics",
      (c: AppContext) => PomodoroController.getStatistics(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Statistik keseluruhan fokus",
          description: "Melihat ringkasan total durasi dan jumlah sesi fokus yang pernah dilakukan.",
          tags: ["Pomodoro & Focus"],
        },
      },
    );
  }
}

export default new PomodoroRouter().pomodoroRouter;
