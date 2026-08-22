
FROM oven/bun:1.1.45 AS pruner
WORKDIR /app

RUN bun add -g turbo

COPY . .

RUN turbo prune be --docker


FROM oven/bun:1.1.45 AS installer
WORKDIR /app

COPY package.json bun.lockb* ./


COPY --from=pruner /app/out/json/ .

RUN bun install

COPY --from=pruner /app/out/full/ .

RUN cd apps/be && bunx prisma generate


FROM oven/bun:1.1.45 AS runner
WORKDIR /app

COPY --from=installer /app .

EXPOSE 5000

CMD ["bun", "run", "apps/be/src/serve.ts"]