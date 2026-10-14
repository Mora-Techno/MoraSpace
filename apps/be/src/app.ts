import Elysia from 'elysia';
import cors from '@elysiajs/cors';
import { helmet } from 'elysia-helmet';
import { opentelemetry } from '@elysia/opentelemetry';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import apiRoutes from './routes/apiRoutes';
import chatGateway from './ws/chat.gateway';
import swaggerPlugin from './swagger';
import { getCorsOrigin } from './types/cors';

const app = new Elysia()
  .use(
    cors({
      origin: (request) => {
        const origin = request.headers.get('origin');
        if (!origin) return true;
        return getCorsOrigin(origin);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'x-internal-api-key',
        'Origin',
        'Accept',
        'x-requested-with',
      ],
      exposeHeaders: ['Content-Range', 'X-Content-Range'],
      maxAge: 86400,
    }),
  )
  .use(
    opentelemetry({
      spanProcessors: [
        new BatchSpanProcessor(
          new OTLPTraceExporter({
            url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4318/v1/traces',
          }),
        ),
      ],
    }),
  )
  .use(
    helmet({
      contentSecurityPolicy: false,
      originAgentCluster: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  )

  .get('/', () => 'Hello Mora Space Api')
  .use(apiRoutes)
  .use(chatGateway)
  .use(swaggerPlugin);

export default app;
