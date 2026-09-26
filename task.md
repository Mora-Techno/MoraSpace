# SPACES PROJECT STATUS & TASK TRACKER

> Terakhir diperbarui: 2026-09-26  
> Arsitektur: Monorepo (Bun + Turborepo)
> - **Backend (`apps/be`)**: Bun + Elysia.js + Prisma ORM + PostgreSQL
> - **Web (`apps/fe`)**: Next.js 16 + React 19 + Tailwind CSS + Radix UI
> - **Mobile (`apps/mobile`)**: Expo + React Native + NativeWind
> - **Shared (`packages/shared`)**: Contract types, API SDK, TanStack Query hooks

---

## 1. Ringkasan Status Keseluruhan

| Domain / Workspace | Tingkat Kematangan | Status Singkat |
|---|---|---|
| **Backend API (`apps/be`)** | ~85% | Fondasi endpoint, controller, service, Prisma schema, auth, multi-tenant RBAC sudah matang. |
| **Shared Contracts (`packages/shared`)** | ~80% | DTO, service wrapper, dan hooks TanStack Query sebagian besar sudah siap. |
| **Frontend Web (`apps/fe`)** | ~60% | Auth, owner dashboard/member/teams, calendar, notes, todos sudah jalan; modul tasks/billing/analytics belum lengkap. |
| **Mobile App (`apps/mobile`)** | ~20% | Baru setup dasar Expo, navigation tabs, auth login, dan splash/home dummy. |

---

## 2. Fitur yang SUDAH DIBUAT (Completed)

### A. Backend (`apps/be`)
- [x] **Dual-Layer Authorization**:
  - Layer 1: `User.platformRole` (`USER`, `DEVELOPER`, `SUPER_ADMIN`) via `requirePlatformRole`.
  - Layer 2: Multi-tenant RBAC (`CompanyMember`, `Role`, `Permission`, `requireRole`, `requirePermission`).
- [x] **Authentication & Session**:
  - Register (Owner & Employee), Login (JWT Access Token + Refresh Token).
  - Google OAuth (`google-auth-library`), Magic Link, Forgot & Reset Password.
  - Active session tracking (`UserSession`).
- [x] **Company & Workspace Management**:
  - Company CRUD, slug generator, member invitations via email (`nodemailer`).
  - Department, Team, dan Position hierarchy.
- [x] **Productivity Modules**:
  - **Todos**: Personal/team todos, status update, priority.
  - **Notes**: CRUD notes, rich content support.
  - **Calendar**: Events, scheduling, holiday mapping.
  - **Pomodoro**: Session tracking & productivity metrics.
  - **Music & Track Catalog**: YouTube streaming metadata, review & approval track oleh developer/super-admin.
- [x] **Notification & Policy**:
  - In-app notification, web-push (`web-push`), email notifications.
  - Working hours policy & queueing rule (Critical vs Normal).
- [x] **Subscription & Payment**:
  - Integrasi Stripe & Xendit service, subscription plans config, webhook handler skeleton.

### B. Shared Package (`packages/shared`)
- [x] Shared TypeScript types untuk semua entitas (Auth, Member, Company, Role, Todo, Note, Calendar, Pomodoro, Subscription, TrackCatalog).
- [x] Endpoint path definitions (`packages/shared/endpoints/*`).
- [x] API client & server-fetch helpers (`axios`, `wrapApi`).
- [x] TanStack React Query hooks dan mutation wrappers.

### C. Frontend Web (`apps/fe`)
- [x] **Auth Flow**: Login, register company/employee, forgot-password, reset-password, magic link.
- [x] **App Shell & Theme**: Dark/light mode switcher, sidebar navigasi, app header, bottom nav, toast (`goey-toast` / `sonner`).
- [x] **Owner Portal (`/owner`)**:
  - Dashboard overview.
  - Company info & admin settings.
  - Member management & invitation flow.
  - Team, position, & role/permission settings.
- [x] **Member Workspace (`/member`)**:
  - Member Dashboard.
  - Todos (`/member/todos`, `/member/todos/[id]`).
  - Notes (`/member/notes`, `/member/notes/[id]`).
  - Calendar (`/member/calendar`, `/member/calendar/[id]`).
  - Notifications (`/member/notifications`, `/member/notifications/[id]`).
  - Music Player widget & context.
- [x] **Public Landing**: `/home`, `/pricing`, `/blogs`, `/resource`.

---

## 3. Fitur yang BELUM DIBUAT / PERLU DILANJUTKAN (Pending / Backlog)

### A. Frontend Web (`apps/fe`)
- [ ] **Modul Task Management (Jira/Linear style)**:
  - Backend sudah ada `TaskController`, `task.dto.ts`, dan Prisma model `Task`, tetapi **UI Kanban board/List view belum ada di `apps/fe`**.
- [ ] **Modul Pomodoro UI**:
  - Backend `PomodoroController` dan service sudah ada, UI timer Pomodoro belum diimplementasikan di FE.
- [ ] **Billing & Subscription UI (Owner)**:
  - Halaman checkout tier (Stripe/Xendit), invoice history, dan upgrade plan untuk company owner belum dihubungkan ke UI.
- [ ] **Developer / Super-Admin Console**:
  - UI untuk mereview `TrackCatalog` (approve/reject track) dan memonitor platform tenant sesuai Layer 1 platform role.
- [ ] **Company Policy UI**:
  - Pengaturan working-hours, queue notification switch, and remote policy di settings owner.

### B. Mobile App (`apps/mobile`)
- [ ] Integrasi auth token storage & auto-refresh session di Expo.
- [ ] Implementasi screen Todo list & creation.
- [ ] Implementasi screen Calendar & Schedule.
- [ ] Implementasi screen Notes.
- [ ] Push Notification handler di React Native (Expo Notifications).
- [ ] Music player audio player native.

### C. Backend & DevOps (`apps/be`)
- [ ] Background Worker / Queue Runner untuk dispatch notification di luar jam kerja (working-hours policy).
- [ ] Automated end-to-end tests untuk multi-tenant boundary checks (mencegah data leak antar `companyId`).
- [ ] Verifikasi konsistensi webhook Stripe & Xendit saat payment sukses.

---

## 4. Prioritas Rekomendasi Langkah Selanjutnya

1. **Prioritas 1 (Frontend Tasks Board)**: Buat halaman `/member/tasks` atau `/owner/tasks` menggunakan `useTask` dari `packages/shared`.
2. **Prioritas 2 (Billing & Subscription Management)**: Lengkapi halaman `/owner/billing` untuk pemilihan paket dan payment gateway.
3. **Prioritas 3 (Developer Platform Console)**: Buat tampilan internal untuk review track katalog musik (`PATCH /api/internal/track-catalogs/:id/review`).
4. **Prioritas 4 (Mobile Core Features)**: Sambungkan Auth API ke `apps/mobile` dan bangun screen Todo/Schedule.
