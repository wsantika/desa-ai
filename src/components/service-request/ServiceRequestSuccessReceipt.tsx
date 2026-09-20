import { useState } from 'react'
import {
  CheckCircle2,
  Copy,
  Check,
  Clock,
  FileText,
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
    <div className="island-shell mx-auto max-w-xl rounded-3xl p-6 text-center sm:p-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600/15 text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
      </div>

      <span className="mt-3 inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
        Pemerintah Desa Tegal Tugu
      </span>

      <h2 className="mt-2 text-xl font-extrabold text-[var(--sea-ink)] sm:text-2xl">
        Permohonan Surat Berhasil Dikirim!
      </h2>
      <p className="mt-1 text-xs text-[var(--sea-ink-soft)] sm:text-sm">
        Simpan kode tiket di bawah ini untuk memantau status persetujuan surat Anda.
      </p>

      {/* Big Ticket Code Card */}
      <div className="mt-6 rounded-2xl border-2 border-emerald-600/30 bg-emerald-600/10 p-5">
        <span className="text-xs font-semibold text-[var(--sea-ink-soft)]">
          Nomor Tiket Pelacakan Resmi:
        </span>
        <div className="mt-1 flex items-center justify-center gap-3">
          <span className="font-mono text-2xl font-black tracking-wider text-emerald-800 dark:text-emerald-300 sm:text-3xl">
            {request.trackingCode}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-[var(--line)] bg-[var(--chip-bg)] px-3 py-1.5 text-xs font-bold text-[var(--sea-ink)] shadow-sm transition hover:bg-black/5 active:scale-95 dark:hover:bg-white/5"
            title="Salin Nomor Tiket"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                <span className="text-emerald-600">Tersalin!</span>
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
      <div className="mt-6 divide-y divide-[var(--line)] rounded-2xl border border-[var(--line)] bg-[var(--header-bg)] text-left text-xs sm:text-sm">
        <div className="flex items-center justify-between p-3.5">
          <span className="text-[var(--sea-ink-soft)]">Jenis Surat:</span>
          <span className="font-bold text-[var(--sea-ink)]">
            {request.serviceTypeTitle || request.serviceTypeCode}
          </span>
        </div>
        <div className="flex items-center justify-between p-3.5">
          <span className="text-[var(--sea-ink-soft)]">Nama Pemohon:</span>
          <span className="font-semibold text-[var(--sea-ink)]">
            {request.applicantName}
          </span>
        </div>
        <div className="flex items-center justify-between p-3.5">
          <span className="text-[var(--sea-ink-soft)]">NIK Pemohon:</span>
          <span className="font-mono font-medium text-[var(--sea-ink)]">
            {maskedNik}
          </span>
        </div>
        <div className="flex items-center justify-between p-3.5">
          <span className="text-[var(--sea-ink-soft)]">Estimasi Selesai:</span>
          <span className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400">
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
          className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-emerald-800 dark:bg-emerald-600 sm:text-sm"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span>Lacak Status Sekarang</span>
        </button>

        <button
          type="button"
          onClick={onNewRequest}
          className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--chip-bg)] px-6 py-2.5 text-xs font-bold text-[var(--sea-ink)] transition hover:bg-black/5 dark:hover:bg-white/5 sm:text-sm"
        >
          <PlusCircle className="h-4 w-4" aria-hidden="true" />
          <span>Buat Permohonan Lain</span>
        </button>
      </div>
    </div>
  )
}
