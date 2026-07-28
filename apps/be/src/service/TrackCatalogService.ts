import prisma from "prisma/client";
import { extractYouTubeVideoId } from "@/utils/youtube.utils";
import NotificationService from "./NotificationService";
import { sendMailMessage, getMailFromAddress } from "@/utils/mail.utils";
import type {
  PickSubmitTrack,
  PickReviewTrack,
} from "@repo/types/trackCatalog.types";

function mapTrack(track: {
  id: string;
  title: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  status: string;
  rejectionReason: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  companyMember?: { user?: { fullName: string } | null } | null;
  user?: { fullName: string } | null;
}) {
  return {
    id: track.id,
    title: track.title,
    youtubeUrl: track.youtubeUrl,
    youtubeVideoId: track.youtubeVideoId,
    status: track.status,
    rejectionReason: track.rejectionReason,
    reviewedAt: track.reviewedAt?.toISOString() ?? null,
    createdAt: track.createdAt.toISOString(),
    updatedAt: track.updatedAt.toISOString(),
    submittedBy:
      track.companyMember?.user?.fullName ?? track.user?.fullName ?? "Unknown",
  };
}

// ─── service ────────────────────────────────────────────────────────────

class TrackCatalogService {
  public async submit(
    companyMemberId: string | null,
    userId: string,
    companyId: string | null,
    input: PickSubmitTrack,
  ) {
    const videoId = extractYouTubeVideoId(input.youtubeUrl);
    if (!videoId) {
      throw new Error("URL YouTube tidak valid");
    }

    // Check duplicity (scoped to company)
    const existing = await prisma.trackCatalog.findFirst({
      where: {
        companyId: companyId ?? null,
        youtubeVideoId: videoId,
      },
      select: { id: true, status: true },
    });

    if (existing) {
      const statusMsg =
        existing.status === "APPROVED"
          ? "sudah disetujui"
          : existing.status === "REJECTED"
            ? "sudah ditolak"
            : "sedang dalam proses review";
      throw new Error(`Lagu ini ${statusMsg} (duplicate)`);
    }

    const data: Record<string, unknown> = {
      title: input.title,
      youtubeUrl: input.youtubeUrl,
      youtubeVideoId: videoId,
      status: "PENDING",
    };
    if (companyId) data.companyId = companyId;
    if (companyMemberId) data.companyMemberId = companyMemberId;
    if (userId) data.userId = userId;

    const track = await prisma.trackCatalog.create({
      data: data as any,
      include: {
        companyMember: { include: { user: true } },
        user: true,
      },
    });

    // ── notification + email ──────────────────────────────────────────
    const submitterName =
      track.companyMember?.user?.fullName ?? track.user?.fullName ?? "Unknown";

    // In-app notification to submitter
    try {
      if (companyMemberId) {
        await prisma.notification.create({
          data: {
            companyId: companyId ?? undefined,
            companyMemberId,
            userId,
            title: "Track Submitted",
            body: `Lagu "${input.title}" berhasil dikirim untuk review.`,
            type: "track_catalog",
          },
        });
      }
    } catch {
      // notification is best-effort
    }

    // Email notification to submitter
    try {
      const userEmail = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });
      if (userEmail) {
        await sendMailMessage({
          to: userEmail.email,
          subject: `[Mora] Track "${input.title}" Submitted`,
          html: `<p>Halo ${submitterName},</p>
<p>Lagu <strong>"${input.title}"</strong> telah berhasil dikirim ke Track Catalog dan sedang menunggu review oleh admin.</p>
<p>Terima kasih!</p>`,
        });
      }
    } catch {
      // email is best-effort
    }

    return mapTrack(track);
  }

  /** List tracks with optional status filter. Users only see APPROVED. */
  public async list(
    companyMemberId: string | null,
    userId: string,
    companyId: string | null,
    query: {
      search?: string;
      status?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {},
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (companyId) where.companyId = companyId;

    // Default: non-admin users only see APPROVED tracks
    if (query.status) {
      where.status = query.status;
    } else {
      where.status = "APPROVED";
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { youtubeVideoId: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const orderBy: Record<string, unknown>[] = [];
    if (query.sortBy) {
      orderBy.push({ [query.sortBy]: query.sortOrder ?? "asc" });
    } else {
      orderBy.push({ createdAt: "desc" });
    }

    const [totalData, data] = await prisma.$transaction([
      prisma.trackCatalog.count({ where: where as any }),
      prisma.trackCatalog.findMany({
        where: where as any,
        orderBy: orderBy as any,
        take: limit,
        skip,
        include: {
          companyMember: { include: { user: true } },
          user: true,
        },
      }),
    ]);

    return {
      data: data.map(mapTrack),
      meta: {
        currentPage: page,
        limit,
        totalData,
        totalPage: Math.ceil(totalData / limit),
      },
    };
  }

  public async listPending(
    companyId: string | null,
    query: {
      search?: string;
      status?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {},
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (companyId) where.companyId = companyId;
    // Default: non-admin users only see PENDING tracks
    if (query.status) {
      where.status = query.status;
    } else {
      where.status = "PENDING";
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { youtubeVideoId: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const orderBy: Record<string, unknown>[] = [];
    if (query.sortBy) {
      orderBy.push({ [query.sortBy]: query.sortOrder ?? "asc" });
    } else {
      orderBy.push({ createdAt: "desc" });
    }

    const [totalData, data] = await prisma.$transaction([
      prisma.trackCatalog.count({ where: where as any }),
      prisma.trackCatalog.findMany({
        where: where as any,
        orderBy: orderBy as any,
        take: limit,
        skip,
        include: {
          companyMember: { include: { user: true } },
          user: true,
        },
      }),
    ]);

    return {
      data: data.map(mapTrack),
      meta: {
        currentPage: page,
        limit,
        totalData,
        totalPage: Math.ceil(totalData / limit),
      },
    };
  }

  /** Get a single track by ID */
  public async getById(id: string) {
    const track = await prisma.trackCatalog.findUnique({
      where: { id },
      include: {
        companyMember: { include: { user: true } },
        user: true,
      },
    });
    if (!track) return null;
    return mapTrack(track);
  }

  /**
   * Developer / Super Admin: approve a pending track.
   * `adminMemberId` / `adminCompanyId` may be null for personal developers.
   * Sends email notification to the submitter.
   */
  public async approve(
    id: string,
    adminMemberId: string | null,
    adminCompanyId: string | null,
    adminUserId: string,
  ) {
    const track = await prisma.trackCatalog.findUnique({
      where: { id },
      include: {
        companyMember: { include: { user: true } },
        user: true,
      },
    });
    if (!track) return null;

    if (track.status !== "PENDING") {
      throw new Error(`Track sudah berstatus "${track.status}"`);
    }

    const updated = await prisma.trackCatalog.update({
      where: { id },
      data: {
        status: "APPROVED",
        reviewedAt: new Date(),
      },
      include: {
        companyMember: { include: { user: true } },
        user: true,
      },
    });

    const submitterUserId = updated.userId;
    const submitterMemberId = updated.companyMemberId;
    const trackTitle = updated.title;

    // In-app notification (company-scoped only)
    try {
      if (submitterMemberId && adminCompanyId) {
        await prisma.notification.create({
          data: {
            companyId: adminCompanyId,
            companyMemberId: submitterMemberId,
            userId: submitterUserId ?? undefined,
            title: "Track Approved",
            body: `Lagu "${trackTitle}" telah disetujui dan sekarang tersedia di katalog.`,
            type: "track_catalog",
          },
        });
      }
    } catch {}

    // Email notification to submitter
    try {
      if (submitterUserId) {
        const user = await prisma.user.findUnique({
          where: { id: submitterUserId },
          select: { email: true, fullName: true },
        });
        if (user) {
          await sendMailMessage({
            to: user.email,
            subject: `[Mora] Track "${trackTitle}" Approved`,
            html: `<p>Halo ${user.fullName},</p>
<p>Lagu <strong>"${trackTitle}"</strong> telah disetujui dan sekarang tersedia untuk diputar di Track Catalog.</p>
<p>Selamat! 🎵</p>`,
          });
        }
      }
    } catch {}

    return mapTrack(updated);
  }

  /**
   * Developer / Super Admin: reject a pending track with optional reason.
   * `adminMemberId` / `adminCompanyId` may be null for personal developers.
   * Sends email notification to the submitter.
   */
  public async reject(
    id: string,
    adminMemberId: string | null,
    adminCompanyId: string | null,
    adminUserId: string,
    input: PickReviewTrack,
  ) {
    const track = await prisma.trackCatalog.findUnique({
      where: { id },
      include: {
        companyMember: { include: { user: true } },
        user: true,
      },
    });
    if (!track) return null;

    if (track.status !== "PENDING") {
      throw new Error(`Track sudah berstatus "${track.status}"`);
    }

    const updated = await prisma.trackCatalog.update({
      where: { id },
      data: {
        status: "REJECTED",
        rejectionReason: input.rejectionReason ?? null,
        reviewedAt: new Date(),
      },
      include: {
        companyMember: { include: { user: true } },
        user: true,
      },
    });

    // ── notification + email to submitter ──────────────────────────────
    const submitterUserId = updated.userId;
    const submitterMemberId = updated.companyMemberId;
    const trackTitle = updated.title;
    const reason = input.rejectionReason
      ? `\nAlasan: ${input.rejectionReason}`
      : "";

    // In-app notification (company-scoped only)
    try {
      if (submitterMemberId && adminCompanyId) {
        await prisma.notification.create({
          data: {
            companyId: adminCompanyId,
            companyMemberId: submitterMemberId,
            userId: submitterUserId ?? undefined,
            title: "Track Rejected",
            body: `Lagu "${trackTitle}" ditolak.${reason}`,
            type: "track_catalog",
          },
        });
      }
    } catch {
      // best-effort
    }

    // Email notification to submitter
    try {
      const targetUserId = submitterUserId ?? adminUserId;
      if (targetUserId) {
        const user = await prisma.user.findUnique({
          where: { id: targetUserId },
          select: { email: true, fullName: true },
        });
        if (user) {
          await sendMailMessage({
            to: user.email,
            subject: `[Mora] Track "${trackTitle}" Rejected`,
            html: `<p>Halo ${user.fullName},</p>
<p>Lagu <strong>"${trackTitle}"</strong> telah ditolak.</p>
${reason ? `<p>Alasan: <em>${input.rejectionReason}</em></p>` : ""}
<p>Anda dapat mengirim ulang track lainnya kapan saja.</p>`,
          });
        }
      }
    } catch {
      // best-effort
    }

    return mapTrack(updated);
  }

  /** Delete a track catalog entry (owner or admin) */
  public async remove(
    id: string,
    companyMemberId: string | null,
    userId: string,
    companyId: string | null,
  ) {
    const where: Record<string, unknown> = { id };
    if (companyId) where.companyId = companyId;

    const existing = await prisma.trackCatalog.findFirst({
      where: where as any,
    });
    if (!existing) return null;

    await prisma.trackCatalog.delete({ where: { id } });
    return { id: existing.id, title: existing.title };
  }
}

export default new TrackCatalogService();
