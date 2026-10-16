FROM oven/bun:1.4.3 AS pruner

WORKDIR /app
RUN bun add -g turbo@2.11.4
COPY . .
# prune butuh monorepo root — pastikan konteks build = repo root, bukan apps/be.
RUN test -f turbo.json || (echo "FATAL: turbo.json tidak ada. Set Render 'Docker Build Context Directory' / 'Root Directory' ke repo root." >&2 && exit 1)
RUN turbo prune api --docker

FROM oven/bun:1.4.3 AS installer

WORKDIR /app
COPY --from=pruner /app/out/json/ ./
RUN bun install

COPY --from=pruner /app/out/full/ ./
RUN bun run --filter=api prisma:generate
RUN bun run --filter=api build

FROM oven/bun:1.4.3 AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=installer /app ./
WORKDIR /app/apps/be

EXPOSE 5000
CMD ["bun", "run", "start"]
