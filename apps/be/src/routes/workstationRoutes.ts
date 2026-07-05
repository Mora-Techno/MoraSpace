import Elysia from "elysia";
import WorkstationController from "@/controllers/WorkstationController";
import { AppContext } from "@/contex";
import {
  CreateWorkstationDto,
  InviteMemberDto,
  MemberParamsDto,
  UpdateWorkstationDto,
  WorkstationParamsDto,
} from "@/dto/workstation.dto";
import { verifyToken } from "@/middlewares/auth";

class WorkstationRouter {
  public workstationRouter;

  constructor() {
    this.workstationRouter = new Elysia({
      prefix: "/workstations",
      tags: ["Workstations"],
    });
    this.routes();
  }

  private routes() {
    this.workstationRouter.get(
      "/",
      (c: AppContext) => WorkstationController.list(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Daftar workstation",
          description: "Leader/Admin melihat semua workstation di company.",
          tags: ["Workstations"],
        },
      },
    );
    this.workstationRouter.post(
      "/",
      (c: AppContext) => WorkstationController.create(c),
      {
        body: CreateWorkstationDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Buat workstation baru",
          tags: ["Workstations"],
        },
      },
    );
    this.workstationRouter.get(
      "/:id",
      (c: AppContext) => WorkstationController.getById(c),
      {
        params: WorkstationParamsDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Detail workstation + anggota",
          tags: ["Workstations"],
        },
      },
    );
    this.workstationRouter.patch(
      "/:id",
      (c: AppContext) => WorkstationController.update(c),
      {
        params: WorkstationParamsDto,
        body: UpdateWorkstationDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Perbarui workstation",
          tags: ["Workstations"],
        },
      },
    );
    this.workstationRouter.delete(
      "/:id",
      (c: AppContext) => WorkstationController.remove(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
        params: WorkstationParamsDto,
        detail: {
          summary: "Hapus workstation",
          tags: ["Workstations"],
        },
      },
    );
    this.workstationRouter.post(
      "/:id/members",
      (c: AppContext) => WorkstationController.inviteMember(c),
      {
        params: WorkstationParamsDto,
        body: InviteMemberDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Invite karyawan ke workstation",
          description:
            "Menambah anggota ke workstation. Batas: 4 (free) / 8 (pro) / 16 (enterprise).",
          tags: ["Workstations"],
        },
      },
    );
    this.workstationRouter.delete(
      "/:id/members/:userId",
      (c: AppContext) => WorkstationController.removeMember(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
        params: MemberParamsDto,
        detail: {
          summary: "Hapus anggota dari workstation",
          tags: ["Workstations"],
        },
      },
    );
  }
}

export default new WorkstationRouter().workstationRouter;
