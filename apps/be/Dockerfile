FROM oven/bun:1.1.45 AS pruner

WORKDIR /app

# Install Turbo
RUN bun add -g turbo@1.13.4

# Copy monorepo
COPY . .

# Prune hanya workspace BE
RUN turbo prune be --docker


FROM oven/bun:1.1.45 AS installer

WORKDIR /app

# Copy dependency manifests hasil prune
COPY --from=pruner /app/out/json/ .

# Copy lockfile hasil prune
COPY --from=pruner /app/out/bun.lockb ./bun.lockb

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code hasil prune
COPY --from=pruner /app/out/full/ .

# Generate Prisma Client
RUN cd apps/be && bunx prisma generate


FROM oven/bun:1.1.45 AS runner

WORKDIR /app

COPY --from=installer /app .

EXPOSE 5000

CMD ["bun", "run", "apps/be/src/serve.ts"]