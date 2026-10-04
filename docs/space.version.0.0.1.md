# Spaces v0.0.1 — Role & Scope Lock

> Target: hanya ini dulu, tidak lebih. Freeze hirarki granular (Department/Team/Position) — backend boleh support, UI disembunyikan total.

## Prinsip Dasar

2 layer role, jangan campur:

- **Layer 1 — Platform Role**: tim internal Mora, bukan customer.
- **Layer 2 — Company Role**: customer (beta tester). Company = flat list anggota, bukan struktur bertingkat.

## Layer 1: Platform Role — Super Admin only

Hanya 1 role: `SUPER_ADMIN`. Tanpa sub-role (support-only, billing-only, dst).

| Kemampuan                                             | v0.0.1?   | Catatan                                                   |
| ----------------------------------------------------- | --------- | --------------------------------------------------------- |
| Buat/lihat akun Company manual                        | ✅ MUST   | Onboarding beta satu-satu, tanpa self-serve signup publik |
| Suspend/aktifkan Company                              | ✅ MUST   | Kill switch abuse/bug kritis                              |
| Lihat aktivitas dasar (login terakhir, jumlah member) | ✅ MUST   | Pantau adopsi beta, bukan analitik                        |
| Set plan/tier manual                                  | ✅ SHOULD | Tanpa billing self-serve                                  |
| Dashboard analitik lengkap                            | ❌ WON'T  | tunda v1.x                                                |
| Role platform granular                                | ❌ WON'T  | tunda sampai tim besar                                    |
| Automated billing/invoicing                           | ❌ WON'T  | manual selama beta                                        |

### Kontrak BE (baru)

- `GET /admin/companies` — list + `memberCount + lastLoginAt + plan + status`. Guard `SUPER_ADMIN`.
- `POST /admin/companies` — `{name, ownerEmail, ownerFullName, planId?}`. Reuse `registerLeader`.
- `PATCH /admin/companies/:id/suspend | /activate` — set `Company.status/suspendedAt`.
- `PATCH /admin/companies/:id/plan` — `{planId}` manual.
- Enforcement: `Company.status==suspended → 403` untuk semua member (SUPER_ADMIN bypass).
- DB: `Company += status CompanyStatus(active|suspended) + suspendedAt`. Seed role hanya `Owner, Member`.

## Layer 2: Company Role — Owner & Member only

Tanpa Manager/Team Lead/Department Head (frozen).

| Fitur                         | Owner           | Member                                        |
| ----------------------------- | --------------- | --------------------------------------------- |
| Invite/hapus anggota          | ✅              | ❌ (403)                                      |
| Atur Working Hours            | ✅ edit         | 👁️ lihat saja                                 |
| Buat/edit Task                | ✅              | ✅                                            |
| Assign Task ke anggota lain   | ✅              | ✅ — **LOCKED: bebas assign**                 |
| Lihat Task perusahaan         | ✅ semua        | ⚠️ hanya own (reporter/assignee) — **LOCKED** |
| Kelola langganan/plan         | ✅              | ❌ (read-only badge di FE)                    |
| Edit profil, Pomodoro/Music   | ✅              | ✅                                            |
| Buat Department/Team/Position | 🚫 hidden total | 🚫 n/a                                        |

### Kontrak BE (guard + 1 endpoint baru)

- `Invitation + Member remove/update` → `requireRole(['Owner'])`.
- `GET /companies/settings` (semua member) + `PATCH /companies/settings` (Owner only): `{workingHourStart, workingHourEnd, workDays}`.
- `Task.list/get/update`: Member difilter `OR(reporter==me, assignee==me)`, Owner bypass. Assign bebas, tanpa guard baru.
- `PATCH /companies/subscription` tetap Owner-only (sudah ada).

### FE — hide > build

- Baru: `admin/companies/page.tsx` (tabel + suspend/aktifkan + buat manual). Tanpa chart.
- Keep: `CompanyMemberSection + MemberRow` (flat list). Wire dialog `Tambah Anggota` → invite API.
- Hide total (un-link nav, jangan hapus file): `owner/position`, `owner/team`, `member/team`, `owner/permission`, `company-roles Admin/Chief`, `owner/company/admin`.
- Working Hours: `CompanySettingsSection` potong jadi 2x `time` + `workDays`. Container settings fix save ke endpoint baru.
- Task Kanban: tanpa perubahan UI (visibility server-side).
- Billing: hide `checkout/cancel`, tampil badge `Paket Aktif`.
- Keep as-is: Pomodoro, Music, profil/settings personal.

## WON'T

Analitik platform, role granular, auto-billing, hirarki UI, Department/Team/Position create.

## Verifikasi

`bun run lint`, `format:check`, QA: suspend blokir 403 → activate pulih; Member invite 403; Member own-task only; `graphify update .`.
