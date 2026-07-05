import { AppContext } from "@/contex";
import SessionController from "@/controllers/SessionController";
import { SessionParamsDto } from "@/dto/session.dto";
import { verifyToken } from "@/middlewares/auth";
import Elysia from "elysia";

class SessionRouter {
  public sessionRouter;

  constructor() {
    this.sessionRouter = new Elysia({ prefix: "/session", tags: ["Session"] });
    this.routes();
  }
  private routes() {
    this.sessionRouter.get("/", (c: AppContext) => SessionController.list(c), {
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: "Daftar Semua session",
        description: "Menampilkan history session",
        tags: ["Session"],
      },
    });
    this.sessionRouter.get(
      "/:id",
      (c: AppContext) => SessionController.getById(c),
      {
        params: SessionParamsDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Daftar Session berdasarkan id",
          description: "Menampilkan history session",
          tags: ["Session"],
        },
      },
    );
    this.sessionRouter.delete(
      "/:id",
      (c: AppContext) => SessionController.deleteSessionById(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
        params: SessionParamsDto,
        detail: {
          summary: "Mengapus Session berdasarkan id",
          description: "Menghapus history session berdasarkan id",
          tags: ["Session"],
        },
      },
    );
    this.sessionRouter.delete(
      "/",
      (c: AppContext) => SessionController.deleteSession(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Menghapus Seluruh Session User",
          description: "Menghapus history session seluruh",
          tags: ["Session"],
        },
      },
    );
  }
}

export default new SessionRouter().sessionRouter;
