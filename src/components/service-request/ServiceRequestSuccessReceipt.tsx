import { useState } from 'react'
import {
  CheckCircle2,
  Copy,
  Check,
  Clock,
  Search,
  PlusCircle,
} from 'lucide-react'
import type { ServiceRequestEntity } from '../../domain/entities/service-request.entity'

interface ServiceRequestSuccessReceiptProps {
  request: ServiceRequestEntity
  onTrackNow: (trackingCode: string) => void
  onNewRequest: () => void
}

export default function ServiceRequestSuccessReceipt({
  request,
  onTrackNow,
  onNewRequest,
}: ServiceRequestSuccessReceiptProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(request.trackingCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  const maskedNik =
    request.applicantNik.length >= 8
      ? request.applicantNik.slice(0, 6) + '******' + request.applicantNik.slice(-4)
      : request.applicantNik

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xs sm:p-10 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
        <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
      </div>

      <span className="mt-3 inline-block rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/60 dark:text-blue-300">
        Pemerintah Desa Tegal Tugu
      </span>

      <h2 className="mt-2 text-xl font-extrabold text-slate-900 sm:text-2xl dark:text-white">
        Permohonan Surat Berhasil Dikirim!
      </h2>
      <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
        Simpan kode tiket di bawah ini untuk memantau status persetujuan surat Anda.
      </p>

      {/* Big Ticket Code Card */}
      <div className="mt-6 rounded-2xl border-2 border-blue-200 bg-blue-50/70 p-5 dark:border-blue-900/50 dark:bg-blue-950/40">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Nomor Tiket Pelacakan Resmi:
        </span>
        <div className="mt-1 flex items-center justify-center gap-3">
          <span className="font-mono text-2xl font-black tracking-wider text-blue-800 dark:text-blue-300 sm:text-3xl">
            {request.trackingCode}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            title="Salin Nomor Tiket"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                <span className="text-blue-600 dark:text-blue-400">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Salin</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Detail Summary */}
      <div className="mt-6 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-slate-50/50 text-left text-xs sm:text-sm dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-800/30">
        <div className="flex items-center justify-between p-3.5">
          <span className="text-slate-500 dark:text-slate-400">Jenis Surat:</span>
          <span className="font-bold text-slate-900 dark:text-white">
            {request.serviceTypeTitle || request.serviceTypeCode}
          </span>
        </div>
        <div className="flex items-center justify-between p-3.5">
          <span className="text-slate-500 dark:text-slate-400">Nama Pemohon:</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {request.applicantName}
          </span>
        </div>
        <div className="flex items-center justify-between p-3.5">
          <span className="text-slate-500 dark:text-slate-400">NIK Pemohon:</span>
          <span className="font-mono font-medium text-slate-900 dark:text-white">
            {maskedNik}
          </span>
        </div>
        <div className="flex items-center justify-between p-3.5">
          <span className="text-slate-500 dark:text-slate-400">Estimasi Selesai:</span>
          <span className="inline-flex items-center gap-1 font-bold text-blue-700 dark:text-blue-400">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            <span>1 - 2 Hari Kerja</span>
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={() => onTrackNow(request.trackingCode)}
          className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 sm:text-sm"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span>Lacak Status Sekarang</span>
        </button>

        <button
          type="button"
          onClick={onNewRequest}
          className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 sm:text-sm"
        >
          <PlusCircle className="h-4 w-4" aria-hidden="true" />
          <span>Buat Permohonan Lain</span>
        </button>
      </div>
    </div>
  )
}
