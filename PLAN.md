# Spaces v0.0.2 — Rencana Detail: Status Jam Kerja yang Terlihat
*Tingkat konsep dan produk, tanpa kode. Label: **[Keputusan]** sudah disepakati, **[Asumsi]** belum terbukti, **[Terbuka]** perlu kamu putuskan.*

---

## 1. Tujuan dan Hipotesis

**Tujuan:** membuat "Respect Working Hours" terlihat dan terasa oleh orang yang baru memakai Spaces, bukan hanya berjalan diam-diam di balik layar.

**Hipotesis yang diuji:**
1. Pengirim yang tahu pesannya akan tertahan merasa lebih tenang, bukan terhalang.
2. Penerima merasa terlindungi dan lebih jarang membuka app di luar jam kerja.
3. Tim akan menghormati status ini tanpa kembali ke WhatsApp untuk urusan biasa.

**Ukuran berhasil (dicatat sejak hari pertama):**
- Berapa kali orang mengirim pesan atau meng-assign task ke rekan yang sedang di luar jam kerja.
- Berapa kali tombol "mendesak" dipakai, oleh siapa, dan berapa yang ditandai berlebihan.
- Apakah jumlah pembukaan app di luar jam kerja turun dibanding sebelum fitur ini.
- Umpan balik tim di catatan harian: "melegakan" atau "menghalangi".

---

## 2. Lingkup

### Masuk v0.0.2
1. **Label status** per anggota: "Sedang kerja" atau "Kembali [hari] [jam]".
2. **Penempatan label** di daftar anggota, header percakapan chat, dan saat memilih assignee task.
3. **Info saat mengirim**: di chat atau assign task ke orang yang sedang di luar jam kerja, muncul satu baris "Akan sampai [hari] [jam]".
4. **Tombol "Mendesak"** dengan batas pemakaian (lihat bagian 3).
5. **Pencatatan kejadian** untuk ukuran berhasil di atas.
6. **Ringkasan untuk Owner**: seberapa sering "mendesak" dipakai (satu angka sederhana di pengaturan atau notifikasi).

### Sengaja ditunda
Jam kerja per orang, zona waktu berbeda, status manual (cuti, fokus), integrasi dengan pomodoro, ringkasan "yang tertahan semalam" (nomor 1, antre berikutnya), chat esensial (nomor 3), impor data (nomor 4, parkir).

---

## 3. Aturan Perilaku

**Status diturunkan otomatis** dari kebijakan jam kerja perusahaan yang sudah ada. Tidak ada pengaturan baru untuk Member.

| Situasi | Perilaku |
|---|---|
| Penerima dalam jam kerja | Status "Sedang kerja", pesan terkirim seperti biasa |
| Penerima di luar jam kerja | Status "Kembali [hari] [jam]", pesan tersimpan dan sampai saat jam kerja mulai |
| Akhir pekan atau hari libur | Mengikuti kebijakan perusahaan. **[Terbuka]** apakah hari libur nasional ikut dihitung, saya sarankan tidak di v0.0.2 |
| Pengirim menekan "Mendesak" | Pesan menembus, ditandai khusus, tercatat untuk Owner |

**[Keputusan sementara, kamu bisa ubah]** Pesan mendesak boleh, dengan batas. Alasannya: tanpa jalur darurat orang kembali ke WhatsApp, dan tanpa batas semua orang menandai urgent.

**[Asumsi]** batas awal tiga pesan mendesak per orang per hari, bisa diubah Owner. Angkanya tebakan, jangan dianggap benar sebelum dilihat dari data pemakaian.

**[Keputusan]** Privasi: yang ditampilkan hanya status dan jam kembali. Tidak ada alasan, tidak ada aktivitas terakhir, tidak ada isi pesan di data pengukuran.

**[Asumsi]** satu zona waktu per perusahaan di v0.0.2.

---

## 4. Pengalaman Pengguna per Peran

**Member**
- Melihat status semua rekan, dan statusnya sendiri.
- Mengirim pesan dan assign task dengan informasi kapan sampai.
- Memakai "Mendesak" sampai batas harian.

**Owner**
- Semua hal Member.
- Mengatur batas "Mendesak" dan melihat angka pemakaian.
- Tidak mendapat hak istimewa menembus jam kerja anggota **[Terbuka]**: apakah Owner perlu jalur khusus. Saran saya tidak, supaya aturannya konsisten.

**Penempatan visual** (untuk dibahas dengan designer): label kecil, tenang, tidak merah. Di luar jam kerja bukan "error" tapi keadaan normal yang nyaman.

---

## 5. Pengukuran dan Privasi

Kejadian yang dicatat: pesan terkirim ke penerima di luar jam kerja, tombol mendesak dipakai, status dilihat, app dibuka di luar jam kerja. Dicatat tanpa isi pesan dan tanpa isi task. Beri tahu tim dan beta tester dengan jelas apa yang dicatat, karena brand Mora menjanjikan privasi.

---

## 6. Pembagian Kerja

| Bidang | Tugas |
|---|---|
| **Kamu (develop)** | Penurunan status dari kebijakan jam kerja, penahanan dan pengiriman pesan, jalur mendesak berikut batasnya, pencatatan kejadian |
| **Designer** | Tampilan label status, pesan "akan sampai ...", tampilan pesan mendesak, keadaan kosong dan keadaan di luar jam kerja, pastikan sesuai arah visual yang dipilih |
| **PM / Ops** | Menyusun skenario uji dari sudut pemakai nyata, menyiapkan pertanyaan untuk dogfooding dan wawancara eksternal |
| **Admin** | Merapikan catatan temuan harian tim di Spaces |

---

## 7. Jadwal Kasar (10 hari kerja)

| Hari | Fokus |
|---|---|
| 1 | Keputusan terbuka diputuskan, desain label dan alur "mendesak" disepakati dengan designer |
| 2-4 | Penurunan status dan penahanan pesan, diuji di dev |
| 5 | Jalur "mendesak" dan batasnya |
| 6 | Penempatan label di daftar anggota, chat, dan assign task |
| 7 | Pencatatan kejadian dan ringkasan untuk Owner |
| 8 | Staging: pengujian skenario bersama tim |
| 9 | Perbaikan temuan P0 dan P1 saja |
| 10 | Rilis ke prod, tim mulai memakai dan mencatat |

Rilis dengan **bendera fitur** supaya bisa dimatikan cepat bila ternyata mengganggu.

---

## 8. Skenario Uji Wajib

1. Penerima tepat di batas awal dan akhir jam kerja.
2. Pesan dikirim Jumat sore, sampai Senin pagi.
3. Perubahan kebijakan jam kerja saat ada pesan tertahan.
4. Batas "Mendesak" tercapai: apa yang dilihat pengirim.
5. Owner mengubah batas, berlaku mulai kapan.
6. Penerima dihapus dari workspace saat pesannya tertahan.
7. Dua orang saling kirim saat sama-sama di luar jam kerja.
8. Member baru bergabung di luar jam kerja.
9. Pengguna membuka app di luar jam kerja: apakah pesan lama tetap terbaca.

---

## 9. Risiko

| Risiko | Penanganan |
|---|---|
| Tim menganggap fitur ini menghalangi | Catatan harian + bendera fitur untuk mematikan |
| "Mendesak" disalahgunakan | Batas harian dan angka terlihat oleh Owner |
| Pesan tertahan hilang atau terlambat | Skenario uji 2, 3, 6 sebelum rilis |
| Perhatian pecah dengan mobile dan perbaikan bug | Mobile dibatasi versi tipis, bug hanya P0 dan P1 |
| Fitur selesai tapi tidak ada yang divalidasi | Wawancara eksternal dijadwalkan paralel (lihat bagian 10) |

---

## 10. Jalur Paralel (jangan dilewatkan)

Fitur ini hanya bernilai kalau hipotesisnya benar, dan itu hanya bisa dijawab orang di luar tim. Selama 10 hari ini:

- Jadwalkan 3-5 obrolan 20 menit dengan orang di luar tim (software house, agency, startup).
- Pertanyaan kunci: kapan terakhir notifikasi kerja mengganggu di luar jam kerja, bagaimana tim mereka menangani pesan darurat, dan apakah mereka mau ada batas seperti ini.
- Jangan sebut produkmu sampai akhir obrolan.

---

## 11. Definisi Selesai

- [ ] Status benar di semua skenario uji bagian 8.
- [ ] Tidak ada bug P0, bug P1 di jalur pesan sudah diperbaiki.
- [ ] Pencatatan kejadian berjalan di staging dan prod.
- [ ] Tim memakai selama minimal 5 hari kerja dengan catatan harian.
- [ ] Minimal 3 obrolan eksternal sudah terjadi dan dirangkum.
- [ ] Angka pemakaian "mendesak" dan pengiriman ke penerima di luar jam kerja sudah ada untuk dibahas.

---

## 12. Keputusan Terbuka (isi sebelum hari 1)

1. Batas awal "Mendesak" per hari: [ ]
2. Hari libur nasional ikut dihitung atau tidak: [ ]
3. Owner punya jalur khusus atau tidak: [ ]
4. Siapa yang menghubungi 3-5 orang eksternal dan kapan: [ ]