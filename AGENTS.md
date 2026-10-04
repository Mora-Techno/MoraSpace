# SPACES — Agent Entry Point (OpenCode auto-loads this file)

CRITICAL: at session start, `Read` `agent/CLAUDE.MD` and follow it
(skill router, freshness check, anti-hallucination harness). Treat its
contents as mandatory; this file is only the pointer + the rules below.

## Stack

Bun + Elysia + Prisma + Postgres (`apps/be`), Next.js 16 + React 19 +
Tailwind + Radix (`apps/fe`), Expo (`apps/mobile`), contract-first
`packages/shared`, Turborepo + Bun workspaces.

## Rules (ringkas — detail di `agent/CLAUDE.MD`)

1. Tenant isolation: tiap query/mutasi wajib `companyId` + `companyMemberId`.
2. Layer 1 (`User.platformRole`, hanya `SUPER_ADMIN` dipakai): jangan join
   `CompanyMember`/`Role`. Layer 2: hanya `Owner` & `Member`.
3. Contract-first atomik: `prisma/schema.prisma` → `apps/be/src` →
   `packages/shared` sekaligus.
4. Graph: baca snapshot terbaru `graphify-out/YYYY-MM-DD/` (bukan yang lama);
   cek `git rev-parse HEAD` vs commit di `GRAPH_REPORT.md`.
5. Scope: `docs/space.version.0.0.1.md`. Yang WON'T → tolak.
6. Selesai: `bun run lint`, `bun run format:check`.
