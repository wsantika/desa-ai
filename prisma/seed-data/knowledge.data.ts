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
      'Standar Operasional Prosedur (SOP) Pelayanan Persuratan Mandiri Desa Tegal Tugu',
    category: 'SOP_LAYANAN',
    sourceUrl: 'https://tegaltugu.desa.id/sop/layanan-surat',
    contentText:
      'SOP Pelayanan Persuratan Desa Tegal Tugu mengatur alur pengajuan dokumen kependudukan secara digital melalui DesaAI. Warga dapat mengajukan permohonan surat seperti Surat Keterangan Domisili, SKU, SKCK, dan SKTM melalui aplikasi atau portal warga. Berkas akan diverifikasi oleh petugas pelayanan dalam kurun waktu 1x24 jam kerja. Setelah disetujui, surat ditandatangani secara elektronik (TTE) dan warga menerima dokumen digital ber-QR Code resmi tanpa dipungut biaya retribusi (gratis Rp 0).',
    metadata: {
      nomorSOP: 'SOP/01/PELAYANAN/2026',
      tanggalBerlaku: '2026-01-01',
      penanggungJawab: 'Kasi Pelayanan Desa Tegal Tugu',
    },
    chunks: [
      'Alur pengajuan surat warga: 1. Warga memilih jenis surat dan mengunggah berkas syarat; 2. Verifikasi otomatis kelengkapan berkas oleh sistem; 3. Validasi berkas oleh petugas Desa Tegal Tugu; 4. Penandatanganan dokumen dan penerbitan QR Code legalitas.',
      'Ketentuan waktu dan biaya: Seluruh pelayanan administrasi persuratan di Desa Tegal Tugu bebas biaya (Rp 0). Estimasi waktu pengerjaan adalah maksimal 1 hari kerja untuk surat standar dan 2 hari kerja untuk surat yang memerlukan verifikasi lapangan seperti SKTM dan SKU.',
    ],
  },
  {
    id: 'doc-perdes-kebersihan-lingkungan',
    title:
      'Peraturan Desa Tegal Tugu No. 03 Tahun 2025 tentang Pengelolaan Sampah dan Kebersihan Wilayah Banjar',
    category: 'REGULASI',
    sourceUrl: 'https://jdih.tegaltugu.desa.id/perdes-03-2025',
    contentText:
      'Peraturan Desa Tegal Tugu No. 03 Tahun 2025 mewajibkan pemilahan sampah berbasis sumber (organik, anorganik, residu) di setiap rumah tangga dan tempat usaha di wilayah desa. Pengangkutan sampah diatur secara berkala oleh Satgas Kebersihan Banjar dan TPS3R Desa Tegal Tugu. Dilarang keras membuang sampah atau limbah ke sungai, saluran irigasi subak, atau lahan terbuka. Pelanggaran dikenakan sanksi teguran tertulis hingga denda pembinaan adat banjar.',
    metadata: {
      nomorPerdes: '03/2025',
      tahun: 2025,
      bidang: 'Lingkungan Hidup & Kebersihan',
    },
    chunks: [
      'Kewajiban pemilahan sampah: Setiap kepala keluarga di Desa Tegal Tugu diwajibkan memilah sampah menjadi sampah organik (masuk biopori/kompos), sampah anorganik terdaur (disetor ke Bank Sampah Desa), dan residu.',
      'Jadwal pengangkutan sampah residu dilakukan oleh armada TPS3R Desa Tegal Tugu setiap hari Selasa, Kamis, dan Sabtu mulai pukul 06.00 hingga 09.00 WITA. Warga dilarang meletakkan sampah di luar jadwal penjemputan.',
      'Larangan dan sanksi: Membuang sampah sembarangan di badan jalan, saluran irigasi subak, maupun area pura dikenai sanksi peringatan lisan, peringatan tertulis, dan denda sanksi adat pembersihan lingkungan banjar.',
    ],
  },
  {
    id: 'doc-profil-desa-mandara',
    title:
      'Profil Wilayah, Visi Misi, dan Jam Operasional Kantor Desa Tegal Tugu',
    category: 'PROFIL_DESA',
    sourceUrl: 'https://tegaltugu.desa.id/profil',
    contentText:
      'Desa Tegal Tugu merupakan desa percontohan cerdas (Smart Village) yang terletak di Kecamatan Gianyar, Kabupaten Gianyar, Bali. Desa Tegal Tugu terbagi menjadi 5 Banjar Adat dan Dinas: Banjar Kaja, Banjar Kelod, Banjar Tengah, Banjar Kangin, dan Banjar Kauh, dengan total populasi 5.120 jiwa. Visi desa adalah mewujudkan tata kelola desa berbasis transparansi digital, berkeadilan sosial, dan berakar pada kearifan lokal Tri Hita Karana. Jam pelayanan kantor desa: Senin - Jumat pukul 08.00 - 15.30 WITA.',
    metadata: {
      kecamatan: 'Gianyar',
      kabupaten: 'Gianyar',
      provinsi: 'Bali',
      kodePos: '80511',
      teleponKantor: '0361-943210',
    },
    chunks: [
      'Struktur wilayah Desa Tegal Tugu mencakup 5 banjar: Banjar Kaja (utara), Banjar Kelod (selatan), Banjar Tengah (pusat desa dan kantor perbekel), Banjar Kangin (timur), serta Banjar Kauh (barat).',
      'Jam operasional dan layanan aduan: Kantor Perbekel Desa Tegal Tugu buka Senin-Jumat pukul 08.00 - 15.30 WITA. Layanan pengaduan gawat darurat (pohon tumbang, lampu padam, ketertiban) dapat diakses 24/7 melalui sistem DesaAI.',
    ],
  },
  {
    id: 'doc-faq-desa-ai',
    title: 'Tanya Jawab Umum (FAQ) Penggunaan Layanan Digital DesaAI Desa Tegal Tugu',
    category: 'FAQ',
    sourceUrl: 'https://tegaltugu.desa.id/bantuan',
    contentText:
      'Panduan pertanyaan yang sering diajukan warga terkait DesaAI di Desa Tegal Tugu: Cara mengajukan pengaduan warga, cara melacak status permohonan surat menggunakan kode tracking, kerahasiaan identitas pelapor (opsi anonim), dan integrasi notifikasi langsung petugas desa.',
    metadata: {
      versi: '2.0',
      terakhirDiperbarui: '2026-09-21',
    },
    chunks: [
      'Bagaimana cara memantau permohonan surat? Setiap pengajuan surat menghasilkan kode tracking unik (contoh: REQ-202609-0001). Masukkan kode tersebut pada kolom lacak surat di portal DesaAI untuk melihat status real-time dari perangkat Desa Tegal Tugu.',
      'Apakah melapor kerusakan fasilitas umum dipungut biaya? Tidak, semua pelaporan pengaduan infrastruktur dan kebersihan bebas biaya dan secara otomatis diklasifikasi oleh kecerdasan buatan (AI triage) ke dinas terkait dan kelian banjar.',
    ],
  },
  {
    id: 'doc-sop-pengaduan-warga',
    title:
      'Standar Operasional Prosedur (SOP) Penanganan Pengaduan dan Kedaruratan Warga Desa Tegal Tugu',
    category: 'SOP_LAYANAN',
    sourceUrl: 'https://tegaltugu.desa.id/sop/penanganan-pengaduan',
    contentText:
      'SOP Penanganan Pengaduan Warga Desa Tegal Tugu mengatur klasifikasi kedaruratan laporan masyarakat yang masuk melalui DesaAI. Laporan kategori Darurat (pohon tumbang, jalan amblas, kabel putus) direspons tim Linmas dan BPBD dalam waktu maksimal 2 jam. Laporan kategori Tinggi dan Sedang (lampu penerangan padam, sumbatan saluran air subak) ditindaklanjuti dalam waktu 1x24 jam hingga 2x24 jam kerja. Setiap perkembangan dicatat transparan pada log status tiket warga.',
    metadata: {
      nomorSOP: 'SOP/02/PENGADUAN/2026',
      tanggalBerlaku: '2026-01-01',
      penanggungJawab: 'Kaur Trantib & Linmas Desa Tegal Tugu',
    },
    chunks: [
      'Tingkat respons penanganan pengaduan: Kategori Darurat (EMERGENCY) penanganan maksimal 2 jam; Kategori Tinggi (HIGH) penanganan 1x24 jam; Kategori Sedang (MEDIUM) penanganan maksimal 2 hari kerja; Kategori Rendah (LOW) penanganan maksimal 3 hari kerja.',
      'Alur penanganan pengaduan: Pengaduan diterima sistem -> AI Triage mengklasifikasi kategori dan urgensi -> Notifikasi ke meja kerja perangkat desa dan Kelian Banjar terkait -> Pengerahan petugas lapangan -> Konfirmasi penyelesaian disertai dokumentasi foto penanganan.',
    ],
  },
]
