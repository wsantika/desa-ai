import { useState, useEffect } from 'react'
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  FileCheck,
  Building2,
  Loader2,
} from 'lucide-react'
import { trackServiceRequestServerFn } from '../../application/server-functions/service-request.fn'
import type { TrackingDetailResult } from '../../application/use-cases/track-service-request.use-case'

interface ServiceTrackingTimelineProps {
  initialCode?: string
}

export default function ServiceTrackingTimeline({
  initialCode = '',
}: ServiceTrackingTimelineProps) {
  const [code, setCode] = useState(initialCode)
  const [result, setResult] = useState<TrackingDetailResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleTrack = async (targetCode?: string) => {
    const query = (targetCode || code).trim().toUpperCase()
    if (!query) return

    setLoading(true)
    setErrorMsg(null)

    try {
      const data = await trackServiceRequestServerFn({
        data: { trackingCode: query },
      })

      if (!data.found) {
        setResult(null)
        setErrorMsg(`Nomor tiket "${query}" tidak ditemukan di database Desa Tegal Tugu. Pastikan format penulisan benar (contoh: REQ-202609-0001).`)
      } else {
        setResult(data)
      }
    } catch {
      setErrorMsg('Terjadi kendala saat memeriksa nomor tiket. Silakan coba kembali.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode)
      handleTrack(initialCode)
    }
  }, [initialCode])

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'PENDING':
        return {
          bg: 'bg-amber-500/10 text-amber-800 border-amber-500/30 dark:text-amber-300',
          label: 'Menunggu Verifikasi',
          stepIndex: 1,
        }
      case 'IN_REVIEW':
        return {
          bg: 'bg-blue-500/10 text-blue-800 border-blue-500/30 dark:text-blue-300',
          label: 'Sedang Diverifikasi',
          stepIndex: 2,
        }
      case 'APPROVED':
        return {
          bg: 'bg-emerald-500/10 text-emerald-800 border-emerald-500/30 dark:text-emerald-300',
          label: 'Disetujui / Selesai',
          stepIndex: 4,
        }
      case 'REVISION':
        return {
          bg: 'bg-orange-500/10 text-orange-800 border-orange-500/30 dark:text-orange-300',
          label: 'Perlu Revisi Dokumen',
          stepIndex: 2,
        }
      case 'REJECTED':
        return {
          bg: 'bg-rose-500/10 text-rose-800 border-rose-500/30 dark:text-rose-300',
          label: 'Permohonan Ditolak',
          stepIndex: 2,
        }
      default:
        return {
          bg: 'bg-gray-500/10 text-gray-800 border-gray-500/30',
          label: 'Status Tidak Diketahui',
          stepIndex: 1,
        }
    }
  }

  const badge = getStatusBadge(result?.status)

  return (
    <div className="space-y-6">
      {/* Search Input Box */}
      <div className="island-shell rounded-3xl p-5 sm:p-7">
        <h2 className="text-base font-bold text-[var(--sea-ink)] sm:text-lg">
          Lacak Status Permohonan Surat
        </h2>
        <p className="mt-1 text-xs text-[var(--sea-ink-soft)] sm:text-sm">
          Masukkan kode tiket permohonan Anda untuk melihat status terkini dari perangkat Desa Tegal Tugu.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleTrack()
          }}
          className="mt-4 flex flex-col gap-2.5 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--sea-ink-soft)]" aria-hidden="true" />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Contoh: REQ-202609-0001"
              aria-label="Nomor Tiket Permohonan"
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--header-bg)] py-2.5 pl-10 pr-3 font-mono text-xs uppercase text-[var(--sea-ink)] placeholder-[var(--sea-ink-soft)] focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={!code.trim() || loading}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50 dark:bg-emerald-600 sm:text-sm"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Search className="h-4 w-4" aria-hidden="true" />
            )}
            <span>Lacak Tiket</span>
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
          {/* Status Header */}
          <div className="flex flex-col gap-3 border-b border-[var(--line)] pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-[var(--sea-ink-soft)]">
                {result.trackingCode}
              </span>
              <h3 className="mt-1 text-lg font-extrabold text-[var(--sea-ink)] sm:text-xl">
                {result.serviceTypeTitle}
              </h3>
              <p className="text-xs text-[var(--sea-ink-soft)]">
                Pemohon: {result.applicantName} ({result.applicantNikMasked})
              </p>
            </div>

            <div className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold ${badge.bg}`}>
              <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
              <span>{result.statusLabel}</span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-[var(--sea-ink-soft)]">
              Tahapan Penanganan Permohonan:
            </h4>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                </div>
                <span className="mt-2 font-bold text-[var(--sea-ink)]">Diajukan</span>
                <span className="text-[10px] text-[var(--sea-ink-soft)]">Sistem Online</span>
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
                  <FileCheck className="h-4 w-4" aria-hidden="true" />
                </div>
                <span className="mt-2 font-bold text-[var(--sea-ink)]">Verifikasi</span>
                <span className="text-[10px] text-[var(--sea-ink-soft)]">Berkas Persyaratan</span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    badge.stepIndex >= 3
                      ? 'bg-emerald-600 text-white'
                      : 'border border-[var(--line)] bg-[var(--chip-bg)] text-[var(--sea-ink-soft)]'
                  }`}
                >
                  <Building2 className="h-4 w-4" aria-hidden="true" />
                </div>
                <span className="mt-2 font-bold text-[var(--sea-ink)]">Tanda Tangan</span>
                <span className="text-[10px] text-[var(--sea-ink-soft)]">Kepala Desa</span>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    result.status === 'APPROVED'
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
                <span className="mt-2 font-bold text-[var(--sea-ink)]">Siap Ambil</span>
                <span className="text-[10px] text-[var(--sea-ink-soft)]">Loket Kantor Desa</span>
              </div>
            </div>
          </div>

          {/* Officer Notes Notice */}
          {result.officerNotes && (
            <div className="rounded-2xl border border-emerald-600/30 bg-emerald-600/10 p-4 text-xs sm:text-sm">
              <span className="font-bold text-emerald-800 dark:text-emerald-300">
                Catatan Petugas Desa Tegal Tugu:
              </span>
              <p className="mt-1 text-[var(--sea-ink)]">{result.officerNotes}</p>
            </div>
          )}

          {/* Timeline History Logs */}
          {result.statusLogs && result.statusLogs.length > 0 && (
            <div className="border-t border-[var(--line)] pt-4">
              <h4 className="mb-2 text-xs font-bold text-[var(--sea-ink)]">
                Riwayat Pembaruan Status:
              </h4>
              <div className="space-y-2">
                {result.statusLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between rounded-xl border border-[var(--line)] bg-black/[0.01] p-3 text-xs dark:bg-white/[0.01]"
                  >
                    <div>
                      <span className="font-semibold text-[var(--sea-ink)]">{log.label}</span>
                      {log.notes && (
                        <p className="mt-0.5 text-[11px] text-[var(--sea-ink-soft)]">
                          {log.notes}
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
