export interface KnowledgeSeedItem {
  id: string
  title: string
  category: 'REGULASI' | 'SOP_LAYANAN' | 'FAQ' | 'PROFIL_DESA'
  sourceUrl?: string
  contentText: string
  metadata: Record<string, unknown>
  chunks: string[]
}

export const knowledgeSeedData: KnowledgeSeedItem[] = [
  {
    id: 'doc-sop-layanan-surat',
    title:
      'Standar Operasional Prosedur (SOP) Pelayanan Persuratan Mandiri Desa',
    category: 'SOP_LAYANAN',
    sourceUrl: 'https://desa-mandara.id/sop/layanan-surat',
    contentText:
      'SOP Pelayanan Persuratan Desa Mandara mengatur alur pengajuan dokumen kependudukan secara digital melalui DesaAI. Warga dapat mengajukan permohonan surat seperti Surat Domisili, SKU, SKCK, dan SKTM melalui aplikasi atau WhatsApp chatbot. Berkas akan diverifikasi oleh petugas pelayanan dalam kurun waktu 1x24 jam kerja. Setelah disetujui, surat ditandatangani secara elektronik (TTE) dan warga menerima dokumen digital ber-QR Code resmi tanpa dipungut biaya retribusi (gratis).',
    metadata: {
      nomorSOP: 'SOP/01/PELAYANAN/2026',
      tanggalBerlaku: '2026-01-01',
      penanggungJawab: 'Kasi Pelayanan Desa',
    },
    chunks: [
      'Alur pengajuan surat warga: 1. Warga memilih jenis surat dan mengunggah berkas syarat; 2. Verifikasi otomatis kelengkapan berkas oleh sistem; 3. Validasi berkas oleh petugas desa; 4. Penandatanganan dokumen dan penerbitan QR Code legalitas.',
      'Ketentuan waktu dan biaya: Seluruh pelayanan administrasi persuratan di Desa Mandara bebas biaya (Rp 0). Estimasi waktu pengerjaan adalah maksimal 1 hari kerja untuk surat standar dan 2 hari kerja untuk surat yang memerlukan verifikasi lapangan seperti SKTM dan SKU.',
    ],
  },
  {
    id: 'doc-perdes-kebersihan-lingkungan',
    title:
      'Peraturan Desa Mandara No. 03 Tahun 2025 tentang Pengelolaan Sampah dan Kebersihan Wilayah Banjar',
    category: 'REGULASI',
    sourceUrl: 'https://jdih.desa-mandara.id/perdes-03-2025',
    contentText:
      'Peraturan Desa Mandara No. 03 Tahun 2025 mewajibkan pemilahan sampah berbasis sumber (organik, anorganik, residu) di setiap rumah tangga dan tempat usaha di wilayah desa. Pengangkutan sampah diatur secara berkala oleh Satgas Kebersihan Banjar. Dilarang keras membuang sampah atau limbah ke sungai, saluran irigasi subak, atau lahan terbuka. Pelanggaran dikenakan sanksi teguran tertulis hingga denda pembinaan adat banjar.',
    metadata: {
      nomorPerdes: '03/2025',
      tahun: 2025,
      bidang: 'Lingkungan Hidup & Kebersihan',
    },
    chunks: [
      'Kewajiban pemilahan sampah: Setiap kepala keluarga diwajibkan memilah sampah menjadi sampah organik (masuk biopori/kompos), sampah anorganik terdaur (disetor ke Bank Sampah Desa), dan residu.',
      'Jadwal pengangkutan sampah residu dilakukan oleh armada desa setiap hari Selasa, Kamis, dan Sabtu mulai pukul 06.00 hingga 09.00 WITA. Warga dilarang meletakkan sampah di luar jadwal penjemputan.',
      'Larangan dan sanksi: Membuang sampah sembarangan di badan jalan, selokan, maupun area pura dikenai sanksi peringatan lisan, peringatan tertulis, dan denda sanksi adat pembersihan lingkungan banjar.',
    ],
  },
  {
    id: 'doc-profil-desa-mandara',
    title:
      'Profil Wilayah, Visi Misi, dan Jam Operasional Kantor Desa Mandara',
    category: 'PROFIL_DESA',
    sourceUrl: 'https://desa-mandara.id/profil',
    contentText:
      'Desa Mandara merupakan desa percontohan cerdas (Smart Village) yang terletak di wilayah pesisir dan agraris Bali. Desa Mandara terbagi menjadi 4 Banjar Adat dan Dinas: Banjar Kaja, Banjar Kelod, Banjar Tengah, dan Banjar Kangin, dengan total populasi 4.850 jiwa. Visi desa adalah mewujudkan tata kelola desa berbasis transparansi digital, berkeadilan sosial, dan berakar pada kearifan lokal Tri Hita Karana. Jam pelayanan kantor desa: Senin - Jumat pukul 08.00 - 15.30 WITA.',
    metadata: {
      kabupaten: 'Denpasar',
      provinsi: 'Bali',
      kodePos: '80237',
      teleponKantor: '0361-223344',
    },
    chunks: [
      'Struktur wilayah Desa Mandara mencakup 4 banjar: Banjar Kaja (utara), Banjar Kelod (selatan), Banjar Tengah (pusat desa dan kantor desa), serta Banjar Kangin (timur).',
      'Jam operasional dan layanan aduan: Kantor Desa Mandara buka Senin-Jumat 08.00 - 15.30 WITA. Layanan pengaduan gawat darurat (pohon tumbang, lampu padam, ketertiban) dapat diakses 24/7 melalui sistem DesaAI.',
    ],
  },
  {
    id: 'doc-faq-desa-ai',
    title: 'Tanya Jawab Umum (FAQ) Penggunaan Layanan Digital DesaAI',
    category: 'FAQ',
    sourceUrl: 'https://desa-mandara.id/bantuan',
    contentText:
      'Panduan pertanyaan yang sering diajukan warga terkait DesaAI: Cara mengajukan pengaduan warga, cara melacak status permohonan surat menggunakan kode tracking, kerahasiaan identitas pelapor (opsi anonim), dan integrasi notifikasi via WhatsApp.',
    metadata: {
      versi: '2.0',
      terakhirDiperbarui: '2026-09-19',
    },
    chunks: [
      'Bagaimana cara memantau permohonan surat? Setiap pengajuan surat menghasilkan kode tracking unik (contoh: REQ-202609-0001). Masukkan kode tersebut pada kolom lacak surat di website DesaAI untuk melihat status real-time.',
      'Apakah melapor kerusakan fasilitas umum dipungut biaya? Tidak, semua pelaporan pengaduan infrastruktur dan kebersihan bebas biaya dan secara otomatis diklasifikasi oleh kecerdasan buatan (AI triage) ke dinas/banjar terkait.',
    ],
  },
]
