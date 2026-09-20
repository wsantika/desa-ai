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
        return 'bg-blue-500 text-white border-blue-600'
      default:
        return 'bg-emerald-600 text-white border-emerald-700'
    }
  }

  return (
    <div className="island-shell mx-auto max-w-xl rounded-3xl p-6 text-center sm:p-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600/15 text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
      </div>

      <span className="mt-3 inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
        Pemerintah Desa Tegal Tugu
      </span>

      <h2 className="mt-2 text-xl font-extrabold text-[var(--sea-ink)] sm:text-2xl">
        Laporan Pengaduan Berhasil Dikirim!
      </h2>
      <p className="mt-1 text-xs text-[var(--sea-ink-soft)] sm:text-sm">
        Keluhan Anda telah masuk ke sistem antrean desa dan siap ditindaklanjuti.
      </p>

      {/* Ticket Box */}
      <div className="mt-6 rounded-2xl border-2 border-rose-500/30 bg-rose-500/10 p-5">
        <span className="text-xs font-semibold text-[var(--sea-ink-soft)]">
          Nomor Tiket Pengaduan Resmi:
        </span>
        <div className="mt-1 flex items-center justify-center gap-3">
          <span className="font-mono text-2xl font-black tracking-wider text-rose-800 dark:text-rose-300 sm:text-3xl">
            {complaint.ticketCode}
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

      {/* Hasil Analisis Cerdas AI */}
      <div className="mt-6 rounded-2xl border border-[var(--line)] bg-[var(--header-bg)] p-4 text-left text-xs sm:text-sm">
        <div className="mb-3 flex items-center justify-between border-b border-[var(--line)] pb-2.5">
          <div className="flex items-center gap-1.5 font-bold text-[var(--sea-ink)]">
            <Sparkles className="h-4 w-4 text-emerald-600" aria-hidden="true" />
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
            <p className="font-bold text-[var(--sea-ink)]">
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
            <div className="rounded-xl border border-emerald-600/20 bg-emerald-600/10 p-2.5">
              <span className="block text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
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
          className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-emerald-800 dark:bg-emerald-600 sm:text-sm"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span>Lacak Status Pengaduan</span>
        </button>

        <button
          type="button"
          onClick={onNewComplaint}
          className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--chip-bg)] px-6 py-2.5 text-xs font-bold text-[var(--sea-ink)] transition hover:bg-black/5 dark:hover:bg-white/5 sm:text-sm"
        >
          <PlusCircle className="h-4 w-4" aria-hidden="true" />
          <span>Laporkan Kendala Lain</span>
        </button>
      </div>
    </div>
  )
}
