import Elysia from "elysia";
import CompanyController from "@/controllers/CompanyController";
import {
  CreateAdminDto,
  RegisterCompanyDto,
  UpdateSubscriptionDto,
} from "@/dto/company.dto";
import { AppContext } from "@/contex";
import { verifyToken, requireRole } from "@/middlewares/auth";

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
        beforeHandle: [verifyToken().beforeHandle],
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
    this.companyRouter.get(
      "/admins",
      (c: AppContext) => CompanyController.listAdmins(c),
      {
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
