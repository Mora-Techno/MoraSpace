Kamu adalah senior full-stack engineer. Implementasikan fitur chat pribadi (1-to-1) dan grup chat pada project ini, menggunakan WebSocket + event untuk komunikasi real-time.

Baca arsitektur dan konvensi project terlebih dahulu, lalu kerjakan backend dan frontend sampai terintegrasi. Ikuti stack, pola komponen, autentikasi, ORM, dan design system yang sudah digunakan. Jangan membaca atau menampilkan isi `.env`, credential, atau secret.

### 1. Audit dan rencana implementasi

Periksa:
- Struktur backend dan frontend.
- Sistem autentikasi serta identitas pengguna.
- Model database dan mekanisme migrasi.
- Dukungan WebSocket yang sudah tersedia.
- Pola state management, fetching, dan komponen UI.
- Topologi deployment: satu atau beberapa instance backend.

Sampaikan temuan dan rencana singkat, kemudian lanjutkan implementasi. Jangan berhenti hanya pada audit atau rencana. Jangan mengganti stack atau melakukan refactor besar di luar kebutuhan fitur.

### 2. Chat pribadi

Implementasikan:
- Mencari dan memilih pengguna yang boleh dihubungi sesuai aturan aplikasi.
- Membuka atau membuat percakapan pribadi.
- Satu percakapan pribadi untuk pasangan pengguna yang sama. Pastikan request bersamaan tidak membuat duplikasi.
- Mengirim dan menerima pesan teks secara real-time.
- Riwayat pesan dengan cursor pagination.
- Preview pesan terakhir, waktu pesan, dan jumlah pesan belum dibaca.
- Indikator sedang mengetik.
- Status pesan: mengirim, tersimpan di server, gagal, dan dibaca.
- Retry pesan gagal tanpa membuat pesan ganda.

Jangan menampilkan status “terkirim ke perangkat penerima” jika belum ada acknowledgement dari perangkat penerima. Bedakan pesan tersimpan di server dengan pesan sudah dibaca.

### 3. Grup chat

Implementasikan:
- Membuat grup dengan nama dan anggota awal.
- Menampilkan informasi serta daftar anggota.
- Mengubah nama dan deskripsi grup.
- Menambah dan mengeluarkan anggota.
- Keluar dari grup.
- Role `OWNER`, `ADMIN`, dan `MEMBER`.
- Owner dapat mengangkat atau menurunkan admin dan memindahkan kepemilikan.
- Admin dapat mengelola informasi grup dan anggota biasa, tetapi tidak dapat mengeluarkan owner atau mengubah kepemilikan.
- Member dapat membaca dan mengirim pesan serta keluar dari grup.
- Owner harus memindahkan kepemilikan sebelum keluar; jika menjadi anggota terakhir, grup boleh diarsipkan.

Default kebijakan riwayat: anggota baru dapat membaca riwayat grup selama menjadi anggota aktif. Setelah keluar atau dikeluarkan, pengguna tidak boleh mengambil riwayat lagi atau menerima event baru. Dokumentasikan kebijakan ini.

### 4. Model data

Sesuaikan dengan ORM project. Minimal mencakup:
- Conversation: tipe `DIRECT` atau `GROUP`, nama, deskripsi, dan timestamp.
- ConversationMember: user, role, waktu bergabung, dan posisi pesan terakhir yang sudah dibaca.
- Message: conversation, pengirim, isi, `clientMessageId`, dan urutan pesan yang ditentukan server.

Tambahkan:
- Constraint percakapan pribadi untuk pasangan pengguna yang sama.
- Constraint keanggotaan agar tidak duplikat.
- Constraint idempotensi berdasarkan pengirim dan `clientMessageId`.
- Index untuk daftar percakapan, pagination pesan, dan unread count.

Gunakan urutan pesan yang stabil dari server untuk pagination, sinkronisasi, dan read receipt. Jangan mengandalkan jam perangkat pengguna.

### 5. HTTP API dan event WebSocket

Gunakan HTTP API untuk daftar percakapan, riwayat, pencarian pengguna, dan pengelolaan grup. Gunakan WebSocket untuk pengiriman pesan dan pembaruan real-time.

Definisikan kontrak payload, validasi, acknowledgement, dan error secara konsisten.

Event client → server minimal:
- `conversation:subscribe`
- `conversation:unsubscribe`
- `message:send`
- `typing:start`
- `typing:stop`
- `message:read`

Event server → client minimal:
- `message:new`
- `message:read`
- `typing:update`
- `conversation:updated`
- `conversation:membership_changed`

Alur mengirim pesan:
1. Autentikasi dan validasi payload.
2. Periksa keanggotaan aktif serta izin mengirim.
3. Simpan pesan ke database.
4. Setelah transaksi berhasil, kirim acknowledgement berisi pesan canonical dari server.
5. Broadcast pesan ke anggota yang berhak.

Jika `clientMessageId` yang sama dikirim ulang, kembalikan pesan yang sudah tersimpan tanpa membuat pesan baru.

### 6. Keamanan dan privasi

Wajib:
- HTTPS dan WSS pada production.
- Gunakan autentikasi project yang sudah ada.
- Jangan menaruh token sensitif dalam URL WebSocket.
- Validasi origin sesuai mekanisme autentikasi dan deployment.
- Periksa akses pada setiap endpoint dan event, bukan hanya saat koneksi dibuka.
- Jangan percaya `senderId`, role, atau daftar penerima dari client.
- Batasi panjang pesan, ukuran payload, frekuensi kirim, dan event typing.
- Render pesan sebagai teks aman untuk mencegah XSS.
- Jangan mencatat isi pesan atau token dalam log.
- Keluarkan anggota yang dicabut aksesnya dari subscription real-time.
- Tangani logout dan sesi kedaluwarsa dengan mencabut akses koneksi.

Pastikan perlindungan database dan backup didokumentasikan sesuai deployment.

Scope awal menggunakan enkripsi transport HTTPS/WSS. Jangan mengklaim fitur ini E2EE: server masih dapat membaca pesan. Jangan membuat algoritma kriptografi sendiri. Jika project sudah menggunakan E2EE, pertahankan mekanismenya dan sesuaikan implementasi.

### 7. Reconnect dan konsistensi

Implementasikan:
- Reconnect dengan exponential backoff dan jitter.
- Sinkronisasi pesan terlewat setelah reconnect melalui cursor dari server.
- Deduplikasi berdasarkan ID pesan dan `clientMessageId`.
- Optimistic UI yang direkonsiliasi dengan pesan canonical server.
- Pesan gagal tetap terlihat dan dapat dicoba kembali.
- Sinkronisasi unread count dan status dibaca pada beberapa tab atau perangkat.
- Typing bersifat sementara, memiliki expiry, dan tidak disimpan ke database.
- Status dibaca hanya diperbarui ketika percakapan terbuka, halaman aktif, dan pesan sudah terlihat.
- Read cursor tidak boleh bergerak mundur.

Database menjadi sumber kebenaran. Jangan menganggap broadcast WebSocket pasti diterima semua perangkat.

Jika backend berjalan di beberapa instance, gunakan pub/sub yang sesuai agar event dapat diterima lintas instance. Jika hanya satu instance, jangan menambah infrastruktur yang belum dibutuhkan. Dokumentasikan batasannya.

### 8. Frontend dan pengalaman pengguna

Bangun UI responsif mengikuti design system project:
- Daftar percakapan dengan pencarian, preview pesan, dan unread badge.
- Halaman chat dengan header, riwayat, composer, indikator typing, dan status koneksi.
- Pesan sendiri dan orang lain mudah dibedakan.
- Dalam grup, tampilkan identitas pengirim.
- Panel informasi grup dan pengelolaan anggota sesuai role.
- Loading state, empty state, error state, dan retry.
- Enter untuk mengirim, Shift+Enter untuk baris baru; jangan mengirim saat pengguna masih melakukan komposisi teks melalui IME.
- Auto-scroll ketika pengguna berada dekat pesan terbaru atau mengirim pesan sendiri.
- Jika pengguna sedang membaca pesan lama, tampilkan indikator pesan baru tanpa memaksa scroll.
- Saat memuat riwayat lama, pertahankan posisi scroll.
- Pastikan navigasi keyboard, label input, dan kontras dapat digunakan dengan nyaman.

Jangan menambahkan attachment, voice call, video call, atau fitur lain di luar scope awal pesan teks.

### 9. Pengujian

Jalankan lint, typecheck, build, dan pengujian relevan sesuai project.

Verifikasi minimal:
- Chat pribadi tidak duplikat saat dibuat bersamaan.
- Pesan tersimpan dan diterima pengguna yang tepat.
- Retry tidak membuat pesan ganda.
- Non-anggota gagal mengambil riwayat, subscribe, atau mengirim pesan.
- Anggota yang dikeluarkan kehilangan akses pada koneksi yang masih aktif.
- Role grup bekerja sesuai aturan.
- Reconnect mengambil pesan terlewat tanpa duplikasi.
- Pagination tidak melewatkan pesan.
- Read receipt dan unread count konsisten.
- Pesan berisi HTML/script ditampilkan sebagai teks aman.

Jangan mengklaim pengujian berhasil jika belum dijalankan.

### 10. Hasil akhir

Selesaikan implementasi, lalu laporkan:
- Fitur yang selesai.
- Perubahan utama dan migrasi database.
- Kontrak HTTP API dan event.
- Cara menjalankan serta mencoba dengan dua pengguna.
- Hasil pengujian yang benar-benar dijalankan.
- Konfigurasi deployment yang diperlukan.
- Keterbatasan yang masih ada.

Jika menemukan blocker, jelaskan secara konkret dan lanjutkan bagian lain yang tidak bergantung pada blocker tersebut.