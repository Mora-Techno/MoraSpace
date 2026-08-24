FROM oven/bun:1.1.45 AS pruner

WORKDIR /app

RUN bun add -g turbo@1.13.4

COPY . .

# Prune hanya workspace BE
RUN turbo prune be --docker


FROM oven/bun:1.1.45 AS installer

WORKDIR /app

COPY --from=pruner /app/out/json/ .

COPY --from=pruner /app/out/bun.lockb ./bun.lockb

RUN bun install --frozen-lockfile

COPY --from=pruner /app/out/full/ .

RUN cd apps/be && bunx prisma generate

FROM oven/bun:1.1.45 AS runner

WORKDIR /app

COPY --from=installer /app .

EXPOSE 5000

CMD ["bun", "run", "apps/be/src/serve.ts"]