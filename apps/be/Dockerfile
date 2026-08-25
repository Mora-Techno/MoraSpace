FROM oven/bun:1.3.1 AS pruner

WORKDIR /app

RUN bun add -g turbo@2.6.3

COPY . .

RUN turbo prune api --docker


FROM oven/bun:1.3.1 AS installer

WORKDIR /app

COPY --from=pruner /app/out/json/ ./

RUN bun install --frozen-lockfile

COPY --from=pruner /app/out/full/ ./

RUN bun run --filter=api prisma:generate


FROM oven/bun:1.3.1 AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=installer /app ./

WORKDIR /app/apps/be

EXPOSE 5000

CMD ["bun", "run", "start"]