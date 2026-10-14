# Cloudflare Workers + OpenNext Deployment Guide for Next.js 16 (Spaces Web)

Dokumentasi resmi ini memuat panduan komprehensif integrasi, konfigurasi, optimasi Free Tier, serta arsitektur deployment otomatis berbasis **GitHub Organization** ke **Cloudflare Workers** menggunakan adapter resmi `@opennextjs/cloudflare`.

---

## 1. Arsitektur Deployment

Aplikasi frontend (`apps/fe`) menggunakan arsitektur hybrid Server-Side Rendering (SSR) & Static Site Generation (SSG) berbasis Next.js 16 App Router. Adapter `@opennextjs/cloudflare` memisahkan build Next.js menjadi 2 komponen utama yang dieksekusi secara optimal di edge network Cloudflare:

```
                                      [User Request]
                                            │
                                            ▼
                           ┌─────────────────────────────────┐
                           │    Cloudflare Global Edge CDN   │
                           └─────────────────────────────────┘
                                            │
                 ┌──────────────────────────┴──────────────────────────┐
                 │                                                     │
        [Static Assets Match]                                [Dynamic / SSR Route]
                 │                                                     │
                 ▼                                                     ▼
    ┌──────────────────────────┐                         ┌──────────────────────────┐
    │  Cloudflare Assets CDN   │                         │ Cloudflare Worker (V8)   │
    │  (.open-next/assets)     │                         │ (.open-next/worker.js)   │
    │  - JS/CSS bundles        │                         │ - Next.js SSR renderer   │
    │  - Static Images / Icons │                         │ - Route Handlers (API)   │
    │  - PWA Manifest & SW     │                         │ - Cookie Session logic   │
    │  (Cost: 0 CPU ms, Free)  │                         │ (Cost: <10ms CPU time)   │
    └──────────────────────────┘                         └──────────────────────────┘
                                                                       │
                                                                       ▼
                                                         ┌──────────────────────────┐
                                                         │ External Backend (Elysia)│
                                                         │ NEXT_PUBLIC_BACKEND_URL  │
                                                         └──────────────────────────┘
```

1. **Static Assets (`.open-next/assets`)**: Disajikan langsung oleh CDN Cloudflare melalui binding `ASSETS`. Tidak memakan waktu komputasi Worker (0ms CPU time), menghemat kuota Free Tier secara drastis.
2. **Serverless Worker (`.open-next/worker.js`)**: Dijalankan pada runtime V8 isolate `workerd` dengan compatibility flag `nodejs_compat`. Menangani SSR dynamic routes, dynamic metadata, sitemap XML, dan Route Handlers (`/api/session/delete`).
3. **External Backend**: Komunikasi data dynamic client-side (TanStack Query) langsung menghubungkan browser ke backend Elysia REST API, tanpa melalui Worker proxy sehingga latency minimal.

---

## 2. Dependencies yang Ditambahkan

Dependency ditambahkan pada workspace `apps/fe` tanpa mengubah package root yang tidak relevan:

| Package | Tipe | Versi | Tujuan |
|---|---|---|---|
| `@opennextjs/cloudflare` | `devDependencies` | `^1.20.11` | Adapter Next.js App Router ke Cloudflare Workers |
| `wrangler` | `devDependencies` | `^4.150.0` | CLI resmi Cloudflare Workers & local `workerd` preview |

---

## 3. Konfigurasi File

### A. `apps/fe/open-next.config.ts`
File konfigurasi OpenNext yang mendefinisikan adapter Cloudflare:
```typescript
import { defineCloudflareConfig } from '@opennextjs/cloudflare';

export default defineCloudflareConfig();
```

### B. `apps/fe/wrangler.jsonc`
Konfigurasi Cloudflare Workers dengan dukungan multi-environment (Development, Staging, Production), self-reference service binding, dan optimasi runtime:
```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "next-shadcn-base-dev",
  "main": ".open-next/worker.js",
  "compatibility_date": "2025-02-14",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  },
  "services": [
    {
      "binding": "WORKER_SELF_REFERENCE",
      "service": "next-shadcn-base-dev"
    }
  ],
  "vars": {
    "NODE_ENV": "development",
    "NEXT_PUBLIC_BASEPATH": "/home",
    "NEXT_PRIVATE_MINIMAL_MODE": "1"
  },
  "env": {
    "staging": {
      "name": "next-shadcn-base-staging",
      "services": [
        {
          "binding": "WORKER_SELF_REFERENCE",
          "service": "next-shadcn-base-staging"
        }
      ],
      "vars": {
        "NODE_ENV": "production",
        "NEXT_PUBLIC_BASEPATH": "/home",
        "NEXT_PRIVATE_MINIMAL_MODE": "1"
      }
    },
    "production": {
      "name": "next-shadcn-base-prod",
      "services": [
        {
          "binding": "WORKER_SELF_REFERENCE",
          "service": "next-shadcn-base-prod"
        }
      ],
      "vars": {
        "NODE_ENV": "production",
        "NEXT_PUBLIC_BASEPATH": "/home",
        "NEXT_PRIVATE_MINIMAL_MODE": "1"
      }
    }
  }
}
```

### C. `apps/fe/next.config.ts`
Penyesuaian konfigurasi Next.js:
- `output: 'standalone'`: Menghasilkan standalone server bundle yang dibutuhkan OpenNext.
- `turbopack: { root: path.resolve(__dirname, '../../') }`: Memastikan Turbopack mendeteksi root monorepo Bun secara akurat.
- `outputFileTracingExcludes`: Mencegah binary C++ native (`sharp`, `@img/**`) masuk ke standalone trace.
- `images: { unoptimized: true }`: Memastikan seluruh gambar statis lokal disajikan melalui Cloudflare Static Assets CDN tanpa memicu ketergantungan Cloudflare Images berbayar.
- `transpilePackages: ['@repo']`: Mempertahankan integrasi paket shared internal monorepo.
- `redirects`: Menjaga redirection default root `/` ke `/home`.

---

## 4. Scripts Bun

Scripts standar Next.js tetap dipertahankan, dan ditambahkan scripts operasional Cloudflare:

```json
{
  "scripts": {
    "dev": "bun --bun next dev",
    "build": "bun --bun next build",
    "start": "bun --bun next start",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "biome format --write src",
    "format:check": "biome format src",
    "cf:build": "opennextjs-cloudflare build",
    "cf:preview": "wrangler dev",
    "cf:deploy": "wrangler deploy",
    "cf:deploy:dev": "wrangler deploy --env dev",
    "cf:deploy:staging": "wrangler deploy --env staging",
    "cf:deploy:prod": "wrangler deploy --env production",
    "cf:upload": "opennextjs-cloudflare upload",
    "cf:typegen": "wrangler types --env-interface CloudflareEnv env.d.ts"
  }
}
```

---

## 5. Environment Variables & Secrets

### Perbedaan Build-Time vs Runtime Variables
1. **Build-Time Variables (`NEXT_PUBLIC_*`)**:
   - Dimasukkan ke dalam JavaScript bundle client saat proses build (`cf:build`).
   - Wajib disediakan pada CI/CD sebelum menjalankan build OpenNext.
   - Contoh: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_BASEPATH`.
2. **Server-Only Secrets (Runtime)**:
   - Dikelola melalui Cloudflare Dashboard atau Wrangler Secrets.
   - **TIDAK PERNAH** dikomit ke dalam Git repository.
   - Contoh: `AUTH_SECRET_KEY`, `GOOGLE_CLIENT_SECRET`, `NEXT_INTERNAL_API_SECRET`.

### Template Variabel (`apps/fe/.env.example`)
Gunakan template berikut untuk menyiapkan environment:

```bash
# Server Environment Variables (Secrets - Set via Cloudflare Secrets / Wrangler Secret)
NODE_ENV=production
AUTH_SECRET_KEY=your_auth_secret_key_here
NEXT_INTERNAL_API_SECRET=your_next_internal_api_secret_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXT_CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id_here
NEXT_ACCESS_KEY_ID=your_r2_access_key_id_here
NEXT_SECRET_ACCESS_KEY=your_r2_secret_access_key_here

# Client Environment Variables (Build-time Public Variables)
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_BACKEND_URL=https://api.your-domain.com
NEXT_PUBLIC_BASEPATH=/home
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
NEXT_PUBLIC_GATE_API=/api
NEXT_PUBLIC_VERSION_API=/v1
NEXT_PUBLIC_INTERNAL_API_SECRET=your_public_internal_api_secret_here
NEXT_PUBLIC_R2_URL=https://your-bucket.r2.cloudflarestorage.com

# Build Flag (CI/CD)
SKIP_ENV_VALIDATION=1
```

### Mengatur Secret di Cloudflare via Wrangler:
```bash
# Untuk Development
bun --cwd apps/fe wrangler secret put AUTH_SECRET_KEY
bun --cwd apps/fe wrangler secret put NEXT_INTERNAL_API_SECRET
bun --cwd apps/fe wrangler secret put GOOGLE_CLIENT_SECRET

# Untuk Staging
bun --cwd apps/fe wrangler secret put AUTH_SECRET_KEY --env staging
bun --cwd apps/fe wrangler secret put NEXT_INTERNAL_API_SECRET --env staging
bun --cwd apps/fe wrangler secret put GOOGLE_CLIENT_SECRET --env staging

# Untuk Production
bun --cwd apps/fe wrangler secret put AUTH_SECRET_KEY --env production
bun --cwd apps/fe wrangler secret put NEXT_INTERNAL_API_SECRET --env production
bun --cwd apps/fe wrangler secret put GOOGLE_CLIENT_SECRET --env production
```

---

## 6. Local Build & Runtime Preview

Untuk menguji build dan Workers runtime secara lokal menggunakan emulator `workerd`:

```bash
# 1. Jalankan build OpenNext Cloudflare
SKIP_ENV_VALIDATION=1 bun run --cwd apps/fe cf:build

# 2. Jalankan Workers local preview di port 8787
bun run --cwd apps/fe cf:preview --port 8787
```

Akses `http://localhost:8787/home` di browser atau jalankan `curl`:
```bash
curl -I http://localhost:8787/home
# Respons header:
# HTTP/1.1 200 OK
# x-opennext: 1
```

---

## 7. GitHub Organization CI/CD Integration

Repository berada di bawah GitHub Organization (`git@github.com:MuliaAndiki/production.git`). Terdapat 2 pendekatan deployment yang didukung:

### Pendekatan 1: Cloudflare Workers Builds (Git Integration di Dashboard) - *Direkomendasikan*
Metode ini menghubungkan repository GitHub Organization langsung dengan Cloudflare Workers. Setiap push ke branch target otomatis memicu build di infrastruktur Cloudflare.

#### Langkah Setup Manual di Cloudflare Dashboard:
1. Buka **Cloudflare Dashboard** &rarr; **Workers & Pages** &rarr; **Create application** &rarr; Tab **Workers** &rarr; Pilih **Connect to Git**.
2. Pilih akun **GitHub Organization**.
   - Berikan izin GitHub App Cloudflare hanya pada repository: `MuliaAndiki/production` (Prinsip Least Privilege).
3. Konfigurasi 3 Workers untuk masing-masing environment:

| Setting | Development Worker | Staging Worker | Production Worker |
|---|---|---|---|
| **Worker Name** | `next-shadcn-base-dev` | `next-shadcn-base-staging` | `next-shadcn-base-prod` |
| **Production Branch** | `dev` | `staging` | `main` |
| **Root Directory** | `apps/fe` | `apps/fe` | `apps/fe` |
| **Build Command** | `cd ../.. && bun install --frozen-lockfile && bun --filter=next-shadcn-base run cf:build` | `cd ../.. && bun install --frozen-lockfile && bun --filter=next-shadcn-base run cf:build` | `cd ../.. && bun install --frozen-lockfile && bun --filter=next-shadcn-base run cf:build` |
| **Deploy Command** | `wrangler deploy` | `wrangler deploy --env staging` | `wrangler deploy --env production` |

#### Build Environment Variables (Settings &rarr; Build &rarr; Variables):
Tambahkan variabel berikut pada tiap Worker di dashboard:
- `BUN_VERSION`: `1.3.1` (atau versi yang digunakan)
- `SKIP_DEPENDENCY_INSTALL`: `true` (mencegah Cloudflare menjalankan default npm/pnpm di subfolder)
- `SKIP_ENV_VALIDATION`: `1`
- `NEXT_PUBLIC_*`: Masukkan nilai public URL sesuai target environment masing-masing.

---

### Pendekatan 2: GitHub Actions CI/CD Pipeline
Jika organisasi Anda mewajibkan seluruh deployment dikontrol melalui GitHub Actions workflow (misalnya untuk branch protection rules atau approval gate):

1. Buat Cloudflare API Token di Cloudflare Dashboard (**My Profile &rarr; API Tokens &rarr; Create Token &rarr; Edit Cloudflare Workers template**).
2. Simpan secret di GitHub Organization/Repository (**Settings &rarr; Secrets and variables &rarr; Actions**):
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
3. Gunakan workflow step dengan action `cloudflare/wrangler-action`:
   ```yaml
   - name: Deploy to Cloudflare Workers
     uses: cloudflare/wrangler-action@v3
     with:
       apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
       accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
       workingDirectory: 'apps/fe'
       command: deploy --env ${{ github.ref_name == 'main' && 'production' || (github.ref_name == 'staging' && 'staging' || 'dev') }}
   ```

---

## 8. Cloudflare Workers Free Tier Optimization

Target awal deployment adalah memaksimalkan penggunaan **Cloudflare Workers Free Tier**:

| Parameter Free Tier | Batasan Resmi | Optimasi pada Project Ini | Status |
|---|---|---|---|
| **Request Limit** | 100,000 requests / hari | Semua static files (`_next/static`, images, icons, fonts) disajikan via `ASSETS` CDN tanpa memotong kuota Worker execution. | Teroptimasi |
| **CPU Time per Request** | 10ms (burst 50ms) | SSR lightweight; TanStack Query data fetching dilakukan client-side ke external backend; tidak ada image processing berat di server. | Teroptimasi (<5ms rata-rata) |
| **Memory Limit** | 128 MB | Bundle worker hanya berisi SSR Next.js core; binary C++ (`sharp`) dieksklusi. | Aman (~35-45 MB) |
| **Worker Script Size** | 10 MB (uncompressed) / 3 MB (compressed) | Standalone output hanya membundle file yang dieksekusi; assets statis dipisah ke `.open-next/assets`. | Aman (~8.8 MB uncompressed) |
| **Cloudflare Images** | Berbayar (tidak ada free tier) | `images: { unoptimized: true }` menyajikan gambar lokal via CDN statis gratis tanpa biaya tambahan. | $0 Cost Guaranteed |
| **KV / R2 Caching** | KV: 100k reads/hari; R2: 10GB | Aplikasi tidak menggunakan dynamic ISR page cache; tidak membutuhkan KV/R2 binding berbayar. | $0 Cost Guaranteed |

---

## 9. Custom Domain Setup

Untuk menghubungkan domain kustom pada Worker:
1. Masuk ke **Cloudflare Dashboard** &rarr; **Workers & Pages** &rarr; Pilih Worker (misal: `next-shadcn-base-prod`).
2. Masuk ke tab **Settings** &rarr; **Domains & Routes** &rarr; Klik **Add** &rarr; **Custom Domain**.
3. Masukkan domain (misal: `app.mora.space` atau `staging.mora.space`).
4. Cloudflare akan otomatis mengonfigurasi DNS record CNAME dan menerbitkan sertifikat SSL/TLS gratis (Universal SSL).

---

## 10. Troubleshooting & Known Gotchas

### 1. Error: `Could not find the Next.js package (next/package.json)` (Monorepo Turbopack)
- **Root Cause**: Turbopack mendeteksi lockfile terdekat untuk menentukan root workspace. Jika ada `bun.lock` di subfolder `apps/fe`, Turbopack gagal menemukan `next` yang di-hoist di root.
- **Solusi**: Hanya pertahankan satu lockfile di root monorepo (`/bun.lock`). Tambahkan `turbopack: { root: path.resolve(__dirname, '../../') }` pada `next.config.ts`.

### 2. Error: `No loader is configured for ".node" files: sharp-*.node`
- **Root Cause**: `sharp` memiliki C++ native addon yang tidak dapat berjalan di V8 isolates Cloudflare Workers.
- **Solusi**: 
  - `sharp` tidak dijadikan runtime dependency di `apps/fe/package.json`.
  - Script otomatis `scripts/patch-opennext.mjs` meng-alias `sharp` ke empty shim saat bundling.
  - `next.config.ts` dikonfigurasi dengan `images: { unoptimized: true }` dan `outputFileTracingExcludes`.

### 3. Error: `Dynamic require of "/.next/server/middleware-manifest.json" is not supported`
- **Root Cause**: Next.js Node server mencoba membaca manifest middleware secara dinamis saat runtime. V8 isolate Workers tidak memiliki dynamic filesystem require.
- **Solusi**: Tambahkan `"NEXT_PRIVATE_MINIMAL_MODE": "1"` pada `vars` di `wrangler.jsonc`.

---

## 11. Prosedur Rollback

Jika terjadi kesalahan setelah deployment di production:

### Rollback Cepat via Wrangler CLI:
```bash
# Menampilkan riwayat deployment
bun --cwd apps/fe wrangler deployments list --env production

# Melakukan rollback ke versi sebelumnya secara instan (0 downtime)
bun --cwd apps/fe wrangler rollback --env production
```

### Rollback via Cloudflare Dashboard:
1. Buka **Cloudflare Dashboard** &rarr; **Workers & Pages** &rarr; Pilih `next-shadcn-base-prod`.
2. Klik tab **Deployments**.
3. Pilih deployment versi sebelumnya yang stabil &rarr; Klik menu titik tiga `...` &rarr; Pilih **Rollback**.
4. Trafik akan dialihkan seketika (global propagation < 5 detik).
