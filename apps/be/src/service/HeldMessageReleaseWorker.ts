import prisma from 'prisma/client';
import { logger } from '@/utils/logger.utils';
import { broadcastDeliveredMessage } from '@/ws/chat.gateway';

/**
 * Worker periodik untuk merilis pesan chat yang tertahan (held messages)
 * saat jam kerja penerima telah tiba (scheduledDeliverAt <= now).
 */
export async function processHeldMessages(): Promise<number> {
  const now = new Date();

  try {
    const heldMessages = await prisma.message.findMany({
      where: {
        isHeld: true,
        scheduledDeliverAt: { lte: now },
      },
      include: {
        sender: {
          select: { fullName: true },
        },
      },
      take: 50,
    });

    if (heldMessages.length === 0) return 0;

    logger.info(
      `[Held Messages] Merilis ${heldMessages.length} pesan tertahan yang telah mencapai jam kerja...`,
    );

    for (const msg of heldMessages) {
      try {
        const updated = await prisma.message.update({
          where: { id: msg.id },
          data: {
            isHeld: false,
            deliveredAt: now,
          },
          include: {
            sender: { select: { fullName: true } },
          },
        });

        await broadcastDeliveredMessage(msg.conversationId, {
          ...updated,
          senderName: updated.sender.fullName,
        });
      } catch (err) {
        logger.error({ err }, `[Held Messages] Gagal merilis pesan ${msg.id}`);
      }
    }

    return heldMessages.length;
  } catch (error) {
    logger.error({ err: error }, '[Held Messages] Error saat memeriksa antrean pesan tertahan');
    return 0;
  }
}

let heldRunnerInterval: NodeJS.Timeout | null = null;

export function startHeldMessageReleaseRunner(intervalMs = 30000) {
  if (heldRunnerInterval) return;

  logger.info(
    `[Held Messages] Held Message Release Runner aktif (interval: ${intervalMs / 1000}s).`,
  );
  heldRunnerInterval = setInterval(() => {
    void processHeldMessages();
  }, intervalMs);
}

export function stopHeldMessageReleaseRunner() {
  if (heldRunnerInterval) {
    clearInterval(heldRunnerInterval);
    heldRunnerInterval = null;
    logger.info('[Held Messages] Held Message Release Runner dihentikan.');
  }
}
