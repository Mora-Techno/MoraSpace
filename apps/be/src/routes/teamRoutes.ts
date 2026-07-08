import Elysia from "elysia";
import TeamController from "@/controllers/TeamController";
import {
  AddTeamMemberDto,
  CreateTeamDto,
  TeamMemberParamsDto,
  TeamParamsDto,
  TeamQueryDto,
  UpdateTeamDto,
} from "@/dto/team.dto";
import { AppContext } from "@/contex";
import { verifyToken } from "@/middlewares/auth";

class TeamRouter {
  public teamRouter;

  constructor() {
    this.teamRouter = new Elysia({
      prefix: "/teams",
      tags: ["Teams"],
    });
    this.routes();
  }

  private routes() {
    this.teamRouter.get(
      "/",
      (c: AppContext) => TeamController.list(c),
      {
        query: TeamQueryDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Daftar tim",
          description: "Menampilkan semua tim di perusahaan atau filter berdasarkan departemen.",
          tags: ["Teams"],
        },
      },
    );
    this.teamRouter.post(
      "/",
      (c: AppContext) => TeamController.create(c),
      {
        body: CreateTeamDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Buat tim baru",
          description: "Membuat tim baru di dalam suatu departemen.",
          tags: ["Teams"],
        },
      },
    );
    this.teamRouter.patch(
      "/:id",
      (c: AppContext) => TeamController.update(c),
      {
        params: TeamParamsDto,
        body: UpdateTeamDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Perbarui tim",
          description: "Mengubah nama, deskripsi, atau leader tim.",
          tags: ["Teams"],
        },
      },
    );
    this.teamRouter.delete(
      "/:id",
      (c: AppContext) => TeamController.remove(c),
      {
        params: TeamParamsDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Hapus tim",
          description: "Menghapus tim dari departemen.",
          tags: ["Teams"],
        },
      },
    );
    this.teamRouter.get(
      "/:id/members",
      (c: AppContext) => TeamController.listMembers(c),
      {
        params: TeamParamsDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Daftar anggota tim",
          description: "Menampilkan semua anggota yang terdaftar dalam tim.",
          tags: ["Teams"],
        },
      },
    );
    this.teamRouter.post(
      "/:id/members",
      (c: AppContext) => TeamController.addMember(c),
      {
        params: TeamParamsDto,
        body: AddTeamMemberDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Tambah anggota tim",
          description: "Menambahkan anggota ke dalam tim atau mengatur status leader.",
          tags: ["Teams"],
        },
      },
    );
    this.teamRouter.delete(
      "/:id/members/:memberId",
      (c: AppContext) => TeamController.removeMember(c),
      {
        params: TeamMemberParamsDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Hapus anggota tim",
          description: "Menghapus anggota dari tim.",
          tags: ["Teams"],
        },
      },
    );
  }
}

export default new TeamRouter().teamRouter;
