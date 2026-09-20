import { useState, useEffect } from 'react'
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  MapPin,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Wrench,
  Image as ImageIcon,
} from 'lucide-react'
import { trackComplaintServerFn } from '../../application/server-functions/complaint.fn'
import type { ComplaintTrackingDetailResult } from '../../application/use-cases/track-complaint.use-case'

interface ComplaintTrackingTimelineProps {
  initialTicketCode?: string
}

export default function ComplaintTrackingTimeline({
  initialTicketCode = '',
}: ComplaintTrackingTimelineProps) {
  const [ticketCode, setTicketCode] = useState(initialTicketCode)
  const [result, setResult] = useState<ComplaintTrackingDetailResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleTrack = async (targetCode?: string) => {
    const query = (targetCode || ticketCode).trim().toUpperCase()
    if (!query) return

    setLoading(true)
    setErrorMsg(null)

    try {
      const data = await trackComplaintServerFn({
        data: { ticketCode: query },
      })

      if (!data.found) {
        setResult(null)
        setErrorMsg(
          `Nomor tiket "${query}" tidak ditemukan. Pastikan format penulisan benar (contoh: CMP-202609-0001).`
        )
      } else {
        setResult(data)
      }
    } catch {
      setErrorMsg('Terjadi kendala saat memeriksa status pengaduan. Silakan coba kembali.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialTicketCode) {
      setTicketCode(initialTicketCode)
      handleTrack(initialTicketCode)
    }
  }, [initialTicketCode])

  const handleCopy = async () => {
    if (!result?.ticketCode) return
    try {
      await navigator.clipboard.writeText(result.ticketCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'OPEN':
        return {
          bg: 'bg-blue-500/10 text-blue-800 border-blue-500/30 dark:text-blue-300',
          label: 'Laporan Diterima',
          stepIndex: 1,
        }
      case 'IN_PROGRESS':
        return {
          bg: 'bg-amber-500/10 text-amber-800 border-amber-500/30 dark:text-amber-300',
          label: 'Sedang Ditangani',
          stepIndex: 2,
        }
      case 'RESOLVED':
        return {
          bg: 'bg-emerald-500/10 text-emerald-800 border-emerald-500/30 dark:text-emerald-300',
          label: 'Selesai Ditindaklanjuti',
          stepIndex: 3,
        }
      case 'REJECTED':
        return {
          bg: 'bg-rose-500/10 text-rose-800 border-rose-500/30 dark:text-rose-300',
          label: 'Laporan Ditolak',
          stepIndex: 3,
        }
      default:
        return {
          bg: 'bg-gray-500/10 text-gray-800 border-gray-500/30',
          label: 'Status Tidak Diketahui',
          stepIndex: 1,
        }
    }
  }

  const getPriorityBadge = (priority?: string | null) => {
    switch (priority) {
      case 'EMERGENCY':
        return 'bg-rose-600 text-white'
      case 'HIGH':
        return 'bg-amber-600 text-white'
      case 'MEDIUM':
        return 'bg-blue-600 text-white'
      case 'LOW':
        return 'bg-emerald-600 text-white'
      default:
        return 'bg-slate-600 text-white'
    }
  }

  const badge = getStatusBadge(result?.status)

  return (
    <div className="space-y-6">
      {/* Search Input Box */}
      <div className="island-shell rounded-3xl p-5 sm:p-7">
        <h2 className="text-base font-bold text-[var(--sea-ink)] sm:text-lg">
          Lacak Status Pengaduan Warga
        </h2>
        <p className="mt-1 text-xs text-[var(--sea-ink-soft)] sm:text-sm">
          Masukkan nomor tiket pengaduan Anda untuk memantau progres penanganan dan tindakan tim desa.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleTrack()
          }}
          className="mt-4 flex flex-col gap-2.5 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--sea-ink-soft)]"
              aria-hidden="true"
            />
            <input
              type="text"
              value={ticketCode}
              onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
              placeholder="Contoh: CMP-202609-0001"
              aria-label="Nomor Tiket Pengaduan"
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--header-bg)] py-2.5 pl-10 pr-3 font-mono text-xs uppercase text-[var(--sea-ink)] placeholder-[var(--sea-ink-soft)] focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={!ticketCode.trim() || loading}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50 dark:bg-emerald-600 sm:text-sm"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Search className="h-4 w-4" aria-hidden="true" />
            )}
            <span>Lacak Pengaduan</span>
          </button>
        </form>

        {errorMsg && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-2.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-800 dark:text-rose-200"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Tracking Result View */}
      {result && result.found && (
        <div className="island-shell space-y-6 rounded-3xl p-5 sm:p-8">
          {/* Header Card with Ticket Code & Status */}
          <div className="flex flex-col gap-3 border-b border-[var(--line)] pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold tracking-wider text-[var(--sea-ink)]">
                  {result.ticketCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Salin nomor tiket"
                  className="rounded p-1 text-[var(--sea-ink-soft)] transition hover:bg-black/5 hover:text-[var(--sea-ink)] dark:hover:bg-white/5"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                </button>
              </div>

              <h3 className="mt-1 text-lg font-extrabold text-[var(--sea-ink)] sm:text-xl">
                {result.title}
              </h3>
              <p className="mt-0.5 text-xs text-[var(--sea-ink-soft)]">
                Pelapor: <span className="font-medium text-[var(--sea-ink)]">{result.reporterName || 'Warga Tegal Tugu'}</span>
                {result.createdAt && (
                  <span> &bull; Diajukan pada {new Date(result.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}</span>
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {result.priority && (
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${getPriorityBadge(
                    result.priority
                  )}`}
                >
                  Prioritas {result.priorityLabel}
                </span>
              )}
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${badge.bg}`}
              >
                <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
                <span>{result.statusLabel}</span>
              </div>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-[var(--sea-ink-soft)]">
              Tahapan Penanganan Aduan:
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                </div>
                <span className="mt-2 font-bold text-[var(--sea-ink)]">Laporan Masuk</span>
                <span className="text-[10px] text-[var(--sea-ink-soft)]">Diterima Sistem</span>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    badge.stepIndex >= 2
                      ? 'bg-emerald-600 text-white'
                      : 'border border-[var(--line)] bg-[var(--chip-bg)] text-[var(--sea-ink-soft)]'
                  }`}
                >
                  <Wrench className="h-4 w-4" aria-hidden="true" />
                </div>
                <span className="mt-2 font-bold text-[var(--sea-ink)]">Disposisi Lapangan</span>
                <span className="text-[10px] text-[var(--sea-ink-soft)]">Penanganan Tim Desa</span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    result.status === 'RESOLVED'
                      ? 'bg-emerald-600 text-white'
                      : result.status === 'REJECTED'
                        ? 'bg-rose-600 text-white'
                        : 'border border-[var(--line)] bg-[var(--chip-bg)] text-[var(--sea-ink-soft)]'
                  }`}
                >
                  {result.status === 'REJECTED' ? (
                    <XCircle className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  )}
                </div>
                <span className="mt-2 font-bold text-[var(--sea-ink)]">
                  {result.status === 'REJECTED' ? 'Laporan Ditolak' : 'Selesai'}
                </span>
                <span className="text-[10px] text-[var(--sea-ink-soft)]">
                  {result.status === 'RESOLVED' && result.resolvedAt
                    ? new Date(result.resolvedAt).toLocaleDateString('id-ID')
                    : 'Tindak Lanjut Akhir'}
                </span>
              </div>
            </div>
          </div>

          {/* Details Grid: Location & Category */}
          <div className="grid gap-3 rounded-2xl border border-[var(--line)] bg-black/[0.02] p-4 text-xs dark:bg-white/[0.02] sm:grid-cols-2">
            <div>
              <span className="text-[var(--sea-ink-soft)]">Kategori Bidang:</span>
              <p className="mt-0.5 font-bold text-[var(--sea-ink)]">
                {result.categoryLabel || 'Lainnya / Umum'}
              </p>
            </div>
            <div>
              <span className="text-[var(--sea-ink-soft)]">Lokasi Kejadian:</span>
              <div className="mt-0.5 flex items-start gap-1 font-bold text-[var(--sea-ink)]">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
                <span>
                  {result.banjarName}
                  {result.specificLocation ? ` — ${result.specificLocation}` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Complaint Description */}
          <div>
            <h4 className="text-xs font-bold text-[var(--sea-ink)]">Deskripsi Laporan Warga:</h4>
            <p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-[var(--sea-ink-soft)] sm:text-sm">
              {result.description}
            </p>
          </div>

          {/* Photo Preview if attached */}
          {result.photoUrl && (
            <div className="rounded-2xl border border-[var(--line)] p-4">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-[var(--sea-ink)]">
                <ImageIcon className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                <span>Foto Bukti Lapangan:</span>
              </div>
              <div className="overflow-hidden rounded-xl border border-[var(--line)]">
                <img
                  src={result.photoUrl}
                  alt={`Bukti foto pengaduan ${result.ticketCode}`}
                  className="max-h-80 w-full object-cover sm:max-h-96"
                />
              </div>
            </div>
          )}

          {/* AI Triaging & Recommendation Analysis */}
          {(result.aiSummary || result.recommendedAction) && (
            <div className="rounded-2xl border border-emerald-600/30 bg-emerald-600/5 p-4 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                <Sparkles className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                <span>Analisis Kecerdasan Buatan (AI Evaluator Desa Tegal Tugu)</span>
              </div>
              {result.aiSummary && (
                <p className="mt-2 text-[var(--sea-ink)]">{result.aiSummary}</p>
              )}
              {result.recommendedAction && (
                <div className="mt-2.5 rounded-xl border border-emerald-600/20 bg-white/70 p-2.5 dark:bg-slate-900/70">
                  <span className="font-bold text-[var(--sea-ink)]">Rekomendasi Tindak Lanjut: </span>
                  <span className="text-[var(--sea-ink-soft)]">{result.recommendedAction}</span>
                </div>
              )}
            </div>
          )}

          {/* Timeline History Logs */}
          {result.logs && result.logs.length > 0 && (
            <div className="border-t border-[var(--line)] pt-4">
              <h4 className="mb-3 text-xs font-bold text-[var(--sea-ink)]">
                Catatan Tindak Lanjut &amp; Riwayat Progres:
              </h4>
              <div className="space-y-2.5">
                {result.logs.map((log, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-between gap-1 rounded-xl border border-[var(--line)] bg-black/[0.01] p-3 text-xs dark:bg-white/[0.01] sm:flex-row sm:items-center"
                  >
                    <div>
                      <span className="font-bold text-[var(--sea-ink)]">{log.label}</span>
                      {log.actionNote && (
                        <p className="mt-0.5 text-[11px] text-[var(--sea-ink-soft)]">
                          {log.actionNote}
                        </p>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-[10px] text-[var(--sea-ink-soft)]">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      <span>{new Date(log.createdAt).toLocaleDateString('id-ID')}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
