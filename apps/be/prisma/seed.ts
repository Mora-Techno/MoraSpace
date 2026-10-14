import prisma from './client/index';

const POSTS = [
  {
    title: 'Mulai Fokus dengan Pomodoro yang Konsisten',
    slug: 'mulai-fokus-dengan-pomodoro',
    excerpt:
      'Teknik Pomodoro 25 menit membantu otak masuk ke mode fokus tanpa kelelahan. Ini panduan memulainya dari nol.',
    content: `Fokus bukan bakat, melainkan kebiasaan yang dilatih.

Teknik Pomodoro membagi kerja menjadi interval 25 menit yang diselingi istirahat 5 menit. Setelah empat sesi, ambil istirahat panjang 15–30 menit.

Aturan mainnya sederhana. Pertama, pilih satu tugas sebelum timer mulai. Kedua, selama timer berjalan, tidak ada distraksi: tutup tab yang tidak perlu dan senyapkan notifikasi. Ketiga, catat setiap distraksi yang muncul di kertas, lalu kembali ke tugas.

Di MoraSpace, sesi Pomodoro tercatat otomatis dan terhubung dengan tugasmu, sehingga kamu bisa melihat korelasi antara waktu fokus dan progres tugas.

Mulailah dari dua sesi per hari. Konsistensi mengalahkan intensitas: otak membentuk jalur fokus baru dalam 2–3 minggu latihan rutin.`,
    category: 'Produktivitas',
    authorName: 'Tim MoraSpace',
    publishedAt: new Date('2026-09-20T09:00:00Z'),
  },
  {
    title: 'Jam Kerja Sehat untuk Tim Kecil',
    slug: 'jam-kerja-sehat-untuk-tim-kecil',
    excerpt:
      'Notifikasi di luar jam kerja membunuh fokus esok hari. Begini cara tim kecil menegakkan batas yang manusiawi.',
    content: `Tim kecil sering terjebak budaya selalu siaga. Padahal riset menunjukkan interupsi di luar jam kerja menurunkan kualitas tidur dan fokus keesokan harinya.

Langkah pertama adalah menyepakati jam operasional tertulis: jam mulai, jam selesai, dan hari kerja. Tempel di tempat yang terlihat semua anggota.

Langkah kedua, bedakan pesan darurat dan biasa. Hanya yang darurat yang boleh menembus batas jam kerja; sisanya antre dan dikirim saat jam operasional tiba.

Langkah ketiga, pimpinan memberi contoh. Atasan yang mengirim pesan tengah malam memberi sinyal bahwa batas itu tidak nyata.

MoraSpace mendukung kebijakan ini lewat Working Hours: notifikasi non-kritis otomatis antre di luar jam operasional perusahaan.`,
    category: 'Tim',
    authorName: 'Tim MoraSpace',
    publishedAt: new Date('2026-09-27T09:00:00Z'),
  },
  {
    title: 'Kanban Sederhana Tanpa Birokrasi',
    slug: 'kanban-sederhana-tanpa-birokrasi',
    excerpt:
      'Papan Kanban yang efektif hanya butuh tiga kolom dan satu aturan WIP. Sisanya adalah distraksi.',
    content: `Banyak tim gagal dengan Kanban bukan karena metodenya sulit, tapi karena papan mereka terlalu rumit.

Mulai dari tiga kolom: Antrian, Dikerjakan, Selesai. Satu aturan: batasi pekerjaan dalam progres (WIP) maksimal tiga kartu per orang. Aturan tunggal ini memaksa prioritas dan mencegah setengah-jadi menumpuk.

Kartu yang baik punya tiga hal: judul kata kerja yang jelas, satu penanggung jawab, dan definisi selesai yang bisa dicek. Tanpa ketiganya, kartu hanya jadi daftar keinginan.

Review papan 10 menit tiap pagi: apa yang macet, apa yang selesai, apa yang mulai hari ini. Rapat status panjang tidak diperlukan kalau papan jujur.`,
    category: 'Produktivitas',
    authorName: 'Tim MoraSpace',
    publishedAt: new Date('2026-10-04T09:00:00Z'),
  },
  {
    title: 'Mengapa Kami Membangun Spaces',
    slug: 'mengapa-kami-membangun-spaces',
    excerpt:
      'Alat kerja modern terfragmentasi di belasan aplikasi. Spaces menyatukan tugas, fokus, dan arsip dalam satu tempat yang tenang.',
    content: `Rata-rata pekerja pengetahuan berpindah aplikasi ratusan kali sehari. Setiap perpindahan memakan biaya konteks: butuh belasan menit untuk kembali fokus penuh.

Spaces lahir dari frustrasi itu. Satu workspace berisi tugas (Kanban), timer fokus (Pomodoro), catatan, kalender, dan musik — tanpa perlu berpindah tab.

Prinsip desain kami: tenang secara default. Tidak ada badge merah yang berteriak, tidak ada notifikasi yang tidak diminta. Yang darurat langsung sampai; sisanya menunggu jam kerja.

Kami membangun perlahan bersama penguji beta. Setiap fitur harus memenangkan tempatnya: kalau tidak dipakai tiap minggu, ia tidak layak ada.`,
    category: 'Filosofi',
    authorName: 'Mulia Andiki',
    publishedAt: new Date('2026-10-11T09:00:00Z'),
  },
];

for (const post of POSTS) {
  await prisma.blogPost.upsert({
    where: { slug: post.slug },
    update: {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      authorName: post.authorName,
      status: 'published',
      publishedAt: post.publishedAt,
    },
    create: { ...post, status: 'published' },
  });
}

console.log(`Seeded ${POSTS.length} blog posts`);
await prisma.$disconnect();
