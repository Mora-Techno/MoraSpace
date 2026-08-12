import Elysia from "elysia";
import CompanyController from "@/controllers/CompanyController";
import {
  CompanyParamsDto,
  CompanyQueryDto,
  CreateAdminDto,
  RegisterCompanyDto,
  UpdateCompanyProfileDto,
  UpdateSubscriptionDto,
} from "@/dto/company.dto";
import type { AppContext } from "@/contex";
import { verifyToken } from "@/middlewares/auth";

class CompanyRouter {
  public companyRouter;

  constructor() {
    this.companyRouter = new Elysia({
      prefix: "/companies",
      tags: ["Companies"],
    });
    this.routes();
  }

  private routes() {
    this.companyRouter.post(
      "/register",
      (c: AppContext) => CompanyController.register(c),
      {
        body: RegisterCompanyDto,

        detail: {
          summary: "Daftar company + leader",
          description:
            "Membuat company baru beserta akun leader. Tier default: free (max 4 user/workstation).",
          tags: ["Companies"],
        },
      },
    );

    this.companyRouter.post(
      "/admins",
      (c: AppContext) => CompanyController.createAdmin(c),
      {
        body: CreateAdminDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Buat akun admin",
          description: "Leader membuat akun admin untuk mengelola workstation.",
          tags: ["Companies"],
        },
      },
    );
    this.companyRouter.delete(
      "/admins/:id",
      (c: AppContext) => CompanyController.deleteAdmin(c),
      {
        params: CompanyParamsDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Berhasil Delete",
          description: "Leader menghapus admin",
          tags: ["Companies"],
        },
      },
    );
    this.companyRouter.get(
      "/admins",
      (c: AppContext) => CompanyController.listAdmins(c),
      {
        query: CompanyQueryDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Daftar admin company",
          tags: ["Companies"],
        },
      },
    );
    this.companyRouter.get(
      "/me",
      (c: AppContext) => CompanyController.getProfile(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Profil company saat ini",
          tags: ["Companies"],
        },
      },
    );
    this.companyRouter.patch(
      "/profile",
      (c: AppContext) => CompanyController.updateProfile(c),
      {
        body: UpdateCompanyProfileDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Update logo & country perusahaan",
          description: "Memperbarui logo URL dan/atau negara perusahaan.",
          tags: ["Companies"],
        },
      },
    );
    this.companyRouter.patch(
      "/subscription",
      (c: AppContext) => CompanyController.updateSubscription(c),
      {
        body: UpdateSubscriptionDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Upgrade/downgrade langganan",
          description:
            "Leader mengubah tier (free/pro/enterprise). Pro = max 8 user/workstation.",
          tags: ["Companies"],
        },
      },
    );
  }
}

export default new CompanyRouter().companyRouter;
