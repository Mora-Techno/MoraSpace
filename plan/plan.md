# Plan: Menyamakan Fitur Owner dengan Member

## Masalah

Saat ini setelah login, halaman owner hanya memiliki `dashboard/`, sedangkan member memiliki 6 fitur:

| Member                    | Owner           |
| ------------------------- | --------------- |
| `dashboard/`              | `dashboard/` ✅ |
| `calendar/`               | ❌              |
| `music/`                  | ❌              |
| `notes/` (+ `notes/[id]`) | ❌              |
| `settings/`               | ❌              |
| `todos/`                  | ❌              |

## Analisis

- **Backend API** sudah lengkap untuk semua fitur (todo, calendar, notes, music, settings, member).
- **Shared components** di `components/page/private/member/*` sudah mature dan bisa di-reuse langsung oleh owner.
- **Shared hooks & API** (`useApi`, `@repo/types`, `@repo/shared`) tidak terkait role — bisa dipakai siapa saja.
- Satu-satunya perbedaan adalah **routing** (`/member/*` vs `/owner/*`) dan **authorization middleware** di level layout/guard.

## Strategi Pendekatan

Ada 2 opsi pendekatan:

### Opsi A: Duplikasi Container → Reuse Component (Direkomendasikan ✅)

Buat file container baru di `(private)/owner/*` yang **meng-import ulang komponen yang sama** dari member.

**Kenapa?**

- Route terpisah → guard/permission owner bisa berbeda suatu saat nanti
- Zero risk regresi ke member
- Container file sangat kecil (~5-10 baris)
- Komponen bisnis tetap DRY (semua logika di `components/page/private/*`)

### Opsi B: Satu Layout dengan Role Guard

Satu route `/dashboard`, `/todos`, dll. lalu layout membaca role user.

**Tidak direkomendasikan** karena:

- Percampuran guard authorization di level routing jadi kompleks
- Owner mungkin butuh fitur tambahan nanti (company management, teams, member CRUD)
- Perubahan layout member bisa berdampak ke owner tanpa sengaja

## Langkah Implementasi

### Langkah 1: Buat halaman owner yang mirip member

Buat struktur folder owner mengikuti pola member:

```
apps/fe/src/app/(private)/owner/
├── dashboard/             # ✅ sudah ada
├── calendar/
│   ├── page.tsx
│   └── _containers/
│       └── calendar.tsx
├── music/
│   ├── page.tsx
│   └── _containers/
│       └── music.tsx
├── notes/
│   ├── page.tsx
│   ├── _containers/
│   │   ├── notes.tsx
│   │   └── note-detail.tsx
│   └── [id]/
│       └── page.tsx
├── settings/
│   ├── page.tsx
│   └── _containers/
│       └── settings.tsx
└── todos/
    ├── page.tsx
    └── _containers/
        └── todos.tsx
```

Setiap container owner akan **meng-import dan me-render langsung komponen member**.

Contoh pola [`owner/calendar/_containers/calendar.tsx`](<Space/apps/fe/src/app/(private)/owner/calendar/_containers/calendar.tsx>):

```tsx
"use client";

// Reuse member component
export { default } from "@/app/(private)/member/calendar/_containers/calendar";
```

Atau jika ingin membungkus dengan layout/wrapper owner:

```tsx
"use client";

import MemberCalendar from "@/app/(private)/member/calendar/_containers/calendar";

export default function OwnerCalendarContainer() {
  return (
    <div data-role="owner">
      <MemberCalendar />
    </div>
  );
}
```

Untuk halaman yang komplex seperti [`dashboard`](<Space/apps/fe/src/app/(private)/owner/dashboard/_container/dashboard.tsx>), tetap bisa dibuat container sendiri yang meng-import [`DashboardMemberSection`](Space/apps/fe/src/components/page/private/member/dashboard/dashboard-section.tsx).

### Langkah 2: Update Navigation Config

File [`nav.config.ts`](Space/apps/fe/src/configs/nav.config.ts) saat ini hardcode ke `/member/*`. Perlu dibuat role-aware:

```ts
// Bisa menggunakan 2 strategi:

// Strategi A — nav items terpisah per role
export const OWNER_NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", url: "/owner/dashboard", icon: Home, mobile: true },
  { title: "Todos", url: "/owner/todos", icon: CheckSquare, mobile: true },
  { title: "Notes", url: "/owner/notes", icon: FileText, mobile: true },
  { title: "Calendar", url: "/owner/calendar", icon: Calendar, mobile: true },
  { title: "Music", url: "/owner/music", icon: Music2, mobile: false },
  { title: "Settings", url: "/owner/settings", icon: Settings, mobile: true },
];

// Strategi B — dynamic URL berdasarkan role
export const NAV_ITEMS = (role: "member" | "owner") => [
  { title: "Dashboard", url: `/${role}/dashboard`, icon: Home, mobile: true },
  { title: "Todos", url: `/${role}/todos`, icon: CheckSquare, mobile: true },
  // ...etc
];
```

### Langkah 3: Update Sidebar & BottomNav

[`AppSidebar`](Space/apps/fe/src/core/components/app-sidebar.tsx) dan [`BottomNav`](Space/apps/fe/src/core/components/bottom-nav.tsx) perlu membaca role user (dari auth context / cookie) untuk memilih nav items yang sesuai.

Contoh di sidebar:

```tsx
const { user } = useAuth(); // atau dari context
const role = user?.role ?? "member";
const items = role === "owner" ? OWNER_NAV_ITEMS : NAV_ITEMS;
```

### Langkah 4: Update Owner Dashboard (Opsional)

[`OwnerDashboardContainer`](<Space/apps/fe/src/app/(private)/owner/dashboard/_container/dashboard.tsx>) saat ini hanya render [`OwnerDashboardSection`](Space/apps/fe/src/components/page/private/owner/dashboard/OwnerDashboardSection.tsx) yang masih placeholder (`<div>log</div>`).

Bisa langsung direplace dengan container yang reuse [`DashboardMemberSection`](Space/apps/fe/src/components/page/private/member/dashboard/dashboard-section.tsx).

### Langkah 5: Auth Guard / Middleware

Pastikan route `/owner/*` hanya bisa diakses oleh user dengan role `owner`. Bisa via:

- Middleware di level app
- Guard di [`private.provider.tsx`](Space/apps/fe/src/core/providers/private.provider.tsx)
- Layout-level check

## Files yang Akan Dimodifikasi

| File                                                                   | Perubahan                                 |
| ---------------------------------------------------------------------- | ----------------------------------------- |
| [`nav.config.ts`](Space/apps/fe/src/configs/nav.config.ts)             | Tambah owner nav items / jadikan function |
| [`app-sidebar.tsx`](Space/apps/fe/src/core/components/app-sidebar.tsx) | Baca role untuk pilih nav items           |
| [`bottom-nav.tsx`](Space/apps/fe/src/core/components/bottom-nav.tsx)   | Baca role untuk pilih mobile nav items    |

## Files yang Akan Dibuat (Baru)

| File                                      | Sumber                     |
| ----------------------------------------- | -------------------------- |
| `owner/calendar/page.tsx`                 | reuse pattern member       |
| `owner/calendar/_containers/calendar.tsx` | re-export member container |
| `owner/music/page.tsx`                    | re-export member           |
| `owner/music/_containers/music.tsx`       | re-export member container |
| `owner/notes/page.tsx`                    | re-export member           |
| `owner/notes/_containers/notes.tsx`       | re-export member container |
| `owner/notes/_containers/note-detail.tsx` | re-export member container |
| `owner/notes/[id]/page.tsx`               | re-export member           |
| `owner/settings/page.tsx`                 | re-export member           |
| `owner/settings/_containers/settings.tsx` | re-export member container |
| `owner/todos/page.tsx`                    | re-export member           |
| `owner/todos/_containers/todos.tsx`       | re-export member container |

## Ringkasan

Pendekatan ini meminimalkan perubahan kode dengan:

1. **Reuse** seluruh komponen member (tidak ada duplikasi logika)
2. **Re-export** container owner yang tipis (hanya import ulang)
3. **Role-aware nav** via satu config point
4. **Route terpisah** untuk fleksibilitas guard/permission owner di masa depan
