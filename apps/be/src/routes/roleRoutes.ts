import Elysia from "elysia";
import RoleController from "@/controllers/RoleController";
import {
  CreateRoleDto,
  PermissionQueryDto,
  RoleParamsDto,
  RoleQueryDto,
  UpdateRoleDto,
  UpdateRolePermissionsDto,
} from "@/dto/role.dto";
import type { AppContext } from "@/contex";
import { verifyToken } from "@/middlewares/auth";

class RoleRouter {
  public roleRouter;

  constructor() {
    this.roleRouter = new Elysia({
      prefix: "/roles",
      tags: ["Roles & Permissions"],
    });
    this.routes();
  }

  private routes() {
    this.roleRouter.get("/", (c: AppContext) => RoleController.listRoles(c), {
      query: RoleQueryDto,
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: "Daftar role",
        description: "Menampilkan semua peran (role) di perusahaan.",
        tags: ["Roles & Permissions"],
      },
    });
    this.roleRouter.post("/", (c: AppContext) => RoleController.createRole(c), {
      body: CreateRoleDto,
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: "Buat role kustom",
        description: "Membuat peran kustom baru di perusahaan.",
        tags: ["Roles & Permissions"],
      },
    });
    this.roleRouter.patch(
      "/:id",
      (c: AppContext) => RoleController.updateRole(c),
      {
        params: RoleParamsDto,
        body: UpdateRoleDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Perbarui role",
          description: "Mengubah nama atau deskripsi peran.",
          tags: ["Roles & Permissions"],
        },
      },
    );
    this.roleRouter.delete(
      "/:id",
      (c: AppContext) => RoleController.removeRole(c),
      {
        params: RoleParamsDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Hapus role",
          description: "Menghapus peran kustom dari perusahaan.",
          tags: ["Roles & Permissions"],
        },
      },
    );
    this.roleRouter.get(
      "/:id/permissions",
      (c: AppContext) => RoleController.getRolePermissions(c),
      {
        params: RoleParamsDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Daftar permission role",
          description:
            "Menampilkan semua hak akses sistem yang dipetakan pada peran ini.",
          tags: ["Roles & Permissions"],
        },
      },
    );
    this.roleRouter.put(
      "/:id/permissions",
      (c: AppContext) => RoleController.updateRolePermissions(c),
      {
        params: RoleParamsDto,
        body: UpdateRolePermissionsDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Perbarui pemetaan permission",
          description: "Mengganti seluruh pemetaan hak akses pada peran ini.",
          tags: ["Roles & Permissions"],
        },
      },
    );
    this.roleRouter.get(
      "/permissions",
      (c: AppContext) => RoleController.listMasterPermissions(c),
      {
        query: PermissionQueryDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Daftar permission master",
          description:
            "Menampilkan semua permission master yang tersedia di sistem.",
          tags: ["Roles & Permissions"],
        },
      },
    );
  }
}

export default new RoleRouter().roleRouter;
