
FROM oven/bun:1.1.45 AS pruner
WORKDIR /app


RUN apt-get update && apt-get install -y nodejs


# Use bunx to run turbo without relying on global installation paths
RUN bun i -g turbo@1.13.4


COPY . .


RUN bunx turbo prune be --docker


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

# Jalankan server
CMD ["bun", "run", "apps/be/src/serve.ts"]