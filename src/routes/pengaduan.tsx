import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  ShieldAlert,
  Search,
  Wrench,
  Lightbulb,
  Trash2,
  Shield,
  FileText,
  AlertTriangle,
  Sparkles,
  Clock,
} from 'lucide-react'
import ComplaintForm from '../components/complaint/ComplaintForm'
import ComplaintSuccessReceipt from '../components/complaint/ComplaintSuccessReceipt'
import ComplaintTrackingTimeline from '../components/complaint/ComplaintTrackingTimeline'
import type { ComplaintEntity } from '../domain/entities/complaint.entity'
import type { AIEvaluationResult } from '../domain/repositories/i-ai-evaluator.service'

interface PengaduanSearchParams {
  track?: string
  tab?: 'kategori' | 'form' | 'lacak'
}

export const Route = createFileRoute('/pengaduan')({
  validateSearch: (search: Record<string, unknown>): PengaduanSearchParams => {
    const validTabs = ['kategori', 'form', 'lacak'] as const
    return {
      track: typeof search.track === 'string' ? search.track : undefined,
      tab:
        typeof search.tab === 'string' &&
        validTabs.includes(search.tab as (typeof validTabs)[number])
          ? (search.tab as (typeof validTabs)[number])
          : undefined,
    }
  },
  component: PengaduanHubPage,
})

type ActiveTab = 'kategori' | 'form' | 'lacak'

const COMPLAINT_CATEGORIES = [
  {
    icon: Wrench,
    title: 'Infrastruktur Jalan & Fasilitas',
    desc: 'Jalan berlubang, saluran drainase mampet, senderan longsor, atau kerusakan balai banjar.',
    priorityHint: 'Tindakan: 1 - 3 Hari',
  },
  {
    icon: Lightbulb,
    title: 'Penerangan Jalan Umum (LPJU)',
    desc: 'Lampu jalan mati, tiang rapuh membahayakan warga, atau kabel listrik kendor.',
    priorityHint: 'Tindakan: 1 - 2 Hari',
  },
  {
    icon: Trash2,
    title: 'Kebersihan & Sampah Liar',
    desc: 'Tumpukan sampah liar, jadwal angkut TPS3R terlambat, atau limbah di bantaran sungai.',
    priorityHint: 'Tindakan: 1 Hari',
  },
  {
    icon: Shield,
    title: 'Ketertiban & Keamanan Warga',
    desc: 'Hewan liar meresahkan, gangguan kebisingan larut malam, atau potensi kerawanan banjar.',
    priorityHint: 'Tindakan: Respons Cepat',
  },
]

function PengaduanHubPage() {
  const search = Route.useSearch()
  const initialTrack = search.track || ''
  const initialTab: ActiveTab =
    search.tab || (initialTrack ? 'lacak' : 'kategori')

  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab)
  const [trackingTicketToQuery, setTrackingTicketToQuery] =
    useState(initialTrack)
  const [submittedData, setSubmittedData] = useState<{
    complaint: ComplaintEntity
    evaluation?: AIEvaluationResult
  } | null>(null)

  useEffect(() => {
    if (search.tab) {
      setActiveTab(search.tab)
    } else if (search.track) {
      setActiveTab('lacak')
      setTrackingTicketToQuery(search.track)
    }
  }, [search.tab, search.track])

  const handleStartReport = () => {
    setSubmittedData(null)
    setActiveTab('form')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleTrackDirect = (code: string) => {
    setTrackingTicketToQuery(code)
    setActiveTab('lacak')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="page-wrap px-4 py-6 sm:py-10">
      {/* Header Identitas Desa Tegal Tugu */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/60 dark:text-rose-300">
          <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Pengaduan Terpadu Desa Tegal Tugu, Gianyar</span>
        </div>
        <h1 className="display-title mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Layanan Pengaduan &amp; Aspirasi Warga
        </h1>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
          Laporkan kendala fasilitas umum atau aspirasi Anda di Desa Tegal Tugu.
          Setiap laporan diprioritaskan otomatis dengan evaluasi cerdas AI dan
          ditindaklanjuti secara transparan oleh perangkat desa.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8 flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab('kategori')}
          className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition sm:text-sm ${
            activeTab === 'kategori'
              ? 'bg-blue-700 text-white shadow-xs dark:bg-blue-600'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="h-4 w-4" aria-hidden="true" />
          <span>Kategori &amp; Alur</span>
        </button>

        <button
          type="button"
          onClick={handleStartReport}
          className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition sm:text-sm ${
            activeTab === 'form'
              ? 'bg-blue-700 text-white shadow-xs dark:bg-blue-600'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          <span>Formulir Pengaduan</span>
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
          <span>Lacak Tiket Aduan</span>
        </button>
      </div>

      {/* TAB 1: KATEGORI & ALUR PENGADUAN */}
      {activeTab === 'kategori' && (
        <div className="space-y-8">
          {/* CTA Banner */}
          <div className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-blue-200 bg-blue-50/60 p-6 shadow-xs sm:flex-row sm:items-center sm:p-8 dark:border-blue-900/50 dark:bg-blue-950/30">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-100/70 px-2.5 py-1 text-xs font-bold text-blue-800 dark:border-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Evaluasi Cerdas AI 24 Jam</span>
              </div>
              <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
                Ada Fasilitas Rusak di Lingkungan Anda?
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
                Ambil foto bukti, tuliskan lokasi banjar dan kendalanya. Sistem
                AI Desa Tegal Tugu akan langsung menilai tingkat kedaruratan
                untuk penanganan petugas.
              </p>
            </div>
            <button
              type="button"
              onClick={handleStartReport}
              className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-xs font-bold text-white shadow-xs transition hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 sm:text-sm"
            >
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              <span>Buat Pengaduan Sekarang</span>
            </button>
          </div>

          {/* Quick Tracking Search Box */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">
              Sudah Pernah Mengajukan Pengaduan?
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Cek perkembangan penanganan aduan Anda secara transparan dengan
              memasukkan kode tiket pengaduan (CMP-YYYYMM-XXXX).
            </p>
            <div className="mt-3 flex max-w-md gap-2">
              <input
                type="text"
                placeholder="Contoh: CMP-202609-0001"
                aria-label="Nomor Tiket Pengaduan Warga"
                id="quick-ticket-input"
                className="flex-1 rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2 font-mono text-xs uppercase text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.currentTarget
                    if (input.value.trim()) {
                      handleTrackDirect(input.value.trim().toUpperCase())
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById(
                    'quick-ticket-input',
                  ) as HTMLInputElement | null
                  if (el && el.value.trim()) {
                    handleTrackDirect(el.value.trim().toUpperCase())
                  }
                }}
                className="inline-flex min-h-[40px] items-center justify-center rounded-xl bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                <span>Lacak</span>
              </button>
            </div>
          </div>

          {/* Category Grid */}
          <div>
            <h2 className="mb-4 text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
              Kategori Pengaduan yang Dapat Dilaporkan
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {COMPLAINT_CATEGORIES.map((cat, idx) => {
                const Icon = cat.icon
                return (
                  <article
                    key={idx}
                    className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
                  >
                    <div>
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/60 dark:text-blue-400">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {cat.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                        {cat.desc}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-[11px] font-semibold text-blue-700 dark:border-slate-800 dark:text-blue-400">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      <span>{cat.priorityHint}</span>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>

          {/* 3 Step Workflow */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-base font-bold text-slate-900 sm:text-lg dark:text-white">
              Alur Penanganan Pengaduan Cerdas
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Desa Tegal Tugu menjamin setiap pengaduan diproses secara
              transparan tanpa pungutan liar.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">
                  1
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                  Lapor Mandiri dari HP
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Isi judul, banjar, patokan lokasi, kronologi masalah, dan
                  lampirkan foto bukti lapangan.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">
                  2
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                  Triase &amp; Disposisi AI
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  AI mengklasifikasikan bidang, menyimpulkan urgensi, dan
                  memberi notifikasi ke petugas berwenang.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">
                  3
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                  Tindak Lanjut &amp; Solusi
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Petugas dan aparat banjar meninjau langsung ke lokasi dan
                  mencatat bukti penyelesaian di sistem.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FORMULIR PENGADUAN ATAU BUKTI TIKET */}
      {activeTab === 'form' && (
        <div>
          {submittedData ? (
            <ComplaintSuccessReceipt
              complaint={submittedData.complaint}
              evaluation={submittedData.evaluation}
              onTrackNow={handleTrackDirect}
              onNewComplaint={() => setSubmittedData(null)}
            />
          ) : (
            <ComplaintForm
              onSuccess={(result) => {
                setSubmittedData(result)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          )}
        </div>
      )}

      {/* TAB 3: LACAK TIKET PENGADUAN */}
      {activeTab === 'lacak' && (
        <div>
          <ComplaintTrackingTimeline
            initialTicketCode={trackingTicketToQuery}
          />
        </div>
      )}
    </div>
  )
}
