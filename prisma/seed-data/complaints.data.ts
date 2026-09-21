export interface ComplaintSeedItem {
  ticketCode: string
  reporterName: string
  reporterPhone: string
  citizenId?: string
  banjarId: string
  title: string
  description: string
  specificLocation: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED'
  category:
    | 'INFRASTRUKTUR'
    | 'KEBERSIHAN_LINGKUNGAN'
    | 'KEAMANAN_KETERTIBAN'
    | 'PELAYANAN_PUBLIK'
    | 'BANTUAN_SOSIAL'
    | 'LAINNYA'
  priority: 'EMERGENCY' | 'HIGH' | 'MEDIUM' | 'LOW'
  aiSummary: string
  createdAt: Date
  resolvedAt?: Date
  evaluation: {
    predictedCategory:
      | 'INFRASTRUKTUR'
      | 'KEBERSIHAN_LINGKUNGAN'
      | 'KEAMANAN_KETERTIBAN'
      | 'PELAYANAN_PUBLIK'
      | 'BANTUAN_SOSIAL'
      | 'LAINNYA'
    priority: 'EMERGENCY' | 'HIGH' | 'MEDIUM' | 'LOW'
    confidenceScore: number
    executiveSummary: string
    recommendedAction: string
  }
}

export const complaintsSeedData: ComplaintSeedItem[] = [
  // Banjar Kaja
  {
    ticketCode: 'CMP-202609-0001',
    reporterName: 'I Wayan Agus Pratama',
    reporterPhone: '083333333333',
    citizenId: 'user-citizen-01',
    banjarId: 'banjar-kaja',
    title: 'Jalan Rusak dan Amblas Dekat Jembatan Tukad',
    description:
      'Ruas jalan penghubung Banjar Kaja amblas sepanjang 3 meter paska hujan deras, berisiko membahayakan pengendara motor malam hari.',
    specificLocation: 'Jalan Raya Utama 50 meter sebelah timur Jembatan Tukad',
    status: 'RESOLVED',
    category: 'INFRASTRUKTUR',
    priority: 'EMERGENCY',
    aiSummary:
      'Kerusakan jalan amblas kategori darurat di dekat jembatan Banjar Kaja yang berisiko kecelakaan.',
    createdAt: new Date(Date.now() - 6 * 86400000),
    resolvedAt: new Date(Date.now() - 6 * 86400000 + 22 * 3600000), // 22 jam resolusi
    evaluation: {
      predictedCategory: 'INFRASTRUKTUR',
      priority: 'EMERGENCY',
      confidenceScore: 0.96,
      executiveSummary:
        'Laporan darurat kerusakan badan jalan utama yang mendesak penambalan segera dan barikade peringatan.',
      recommendedAction:
        'Koordinasi bersama Kasi Kesejahteraan Desa dan Dinas PUPR Gianyar untuk pengaspalan darurat.',
    },
  },
  {
    ticketCode: 'CMP-202609-0002',
    reporterName: 'Ni Made Rai Kerti',
    reporterPhone: '081298765431',
    banjarId: 'banjar-kaja',
    title: 'Lampu Penerangan Jalan Mati di Gang Pudak',
    description:
      'Lampu penerangan jalan umum di 3 titik Gang Pudak sudah padam selama 4 hari sehingga gang menjadi sangat gelap.',
    specificLocation: 'Gang Pudak RT 02 Banjar Kaja',
    status: 'RESOLVED',
    category: 'INFRASTRUKTUR',
    priority: 'MEDIUM',
    aiSummary:
      'Padamnya 3 titik lampu penerangan jalan di Gang Pudak Banjar Kaja.',
    createdAt: new Date(Date.now() - 5 * 86400000),
    resolvedAt: new Date(Date.now() - 5 * 86400000 + 26 * 3600000), // 26 jam resolusi
    evaluation: {
      predictedCategory: 'INFRASTRUKTUR',
      priority: 'MEDIUM',
      confidenceScore: 0.91,
      executiveSummary:
        'Keluhan penerangan jalan umum mati yang memerlukan penggantian bohlam dan pengecekan saklar.',
      recommendedAction:
        'Penugasan petugas pemeliharaan sarana desa untuk penggantian bohlam LED hemat energi.',
    },
  },
  {
    ticketCode: 'CMP-202609-0003',
    reporterName: 'I Made Budiasa',
    reporterPhone: '081345678912',
    banjarId: 'banjar-kaja',
    title: 'Penumpukan Sampah Upakara di Tepi Saluran Irigasi Subak',
    description:
      'Terdapat tumpukan sisa canang dan plastik di tepi saluran irigasi yang mulai menyumbat aliran air ke sawah warga.',
    specificLocation: 'Pinggir saluran irigasi subak utara Balai Banjar Kaja',
    status: 'IN_PROGRESS',
    category: 'KEBERSIHAN_LINGKUNGAN',
    priority: 'HIGH',
    aiSummary:
      'Penyumbatan saluran subak akibat sampah upakara yang memerlukan pengangkutan terpadu.',
    createdAt: new Date(Date.now() - 2 * 86400000),
    evaluation: {
      predictedCategory: 'KEBERSIHAN_LINGKUNGAN',
      priority: 'HIGH',
      confidenceScore: 0.94,
      executiveSummary:
        'Penumpukan material sisa upakara yang menghambat sistem irigasi persawahan subak.',
      recommendedAction:
        'Pengerahan tim kebersihan desa bersama pekasih subak dan pengangkutan truk sampah ke TPA.',
    },
  },
  {
    ticketCode: 'CMP-202609-0004',
    reporterName: 'I Nyoman Suweta',
    reporterPhone: '081234123456',
    banjarId: 'banjar-kaja',
    title: 'Permintaan Penataan Saluran Air Hujan Depan Pura',
    description:
      'Saluran drainase depan pura meluap saat hujan deras, memerlukan pembangunan got permanen pada anggaran desa mendatang.',
    specificLocation: 'Depan Pura Candi Banjar Kaja',
    status: 'OPEN',
    category: 'INFRASTRUKTUR',
    priority: 'MEDIUM',
    aiSummary:
      'Aspirasi penataan saluran got permanen depan pura menjelang musim penghujan.',
    createdAt: new Date(Date.now() - 1 * 86400000),
    evaluation: {
      predictedCategory: 'INFRASTRUKTUR',
      priority: 'MEDIUM',
      confidenceScore: 0.89,
      executiveSummary:
        'Usulan pembangunan drainase permanen di area publik depan pura untuk mencegah limpasan air.',
      recommendedAction:
        'Pencatatan sebagai usulan prioritas dalam pembahasan Musrenbangdes RKPDes tahun anggaran berjalan.',
    },
  },

  // Banjar Kelod
  {
    ticketCode: 'CMP-202609-0005',
    reporterName: 'Ni Ketut Dewi Lestari',
    reporterPhone: '084444444444',
    citizenId: 'user-citizen-02',
    banjarId: 'banjar-kelod',
    title: 'Dahan Pohon Beringin Rawan Tumbang Menimpa Kabel',
    description:
      'Dahan pohon beringin tua di pojok pertigaan patah sebagian dan menggantung di atas bentangan kabel listrik utama.',
    specificLocation: 'Pertigaan Jl. Melati Banjar Kelod',
    status: 'RESOLVED',
    category: 'KEAMANAN_KETERTIBAN',
    priority: 'HIGH',
    aiSummary:
      'Dahan pohon patah menggantung di bentangan kabel listrik berpotensi memicu bahaya kebakaran.',
    createdAt: new Date(Date.now() - 4 * 86400000),
    resolvedAt: new Date(Date.now() - 4 * 86400000 + 18 * 3600000), // 18 jam resolusi
    evaluation: {
      predictedCategory: 'KEAMANAN_KETERTIBAN',
      priority: 'HIGH',
      confidenceScore: 0.95,
      executiveSummary:
        'Potensi bahaya kelistrikan akibat dahan pohon rapuh di ruang publik utama banjar.',
      recommendedAction:
        'Pemangkasan dahan pohon darurat oleh tim Linmas Desa berkoordinasi dengan PLN Rayon Gianyar.',
    },
  },
  {
    ticketCode: 'CMP-202609-0006',
    reporterName: 'I Gusti Made Astawa',
    reporterPhone: '081399887766',
    banjarId: 'banjar-kelod',
    title: 'Genangan Air Pascahujan Lebat di Akses Masuk Banjar',
    description:
      'Gorong-gorong penyalur air dangkal akibat endapan lumpur sehingga air meluap ke badan jalan.',
    specificLocation: 'Pintu gerbang gapura batas selatan Banjar Kelod',
    status: 'IN_PROGRESS',
    category: 'INFRASTRUKTUR',
    priority: 'HIGH',
    aiSummary:
      'Pendangkalan gorong-gorong yang memicu genangan air di pintu gerbang banjar.',
    createdAt: new Date(Date.now() - 2 * 86400000),
    evaluation: {
      predictedCategory: 'INFRASTRUKTUR',
      priority: 'HIGH',
      confidenceScore: 0.92,
      executiveSummary:
        'Sumbatan sedimentasi gorong-gorong batas selatan yang memerlukan normalisasi drainase.',
      recommendedAction:
        'Pembersihan lumpur dan pengerukan gorong-gorong dengan partisipasi warga dan petugas PU desa.',
    },
  },
  {
    ticketCode: 'CMP-202609-0007',
    reporterName: 'Ni Wayan Murtini',
    reporterPhone: '081267895432',
    banjarId: 'banjar-kelod',
    title: 'Pengajuan Fogging Nyamuk DBD Lingkungan Tempekan',
    description:
      'Dua warga setempat terkonfirmasi sakit demam berdarah, dimohon bantuan penyemprotan fogging lingkungan.',
    specificLocation: 'Lingkungan Tempekan Kaja Banjar Kelod',
    status: 'RESOLVED',
    category: 'PELAYANAN_PUBLIK',
    priority: 'MEDIUM',
    aiSummary:
      'Permohonan fogging DBD paska temuan kasus demam berdarah warga.',
    createdAt: new Date(Date.now() - 7 * 86400000),
    resolvedAt: new Date(Date.now() - 7 * 86400000 + 44 * 3600000), // 44 jam resolusi
    evaluation: {
      predictedCategory: 'PELAYANAN_PUBLIK',
      priority: 'MEDIUM',
      confidenceScore: 0.93,
      executiveSummary:
        'Laporan kesehatan masyarakat terkait potensi penularan DBD di kawasan pemukiman warga.',
      recommendedAction:
        'Koordinasi dengan Puskesmas Gianyar untuk jadwal fogging dan pembagian bubuk abate.',
    },
  },

  // Banjar Tengah
  {
    ticketCode: 'CMP-202609-0008',
    reporterName: 'I Nyoman Giri Sentana',
    reporterPhone: '081234567893',
    banjarId: 'banjar-tengah',
    title: 'Pipa Air Swadaya Pecah Menggenangi Jalan Utama',
    description:
      'Pipa distribusi air bersih milik kelompok swadaya pecah tergilas kendaraan berat sehingga air mengucur deras.',
    specificLocation: 'Depan wantilan Banjar Tengah',
    status: 'RESOLVED',
    category: 'INFRASTRUKTUR',
    priority: 'HIGH',
    aiSummary:
      'Kebocoran pipa air swadaya di depan wantilan yang mengganggu suplai air warga.',
    createdAt: new Date(Date.now() - 5 * 86400000),
    resolvedAt: new Date(Date.now() - 5 * 86400000 + 16 * 3600000), // 16 jam resolusi
    evaluation: {
      predictedCategory: 'INFRASTRUKTUR',
      priority: 'HIGH',
      confidenceScore: 0.97,
      executiveSummary:
        'Pecahnya pipa distribusi air minum komunal yang perlu penggantian elbow sambungan.',
      recommendedAction:
        'Penutupan katup sementara dan perbaikan sambungan pipa oleh pengelola air desa Tirta Sari.',
    },
  },
  {
    ticketCode: 'CMP-202609-0009',
    reporterName: 'I Putu Eka Wijaya',
    reporterPhone: '085678901234',
    banjarId: 'banjar-tengah',
    title: 'Kebisingan Sound System Larut Malam Melebihi Batas Desa',
    description:
      'Uji coba sound system hajatan lewat pukul 23.30 WITA mengganggu istirahat lansia dan anak balita di pemukiman.',
    specificLocation: 'Jalan Kenanga Gang 1 Banjar Tengah',
    status: 'RESOLVED',
    category: 'KEAMANAN_KETERTIBAN',
    priority: 'LOW',
    aiSummary:
      'Keluhan kebisingan musik larut malam melebihi jam operasional ketertiban desa.',
    createdAt: new Date(Date.now() - 3 * 86400000),
    resolvedAt: new Date(Date.now() - 3 * 86400000 + 12 * 3600000), // 12 jam resolusi
    evaluation: {
      predictedCategory: 'KEAMANAN_KETERTIBAN',
      priority: 'LOW',
      confidenceScore: 0.88,
      executiveSummary:
        'Gangguan kebisingan jam istirahat malam yang melanggar pararem ketertiban banjar.',
      recommendedAction:
        'Himbauan kekeluargaan oleh prajuru banjar dan pecalang kepada pihak penyelenggara.',
    },
  },
  {
    ticketCode: 'CMP-202609-0010',
    reporterName: 'Ni Luh Putu Sariasih',
    reporterPhone: '081987654321',
    banjarId: 'banjar-tengah',
    title: 'Usulan Pengadaan Tong Sampah Terpilah Organik di Pasar Banjar',
    description:
      'Pasar tumpah pagi hari kekurangan wadah sampah terpilah sehingga sampah organik sayuran berserakan di trotoar.',
    specificLocation: 'Pelataran pasar pagi Banjar Tengah',
    status: 'OPEN',
    category: 'KEBERSIHAN_LINGKUNGAN',
    priority: 'MEDIUM',
    aiSummary:
      'Usulan penambahan wadah sampah organik dan non-organik di pelataran pasar desa.',
    createdAt: new Date(Date.now() - 3 * 86400000),
    evaluation: {
      predictedCategory: 'KEBERSIHAN_LINGKUNGAN',
      priority: 'MEDIUM',
      confidenceScore: 0.9,
      executiveSummary:
        'Kebutuhan sarana pemilahan sampah organik guna mendukung program TPS3R desa.',
      recommendedAction:
        'Pengadaan 4 set tong sampah terpilah melalui pos anggaran pembinaan lingkungan desa.',
    },
  },

  // Banjar Kangin
  {
    ticketCode: 'CMP-202609-0011',
    reporterName: 'I Ketut Sudikerta Putra',
    reporterPhone: '081234567894',
    banjarId: 'banjar-kangin',
    title: 'Akses Jalan Usaha Tani Rusak Berat Akibat Banjir Lahar Hujan',
    description:
      'Jalan rabat beton menuju areal subak perkebunan tergerus air sepanjang 15 meter, hasil panen padi sulit diangkut.',
    specificLocation: 'Jalan Usaha Tani Tempekan Kangin',
    status: 'IN_PROGRESS',
    category: 'INFRASTRUKTUR',
    priority: 'HIGH',
    aiSummary:
      'Kerusakan jalan usaha tani subak yang mengganggu distribusi logistik hasil panen warga.',
    createdAt: new Date(Date.now() - 3 * 86400000),
    evaluation: {
      predictedCategory: 'INFRASTRUKTUR',
      priority: 'HIGH',
      confidenceScore: 0.93,
      executiveSummary:
        'Kerusakan akses jalan pertanian strategis yang berimbas pada rantai ekonomi pangan desa.',
      recommendedAction:
        'Pemasangan bronjong penahan tebing sementara dan usulan rabat beton lanjutan di APBDes.',
    },
  },
  {
    ticketCode: 'CMP-202609-0012',
    reporterName: 'I Gede Wardana',
    reporterPhone: '082134567890',
    banjarId: 'banjar-kangin',
    title: 'Warga Lansia Kurang Mampu Belum Terdata Bantuan Sembako',
    description:
      'Nenek Made Sari (82 tahun) tinggal sebatang kara dan belum masuk dalam daftar penerima bantuan pangan desa.',
    specificLocation: 'Banjar Kangin RT 03 dekat Balai Subak',
    status: 'RESOLVED',
    category: 'BANTUAN_SOSIAL',
    priority: 'MEDIUM',
    aiSummary:
      'Permohonan validasi data penerima manfaat bansos pangan lansia sebatang kara.',
    createdAt: new Date(Date.now() - 8 * 86400000),
    resolvedAt: new Date(Date.now() - 8 * 86400000 + 42 * 3600000), // 42 jam resolusi
    evaluation: {
      predictedCategory: 'BANTUAN_SOSIAL',
      priority: 'MEDIUM',
      confidenceScore: 0.94,
      executiveSummary:
        'Laporan kesejahteraan sosial terkait perlindungan warga lanjut usia terlantar.',
      recommendedAction:
        'Verifikasi faktual oleh Kaur Kesra dan penyaluran paket bantuan sembako darurat dari kas desa.',
    },
  },
  {
    ticketCode: 'CMP-202609-0013',
    reporterName: 'Ni Kadek Sintawati',
    reporterPhone: '083123456789',
    banjarId: 'banjar-kangin',
    title: 'Populasi Kera Liar Mengganggu Kebun dan Pemukiman',
    description:
      'Sekelompok kera dari kawasan hutan batas desa masuk ke pekarangan rumah warga mencari makanan dan merusak atap genteng.',
    specificLocation: 'Perbatasan hutan adat Banjar Kangin',
    status: 'OPEN',
    category: 'KEAMANAN_KETERTIBAN',
    priority: 'LOW',
    aiSummary:
      'Gangguan satwa kera liar yang merambah kawasan pemukiman warga di tepi hutan adat.',
    createdAt: new Date(Date.now() - 1 * 86400000),
    evaluation: {
      predictedCategory: 'KEAMANAN_KETERTIBAN',
      priority: 'LOW',
      confidenceScore: 0.86,
      executiveSummary:
        'Interaksi satwa liar dan pemukiman warga yang membutuhkan koordinasi Balai Konservasi SDA.',
      recommendedAction:
        'Koordinasi bersama BKSDA Gianyar dan pemasangan papan himbauan pengelolaan pakan satwa.',
    },
  },
]
