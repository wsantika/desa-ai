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
  ArrowRight,
  CheckCircle2,
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
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
          <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Pengaduan Terpadu Desa Tegal Tugu, Gianyar</span>
        </div>
        <h1 className="display-title mt-3 text-2xl font-extrabold tracking-tight text-[var(--sea-ink)] sm:text-4xl">
          Layanan Pengaduan &amp; Aspirasi Warga
        </h1>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-[var(--sea-ink-soft)] sm:text-base">
          Laporkan kendala fasilitas umum atau aspirasi Anda di Desa Tegal Tugu.
          Setiap laporan diprioritaskan otomatis dengan evaluasi cerdas AI dan
          ditindaklanjuti secara transparan oleh perangkat desa.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8 flex gap-2 border-b border-[var(--line)] pb-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('kategori')}
          className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition sm:text-sm ${
            activeTab === 'kategori'
              ? 'bg-emerald-700 text-white shadow-sm dark:bg-emerald-600'
              : 'text-[var(--sea-ink-soft)] hover:bg-black/5 dark:hover:bg-white/5'
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
              ? 'bg-emerald-700 text-white shadow-sm dark:bg-emerald-600'
              : 'text-[var(--sea-ink-soft)] hover:bg-black/5 dark:hover:bg-white/5'
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
              ? 'bg-emerald-700 text-white shadow-sm dark:bg-emerald-600'
              : 'text-[var(--sea-ink-soft)] hover:bg-black/5 dark:hover:bg-white/5'
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
          <div className="island-shell flex flex-col items-start justify-between gap-5 rounded-3xl border-2 border-emerald-600/30 bg-emerald-600/5 p-6 sm:flex-row sm:items-center sm:p-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600/10 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Evaluasi Cerdas AI 24 Jam</span>
              </div>
              <h2 className="mt-2 text-xl font-bold text-[var(--sea-ink)] sm:text-2xl">
                Ada Fasilitas Rusak di Lingkungan Anda?
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-[var(--sea-ink-soft)] sm:text-sm">
                Ambil foto bukti, tuliskan lokasi banjar dan kendalanya. Sistem
                AI Desa Tegal Tugu akan langsung menilai tingkat kedaruratan
                untuk penanganan petugas.
              </p>
            </div>
            <button
              type="button"
              onClick={handleStartReport}
              className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-xs font-bold text-white shadow-md transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 sm:text-sm"
            >
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              <span>Buat Pengaduan Sekarang</span>
            </button>
          </div>

          {/* Quick Tracking Search Box */}
          <div className="island-shell rounded-2xl p-5 sm:p-6">
            <h3 className="text-sm font-bold text-[var(--sea-ink)] sm:text-base">
              Sudah Pernah Mengajukan Pengaduan?
            </h3>
            <p className="mt-1 text-xs text-[var(--sea-ink-soft)]">
              Cek perkembangan penanganan aduan Anda secara transparan dengan
              memasukkan kode tiket pengaduan (CMP-YYYYMM-XXXX).
            </p>
            <div className="mt-3 flex max-w-md gap-2">
              <input
                type="text"
                placeholder="Contoh: CMP-202609-0001"
                aria-label="Nomor Tiket Pengaduan Warga"
                id="quick-ticket-input"
                className="flex-1 rounded-xl border border-[var(--line)] bg-[var(--header-bg)] px-3.5 py-2 font-mono text-xs uppercase text-[var(--sea-ink)] placeholder-[var(--sea-ink-soft)] focus:border-emerald-600 focus:outline-none"
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
                className="inline-flex min-h-[40px] items-center justify-center rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-800 dark:bg-emerald-600"
              >
                <span>Lacak</span>
              </button>
            </div>
          </div>

          {/* Category Grid */}
          <div>
            <h2 className="mb-4 text-lg font-bold text-[var(--sea-ink)] sm:text-xl">
              Kategori Pengaduan yang Dapat Dilaporkan
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {COMPLAINT_CATEGORIES.map((cat, idx) => {
                const Icon = cat.icon
                return (
                  <article
                    key={idx}
                    className="island-shell flex flex-col justify-between rounded-2xl p-5"
                  >
                    <div>
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="text-sm font-bold text-[var(--sea-ink)]">
                        {cat.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-[var(--sea-ink-soft)]">
                        {cat.desc}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center gap-1.5 border-t border-[var(--line)] pt-3 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      <span>{cat.priorityHint}</span>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>

          {/* 3 Step Workflow */}
          <div className="island-shell rounded-3xl p-6 sm:p-8">
            <h2 className="text-base font-bold text-[var(--sea-ink)] sm:text-lg">
              Alur Penanganan Pengaduan Cerdas
            </h2>
            <p className="mt-1 text-xs text-[var(--sea-ink-soft)]">
              Desa Tegal Tugu menjamin setiap pengaduan diproses secara
              transparan tanpa pungutan liar.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[var(--line)] bg-black/[0.01] p-4 dark:bg-white/[0.01]">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  1
                </div>
                <h3 className="mt-3 text-sm font-bold text-[var(--sea-ink)]">
                  Lapor Mandiri dari HP
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[var(--sea-ink-soft)]">
                  Isi judul, banjar, patokan lokasi, kronologi masalah, dan
                  lampirkan foto bukti lapangan.
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--line)] bg-black/[0.01] p-4 dark:bg-white/[0.01]">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  2
                </div>
                <h3 className="mt-3 text-sm font-bold text-[var(--sea-ink)]">
                  Triase &amp; Disposisi AI
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[var(--sea-ink-soft)]">
                  AI mengklasifikasikan bidang, menyimpulkan urgensi, dan
                  memberi notifikasi ke petugas berwenang.
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--line)] bg-black/[0.01] p-4 dark:bg-white/[0.01]">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  3
                </div>
                <h3 className="mt-3 text-sm font-bold text-[var(--sea-ink)]">
                  Tindak Lanjut &amp; Solusi
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[var(--sea-ink-soft)]">
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
