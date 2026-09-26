FROM oven/bun:1.4.3 AS pruner

WORKDIR /app
RUN bun add -g turbo@2.11.4
COPY . .
RUN turbo prune next-shadcn-base --docker

FROM oven/bun:1.4.3 AS installer

WORKDIR /app
COPY --from=pruner /app/out/json/ ./
RUN bun install

COPY --from=pruner /app/out/full/ ./
ENV SKIP_ENV_VALIDATION=1
ENV NODE_ENV=production
RUN bun --filter=next-shadcn-base run build

FROM oven/bun:1.4.3 AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=installer /app ./
WORKDIR /app/apps/fe

EXPOSE 3000
CMD ["bun", "run", "start"]
