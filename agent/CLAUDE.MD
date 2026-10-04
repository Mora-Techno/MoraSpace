# SPACES AGENT CONFIGURATION & PLAYBOOK

> Single source of truth untuk semua agent di repo ini.
> Root `AGENTS.md` mewajibkan agent membaca file ini di awal sesi.

## 1. Project Overview & Architecture

- **Backend (`apps/be`)**: Bun + Elysia.js + Prisma ORM + PostgreSQL.
- **Frontend Web (`apps/fe`)**: Next.js 16 + React 19 + Tailwind CSS + Radix UI.
- **Mobile (`apps/mobile`)**: Expo + React Native + NativeWind.
- **Shared (`packages/shared`)**: Contract-first shared types, endpoints, and react-query services.
- **Monorepo Manager**: Turborepo + Bun Workspaces.
- **Scope aktif**: `docs/space.version.0.0.1.md` — baca sebelum menambah fitur/rule baru.

## 2. Skill Router (wajib pakai `skill` tool)

Skill sudah terinstall global (`~/.agents/skills/`, `~/.claude/skills/`).
Jangan re-implementasi — load saat trigger terpenuhi:

| Trigger | Load skill |
|---|---|
| Tanya arsitektur / cari file / trace dependensi / "di mana X dipakai" | `graphify` |
| Tulis / refactor / fix code apapun | `ponytail` (level full, aktif permanen) |
| Bangun / review / fix UI web & mobile | `ui-ux-pro-max` + `ui-styling` |
| Token warna / spacing / tipografi / komponen baru | `design-system` |

Aturan: **maksimal load yang dibutuhkan**, jangan load semua di awal.

## 3. Session Start Protocol (anti-halu, <30 detik)

1. **Freshness check** — graph bisa basi. Jalankan:
   ```bash
   ls -dt graphify-out/20*/ | head -1   # snapshot terbaru (BACA YANG INI, bukan yang lama)
   git rev-parse HEAD                     # bandingkan dengan "Built from commit" di GRAPH_REPORT.md
   ```
   Jika HEAD != commit di report → graph basi → jawab dari baca file langsung
   (`Read`/`Grep`), jangan dari ingatan graph.
2. **Query first, baca file kedua** — untuk pertanyaan codebase: `graphify query`
   dulu, lalu verifikasi dengan `Read` file sumber sebelum menyimpulkan.
3. **Scope check** — baca `docs/space.version.0.0.1.md`. Yang berlabel WON'T → tolak,
   tawarkan versi minimal yang masuk scope.

## 4. Anti-Hallucination Harness (wajib tiap task code)

1. **Evidence before synthesis** — klaim soal kode harus disertai `path:line`.
   Dilarang menjawab dari ingatan tanpa `Read`/`Grep` dulu.
2. **Reuse-first ladder** (sebelum tulis kode baru):
   `Grep` helper/util/type/pattern yang sudah ada → pakai itu.
   Duplikasi helper yang sudah ada = bug.
3. **Bug fix = root cause** — `Grep` semua caller fungsi yang disentuh.
   Fix di satu fungsi shared > tambal tiap caller.
4. **Contract-first (atomik)** — ubah schema/endpoint harus sentuh ketiganya sekaligus:
   `apps/be/prisma/schema.prisma` → Elysia controller/DTO `apps/be/src` →
   `packages/shared` (types + endpoints + services).
   Satu saja ketinggalan = kontrak rusak.
5. **No silent invention** — jangan karang nama file, endpoint, env var, atau API.
   Tidak ketemu di repo/graph → bilang tidak ada + tanya user.

## 5. Non-Negotiable Core Rules

1. **Multi-Tenant Isolation (Layer 2)**:
   - Every tenant query/mutation MUST verify `companyId` and `companyMemberId`.
   - Never allow cross-tenant data leakage.
2. **Platform Role Isolation (Layer 1)**:
   - Global super-admin access attaches to `User.platformRole`
     (`USER`, `DEVELOPER`, `SUPER_ADMIN`).
   - Never query or link `CompanyMember` or `Role` tables for Layer 1 platform access.
   - v0.0.1: hanya `SUPER_ADMIN` yang dipakai; `DEVELOPER` diabaikan (tidak dihapus).
3. **Company Role v0.0.1 (Layer 2)**: hanya `Owner` & `Member`.
   - Invite/remove member, edit Working Hours, kelola plan → `Owner` only.
   - Task: assign bebas, visibility `Owner=all / Member=own (reporter/assignee)`.
   - `Department/Team/Position/Role` granular: backend boleh ada, **UI disembunyikan total**.
4. **Respect Working Hours Policy**:
   - Any notification or email trigger must explicitly classify as `Critical`
     (immediate dispatch) or `Normal` (working-hours queue).
5. **Quality & Validation**:
   - Run typecheck, lint, and formatting before completing tasks
     (`bun run lint`, `bun run format:check`).

## 6. Reusable Workflows (resep cepat, jangan improvisasi)

- **Endpoint BE baru**: DTO `src/dto/` → controller `src/controllers/` →
  route `src/routes/` + daftar di `apiRoutes.ts` → guard
  (`verifyToken` + `requireRole`/`requirePlatformRole`) → service `src/service/`.
- **Halaman FE baru**: route `app/(private)/.../page.tsx` → container
  `_containers/` → section `components/page/...` → hook `hooks/useApi/<domain>/`
  (reuse `useAppMutation`/cache context yang sudah ada, jangan bikin fetcher baru).
- **Kontrak shared baru**: `types/<domain>.types.ts` → `endpoints/` →
  `services/` → `react-query/` hooks bila perlu.
- **Suspend-aware**: tiap query tenant baru harus lolos blokir
  `Company.status == suspended → 403` (kecuali `SUPER_ADMIN`).

## 7. Knowledge Graph (Graphify) Auto-Update Rule

Artifacts: `graphify-out/` — **snapshot bertanggal (`graphify-out/YYYY-MM-DD/`)
di-commit ke git, `cache/` di-ignore**. Agent selalu baca snapshot terbaru
(lihat §3), bukan `graph.json` root yang bisa basi.

### Knowledge Graph Maintenance Protocol:

- **Query First**: `graphify query "<question>"` atau baca snapshot terbaru
  `graphify-out/<YYYY-MM-DD terbaru>/GRAPH_REPORT.md + graph.json`.
- **Auto-Sync Trigger**: setelah fitur/endpoint/refactor/ubah model, jalankan:
  ```bash
  graphify update .
  ```
  *(atau `bun run graphify:update`)*
- **Git Hook (otomatis saat commit)**:
  `.git/hooks/pre-commit` menjalankan `graphify update .` bila ada staged file
  di luar `graphify-out/`, lalu `git add graphify-out/`.
  Setup sekali per clone: `cp .github/hooks/pre-commit .git/hooks/pre-commit`.
