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
          bg: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900/50 dark:text-amber-300',
          label: 'Menunggu Verifikasi',
          stepIndex: 1,
        }
      case 'IN_REVIEW':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:border-blue-900/50 dark:text-blue-300',
          label: 'Sedang Diverifikasi',
          stepIndex: 2,
        }
      case 'APPROVED':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900/50 dark:text-emerald-300',
          label: 'Disetujui / Selesai',
          stepIndex: 4,
        }
      case 'REVISION':
        return {
          bg: 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/40 dark:border-orange-900/50 dark:text-orange-300',
          label: 'Perlu Revisi Dokumen',
          stepIndex: 2,
        }
      case 'REJECTED':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900/50 dark:text-rose-300',
          label: 'Permohonan Ditolak',
          stepIndex: 2,
        }
      default:
        return {
          bg: 'bg-slate-50 text-slate-800 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300',
          label: 'Status Tidak Diketahui',
          stepIndex: 1,
        }
    }
  }

  const badge = getStatusBadge(result?.status)

  return (
    <div className="space-y-6">
      {/* Search Input Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-7 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg dark:text-white">
          Lacak Status Permohonan Surat
        </h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
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
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Contoh: REQ-202609-0001"
              aria-label="Nomor Tiket Permohonan"
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pl-10 pr-3 font-mono text-xs uppercase text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={!code.trim() || loading}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-800 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500 sm:text-sm"
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
            className="mt-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/50 p-3.5 text-xs text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Tracking Result View */}
      {result && result.found && (
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-8 dark:border-slate-800 dark:bg-slate-900">
          {/* Status Header */}
          <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                {result.trackingCode}
              </span>
              <h3 className="mt-1 text-lg font-extrabold text-slate-900 sm:text-xl dark:text-white">
                {result.serviceTypeTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
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
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Tahapan Penanganan Permohonan:
            </h4>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 text-white shadow-xs">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                </div>
                <span className="mt-2 font-bold text-slate-900 dark:text-white">Diajukan</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Sistem Online</span>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    badge.stepIndex >= 2
                      ? 'bg-blue-700 text-white'
                      : 'border border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  <FileCheck className="h-4 w-4" aria-hidden="true" />
                </div>
                <span className="mt-2 font-bold text-slate-900 dark:text-white">Verifikasi</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Berkas Persyaratan</span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    badge.stepIndex >= 3
                      ? 'bg-blue-700 text-white'
                      : 'border border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  <Building2 className="h-4 w-4" aria-hidden="true" />
                </div>
                <span className="mt-2 font-bold text-slate-900 dark:text-white">Tanda Tangan</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Kepala Desa</span>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    result.status === 'APPROVED'
                      ? 'bg-emerald-600 text-white'
                      : result.status === 'REJECTED'
                        ? 'bg-rose-600 text-white'
                        : 'border border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {result.status === 'REJECTED' ? (
                    <XCircle className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  )}
                </div>
                <span className="mt-2 font-bold text-slate-900 dark:text-white">Siap Ambil</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Loket Kantor Desa</span>
              </div>
            </div>
          </div>

          {/* Officer Notes Notice */}
          {result.officerNotes && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 text-xs sm:text-sm dark:border-blue-900/50 dark:bg-blue-950/30">
              <span className="font-bold text-blue-900 dark:text-blue-300">
                Catatan Petugas Desa Tegal Tugu:
              </span>
              <p className="mt-1 text-slate-800 dark:text-slate-200">{result.officerNotes}</p>
            </div>
          )}

          {/* Timeline History Logs */}
          {result.statusLogs && result.statusLogs.length > 0 && (
            <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
              <h4 className="mb-2 text-xs font-bold text-slate-900 dark:text-white">
                Riwayat Pembaruan Status:
              </h4>
              <div className="space-y-2">
                {result.statusLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/30"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">{log.label}</span>
                      {log.notes && (
                        <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                          {log.notes}
                        </p>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
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
