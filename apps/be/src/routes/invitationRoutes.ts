import Elysia from "elysia";
import InvitationController from "@/controllers/InvitationController";
import {
  AcceptInvitationDto,
  CreateInvitationDto,
  InvitationParamsDto,
  InvitationQueryDto,
  RejectInvitationDto,
} from "@/dto/invitation.dto";
import type { AppContext } from "@/contex";
import { verifyToken } from "@/middlewares/auth";

class InvitationRouter {
  public invitationRouter;

  constructor() {
    this.invitationRouter = new Elysia({
      prefix: "/invitations",
      tags: ["Invitations"],
    });
    this.routes();
  }

  private routes() {
    this.invitationRouter.get(
      "/",
      (c: AppContext) => InvitationController.list(c),
      {
        query: InvitationQueryDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Daftar undangan",
          description:
            "Menampilkan semua undangan yang dikirim oleh perusahaan.",
          tags: ["Invitations"],
        },
      },
    );
    this.invitationRouter.post(
      "/",
      (c: AppContext) => InvitationController.create(c),
      {
        body: CreateInvitationDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Buat undangan",
          description:
            "Mengirim undangan ke alamat email untuk bergabung ke perusahaan.",
          tags: ["Invitations"],
        },
      },
    );
    this.invitationRouter.post(
      "/accept",
      (c: AppContext) => InvitationController.accept(c),
      {
        body: AcceptInvitationDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Terima undangan",
          description:
            "Menerima undangan menggunakan token dan bergabung ke perusahaan.",
          tags: ["Invitations"],
        },
      },
    );
    this.invitationRouter.post(
      "/reject",
      (c: AppContext) => InvitationController.reject(c),
      {
        body: RejectInvitationDto,
        detail: {
          summary: "Tolak undangan",
          description: "Menolak undangan yang diterima.",
          tags: ["Invitations"],
        },
      },
    );
    this.invitationRouter.delete(
      "/:id",
      (c: AppContext) => InvitationController.remove(c),
      {
        params: InvitationParamsDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Batalkan undangan",
          description:
            "Menghapus atau membatalkan undangan yang belum diterima.",
          tags: ["Invitations"],
        },
      },
    );
  }
}

export default new InvitationRouter().invitationRouter;
