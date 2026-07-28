import Elysia from "elysia";
import TrackCatalogController from "@/controllers/TrackCatalogController";
import {
  SubmitTrackDto,
  ReviewTrackDto,
  TrackCatalogQueryDto,
  TrackCatalogParamsDto,
} from "@/dto/trackCatalog.dto";
import type { AppContext } from "@/contex";
import { verifyToken } from "@/middlewares/auth";

class TrackCatalogRouter {
  public trackCatalogRouter;

  constructor() {
    this.trackCatalogRouter = new Elysia({
      prefix: "/music/tracks",
      tags: ["Track Catalog"],
    });
    this.routes();
  }

  private routes() {
    this.trackCatalogRouter.get(
      "/",
      (c: AppContext) => TrackCatalogController.list(c),
      {
        query: TrackCatalogQueryDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Daftar track katalog",
          description:
            "Mengambil daftar track yang tersedia. Default hanya menampilkan track APPROVED.",
          tags: ["Track Catalog"],
        },
      },
    );

    this.trackCatalogRouter.get(
      "/pending",
      (c: AppContext) => TrackCatalogController.listPending(c),
      {
        query: TrackCatalogQueryDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Daftar track katalog",
          description:
            "Mengambil daftar track yang tersedia. Default hanya menampilkan track PENDING.",
          tags: ["Track Catalog"],
        },
      },
    );

    this.trackCatalogRouter.get(
      "/:id",
      (c: AppContext) => TrackCatalogController.getById(c),
      {
        params: TrackCatalogParamsDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Detail track",
          description: "Mengambil detail satu track berdasarkan ID.",
          tags: ["Track Catalog"],
        },
      },
    );

    // ── Submit a new track ──────────────────────────────────────────
    this.trackCatalogRouter.post(
      "/",
      (c: AppContext) => TrackCatalogController.submit(c),
      {
        body: SubmitTrackDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Kirim track untuk review",
          description:
            "Mengirimkan lagu baru ke Track Catalog dengan status PENDING. Akan dicek duplikasi berdasarkan YouTube Video ID.",
          tags: ["Track Catalog"],
        },
      },
    );

    // ── Admin: approve ──────────────────────────────────────────────
    this.trackCatalogRouter.patch(
      "/:id/approve",
      (c: AppContext) => TrackCatalogController.approve(c),
      {
        params: TrackCatalogParamsDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Setujui track (Admin)",
          description:
            "Admin menyetujui track yang berstatus PENDING. Notifikasi + email dikirim ke submitter.",
          tags: ["Track Catalog"],
        },
      },
    );

    // ── Admin: reject ───────────────────────────────────────────────
    this.trackCatalogRouter.patch(
      "/:id/reject",
      (c: AppContext) => TrackCatalogController.reject(c),
      {
        params: TrackCatalogParamsDto,
        body: ReviewTrackDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Tolak track (Admin)",
          description:
            "Admin menolak track yang berstatus PENDING dengan alasan opsional. Notifikasi + email dikirim ke submitter.",
          tags: ["Track Catalog"],
        },
      },
    );

    // ── Delete a track ──────────────────────────────────────────────
    this.trackCatalogRouter.delete(
      "/:id",
      (c: AppContext) => TrackCatalogController.remove(c),
      {
        params: TrackCatalogParamsDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: "Hapus track",
          description: "Menghapus entry track dari katalog.",
          tags: ["Track Catalog"],
        },
      },
    );
  }
}

export default new TrackCatalogRouter().trackCatalogRouter;
