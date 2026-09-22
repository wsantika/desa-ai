import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
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

interface LayananSearchParams {
  track?: string
  tab?: 'katalog' | 'form' | 'lacak'
  type?: 'DOMISILI' | 'SKU' | 'SKCK' | 'SKTM'
}

export const Route = createFileRoute('/layanan')({
  validateSearch: (search: Record<string, unknown>): LayananSearchParams => {
    const validTabs = ['katalog', 'form', 'lacak'] as const
    const validTypes = ['DOMISILI', 'SKU', 'SKCK', 'SKTM'] as const
    return {
      track: typeof search.track === 'string' ? search.track : undefined,
      tab:
        typeof search.tab === 'string' &&
        validTabs.includes(search.tab as (typeof validTabs)[number])
          ? (search.tab as (typeof validTabs)[number])
          : undefined,
      type:
        typeof search.type === 'string' &&
        validTypes.includes(search.type as (typeof validTypes)[number])
          ? (search.type as (typeof validTypes)[number])
          : undefined,
    }
  },
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
  const search = Route.useSearch()
  const initialTrack = search.track || ''
  const initialType = search.type
  const initialTab: ActiveTab =
    search.tab || (initialTrack ? 'lacak' : initialType ? 'form' : 'katalog')

  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab)
  const [selectedServiceCode, setSelectedServiceCode] = useState<
    'DOMISILI' | 'SKU' | 'SKCK' | 'SKTM'
  >(initialType || 'DOMISILI')
  const [submittedRequest, setSubmittedRequest] =
    useState<ServiceRequestEntity | null>(null)
  const [trackingCodeToQuery, setTrackingCodeToQuery] = useState(initialTrack)

  useEffect(() => {
    if (search.type) {
      setSelectedServiceCode(search.type)
      setActiveTab('form')
    } else if (search.tab) {
      setActiveTab(search.tab)
    } else if (search.track) {
      setActiveTab('lacak')
      setTrackingCodeToQuery(search.track)
    }
  }, [search.type, search.tab, search.track])

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
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/60 dark:text-blue-300">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Pemerintah Desa Tegal Tugu, Gianyar</span>
        </div>
        <h1 className="display-title mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Pelayanan Surat Mandiri Warga
        </h1>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
          Ajukan permohonan administrasi surat desa secara online dari HP Anda.
          Bebas antrean fisik, verifikasi transparan, dan tanpa pungutan biaya
          (Gratis Rp 0).
        </p>
      </div>

      {/* Navigation Tabs (Katalog, Formulir, Lacak) */}
      <div className="mb-8 flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab('katalog')}
          className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition sm:text-sm ${
            activeTab === 'katalog'
              ? 'bg-blue-700 text-white shadow-xs dark:bg-blue-600'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
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
              ? 'bg-blue-700 text-white shadow-xs dark:bg-blue-600'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
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
              ? 'bg-blue-700 text-white shadow-xs dark:bg-blue-600'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
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
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-blue-300 sm:p-6 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {service.category}
                    </span>
                    <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/60 dark:text-blue-300">
                      {service.fee}
                    </span>
                  </div>

                  <h2 className="mt-3 text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
                    {service.title}
                  </h2>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-400">
                    {service.description}
                  </p>

                  <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                    <p className="mb-2 text-xs font-bold text-slate-900 dark:text-white">
                      Persyaratan Dokumen:
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                      {service.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400"
                            aria-hidden="true"
                          />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex flex-col items-stretch gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <Clock
                      className="h-3.5 w-3.5 text-blue-700 dark:text-blue-400"
                      aria-hidden="true"
                    />
                    <span>Estimasi: {service.sla}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApplyService(service.code)}
                    className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
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
