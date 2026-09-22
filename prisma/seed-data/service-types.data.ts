export interface ServiceTypeSeedItem {
  id: string
  code: string
  title: string
  description: string
  requiredDocs: string[]
  estimatedDays: number
  isActive: boolean
}

export const serviceTypesSeedData: ServiceTypeSeedItem[] = [
  {
    id: 'st-domisili',
    code: 'DOMISILI',
    title: 'Surat Keterangan Domisili',
    description:
      'Surat keterangan resmi yang menyatakan domisili atau keberadaan tempat tinggal pemohon di wilayah desa untuk keperluan perbankan, pekerjaan, atau sekolah.',
    requiredDocs: [
      'Foto KTP Pemohon (Asli/Jelas)',
      'Foto Kartu Keluarga (KK)',
      'Surat Pengantar dari Kelian Banjar / Kepala Lingkungan',
    ],
    estimatedDays: 1,
    isActive: true,
  },
  {
    id: 'st-sku',
    code: 'SKU',
    title: 'Surat Keterangan Usaha (SKU)',
    description:
      'Surat keterangan bukti kepemilikan dan operasional usaha lokal aktif di desa untuk pengajuan Kredit Usaha Rakyat (KUR) atau perizinan usaha.',
    requiredDocs: [
      'Foto KTP Pemilik Usaha',
      'Foto Kartu Keluarga (KK)',
      'Foto Tempat & Aktivitas Usaha',
      'Bukti Kepemilikan Lokasi Usaha atau Surat Perjanjian Sewa',
    ],
    estimatedDays: 2,
    isActive: true,
  },
  {
    id: 'st-skck',
    code: 'SKCK',
    title: 'Surat Pengantar SKCK',
    description:
      'Surat pengantar kelakuan baik dari kantor desa sebagai salah satu persyaratan penerbitan SKCK di tingkat kepolisian sektor (Polsek).',
    requiredDocs: [
      'Foto KTP Pemohon',
      'Foto Kartu Keluarga (KK)',
      'Foto Akta Kelahiran atau Ijazah Terakhir',
      'Pas Foto 4x6 Latar Belakang Merah (2 lembar)',
    ],
    estimatedDays: 1,
    isActive: true,
  },
  {
    id: 'st-sktm',
    code: 'SKTM',
    title: 'Surat Keterangan Tidak Mampu (SKTM)',
    description:
      'Surat keterangan kondisi sosial ekonomi keluarga tidak mampu untuk permohonan beasiswa pendidikan atau keringanan biaya kesehatan jaminan sosial.',
    requiredDocs: [
      'Foto KTP Kepala Keluarga / Pemohon',
      'Foto Kartu Keluarga (KK)',
      'Surat Pengantar Kelian Banjar Setempat',
      'Foto Kondisi Rumah Tinggal (Tampak Depan & Ruang Tengah)',
      'Surat Pernyataan Tidak Mampu Bermaterai Rp 10.000',
    ],
    estimatedDays: 2,
    isActive: true,
  },
]
