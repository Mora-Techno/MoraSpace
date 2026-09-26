import prisma from "prisma/client";
import { logger } from "@/utils/logger.utils";

/**
 * Worker background untuk memproses antrean notifikasi (working-hours queue).
 * Mengeksekusi pesan yang dijadwalkan ketika jam kerja perusahaan aktif atau saat scheduledAt telah tercapai.
 */
export async function processNotificationQueue() {
  const now = new Date();

  try {
    const pendingItems = await prisma.notificationQueue.findMany({
      where: {
        status: "pending",
        scheduledAt: { lte: now },
      },
      include: {
        notification: {
          include: {
            company: {
              include: {
                settings: true,
                policies: true,
              },
            },
          },
        },
      },
      take: 20,
    });

    if (pendingItems.length === 0) return 0;

    logger.info(`[Queue Worker] Memproses ${pendingItems.length} antrean notifikasi...`);

    for (const item of pendingItems) {
      try {
        await prisma.notificationQueue.update({
          where: { id: item.id },
          data: {
            status: "processed",
            processedAt: new Date(),
          },
        });
      } catch (itemError) {
        logger.error({ err: itemError }, `[Queue Worker] Gagal memproses item antrean ${item.id}`);
        await prisma.notificationQueue.update({
          where: { id: item.id },
          data: {
            retryCount: { increment: 1 },
            status: item.retryCount >= 3 ? "failed" : "pending",
          },
        });
      }
    }

    return pendingItems.length;
  } catch (error) {
    logger.error({ err: error }, "[Queue Worker] Error saat membaca antrean notifikasi");
    return 0;
  }
}

let queueInterval: NodeJS.Timeout | null = null;

export function startNotificationQueueRunner(intervalMs = 60000) {
  if (queueInterval) return;

  logger.info("[Queue Worker] Notification Queue Runner aktif (interval: 60s).");
  queueInterval = setInterval(() => {
    void processNotificationQueue();
  }, intervalMs);
}

export function stopNotificationQueueRunner() {
  if (queueInterval) {
    clearInterval(queueInterval);
    queueInterval = null;
    logger.info("[Queue Worker] Notification Queue Runner dihentikan.");
  }
}
