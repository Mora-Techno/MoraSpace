import app from "./app";
import { connectWithRetry, disconnectDatabase } from "./config/databases";
import { verifyMailTransport } from "./utils/mail.utils";

let isShuttingDown = false;

async function shutdown(signal: string) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(` Shutting down (${signal})...`);

  try {
    await disconnectDatabase();
    console.log(" Database disconnected.");
  } catch (error) {
    console.error(
      " Failed to disconnect database:",
      error instanceof Error ? error.message : error,
    );
  }

  process.exit(0);
}

process.once("SIGINT", () => {
  void shutdown("SIGINT");
});

process.once("SIGTERM", () => {
  void shutdown("SIGTERM");
});

process.once("beforeExit", () => {
  void disconnectDatabase();
});

connectWithRetry()
  .then(() => {
    void verifyMailTransport()
      .then(() => {
        console.log(" SMTP connected successfully!");
      })
      .catch((error) => {
        console.warn(
          " SMTP verification failed. Magic link email will not work until SMTP credentials are fixed.",
        );
        console.warn(
          error instanceof Error ? error.message : "Unknown SMTP error",
        );
      });

    const port = process.env.PORT ? Number(process.env.PORT) : 5000;
    app.listen(port);
    console.log(` Elysia running at in port:${port}`);
  })
  .catch((err) => {
    console.error(" Could not connect to database after retries:", err);
  });
