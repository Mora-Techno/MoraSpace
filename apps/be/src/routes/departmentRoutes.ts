import Elysia from "elysia";
import DepartmentController from "@/controllers/DepartmentController";
import {
  CreateDepartmentDto,
  DepartmentParamsDto,
  UpdateDepartmentDto,
} from "@/dto/department.dto";
import { AppContext } from "@/contex";
import { verifyToken } from "@/middlewares/auth";

class DepartmentRouter {
  public departmentRouter;

  constructor() {
    this.departmentRouter = new Elysia({
      prefix: "/departments",
      tags: ["Departments"],
    });
    this.routes();
  }

  private routes() {
    this.departmentRouter.get(
      "/",
      (c: AppContext) => DepartmentController.list(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Daftar departemen",
          description: "Menampilkan semua departemen di perusahaan.",
          tags: ["Departments"],
        },
      },
    );
    this.departmentRouter.post(
      "/",
      (c: AppContext) => DepartmentController.create(c),
      {
        body: CreateDepartmentDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Buat departemen",
          description: "Membuat departemen baru di perusahaan.",
          tags: ["Departments"],
        },
      },
    );
    this.departmentRouter.get(
      "/:id",
      (c: AppContext) => DepartmentController.getById(c),
      {
        params: DepartmentParamsDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Detail departemen",
          description: "Melihat detail departemen beserta manajer dan tim di dalamnya.",
          tags: ["Departments"],
        },
      },
    );
    this.departmentRouter.patch(
      "/:id",
      (c: AppContext) => DepartmentController.update(c),
      {
        params: DepartmentParamsDto,
        body: UpdateDepartmentDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Perbarui departemen",
          description: "Mengubah nama, deskripsi, atau manajer departemen.",
          tags: ["Departments"],
        },
      },
    );
    this.departmentRouter.delete(
      "/:id",
      (c: AppContext) => DepartmentController.remove(c),
      {
        params: DepartmentParamsDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Hapus departemen",
          description: "Menghapus departemen dari perusahaan.",
          tags: ["Departments"],
        },
      },
    );
  }
}

export default new DepartmentRouter().departmentRouter;
