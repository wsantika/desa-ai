import { createFileRoute, Link } from '@tanstack/react-router'
import { FileText, Clock, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react'

export const Route = createFileRoute('/layanan')({
  component: LayananCatalogPage,
})

interface ServiceCard {
  id: string
  code: string
  title: string
  category: string
  description: string
  requirements: string[]
  sla: string
  fee: string
}

const SERVICE_ITEMS: ServiceCard[] = [
  {
    id: 'domisili',
    code: 'DOMISILI',
    title: 'Surat Keterangan Domisili',
    category: 'Administrasi Kependudukan',
    description:
      'Surat keterangan bukti tempat tinggal resmi di wilayah Banjar Desa Mandara untuk perbankan, pekerjaan, atau sekolah.',
    requirements: ['Fotokopi/Foto KTP Pemohon', 'Kartu Keluarga (KK)', 'Surat Pengantar Kelian Banjar'],
    sla: '1 Hari Kerja',
    fee: 'Gratis (Rp 0)',
  },
  {
    id: 'sku',
    code: 'SKU',
    title: 'Surat Keterangan Usaha (SKU)',
    category: 'Pemberdayaan Ekonomi & UMKM',
    description:
      'Legalitas keterangan usaha warga aktif di Desa Mandara untuk pengajuan pinjaman perbankan (KUR), izin edar, atau kemitraan.',
    requirements: ['KTP & Kartu Keluarga Pemohon', 'Foto Tempat/Aktivitas Usaha', 'Pernyataan Usaha Aktif'],
    sla: '1 Hari Kerja',
    fee: 'Gratis (Rp 0)',
  },
  {
    id: 'skck',
    code: 'PENGANTAR_SKCK',
    title: 'Surat Pengantar SKCK',
    category: 'Kamtibmas & Kepolisian',
    description:
      'Pengantar resmi dari Kepala Desa untuk pengurusan Surat Keterangan Catatan Kepolisian di Polsek Kuta Selatan.',
    requirements: ['KTP & KK Pemohon', 'Pas Foto 4x6 Latar Merah (2 lembar)', 'Pengantar dari Banjar'],
    sla: '1 Hari Kerja',
    fee: 'Gratis (Rp 0)',
  },
  {
    id: 'sktm',
    code: 'SKTM',
    title: 'Surat Keterangan Tidak Mampu (SKTM)',
    category: 'Kesejahteraan Sosial',
    description:
      'Keterangan pembebasan biaya pengobatan rumah sakit, beasiswa siswa berprestasi, atau bantuan sosial terpadu.',
    requirements: ['KTP & KK Pemohon', 'Surat Rekomendasi Kelian Banjar', 'Pernyataan Penghasilan Keluarga'],
    sla: '2 Hari Kerja',
    fee: 'Gratis (Rp 0)',
  },
]

function LayananCatalogPage() {
  return (
    <div className="page-wrap px-4 py-6 sm:py-10">
      {/* Header Section */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-600/10 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Layanan Resmi Desa Mandara</span>
        </div>
        <h1 className="display-title mt-3 text-2xl font-extrabold tracking-tight text-[var(--sea-ink)] sm:text-4xl">
          Layanan Surat Mandiri Warga
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--sea-ink-soft)] sm:text-base">
          Ajukan permohonan administrasi desa langsung dari ponsel Anda. Cepat,
          transparan, terpantau real-time, dan bebas pungutan biaya (0 Rupiah).
        </p>
      </div>

      {/* Service Catalog Grid */}
      <div className="grid gap-5 sm:grid-cols-2">
        {SERVICE_ITEMS.map((service) => (
          <article
            key={service.id}
            className="island-shell flex flex-col justify-between rounded-2xl p-5 transition-shadow hover:shadow-md sm:p-6"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-md border border-[var(--line)] bg-[var(--chip-bg)] px-2.5 py-0.5 text-xs font-medium text-[var(--sea-ink-soft)]">
                  {service.category}
                </span>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  {service.fee}
                </span>
              </div>

              <h2 className="mt-3 text-lg font-bold text-[var(--sea-ink)] sm:text-xl">
                {service.title}
              </h2>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--sea-ink-soft)] sm:text-sm">
                {service.description}
              </p>

              <div className="mt-4 rounded-xl border border-[var(--line)] bg-black/[0.02] p-3 dark:bg-white/[0.02]">
                <p className="mb-2 text-xs font-bold text-[var(--sea-ink)]">
                  Persyaratan Dokumen:
                </p>
                <ul className="space-y-1.5 text-xs text-[var(--sea-ink-soft)]">
                  {service.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-stretch gap-3 border-t border-[var(--line)] pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-1.5 text-xs text-[var(--sea-ink-soft)]">
                <Clock className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                <span>Estimasi: {service.sla}</span>
              </div>

              <Link
                to="/"
                className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                <span>Ajukan Surat</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Information Callout */}
      <div className="island-shell mt-8 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-bold text-[var(--sea-ink)]">
              Bingung dengan dokumen yang harus disiapkan?
            </h3>
            <p className="mt-1 text-xs text-[var(--sea-ink-soft)] sm:text-sm">
              Tanyakan langsung ke Made Mandara, asisten AI resmi Desa Mandara yang siap memandu 24 jam.
            </p>
          </div>
          <Link
            to="/asisten"
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl border border-emerald-600/30 bg-emerald-600/10 px-4 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-600/20 dark:text-emerald-300 sm:text-sm"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            <span>Tanya Persyaratan ke AI</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
