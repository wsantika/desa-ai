import { useState } from 'react'
import {
  CheckCircle2,
  Copy,
  Check,
  Search,
  PlusCircle,
  Sparkles,
  ShieldAlert,
  Clock,
} from 'lucide-react'
import type { ComplaintEntity } from '../../domain/entities/complaint.entity'
import type { AIEvaluationResult } from '../../domain/repositories/i-ai-evaluator.service'

interface ComplaintSuccessReceiptProps {
  complaint: ComplaintEntity
  evaluation?: AIEvaluationResult
  onTrackNow: (ticketCode: string) => void
  onNewComplaint: () => void
}

export default function ComplaintSuccessReceipt({
  complaint,
  evaluation,
  onTrackNow,
  onNewComplaint,
}: ComplaintSuccessReceiptProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(complaint.ticketCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  const getPriorityBadge = (pri?: string) => {
    switch (pri) {
      case 'EMERGENCY':
        return 'bg-rose-500 text-white border-rose-600'
      case 'HIGH':
        return 'bg-amber-500 text-white border-amber-600'
      case 'MEDIUM':
        return 'bg-blue-600 text-white border-blue-700'
      default:
        return 'bg-slate-600 text-white border-slate-700'
    }
  }

  return (
    <div className="island-shell mx-auto max-w-xl rounded-2xl p-6 text-center sm:p-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
        <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
      </div>

      <span className="mt-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
        Pemerintah Desa Tegal Tugu
      </span>

      <h2 className="mt-2 text-xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-2xl">
        Laporan Pengaduan Berhasil Dikirim!
      </h2>
      <p className="mt-1 text-xs text-[var(--sea-ink-soft)] sm:text-sm">
        Keluhan Anda telah masuk ke sistem antrean desa dan siap ditindaklanjuti.
      </p>

      {/* Ticket Box */}
      <div className="mt-6 rounded-xl border-2 border-blue-200 bg-blue-50/70 p-5 dark:border-blue-800 dark:bg-blue-950/30">
        <span className="text-xs font-medium text-[var(--sea-ink-soft)]">
          Nomor Tiket Pengaduan Resmi:
        </span>
        <div className="mt-1 flex items-center justify-center gap-3">
          <span className="font-mono text-2xl font-bold tracking-wider text-blue-800 dark:text-blue-300 sm:text-3xl">
            {complaint.ticketCode}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--chip-bg)] px-3 py-1.5 text-xs font-semibold text-[var(--sea-ink)] shadow-sm transition hover:bg-slate-100 active:scale-95 dark:hover:bg-slate-800"
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

      {/* Hasil Analisis Cerdas AI */}
      <div className="mt-6 rounded-xl border border-[var(--line)] bg-[var(--header-bg)] p-4 text-left text-xs sm:text-sm">
        <div className="mb-3 flex items-center justify-between border-b border-[var(--line)] pb-2.5">
          <div className="flex items-center gap-1.5 font-bold text-[var(--sea-ink)]">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span>Hasil Triage Evaluasi AI:</span>
          </div>
          <span
            className={`rounded-md border px-2 py-0.5 text-xs font-bold ${getPriorityBadge(
              evaluation?.priority || complaint.priority || 'MEDIUM'
            )}`}
          >
            Prioritas: {evaluation?.priority || complaint.priority || 'MEDIUM'}
          </span>
        </div>

        <div className="space-y-2">
          <div>
            <span className="text-xs text-[var(--sea-ink-soft)]">Kategori Terdeteksi:</span>
            <p className="font-semibold text-[var(--sea-ink)]">
              {evaluation?.category || complaint.category || 'INFRASTRUKTUR'}
            </p>
          </div>

          <div>
            <span className="text-xs text-[var(--sea-ink-soft)]">Ringkasan Masalah:</span>
            <p className="text-xs leading-relaxed text-[var(--sea-ink)]">
              {evaluation?.summary || complaint.aiSummary || complaint.description}
            </p>
          </div>

          {evaluation?.recommendedAction && (
            <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-2.5 dark:border-blue-800 dark:bg-blue-950/30">
              <span className="block text-[11px] font-bold text-blue-800 dark:text-blue-300">
                Rekomendasi Disposisi:
              </span>
              <p className="mt-0.5 text-xs text-[var(--sea-ink)]">
                {evaluation.recommendedAction}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={() => onTrackNow(complaint.ticketCode)}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99] dark:bg-blue-600 dark:hover:bg-blue-500 sm:text-sm"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span>Lacak Status Pengaduan</span>
        </button>

        <button
          type="button"
          onClick={onNewComplaint}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--chip-bg)] px-6 py-2.5 text-xs font-semibold text-[var(--sea-ink)] shadow-sm transition hover:bg-slate-100 active:scale-[0.99] dark:hover:bg-slate-800 sm:text-sm"
        >
          <PlusCircle className="h-4 w-4" aria-hidden="true" />
          <span>Laporkan Kendala Lain</span>
        </button>
      </div>
    </div>
  )
}
