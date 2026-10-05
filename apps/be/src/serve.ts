import app from './app';
import { connectWithRetry, disconnectDatabase } from './config/databases';
import {
  startNotificationQueueRunner,
  stopNotificationQueueRunner,
} from './service/NotificationQueueWorker';
import { verifyMailTransport } from './utils/mail.utils';

let isShuttingDown = false;

async function shutdown(signal: string) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(` Shutting down (${signal})...`);
  stopNotificationQueueRunner();

  try {
    await disconnectDatabase();
    console.log(' Database disconnected.');
  } catch (error) {
    console.error(
      ' Failed to disconnect database:',
      error instanceof Error ? error.message : error,
    );
  }

  process.exit(0);
}

process.once('SIGINT', () => {
  void shutdown('SIGINT');
});

process.once('SIGTERM', () => {
  void shutdown('SIGTERM');
});

process.once('beforeExit', () => {
  void disconnectDatabase();
});

connectWithRetry()
  .then(() => {
    void verifyMailTransport()
      .then(() => {
        console.log(' Resend email ready!');
      })
      .catch((error) => {
        console.warn(
          ' Resend NOT configured. Email tidak akan terkirim sampai RESEND_API_KEY diisi.',
        );
        console.warn(error instanceof Error ? error.message : 'Unknown email error');
      });

    const port = process.env.PORT ? Number(process.env.PORT) : 5000;
    app.listen(port);
    console.log(` Elysia running at in port:${port}`);
    startNotificationQueueRunner();
  })
  .catch((err) => {
    console.error(' Could not connect to database after retries:', err);
  });
