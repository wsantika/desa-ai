import { useState, useEffect } from 'react'
import {
  X,
  AlertTriangle,
  Sparkles,
  MapPin,
  Phone,
  Clock,
  History,
  CheckCircle2,
  Send,
  Loader2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react'
import type { TriageComplaintItem } from '../../../application/server-functions/admin-triage.fn.js'
import type { ComplaintStatus } from '../../../domain/entities/complaint.entity.js'

interface TriageDetailModalProps {
  complaint: TriageComplaintItem | null
  isOpen: boolean
  onClose: () => void
  onStatusUpdate: (params: {
    complaintId: string
    status: ComplaintStatus
    notes: string
    proofPhotoUrl?: string | null
  }) => Promise<void>
}

export function TriageDetailModal({
  complaint,
  isOpen,
  onClose,
  onStatusUpdate,
}: TriageDetailModalProps) {
  const [targetStatus, setTargetStatus] = useState<ComplaintStatus>('IN_PROGRESS')
  const [notes, setNotes] = useState('')
  const [proofPhotoUrl, setProofPhotoUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (complaint) {
      // Default ke IN_PROGRESS jika masih OPEN, atau RESOLVED jika sedang IN_PROGRESS
      if (complaint.status === 'OPEN') {
        setTargetStatus('IN_PROGRESS')
      } else if (complaint.status === 'IN_PROGRESS') {
        setTargetStatus('RESOLVED')
      } else {
        setTargetStatus(complaint.status)
      }
      setNotes('')
      setProofPhotoUrl('')
      setErrorMessage(null)
      setSuccessMessage(null)
    }
  }, [complaint])

  if (!isOpen || !complaint) return null

  const isEmergency = complaint.priority === 'EMERGENCY'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (notes.trim().length < 3) {
      setErrorMessage('Catatan tindakan wajib diisi minimal 3 karakter.')
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage(null)
      await onStatusUpdate({
        complaintId: complaint.id,
        status: targetStatus,
        notes: notes.trim(),
        proofPhotoUrl: proofPhotoUrl.trim() || null,
      })
      setSuccessMessage('Status pengaduan dan catatan berhasil diperbarui.')
      setTimeout(() => {
        onClose()
      }, 1200)
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat memperbarui status pengaduan.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="triage-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] shadow-xl dark:border-[#22352f] dark:bg-[#121c19]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[var(--line,#d5ded9)] p-5 dark:border-[#22352f]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-emerald-800 dark:text-emerald-400">
                {complaint.ticketCode}
              </span>
              <span
                className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${
                  isEmergency
                    ? 'border-red-300 bg-red-100 text-red-900 dark:border-red-900 dark:bg-red-950/80 dark:text-red-200'
                    : 'border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f4f7f5)] text-[var(--sea-ink,#1b2a26)] dark:border-[#22352f] dark:bg-[#182622] dark:text-stone-300'
                }`}
              >
                {complaint.status}
              </span>
            </div>
            <h3
              id="triage-modal-title"
              className="mt-1 mb-0 text-base font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-100"
            >
              {complaint.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--sea-ink-soft,#576c64)] hover:bg-black/5 hover:text-black dark:text-stone-400 dark:hover:bg-white/5 dark:hover:text-white"
            aria-label="Tutup dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 space-y-5 overflow-y-auto p-5 text-xs">
          {/* Section 1: AI Evaluation Insights */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-300">
                <Sparkles className="h-4 w-4" />
                <span>Analisis Kecerdasan Buatan (AI Evaluator)</span>
              </div>
              {complaint.aiEvaluation && (
                <span className="rounded-full bg-emerald-200/80 px-2 py-0.5 text-[10px] font-bold text-emerald-950 dark:bg-emerald-900 dark:text-emerald-200">
                  {Math.round(complaint.aiEvaluation.confidenceScore * 100)}% Keyakinan
                </span>
              )}
            </div>

            <div className="mt-3 space-y-2">
              <div>
                <span className="font-semibold text-emerald-950 dark:text-emerald-200">
                  Ringkasan Eksekutif:
                </span>
                <p className="mt-0.5 mb-0 text-emerald-900 dark:text-emerald-300">
                  {complaint.aiSummary ||
                    complaint.aiEvaluation?.executiveSummary ||
                    'Tidak ada ringkasan otomatis.'}
                </p>
              </div>

              {complaint.aiEvaluation?.recommendedAction && (
                <div className="border-t border-emerald-200/60 pt-2 dark:border-emerald-900/40">
                  <span className="font-semibold text-emerald-950 dark:text-emerald-200">
                    Saran Tindakan Petugas:
                  </span>
                  <p className="mt-0.5 mb-0 text-emerald-900 dark:text-emerald-300">
                    {complaint.aiEvaluation.recommendedAction}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Citizen Report Details */}
          <div className="space-y-3 rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f4f7f5)] p-4 dark:border-[#22352f] dark:bg-[#182622]">
            <h4 className="m-0 text-xs font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-100">
              Informasi Laporan Warga
            </h4>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <span className="text-[11px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                  Nama Pelapor:
                </span>
                <div className="font-semibold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                  {complaint.reporterName}
                </div>
              </div>

              <div>
                <span className="text-[11px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                  No. Telepon / Kontak:
                </span>
                <div className="flex items-center gap-1 font-semibold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                  <Phone className="h-3 w-3 text-emerald-700" />
                  <span>{complaint.reporterPhone || 'Tidak dicantumkan'}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                  Wilayah Banjar:
                </span>
                <div className="flex items-center gap-1 font-semibold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                  <MapPin className="h-3 w-3 text-emerald-700" />
                  <span>{complaint.banjarName}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                  Patokan Lokasi Fisik:
                </span>
                <div className="font-semibold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                  {complaint.specificLocation}
                </div>
              </div>
            </div>

            <div>
              <span className="text-[11px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                Deskripsi Lengkap Laporan:
              </span>
              <p className="mt-1 mb-0 rounded-lg bg-white p-3 text-[var(--sea-ink,#1b2a26)] dark:bg-[#121c19] dark:text-stone-300">
                {complaint.description}
              </p>
            </div>

            {complaint.photoUrl && (
              <div>
                <span className="text-[11px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                  Foto Bukti Lampiran:
                </span>
                <div className="mt-1">
                  <a
                    href={complaint.photoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-emerald-800 hover:underline dark:text-emerald-400"
                  >
                    <span>Lihat Foto Bukti</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Audit Trail / Status History */}
          {complaint.statusLogs.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                <History className="h-4 w-4 text-emerald-700" />
                <span>Riwayat Penanganan & Log Audit</span>
              </div>

              <div className="divide-y divide-[var(--line,#d5ded9)] rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] dark:divide-[#22352f] dark:border-[#22352f] dark:bg-[#121c19]">
                {complaint.statusLogs.map((log) => (
                  <div key={log.id} className="p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-emerald-800 dark:text-emerald-400">
                          {log.newStatus}
                        </span>
                        {log.previousStatus && (
                          <span className="text-[10px] text-[var(--sea-ink-soft,#576c64)]">
                            (dari {log.previousStatus})
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[var(--sea-ink-soft,#576c64)]">
                        {new Date(log.createdAt).toLocaleString('id-ID')}
                      </span>
                    </div>
                    {log.actionNote && (
                      <p className="mt-1 mb-0 text-[11px] text-[var(--sea-ink,#1b2a26)] dark:text-stone-300">
                        {log.actionNote}
                      </p>
                    )}
                    {log.proofPhotoUrl && (
                      <div className="mt-1 text-[10px]">
                        <a
                          href={log.proofPhotoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-800 hover:underline dark:text-emerald-400"
                        >
                          Bukti penanganan terlampir
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Officer Action Form */}
          <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] p-4 dark:border-[#22352f] dark:bg-[#121c19]">
            <div className="flex items-center gap-1.5 font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
              <ShieldCheck className="h-4 w-4 text-emerald-700" />
              <span>Tindakan & Disposisi Petugas Desa</span>
            </div>

            {/* Target Status Selection */}
            <div>
              <label className="block text-[11px] font-semibold text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                Ubah Status Laporan
              </label>
              <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <button
                  type="button"
                  onClick={() => setTargetStatus('IN_PROGRESS')}
                  className={`min-h-[38px] rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors ${
                    targetStatus === 'IN_PROGRESS'
                      ? 'border-amber-400 bg-amber-100 text-amber-900 dark:border-amber-700 dark:bg-amber-950/80 dark:text-amber-200'
                      : 'border-[var(--line,#d5ded9)] text-[var(--sea-ink,#1b2a26)] hover:bg-black/5 dark:border-[#22352f] dark:text-stone-300'
                  }`}
                >
                  Diproses
                </button>
                <button
                  type="button"
                  onClick={() => setTargetStatus('RESOLVED')}
                  className={`min-h-[38px] rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors ${
                    targetStatus === 'RESOLVED'
                      ? 'border-emerald-400 bg-emerald-100 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-200'
                      : 'border-[var(--line,#d5ded9)] text-[var(--sea-ink,#1b2a26)] hover:bg-black/5 dark:border-[#22352f] dark:text-stone-300'
                  }`}
                >
                  Selesai
                </button>
                <button
                  type="button"
                  onClick={() => setTargetStatus('REJECTED')}
                  className={`min-h-[38px] rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors ${
                    targetStatus === 'REJECTED'
                      ? 'border-rose-400 bg-rose-100 text-rose-900 dark:border-rose-700 dark:bg-rose-950/80 dark:text-rose-200'
                      : 'border-[var(--line,#d5ded9)] text-[var(--sea-ink,#1b2a26)] hover:bg-black/5 dark:border-[#22352f] dark:text-stone-300'
                  }`}
                >
                  Tolak
                </button>
                <button
                  type="button"
                  onClick={() => setTargetStatus('OPEN')}
                  className={`min-h-[38px] rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors ${
                    targetStatus === 'OPEN'
                      ? 'border-stone-400 bg-stone-200 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200'
                      : 'border-[var(--line,#d5ded9)] text-[var(--sea-ink,#1b2a26)] hover:bg-black/5 dark:border-[#22352f] dark:text-stone-300'
                  }`}
                >
                  Buka Kembali
                </button>
              </div>
            </div>

            {/* Action Note Input */}
            <div>
              <label
                htmlFor="triage-action-notes"
                className="block text-[11px] font-semibold text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400"
              >
                Catatan Penanganan Petugas (Wajib)
              </label>
              <textarea
                id="triage-action-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Tim satgas banjar telah diterjunkan ke lokasi untuk perbaikan kabel lampu jalan."
                className="mt-1 w-full rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f4f7f5)] p-2.5 text-xs text-[var(--sea-ink,#1b2a26)] placeholder-[var(--sea-ink-soft,#576c64)] focus:border-emerald-600 focus:bg-white focus:outline-hidden dark:border-[#22352f] dark:bg-[#182622] dark:text-stone-100 dark:focus:border-emerald-500"
                required
              />
            </div>

            {/* Proof Photo URL Input */}
            <div>
              <label
                htmlFor="triage-proof-url"
                className="block text-[11px] font-semibold text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400"
              >
                URL Foto Bukti Penanganan (Opsional)
              </label>
              <input
                id="triage-proof-url"
                type="url"
                value={proofPhotoUrl}
                onChange={(e) => setProofPhotoUrl(e.target.value)}
                placeholder="https://..."
                className="mt-1 w-full rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f4f7f5)] px-3 py-2 text-xs text-[var(--sea-ink,#1b2a26)] placeholder-[var(--sea-ink-soft,#576c64)] focus:border-emerald-600 focus:bg-white focus:outline-hidden dark:border-[#22352f] dark:bg-[#182622] dark:text-stone-100 dark:focus:border-emerald-500"
              />
            </div>

            {/* Error & Success Feedback */}
            {errorMessage && (
              <div className="rounded-lg bg-red-100 p-2.5 text-xs font-semibold text-red-800 dark:bg-red-950/80 dark:text-red-300">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="flex items-center gap-1.5 rounded-lg bg-emerald-100 p-2.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Submit Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="min-h-[40px] rounded-lg border border-[var(--line,#d5ded9)] px-4 py-2 text-xs font-semibold text-[var(--sea-ink,#1b2a26)] hover:bg-black/5 disabled:opacity-50 dark:border-[#22352f] dark:text-stone-300"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting || notes.trim().length < 3}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-emerald-800 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-900 disabled:opacity-50 dark:bg-emerald-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
