import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  FileText,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Search,
  PenTool,
} from 'lucide-react'
import ServiceRequestForm from '../components/service-request/ServiceRequestForm'
import ServiceRequestSuccessReceipt from '../components/service-request/ServiceRequestSuccessReceipt'
import ServiceTrackingTimeline from '../components/service-request/ServiceTrackingTimeline'
import type { ServiceRequestEntity } from '../domain/entities/service-request.entity'

export const Route = createFileRoute('/layanan')({
  component: LayananHubPage,
})

type ActiveTab = 'katalog' | 'form' | 'lacak'

interface ServiceCard {
  id: string
  code: 'DOMISILI' | 'SKU' | 'SKCK' | 'SKTM'
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
      'Surat keterangan bukti tempat tinggal resmi di wilayah Banjar Desa Tegal Tugu untuk perbankan, pekerjaan, atau sekolah.',
    requirements: [
      'Fotokopi/Foto KTP Pemohon',
      'Kartu Keluarga (KK)',
      'Surat Pengantar Kelian Banjar',
    ],
    sla: '1 Hari Kerja',
    fee: 'Gratis (Rp 0)',
  },
  {
    id: 'sku',
    code: 'SKU',
    title: 'Surat Keterangan Usaha (SKU)',
    category: 'Pemberdayaan Ekonomi & UMKM',
    description:
      'Legalitas keterangan usaha warga aktif di Desa Tegal Tugu untuk pengajuan pinjaman perbankan (KUR), izin edar, atau kemitraan.',
    requirements: [
      'KTP & Kartu Keluarga Pemohon',
      'Foto Tempat/Aktivitas Usaha',
      'Pernyataan Usaha Aktif',
    ],
    sla: '1 - 2 Hari Kerja',
    fee: 'Gratis (Rp 0)',
  },
  {
    id: 'skck',
    code: 'SKCK',
    title: 'Surat Pengantar SKCK',
    category: 'Kamtibmas & Kepolisian',
    description:
      'Pengantar resmi dari Kepala Desa Tegal Tugu untuk pengurusan Surat Keterangan Catatan Kepolisian di Polsek Gianyar.',
    requirements: [
      'KTP & KK Pemohon',
      'Pas Foto 4x6 Latar Merah (2 lembar)',
      'Pengantar dari Kelian Banjar',
    ],
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
    requirements: [
      'KTP & KK Pemohon',
      'Surat Rekomendasi Kelian Banjar',
      'Pernyataan Penghasilan Keluarga',
    ],
    sla: '2 Hari Kerja',
    fee: 'Gratis (Rp 0)',
  },
]

function LayananHubPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('katalog')
  const [selectedServiceCode, setSelectedServiceCode] = useState<
    'DOMISILI' | 'SKU' | 'SKCK' | 'SKTM'
  >('DOMISILI')
  const [submittedRequest, setSubmittedRequest] = useState<ServiceRequestEntity | null>(null)
  const [trackingCodeToQuery, setTrackingCodeToQuery] = useState('')

  const handleApplyService = (code: 'DOMISILI' | 'SKU' | 'SKCK' | 'SKTM') => {
    setSelectedServiceCode(code)
    setSubmittedRequest(null)
    setActiveTab('form')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSuccessSubmit = (request: ServiceRequestEntity) => {
    setSubmittedRequest(request)
  }

  const handleTrackNow = (code: string) => {
    setTrackingCodeToQuery(code)
    setActiveTab('lacak')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="page-wrap px-4 py-6 sm:py-10">
      {/* Header Identitas Desa Tegal Tugu */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-600/10 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Pemerintah Desa Tegal Tugu, Gianyar</span>
        </div>
        <h1 className="display-title mt-3 text-2xl font-extrabold tracking-tight text-[var(--sea-ink)] sm:text-4xl">
          Pelayanan Surat Mandiri Warga
        </h1>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-[var(--sea-ink-soft)] sm:text-base">
          Ajukan permohonan administrasi surat desa secara online dari HP Anda.
          Bebas antrean fisik, verifikasi transparan, dan tanpa pungutan biaya (Gratis Rp 0).
        </p>
      </div>

      {/* Navigation Tabs (Katalog, Formulir, Lacak) */}
      <div className="mb-8 flex gap-2 border-b border-[var(--line)] pb-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('katalog')}
          className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition sm:text-sm ${
            activeTab === 'katalog'
              ? 'bg-emerald-700 text-white shadow-sm dark:bg-emerald-600'
              : 'text-[var(--sea-ink-soft)] hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <FileText className="h-4 w-4" aria-hidden="true" />
          <span>Katalog Surat</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSubmittedRequest(null)
            setActiveTab('form')
          }}
          className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition sm:text-sm ${
            activeTab === 'form'
              ? 'bg-emerald-700 text-white shadow-sm dark:bg-emerald-600'
              : 'text-[var(--sea-ink-soft)] hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <PenTool className="h-4 w-4" aria-hidden="true" />
          <span>Formulir Pengajuan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('lacak')}
          className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition sm:text-sm ${
            activeTab === 'lacak'
              ? 'bg-emerald-700 text-white shadow-sm dark:bg-emerald-600'
              : 'text-[var(--sea-ink-soft)] hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span>Lacak Nomor Tiket</span>
        </button>
      </div>

      {/* TAB 1: KATALOG SURAT */}
      {activeTab === 'katalog' && (
        <div className="space-y-6">
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
                          <CheckCircle2
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                            aria-hidden="true"
                          />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex flex-col items-stretch gap-3 border-t border-[var(--line)] pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--sea-ink-soft)]">
                    <Clock
                      className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400"
                      aria-hidden="true"
                    />
                    <span>Estimasi: {service.sla}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApplyService(service.code)}
                    className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                  >
                    <span>Ajukan Surat Ini</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: FORMULIR PENGAJUAN / RECEIPT */}
      {activeTab === 'form' && (
        <div>
          {submittedRequest ? (
            <ServiceRequestSuccessReceipt
              request={submittedRequest}
              onTrackNow={handleTrackNow}
              onNewRequest={() => setSubmittedRequest(null)}
            />
          ) : (
            <ServiceRequestForm
              initialServiceTypeCode={selectedServiceCode}
              onSuccess={handleSuccessSubmit}
            />
          )}
        </div>
      )}

      {/* TAB 3: LACAK NOMOR TIKET */}
      {activeTab === 'lacak' && (
        <div>
          <ServiceTrackingTimeline initialCode={trackingCodeToQuery} />
        </div>
      )}
    </div>
  )
}
