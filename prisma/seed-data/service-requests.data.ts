export interface ServiceAttachmentSeedItem {
  fileName: string
  fileUrl: string
  fileType: string
}

export interface ServiceStatusLogSeedItem {
  previousStatus?: 'PENDING' | 'IN_REVIEW' | 'REVISION' | 'APPROVED' | 'REJECTED'
  newStatus: 'PENDING' | 'IN_REVIEW' | 'REVISION' | 'APPROVED' | 'REJECTED'
  actorId?: string
  notes?: string
  createdAt: Date
}

export interface ServiceRequestSeedItem {
  id: string
  trackingCode: string
  userId: string
  serviceTypeId: string
  status: 'PENDING' | 'IN_REVIEW' | 'REVISION' | 'APPROVED' | 'REJECTED'
  applicantName: string
  applicantNik: string
  applicantPhone: string
  purpose: string
  officerNotes?: string | null
  createdAt: Date
  completedAt?: Date | null
  attachments: ServiceAttachmentSeedItem[]
  statusLogs: ServiceStatusLogSeedItem[]
}

const now = Date.now()

export const serviceRequestsSeedData: ServiceRequestSeedItem[] = [
  {
    id: 'req-seed-0001',
    trackingCode: 'REQ-202609-0001',
    userId: 'user-citizen-01',
    serviceTypeId: 'st-domisili',
    status: 'APPROVED',
    applicantName: 'I Wayan Agus Pratama',
    applicantNik: '5171010303920003',
    applicantPhone: '083333333333',
    purpose:
      'Persyaratan administrasi pembukaan rekening tabungan bisnis perbankan di Bank BPD Bali Cabang Gianyar.',
    officerNotes:
      'Berkas lengkap dan data kependudukan telah diverifikasi valid di arsip Desa Tegal Tugu.',
    createdAt: new Date(now - 5 * 86400000),
    completedAt: new Date(now - 5 * 86400000 + 18 * 3600000),
    attachments: [
      {
        fileName: 'KTP_I_Wayan_Agus_Pratama.pdf',
        fileUrl: 'https://storage.desa-ai.id/demo/ktp_agus.pdf',
        fileType: 'application/pdf',
      },
      {
        fileName: 'Kartu_Keluarga_Agus.pdf',
        fileUrl: 'https://storage.desa-ai.id/demo/kk_agus.pdf',
        fileType: 'application/pdf',
      },
      {
        fileName: 'Surat_Pengantar_Kelian_Banjar_Kaja.pdf',
        fileUrl: 'https://storage.desa-ai.id/demo/pengantar_kaja.pdf',
        fileType: 'application/pdf',
      },
    ],
    statusLogs: [
      {
        newStatus: 'PENDING',
        notes: 'Permohonan surat didaftarkan secara online via portal warga DesaAI.',
        createdAt: new Date(now - 5 * 86400000),
      },
      {
        previousStatus: 'PENDING',
        newStatus: 'IN_REVIEW',
        actorId: 'user-officer-01',
        notes: 'Pemeriksaan kelengkapan berkas fisik dan kesesuaian NIK oleh Kasi Pelayanan.',
        createdAt: new Date(now - 5 * 86400000 + 4 * 3600000),
      },
      {
        previousStatus: 'IN_REVIEW',
        newStatus: 'APPROVED',
        actorId: 'user-officer-01',
        notes: 'Surat Keterangan Domisili telah ditandatangani dan siap diunduh warga.',
        createdAt: new Date(now - 5 * 86400000 + 18 * 3600000),
      },
    ],
  },
  {
    id: 'req-seed-0002',
    trackingCode: 'REQ-202609-0002',
    userId: 'user-citizen-01',
    serviceTypeId: 'st-sku',
    status: 'APPROVED',
    applicantName: 'I Wayan Agus Pratama',
    applicantNik: '5171010303920003',
    applicantPhone: '083333333333',
    purpose:
      'Pengajuan Kredit Usaha Rakyat (KUR) Mikro untuk ekspansi bengkel kriya perak dan perhiasan tradisional.',
    officerNotes:
      'Surat keterangan usaha diterbitkan setelah verifikasi foto tempat usaha dan kesesuaian izin operasional.',
    createdAt: new Date(now - 4 * 86400000),
    completedAt: new Date(now - 4 * 86400000 + 24 * 3600000),
    attachments: [
      {
        fileName: 'KTP_Pemilik_Usaha.pdf',
        fileUrl: 'https://storage.desa-ai.id/demo/ktp_agus.pdf',
        fileType: 'application/pdf',
      },
      {
        fileName: 'Foto_Workshop_Kerajinan_Perak.jpg',
        fileUrl: 'https://storage.desa-ai.id/demo/workshop_perak.jpg',
        fileType: 'image/jpeg',
      },
      {
        fileName: 'Surat_Perjanjian_Sewa_Lahan.pdf',
        fileUrl: 'https://storage.desa-ai.id/demo/sewa_lahan.pdf',
        fileType: 'application/pdf',
      },
    ],
    statusLogs: [
      {
        newStatus: 'PENDING',
        notes: 'Permohonan SKU diterima melalui sistem.',
        createdAt: new Date(now - 4 * 86400000),
      },
      {
        previousStatus: 'PENDING',
        newStatus: 'IN_REVIEW',
        actorId: 'user-officer-01',
        notes: 'Validasi dokumen usaha dan konfirmasi lokasi ke Kelian Banjar Kaja.',
        createdAt: new Date(now - 4 * 86400000 + 6 * 3600000),
      },
      {
        previousStatus: 'IN_REVIEW',
        newStatus: 'APPROVED',
        actorId: 'user-officer-01',
        notes: 'SKU diterbitkan secara resmi dengan pengesahan Perbekel Desa Tegal Tugu.',
        createdAt: new Date(now - 4 * 86400000 + 24 * 3600000),
      },
    ],
  },
  {
    id: 'req-seed-0003',
    trackingCode: 'REQ-202609-0003',
    userId: 'user-citizen-02',
    serviceTypeId: 'st-skck',
    status: 'APPROVED',
    applicantName: 'Ni Ketut Dewi Lestari',
    applicantNik: '5171010404950004',
    applicantPhone: '084444444444',
    purpose:
      'Persyaratan pendaftaran seleksi Pegawai Pemerintah dengan Perjanjian Kerja (PPPK) Guru Sekolah Dasar Kabupaten Gianyar.',
    officerNotes:
      'Pengantar SKCK disetujui. Surat rekomendasi kelakuan baik telah diterbitkan ber-barcode digital.',
    createdAt: new Date(now - 3 * 86400000),
    completedAt: new Date(now - 3 * 86400000 + 12 * 3600000),
    attachments: [
      {
        fileName: 'KTP_Dewi_Lestari.pdf',
        fileUrl: 'https://storage.desa-ai.id/demo/ktp_dewi.pdf',
        fileType: 'application/pdf',
      },
      {
        fileName: 'Kartu_Keluarga_Dewi.pdf',
        fileUrl: 'https://storage.desa-ai.id/demo/kk_dewi.pdf',
        fileType: 'application/pdf',
      },
      {
        fileName: 'Ijazah_S1_Pendidikan.pdf',
        fileUrl: 'https://storage.desa-ai.id/demo/ijazah_dewi.pdf',
        fileType: 'application/pdf',
      },
      {
        fileName: 'Pas_Foto_Merah_4x6.jpg',
        fileUrl: 'https://storage.desa-ai.id/demo/pasfoto_dewi.jpg',
        fileType: 'image/jpeg',
      },
    ],
    statusLogs: [
      {
        newStatus: 'PENDING',
        notes: 'Permohonan surat pengantar SKCK diajukan warga.',
        createdAt: new Date(now - 3 * 86400000),
      },
      {
        previousStatus: 'PENDING',
        newStatus: 'IN_REVIEW',
        actorId: 'user-officer-01',
        notes: 'Pengecekan rekam catatan kelakuan baik tingkat banjar.',
        createdAt: new Date(now - 3 * 86400000 + 2 * 3600000),
      },
      {
        previousStatus: 'IN_REVIEW',
        newStatus: 'APPROVED',
        actorId: 'user-officer-01',
        notes: 'Surat pengantar SKCK diterbitkan untuk dibawa ke Polsek Gianyar.',
        createdAt: new Date(now - 3 * 86400000 + 12 * 3600000),
      },
    ],
  },
  {
    id: 'req-seed-0004',
    trackingCode: 'REQ-202609-0004',
    userId: 'user-citizen-02',
    serviceTypeId: 'st-domisili',
    status: 'PENDING',
    applicantName: 'Ni Ketut Dewi Lestari',
    applicantNik: '5171010404950004',
    applicantPhone: '084444444444',
    purpose:
      'Kelengkapan berkas mutasi administrasi kepegawaian dinas pendidikan Kabupaten Gianyar.',
    officerNotes: null,
    createdAt: new Date(now - 1 * 86400000),
    completedAt: null,
    attachments: [
      {
        fileName: 'KTP_Pemohon.pdf',
        fileUrl: 'https://storage.desa-ai.id/demo/ktp_dewi.pdf',
        fileType: 'application/pdf',
      },
      {
        fileName: 'Kartu_Keluarga.pdf',
        fileUrl: 'https://storage.desa-ai.id/demo/kk_dewi.pdf',
        fileType: 'application/pdf',
      },
    ],
    statusLogs: [
      {
        newStatus: 'PENDING',
        notes: 'Permohonan baru masuk dalam antrean verifikasi loket pelayanan.',
        createdAt: new Date(now - 1 * 86400000),
      },
    ],
  },
  {
    id: 'req-seed-0005',
    trackingCode: 'REQ-202609-0005',
    userId: 'user-citizen-03',
    serviceTypeId: 'st-sku',
    status: 'IN_REVIEW',
    applicantName: 'I Nyoman Budiartha',
    applicantNik: '5171010505880005',
    applicantPhone: '085555555555',
    purpose:
      'Pengajuan bantuan bibit padi unggul dan alat mesin pertanian (alsintan) kelompok tani subak organik ke Dinas Pertanian Gianyar.',
    officerNotes:
      'Berkas sedang ditelaah oleh Kasi Pelayanan berkoordinasi dengan Pekasih Subak.',
    createdAt: new Date(now - 2 * 86400000),
    completedAt: null,
    attachments: [
      {
        fileName: 'KTP_I_Nyoman_Budiartha.pdf',
        fileUrl: 'https://storage.desa-ai.id/demo/ktp_nyoman.pdf',
        fileType: 'application/pdf',
      },
      {
        fileName: 'Foto_Lahan_Pertanian_Subak.jpg',
        fileUrl: 'https://storage.desa-ai.id/demo/lahan_subak.jpg',
        fileType: 'image/jpeg',
      },
      {
        fileName: 'Surat_Keterangan_Kelompok_Tani.pdf',
        fileUrl: 'https://storage.desa-ai.id/demo/kelompok_tani.pdf',
        fileType: 'application/pdf',
      },
    ],
    statusLogs: [
      {
        newStatus: 'PENDING',
        notes: 'Permohonan surat SKU kelompok tani diajukan.',
        createdAt: new Date(now - 2 * 86400000),
      },
      {
        previousStatus: 'PENDING',
        newStatus: 'IN_REVIEW',
        actorId: 'user-officer-01',
        notes: 'Petugas sedang mencocokkan titik koordinat petak sawah pemohon.',
        createdAt: new Date(now - 2 * 86400000 + 5 * 3600000),
      },
    ],
  },
  {
    id: 'req-seed-0006',
    trackingCode: 'REQ-202609-0006',
    userId: 'user-citizen-03',
    serviceTypeId: 'st-sktm',
    status: 'REVISION',
    applicantName: 'I Nyoman Budiartha',
    applicantNik: '5171010505880005',
    applicantPhone: '085555555555',
    purpose:
      'Permohonan keringanan biaya pengobatan rawat inap puskesmas dan rujukan RSUD Sanjiwani Gianyar.',
    officerNotes:
      'Mohon lampirkan surat pengantar resmi bertandatangan Kelian Banjar Tengah dan foto tampak depan rumah yang lebih jelas.',
    createdAt: new Date(now - 3 * 86400000),
    completedAt: null,
    attachments: [
      {
        fileName: 'KTP_Pemohon.pdf',
        fileUrl: 'https://storage.desa-ai.id/demo/ktp_nyoman.pdf',
        fileType: 'application/pdf',
      },
      {
        fileName: 'Kartu_Keluarga_Nyoman.pdf',
        fileUrl: 'https://storage.desa-ai.id/demo/kk_nyoman.pdf',
        fileType: 'application/pdf',
      },
      {
        fileName: 'Foto_Kondisi_Rumah_Buram.jpg',
        fileUrl: 'https://storage.desa-ai.id/demo/rumah_buram.jpg',
        fileType: 'image/jpeg',
      },
    ],
    statusLogs: [
      {
        newStatus: 'PENDING',
        notes: 'Permohonan SKTM diajukan oleh pemohon.',
        createdAt: new Date(now - 3 * 86400000),
      },
      {
        previousStatus: 'PENDING',
        newStatus: 'IN_REVIEW',
        actorId: 'user-officer-01',
        notes: 'Pemeriksaan berkas foto kondisi hunian pemohon.',
        createdAt: new Date(now - 3 * 86400000 + 4 * 3600000),
      },
      {
        previousStatus: 'IN_REVIEW',
        newStatus: 'REVISION',
        actorId: 'user-officer-01',
        notes:
          'Foto rumah buram dan belum ada pengantar Kelian Banjar Tengah. Menunggu unggahan ulang warga.',
        createdAt: new Date(now - 3 * 86400000 + 8 * 3600000),
      },
    ],
  },
  {
    id: 'req-seed-0007',
    trackingCode: 'REQ-202609-0007',
    userId: 'user-citizen-04',
    serviceTypeId: 'st-sku',
    status: 'APPROVED',
    applicantName: 'Ni Putu Ayu Saraswati',
    applicantNik: '5171010606960006',
    applicantPhone: '086666666666',
    purpose:
      'Pendaftaran Nomor Induk Berusaha (NIB) dan sertifikasi halal UMKM warung jajanan tradisional Bali.',
    officerNotes:
      'Data usaha kuliner terverifikasi aktif beroperasi di Banjar Kangin, surat rekomendasi telah disahkan.',
    createdAt: new Date(now - 6 * 86400000),
    completedAt: new Date(now - 6 * 86400000 + 20 * 3600000),
    attachments: [
      {
        fileName: 'KTP_Ayu_Saraswati.pdf',
        fileUrl: 'https://storage.desa-ai.id/demo/ktp_ayu.pdf',
        fileType: 'application/pdf',
      },
      {
        fileName: 'Foto_Warung_Jajanan_Bali.jpg',
        fileUrl: 'https://storage.desa-ai.id/demo/warung_ayu.jpg',
        fileType: 'image/jpeg',
      },
    ],
    statusLogs: [
      {
        newStatus: 'PENDING',
        notes: 'Pengajuan SKU UMKM kuliner tercatat.',
        createdAt: new Date(now - 6 * 86400000),
      },
      {
        previousStatus: 'PENDING',
        newStatus: 'IN_REVIEW',
        actorId: 'user-officer-01',
        notes: 'Verifikasi lokasi warung jajanan di Banjar Kangin.',
        createdAt: new Date(now - 6 * 86400000 + 3 * 3600000),
      },
      {
        previousStatus: 'IN_REVIEW',
        newStatus: 'APPROVED',
        actorId: 'user-officer-01',
        notes: 'Surat SKU berhasil diterbitkan.',
        createdAt: new Date(now - 6 * 86400000 + 20 * 3600000),
      },
    ],
  },
  {
    id: 'req-seed-0008',
    trackingCode: 'REQ-202609-0008',
    userId: 'user-citizen-04',
    serviceTypeId: 'st-skck',
    status: 'PENDING',
    applicantName: 'Ni Putu Ayu Saraswati',
    applicantNik: '5171010606960006',
    applicantPhone: '086666666666',
    purpose:
      'Persyaratan berkas sertifikasi kompetensi kuliner nusantara Badan Nasional Sertifikasi Profesi (BNSP).',
    officerNotes: null,
    createdAt: new Date(now - 1 * 86400000),
    completedAt: null,
    attachments: [
      {
        fileName: 'KTP_Pemohon.pdf',
        fileUrl: 'https://storage.desa-ai.id/demo/ktp_ayu.pdf',
        fileType: 'application/pdf',
      },
      {
        fileName: 'Kartu_Keluarga_Ayu.pdf',
        fileUrl: 'https://storage.desa-ai.id/demo/kk_ayu.pdf',
        fileType: 'application/pdf',
      },
      {
        fileName: 'Pas_Foto_Merah.jpg',
        fileUrl: 'https://storage.desa-ai.id/demo/pasfoto_ayu.jpg',
        fileType: 'image/jpeg',
      },
    ],
    statusLogs: [
      {
        newStatus: 'PENDING',
        notes: 'Permohonan surat pengantar SKCK diterima di meja loket desa.',
        createdAt: new Date(now - 1 * 86400000),
      },
    ],
  },
  {
    id: 'req-seed-0009',
    trackingCode: 'REQ-202609-0009',
    userId: 'user-citizen-05',
    serviceTypeId: 'st-sku',
    status: 'IN_REVIEW',
    applicantName: 'I Made Bagus Wijaya',
    applicantNik: '5171010707900007',
    applicantPhone: '087777777777',
    purpose:
      'Partisipasi pameran industri kriya ukir kayu internasional Bali Art Festival dan pembukaan rekening giro ekspor.',
    officerNotes:
      'Sedang menunggu konfirmasi kelayakan operasional dari Kepala Seksi Kesejahteraan Desa.',
    createdAt: new Date(now - 2 * 86400000),
    completedAt: null,
    attachments: [
      {
        fileName: 'KTP_Made_Bagus.pdf',
        fileUrl: 'https://storage.desa-ai.id/demo/ktp_bagus.pdf',
        fileType: 'application/pdf',
      },
      {
        fileName: 'Foto_Galeri_Seni_Ukir.jpg',
        fileUrl: 'https://storage.desa-ai.id/demo/galeri_ukir.jpg',
        fileType: 'image/jpeg',
      },
      {
        fileName: 'Surat_Izin_Domisili_Usaha.pdf',
        fileUrl: 'https://storage.desa-ai.id/demo/izin_usaha.pdf',
        fileType: 'application/pdf',
      },
    ],
    statusLogs: [
      {
        newStatus: 'PENDING',
        notes: 'Pengajuan SKU galeri seni masuk.',
        createdAt: new Date(now - 2 * 86400000),
      },
      {
        previousStatus: 'PENDING',
        newStatus: 'IN_REVIEW',
        actorId: 'user-officer-01',
        notes: 'Pemeriksaan portofolio usaha dan izin usaha seni ukir.',
        createdAt: new Date(now - 2 * 86400000 + 4 * 3600000),
      },
    ],
  },
  {
    id: 'req-seed-0010',
    trackingCode: 'REQ-202609-0010',
    userId: 'user-citizen-05',
    serviceTypeId: 'st-domisili',
    status: 'REJECTED',
    applicantName: 'I Made Bagus Wijaya',
    applicantNik: '5171010707900007',
    applicantPhone: '087777777777',
    purpose:
      'Pengurusan sengketa batas tanah warisan adat keluarga di perbatasan pekarangan Banjar Kauh.',
    officerNotes:
      'Permohonan ditolak karena keperluan perdata agraria tanah adat memerlukan paruman banjar dan rekomendasi Majelis Desa Adat (MDA), bukan Surat Keterangan Domisili perorangan.',
    createdAt: new Date(now - 4 * 86400000),
    completedAt: null,
    attachments: [
      {
        fileName: 'KTP_Pemohon.pdf',
        fileUrl: 'https://storage.desa-ai.id/demo/ktp_bagus.pdf',
        fileType: 'application/pdf',
      },
      {
        fileName: 'Fotokopi_SPPT_PBB.pdf',
        fileUrl: 'https://storage.desa-ai.id/demo/sppt_pbb.pdf',
        fileType: 'application/pdf',
      },
    ],
    statusLogs: [
      {
        newStatus: 'PENDING',
        notes: 'Permohonan surat didaftarkan pemohon.',
        createdAt: new Date(now - 4 * 86400000),
      },
      {
        previousStatus: 'PENDING',
        newStatus: 'IN_REVIEW',
        actorId: 'user-officer-01',
        notes: 'Koordinasi bersama Kelian Adat Banjar Kauh mengenai sengketa batas pekarangan.',
        createdAt: new Date(now - 4 * 86400000 + 6 * 3600000),
      },
      {
        previousStatus: 'IN_REVIEW',
        newStatus: 'REJECTED',
        actorId: 'user-officer-01',
        notes:
          'Ditolak. Ranah sengketa tanah warisan adat diserahkan ke musyawarah adat banjar sesuai Pararem.',
        createdAt: new Date(now - 4 * 86400000 + 14 * 3600000),
      },
    ],
  },
  {
    id: 'req-seed-0011',
    trackingCode: 'REQ-202609-0011',
    userId: 'user-citizen-04',
    serviceTypeId: 'st-sktm',
    status: 'APPROVED',
    applicantName: 'Ni Putu Ayu Saraswati',
    applicantNik: '5171010606960006',
    applicantPhone: '086666666666',
    purpose:
      'Pengajuan beasiswa Program Indonesia Pintar (PIP) untuk adik kandung jenjang SMA di Gianyar.',
    officerNotes:
      'Data keluarga telah diverifikasi masuk dalam DTKS desil prioritas bantuan pendidikan desa.',
    createdAt: new Date(now - 5 * 86400000),
    completedAt: new Date(now - 5 * 86400000 + 26 * 3600000),
    attachments: [
      {
        fileName: 'KTP_Kepala_Keluarga.pdf',
        fileUrl: 'https://storage.desa-ai.id/demo/ktp_ayu.pdf',
        fileType: 'application/pdf',
      },
      {
        fileName: 'Kartu_Keluarga_Ayu.pdf',
        fileUrl: 'https://storage.desa-ai.id/demo/kk_ayu.pdf',
        fileType: 'application/pdf',
      },
      {
        fileName: 'Surat_Pengantar_Kelian_Banjar_Kangin.pdf',
        fileUrl: 'https://storage.desa-ai.id/demo/pengantar_kangin.pdf',
        fileType: 'application/pdf',
      },
      {
        fileName: 'Surat_Pernyataan_Tidak_Mampu_Bermaterai.pdf',
        fileUrl: 'https://storage.desa-ai.id/demo/sktm_pernyataan.pdf',
        fileType: 'application/pdf',
      },
    ],
    statusLogs: [
      {
        newStatus: 'PENDING',
        notes: 'Permohonan SKTM beasiswa diajukan.',
        createdAt: new Date(now - 5 * 86400000),
      },
      {
        previousStatus: 'PENDING',
        newStatus: 'IN_REVIEW',
        actorId: 'user-officer-01',
        notes: 'Sinkronisasi dengan database DTKS Kemensos di kantor desa.',
        createdAt: new Date(now - 5 * 86400000 + 4 * 3600000),
      },
      {
        previousStatus: 'IN_REVIEW',
        newStatus: 'APPROVED',
        actorId: 'user-officer-01',
        notes: 'Surat Keterangan Tidak Mampu disahkan untuk keperluan beasiswa PIP.',
        createdAt: new Date(now - 5 * 86400000 + 26 * 3600000),
      },
    ],
  },
  {
    id: 'req-seed-0012',
    trackingCode: 'REQ-202609-0012',
    userId: 'user-citizen-05',
    serviceTypeId: 'st-skck',
    status: 'PENDING',
    applicantName: 'I Made Bagus Wijaya',
    applicantNik: '5171010707900007',
    applicantPhone: '087777777777',
    purpose:
      'Pengajuan visa kunjungan kebudayaan dan program residensi seniman seni rupa ke Tokyo University of the Arts Jepang.',
    officerNotes: null,
    createdAt: new Date(now - 12 * 3600000),
    completedAt: null,
    attachments: [
      {
        fileName: 'KTP_Made_Bagus.pdf',
        fileUrl: 'https://storage.desa-ai.id/demo/ktp_bagus.pdf',
        fileType: 'application/pdf',
      },
      {
        fileName: 'Kartu_Keluarga_Bagus.pdf',
        fileUrl: 'https://storage.desa-ai.id/demo/kk_bagus.pdf',
        fileType: 'application/pdf',
      },
      {
        fileName: 'Ijazah_S1_Seni_Murni.pdf',
        fileUrl: 'https://storage.desa-ai.id/demo/ijazah_bagus.pdf',
        fileType: 'application/pdf',
      },
      {
        fileName: 'Pas_Foto_Merah_Resmi.jpg',
        fileUrl: 'https://storage.desa-ai.id/demo/pasfoto_bagus.jpg',
        fileType: 'image/jpeg',
      },
    ],
    statusLogs: [
      {
        newStatus: 'PENDING',
        notes: 'Permohonan surat pengantar SKCK masuk untuk program residensi seniman internasional.',
        createdAt: new Date(now - 12 * 3600000),
      },
    ],
  },
]
