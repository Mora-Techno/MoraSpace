import Elysia from "elysia";
import MemberController from "@/controllers/MemberController";
import {
  MemberParamsDto,
  UpdateMemberContactsDto,
  UpdateMemberDto,
  UpdateMemberProfileDto,
} from "@/dto/member.dto";
import { AppContext } from "@/contex";
import { verifyToken } from "@/middlewares/auth";

class MemberRouter {
  public memberRouter;

  constructor() {
    this.memberRouter = new Elysia({
      prefix: "/members",
      tags: ["Company Members"],
    });
    this.routes();
  }

  private routes() {
    this.memberRouter.get(
      "/",
      (c: AppContext) => MemberController.list(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Daftar anggota perusahaan",
          description: "Menampilkan semua anggota di perusahaan.",
          tags: ["Company Members"],
        },
      },
    );
    this.memberRouter.get(
      "/:id",
      (c: AppContext) => MemberController.getById(c),
      {
        params: MemberParamsDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Detail anggota",
          description: "Melihat informasi lengkap anggota perusahaan.",
          tags: ["Company Members"],
        },
      },
    );
    this.memberRouter.patch(
      "/:id",
      (c: AppContext) => MemberController.update(c),
      {
        params: MemberParamsDto,
        body: UpdateMemberDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Perbarui data kepegawaian",
          description: "Mengubah kode karyawan, jabatan, tipe kepegawaian, atau status.",
          tags: ["Company Members"],
        },
      },
    );
    this.memberRouter.delete(
      "/:id",
      (c: AppContext) => MemberController.remove(c),
      {
        params: MemberParamsDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Hapus anggota",
          description: "Menghapus anggota dari perusahaan.",
          tags: ["Company Members"],
        },
      },
    );
    this.memberRouter.get(
      "/:id/profile",
      (c: AppContext) => MemberController.getProfile(c),
      {
        params: MemberParamsDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Profil pribadi anggota",
          description: "Mengambil data biodata (gender, birthday, address, dll) anggota.",
          tags: ["Company Members"],
        },
      },
    );
    this.memberRouter.patch(
      "/:id/profile",
      (c: AppContext) => MemberController.updateProfile(c),
      {
        params: MemberParamsDto,
        body: UpdateMemberProfileDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Perbarui profil anggota",
          description: "Mengubah data biodata pribadi anggota.",
          tags: ["Company Members"],
        },
      },
    );
    this.memberRouter.get(
      "/:id/contact",
      (c: AppContext) => MemberController.getContacts(c),
      {
        params: MemberParamsDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Daftar kontak anggota",
          description: "Mengambil semua daftar kontak anggota.",
          tags: ["Company Members"],
        },
      },
    );
    this.memberRouter.patch(
      "/:id/contact",
      (c: AppContext) => MemberController.updateContacts(c),
      {
        params: MemberParamsDto,
        body: UpdateMemberContactsDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Perbarui kontak anggota",
          description: "Mengganti atau memperbarui daftar kontak anggota.",
          tags: ["Company Members"],
        },
      },
    );
  }
}

export default new MemberRouter().memberRouter;
