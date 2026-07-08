import Elysia from "elysia";
import PositionController from "@/controllers/PositionController";
import {
  CreatePositionDto,
  PositionParamsDto,
  UpdatePositionDto,
} from "@/dto/position.dto";
import { AppContext } from "@/contex";
import { verifyToken } from "@/middlewares/auth";

class PositionRouter {
  public positionRouter;

  constructor() {
    this.positionRouter = new Elysia({
      prefix: "/positions",
      tags: ["Positions"],
    });
    this.routes();
  }

  private routes() {
    this.positionRouter.get(
      "/",
      (c: AppContext) => PositionController.list(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Daftar jabatan",
          description: "Menampilkan semua jabatan di perusahaan.",
          tags: ["Positions"],
        },
      },
    );
    this.positionRouter.post(
      "/",
      (c: AppContext) => PositionController.create(c),
      {
        body: CreatePositionDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Buat jabatan baru",
          description: "Membuat jabatan baru di perusahaan beserta level jabatannya.",
          tags: ["Positions"],
        },
      },
    );
    this.positionRouter.patch(
      "/:id",
      (c: AppContext) => PositionController.update(c),
      {
        params: PositionParamsDto,
        body: UpdatePositionDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Perbarui jabatan",
          description: "Mengubah nama, level, atau deskripsi jabatan.",
          tags: ["Positions"],
        },
      },
    );
    this.positionRouter.delete(
      "/:id",
      (c: AppContext) => PositionController.remove(c),
      {
        params: PositionParamsDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Hapus jabatan",
          description: "Menghapus jabatan dari perusahaan.",
          tags: ["Positions"],
        },
      },
    );
  }
}

export default new PositionRouter().positionRouter;
