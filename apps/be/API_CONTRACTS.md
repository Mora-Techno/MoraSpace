# API contract alignment

Kontrak request diperiksa terhadap koleksi Bruno di `MoraDoc/collections/Space` menggunakan `bun run test:contracts`. Override lokasi koleksi dengan `bun run scripts/check-bruno-contracts.ts /path/to/collection` bila kedua repositori tidak berada dalam folder induk yang sama.

Jalankan tes regresi dengan `bun test`. Tes kontrak memakai database stub dan verifikasi signature provider lokal; tidak menjalankan email, pembayaran, atau koneksi database nyata.

## Migrasi

Migrasi `20261004163000_align_api_contracts` menambahkan metadata JSON pada sesi pomodoro dan mengisi status/prioritas task serta tipe kepegawaian yang belum ada untuk perusahaan lama. Data referensi kustom tidak diganti. Perusahaan baru memperoleh defaults yang sama saat registrasi.

Terapkan pada database development/test yang dituju sebelum menjalankan kode baru:

```sh
bunx prisma migrate deploy
bun run prisma:generate
```

Pembuatan perubahan ini tidak menerapkan migrasi ke database bersama/produksi.

Endpoint referensi UUID:

- `GET /api/v1/tasks/statuses`
- `GET /api/v1/tasks/priorities`
- `GET /api/v1/members/employment-types`

Ketiganya membutuhkan token dengan company membership dan hanya mengembalikan data perusahaan pada token.

## Perilaku yang diselaraskan

- Subscription dan mailer memvalidasi JWT sebelum controller membaca user.
- Middleware JWT memastikan session akses masih aktif; logout/delete session langsung mencabut akses token terkait. JWT baru memiliki ID unik.
- Settings personal memakai `userId`; settings company memakai `companyMemberId`.
- Undangan tim mempertahankan path `/teams/inviteMember`, dengan `teamId` wajib dalam body. Shared DTO/SDK ikut diperbarui.
- `HttpResponse.ok(data, meta, message)` memakai objek metadata; pesan berada di argumen ketiga. Timing request berada pada context per request.
- Shared SDK mempertahankan status dan metadata respons.
- Stripe memverifikasi raw body dengan `constructEventAsync`. Hanya POST ke dua path webhook provider yang melewati internal key; signature/callback token tetap wajib.
- Filter subscription menerima `canceled`, `incomplete`, dan `past_due`. Ejaan lama `cancelled` diterjemahkan menjadi `canceled`.
- Metadata pomodoro disimpan; durasi eksplisit adalah integer nonnegatif dalam detik. Filter status didukung: `active` dan `completed`.
- Endpoint session dan stop pomodoro memeriksa kepemilikan resource.
