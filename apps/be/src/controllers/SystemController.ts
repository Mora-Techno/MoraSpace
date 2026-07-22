import { HttpResponse } from "@/http";
import prisma from "prisma/client";
import type { AppContext } from "@/contex";

let lastPingTime: number = 0;

const PING_INTERVAL_MS = 3 * 60 * 1000;

class SystemController {
  public async ping(c: AppContext) {
    try {
      const now = Date.now();

      // Check if we need to ping
      if (now - lastPingTime > PING_INTERVAL_MS) {
        // Update timestamp immediately to prevent concurrent rapid pings
        lastPingTime = now;

        // Ping database to keep it warm
        await prisma.$queryRaw`SELECT 1`;

        return HttpResponse(c).ok(
          { pinged: true },
          undefined,
          "Database pinged successfully",
        );
      }

      // Ignored ping (still warm)
      return HttpResponse(c).ok(
        { pinged: false },
        undefined,
        "Ping skipped (db is warm)",
      );
    } catch (error) {
      // Revert timestamp if failed so next request can try again
      lastPingTime = 0;
      return HttpResponse(c).internalError(error);
    }
  }
}

export default new SystemController();
