import { useState, useEffect } from 'react'
import {
  X,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  User,
  Phone,
  MapPin,
  Calendar,
  FileText,
  ExternalLink,
  Printer,
  History,
  ShieldCheck,
  Send,
  Loader2,
  QrCode,
  Check,
} from 'lucide-react'
import type { ServiceVerificationItem } from '../../application/server-functions/admin-service-verification.fn.js'
import type { ServiceRequestStatus } from '../../domain/entities/service-request.entity.js'

interface ServiceVerificationDetailModalProps {
  request: ServiceVerificationItem | null
  isOpen: boolean
  onClose: () => void
  onStatusUpdate: (params: {
    requestId: string
    status: ServiceRequestStatus
    notes?: string
  }) => Promise<void>
}

type ModalTab = 'berkas' | 'riwayat' | 'tindakan' | 'draf'

function formatDateIndonesian(dateString: string): string {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
  } catch {
    return dateString
  }
}

function formatDateTimeIndonesian(dateString: string): string {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch {
    return dateString
  }
}

function getStatusBadge(status: ServiceRequestStatus) {
  switch (status) {
    case 'PENDING':
      return {
        label: 'Menunggu Verifikasi',
        cls: 'border-amber-400 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
        icon: Clock,
      }
    case 'IN_REVIEW':
      return {
        label: 'Sedang Diproses',
        cls: 'border-blue-400 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300',
        icon: AlertCircle,
      }
    case 'REVISION':
      return {
        label: 'Perlu Revisi',
        cls: 'border-orange-400 bg-orange-50 text-orange-900 dark:border-orange-800 dark:bg-orange-950/60 dark:text-orange-300',
        icon: AlertCircle,
      }
    case 'APPROVED':
      return {
        label: 'Disetujui',
        cls: 'border-emerald-400 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
        icon: CheckCircle2,
      }
    case 'REJECTED':
      return {
        label: 'Ditolak',
        cls: 'border-rose-400 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
        icon: XCircle,
      }
    default:
      return {
        label: status,
        cls: 'border-stone-400 bg-stone-50 text-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300',
        icon: AlertCircle,
      }
  }
}

export function ServiceVerificationDetailModal({
  request,
  isOpen,
  onClose,
  onStatusUpdate,
}: ServiceVerificationDetailModalProps) {
  const [activeTab, setActiveTab] = useState<ModalTab>('berkas')
  const [targetStatus, setTargetStatus] = useState<ServiceRequestStatus>('APPROVED')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (request) {
      if (request.status === 'PENDING') {
        setTargetStatus('APPROVED')
      } else if (request.status === 'IN_REVIEW') {
        setTargetStatus('APPROVED')
      } else {
        setTargetStatus(request.status)
      }
      setNotes(request.officerNotes || '')
      setErrorMessage(null)
      setSuccessMessage(null)
      setActiveTab('berkas')
    }
  }, [request])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isSubmitting, onClose])

  if (!isOpen || !request) return null

  const statusBadge = getStatusBadge(request.status)
  const StatusIcon = statusBadge.icon

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validasi catatan untuk revisi dan penolakan
    if ((targetStatus === 'REVISION' || targetStatus === 'REJECTED') && notes.trim().length < 5) {
      setErrorMessage('Catatan verifikasi wajib diisi minimal 5 karakter untuk revisi atau penolakan.')
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage(null)
      await onStatusUpdate({
        requestId: request.id,
        status: targetStatus,
        notes: notes.trim() ? notes.trim() : undefined,
      })
      setSuccessMessage('Status permohonan surat dan catatan verifikasi berhasil diperbarui.')
      setTimeout(() => {
        onClose()
      }, 1200)
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat memproses status permohonan.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePrintDraft = () => {
    window.print()
  }

  const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']
  const reqDate = new Date(request.createdAt)
  const romanMonth = romanMonths[reqDate.getMonth()] || 'IX'
  const letterNumber = `470 / ${request.trackingCode.replace('REQ-', '')} / DTT / ${romanMonth} / ${reqDate.getFullYear()}`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => !isSubmitting && onClose()}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] shadow-2xl dark:border-[#22352f] dark:bg-[#121c19]">
        {/* Header Bar */}
        <div className="flex items-start justify-between border-b border-[var(--line,#d5ded9)] p-4 sm:p-5 dark:border-[#22352f]">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                {request.trackingCode}
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-bold ${statusBadge.cls}`}
              >
                <StatusIcon className="h-3 w-3" />
                <span>{statusBadge.label}</span>
              </span>
              <span className="rounded-md border border-stone-300 bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300">
                {request.serviceTypeCode}
              </span>
            </div>
            <h2
              id="service-modal-title"
              className="m-0 text-base font-bold text-[var(--sea-ink,#1b2a26)] sm:text-lg dark:text-stone-100"
            >
              {request.serviceTypeTitle}
            </h2>
            <p className="m-0 text-xs text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
              Pemohon: <strong className="text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">{request.applicantName}</strong> (NIK: {request.applicantNik})
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-stone-500 hover:bg-black/5 hover:text-stone-800 focus:outline-hidden dark:text-stone-400 dark:hover:bg-white/5 dark:hover:text-stone-200"
            aria-label="Tutup modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[var(--line,#d5ded9)] px-4 sm:px-5 dark:border-[#22352f]">
          <nav className="flex space-x-2 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
            <button
              type="button"
              onClick={() => setActiveTab('berkas')}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition min-h-[44px] ${
                activeTab === 'berkas'
                  ? 'bg-blue-600 text-white dark:bg-blue-600'
                  : 'text-[var(--sea-ink-soft,#576c64)] hover:bg-black/5 dark:text-stone-400 dark:hover:bg-white/5'
              }`}
            >
              <FileCheck className="h-4 w-4" />
              <span>Rincian & Dokumen</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tindakan')}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition min-h-[44px] ${
                activeTab === 'tindakan'
                  ? 'bg-blue-600 text-white dark:bg-blue-600'
                  : 'text-[var(--sea-ink-soft,#576c64)] hover:bg-black/5 dark:text-stone-400 dark:hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Tindakan Petugas</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('draf')}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition min-h-[44px] ${
                activeTab === 'draf'
                  ? 'bg-blue-600 text-white dark:bg-blue-600'
                  : 'text-[var(--sea-ink-soft,#576c64)] hover:bg-black/5 dark:text-stone-400 dark:hover:bg-white/5'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Draf Surat Resmi</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('riwayat')}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition min-h-[44px] ${
                activeTab === 'riwayat'
                  ? 'bg-blue-600 text-white dark:bg-blue-600'
                  : 'text-[var(--sea-ink-soft,#576c64)] hover:bg-black/5 dark:text-stone-400 dark:hover:bg-white/5'
              }`}
            >
              <History className="h-4 w-4" />
              <span>Riwayat Verifikasi ({request.statusLogs.length})</span>
            </button>
          </nav>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* TAB 1: RINCIAN & DOKUMEN */}
          {activeTab === 'berkas' && (
            <div className="space-y-6">
              {/* Profil Pemohon */}
              <div className="rounded-xl border border-[var(--line,#d5ded9)] bg-stone-50/50 p-4 dark:border-[#22352f] dark:bg-white/[0.02]">
                <h3 className="m-0 mb-3 text-xs font-extrabold tracking-wider text-[var(--sea-ink-soft,#576c64)] uppercase dark:text-stone-400">
                  Biodata Lengkap Pemohon
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-start gap-2.5">
                    <User className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <div>
                      <div className="text-[11px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">Nama Warga</div>
                      <div className="text-xs font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                        {request.applicantName}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <div>
                      <div className="text-[11px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">NIK (16 Digit)</div>
                      <div className="font-mono text-xs font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                        {request.applicantNik}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Phone className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <div>
                      <div className="text-[11px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">Nomor WhatsApp</div>
                      <div className="text-xs font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                        {request.applicantPhone || '-'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <MapPin className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <div>
                      <div className="text-[11px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">Banjar / Lingkungan</div>
                      <div className="text-xs font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                        {request.applicantBanjarName || 'Desa Tegal Tugu'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Calendar className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <div>
                      <div className="text-[11px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">Waktu Pengajuan</div>
                      <div className="text-xs font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                        {formatDateTimeIndonesian(request.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Clock className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <div>
                      <div className="text-[11px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">Estimasi Selesai</div>
                      <div className="text-xs font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                        {request.estimatedDays} Hari Kerja
                      </div>
                    </div>
                  </div>
                </div>

                {/* Keperluan Surat */}
                <div className="mt-4 rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] p-3 dark:border-[#22352f] dark:bg-[#121c19]">
                  <div className="text-[11px] font-bold text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                    Maksud dan Keperluan Pengajuan Surat:
                  </div>
                  <p className="m-0 mt-1 text-xs text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                    {request.purpose}
                  </p>
                </div>
              </div>

              {/* Checklist Dokumen Persyaratan vs Berkas Unggahan */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="m-0 text-xs font-extrabold tracking-wider text-[var(--sea-ink-soft,#576c64)] uppercase dark:text-stone-400">
                    Daftar Dokumen Persyaratan Wajib ({request.requiredDocs.length})
                  </h3>
                  <span className="text-[11px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                    Terunggah: <strong className="text-blue-600 dark:text-blue-400">{request.attachments.length} berkas</strong>
                  </span>
                </div>

                {/* Persyaratan Standar Layanan */}
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {request.requiredDocs.map((docName, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] p-3 text-xs dark:border-[#22352f] dark:bg-[#121c19]"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-semibold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                        {docName}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Berkas Unggahan Warga */}
                <div className="mt-4">
                  <h4 className="m-0 mb-3 text-xs font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                    Lampiran Berkas yang Diunggah Pemohon
                  </h4>

                  {request.attachments.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50/70 p-4 text-center text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                      Warga belum melampirkan berkas dokumen digital saat mengajukan tiket ini.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {request.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center justify-between gap-3 rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] p-3 dark:border-[#22352f] dark:bg-[#121c19]"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div className="truncate">
                              <div className="truncate text-xs font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                                {att.fileName}
                              </div>
                              <div className="text-[11px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                                Format: {att.fileType || 'Dokumen'}
                              </div>
                            </div>
                          </div>

                          <a
                            href={att.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-[var(--line,#d5ded9)] bg-stone-50 px-3 py-1.5 text-xs font-bold text-[var(--sea-ink,#1b2a26)] transition hover:bg-stone-100 dark:border-[#22352f] dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
                          >
                            <span>Buka</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TINDAKAN PETUGAS */}
          {activeTab === 'tindakan' && (
            <form onSubmit={handleStatusSubmit} className="space-y-6">
              {errorMessage && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-medium text-rose-800 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300">
                  {successMessage}
                </div>
              )}

              {/* Pilihan Tindakan Status */}
              <div>
                <label className="block text-xs font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                  Pilih Keputusan Verifikasi Dokumen
                </label>
                <p className="m-0 mt-0.5 text-xs text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                  Tindakan ini akan memperbarui status permohonan dan mengirim catatan pembaruan ke pelacakan warga.
                </p>

                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setTargetStatus('APPROVED')}
                    className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition min-h-[44px] ${
                      targetStatus === 'APPROVED'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200'
                        : 'border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] hover:bg-black/5 dark:border-[#22352f] dark:bg-[#121c19] dark:hover:bg-white/5'
                    }`}
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <div className="text-xs font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                        Setujui Permohonan (APPROVED)
                      </div>
                      <div className="text-[11px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                        Dokumen lengkap dan absah. Surat keterangan resmi siap diterbitkan dan ditandatangani.
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetStatus('REVISION')}
                    className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition min-h-[44px] ${
                      targetStatus === 'REVISION'
                        ? 'border-orange-600 bg-orange-50 text-orange-950 ring-2 ring-orange-600 dark:border-orange-500 dark:bg-orange-950/40 dark:text-orange-200'
                        : 'border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] hover:bg-black/5 dark:border-[#22352f] dark:bg-[#121c19] dark:hover:bg-white/5'
                    }`}
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-orange-600 dark:text-orange-400" />
                    <div>
                      <div className="text-xs font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                        Minta Revisi Berkas (REVISION)
                      </div>
                      <div className="text-[11px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                        Berkas kurang jelas, buram, atau dokumen pengantar belum lengkap.
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetStatus('IN_REVIEW')}
                    className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition min-h-[44px] ${
                      targetStatus === 'IN_REVIEW'
                        ? 'border-blue-600 bg-blue-50 text-blue-950 ring-2 ring-blue-600 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-200'
                        : 'border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] hover:bg-black/5 dark:border-[#22352f] dark:bg-[#121c19] dark:hover:bg-white/5'
                    }`}
                  >
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                    <div>
                      <div className="text-xs font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                        Sedang Diproses (IN_REVIEW)
                      </div>
                      <div className="text-[11px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                        Berkas sedang diteliti lebih mendalam atau divalidasi ke klian banjar.
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetStatus('REJECTED')}
                    className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition min-h-[44px] ${
                      targetStatus === 'REJECTED'
                        ? 'border-rose-600 bg-rose-50 text-rose-950 ring-2 ring-rose-600 dark:border-rose-500 dark:bg-rose-950/40 dark:text-rose-200'
                        : 'border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] hover:bg-black/5 dark:border-[#22352f] dark:bg-[#121c19] dark:hover:bg-white/5'
                    }`}
                  >
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                    <div>
                      <div className="text-xs font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                        Tolak Permohonan (REJECTED)
                      </div>
                      <div className="text-[11px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                        Permohonan tidak memenuhi ketentuan hukum atau data kependudukan tidak sah.
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Catatan Verifikasi / Petugas */}
              <div>
                <label className="block text-xs font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                  {targetStatus === 'REVISION'
                    ? 'Catatan Revisi Berkas (Wajib untuk Warga)*'
                    : targetStatus === 'REJECTED'
                      ? 'Alasan Penolakan Permohonan (Wajib)*'
                      : 'Catatan Petugas (Opsional)'}
                </label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    targetStatus === 'REVISION'
                      ? 'Tuliskan berkas apa yang buram atau perlu diunggah ulang oleh warga...'
                      : targetStatus === 'REJECTED'
                        ? 'Tuliskan alasan resmi penolakan permohonan surat ini...'
                        : 'Catatan opsional untuk arsip layanan atau pesan konfirmasi ke pemohon...'
                  }
                  className="mt-2 w-full rounded-xl border border-[var(--line,#d5ded9)] bg-black/[0.02] p-3 text-xs text-[var(--sea-ink,#1b2a26)] placeholder-[var(--sea-ink-soft,#576c64)] focus:border-blue-600 focus:outline-hidden dark:border-[#22352f] dark:bg-white/[0.02] dark:text-stone-100"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="rounded-xl border border-[var(--line,#d5ded9)] px-4 py-2.5 text-xs font-bold text-[var(--sea-ink,#1b2a26)] transition hover:bg-black/5 min-h-[44px] dark:border-[#22352f] dark:text-stone-200 dark:hover:bg-white/5"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700 disabled:opacity-50 min-h-[44px] dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Menyimpan Keputusan...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Simpan Keputusan Verifikasi</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: DRAF SURAT RESMI (PRINTABLE PREVIEW) */}
          {activeTab === 'draf' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--line,#d5ded9)] bg-stone-50 p-3 sm:p-4 dark:border-[#22352f] dark:bg-stone-900/50">
                <div>
                  <div className="text-xs font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                    Draf Pratinjau Lembar Surat Resmi Desa Tegal Tugu
                  </div>
                  <div className="text-[11px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                    Dokumen ini dicetak pada format kertas resmi desa berstempel digital dan QR validasi keabsahan.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePrintDraft}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700 min-h-[44px] dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                  <Printer className="h-4 w-4" />
                  <span>Cetak / Unduh PDF</span>
                </button>
              </div>

              {/* Printable Document Paper Simulation */}
              <div className="printable-certificate-area mx-auto max-w-2xl rounded-xl border border-stone-300 bg-white p-6 sm:p-10 text-stone-900 shadow-md">
                {/* Official Kop Surat */}
                <div className="text-center">
                  <h3 className="m-0 text-sm font-extrabold tracking-wider uppercase text-stone-900 sm:text-base">
                    Pemerintah Kabupaten Gianyar
                  </h3>
                  <h4 className="m-0 text-xs font-bold tracking-wider uppercase text-stone-800 sm:text-sm">
                    Kecamatan Gianyar
                  </h4>
                  <h2 className="m-0 text-base font-extrabold tracking-wide uppercase text-stone-950 sm:text-lg">
                    Kantor Perbekel Desa Tegal Tugu
                  </h2>
                  <p className="m-0 mt-1 text-[11px] text-stone-600">
                    Jalan Raya Tegal Tugu, Gianyar, Bali 80511 | Laman: tegatugu.desa.id | Surel: perbekel@tegaltugu.desa.id
                  </p>
                </div>

                {/* Kop Divider Line */}
                <div className="my-4 border-b-2 border-t border-stone-900" />

                {/* Nomor & Judul Surat */}
                <div className="text-center">
                  <h3 className="m-0 text-sm font-extrabold tracking-wider underline uppercase text-stone-950 sm:text-base">
                    {request.serviceTypeTitle.toUpperCase()}
                  </h3>
                  <p className="m-0 mt-0.5 text-xs text-stone-700 font-medium">
                    Nomor: {letterNumber}
                  </p>
                </div>

                {/* Surat Content */}
                <div className="mt-6 space-y-4 text-xs leading-relaxed text-stone-800">
                  <p className="m-0">
                    Yang bertanda tangan di bawah ini Perbekel Desa Tegal Tugu, Kecamatan Gianyar, Kabupaten Gianyar, Provinsi Bali, menerangkan dengan sebenarnya bahwa:
                  </p>

                  {/* Applicant Details Table */}
                  <div className="my-3 space-y-1.5 pl-4">
                    <div className="grid grid-cols-12 gap-2">
                      <span className="col-span-4 font-semibold">Nama Lengkap</span>
                      <span className="col-span-8">: <strong>{request.applicantName}</strong></span>
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                      <span className="col-span-4 font-semibold">NIK</span>
                      <span className="col-span-8 font-mono">: {request.applicantNik}</span>
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                      <span className="col-span-4 font-semibold">Banjar / Wilayah</span>
                      <span className="col-span-8">: {request.applicantBanjarName || 'Tengah'}, Desa Tegal Tugu</span>
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                      <span className="col-span-4 font-semibold">Alamat Domisili</span>
                      <span className="col-span-8">: {request.applicantAddress || 'Desa Tegal Tugu, Kec. Gianyar, Kab. Gianyar, Bali'}</span>
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                      <span className="col-span-4 font-semibold">Maksud / Keperluan</span>
                      <span className="col-span-8">: {request.purpose}</span>
                    </div>
                  </div>

                  <p className="m-0">
                    Berdasarkan arsip administrasi kependudukan dan catatan registrasi Desa Tegal Tugu, nama tersebut di atas benar merupakan warga yang berdomisili sah di wilayah Banjar {request.applicantBanjarName || 'Tengah'}, Desa Tegal Tugu, Kecamatan Gianyar, serta memenuhi ketentuan penerbitan {request.serviceTypeTitle.toLowerCase()}.
                  </p>

                  <p className="m-0">
                    Demikian surat keterangan ini kami terbitkan dengan sebenarnya agar dapat dipergunakan sebagaimana mestinya oleh pihak yang berkepentingan.
                  </p>
                </div>

                {/* Tanda Tangan & Stempel Resmi */}
                <div className="mt-10 flex items-end justify-between">
                  {/* QR Code Verifikasi */}
                  <div className="flex flex-col items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 p-2.5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-white p-1 shadow-xs">
                      <QrCode className="h-14 w-14 text-stone-900" />
                    </div>
                    <span className="text-[9px] font-bold text-stone-600">
                      ID: {request.trackingCode}
                    </span>
                    <span className="text-[8px] text-stone-500">
                      Validasi Resmi Desa Tegal Tugu
                    </span>
                  </div>

                  {/* Blok Penandatangan */}
                  <div className="text-center text-xs">
                    <div>Tegal Tugu, {formatDateIndonesian(request.completedAt || request.createdAt)}</div>
                    <div className="font-bold">Perbekel Desa Tegal Tugu</div>

                    {/* Stempel & Cap Digital */}
                    <div className="relative my-2 flex h-20 items-center justify-center">
                      <div className="absolute rounded-full border-2 border-emerald-800/40 px-3 py-1 text-[10px] font-extrabold tracking-widest text-emerald-900/60 uppercase rotate-[-8deg]">
                        TERVERIFIKASI DIGITAL
                      </div>
                      <div className="font-serif text-sm italic text-stone-500">
                        [Tanda Tangan Elektronik]
                      </div>
                    </div>

                    <div className="font-bold underline text-stone-950">
                      I NYOMAN SUARDANA
                    </div>
                    <div className="text-[10px] text-stone-600">
                      Perbekel Desa Tegal Tugu
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RIWAYAT VERIFIKASI */}
          {activeTab === 'riwayat' && (
            <div className="space-y-4">
              <h3 className="m-0 text-xs font-extrabold tracking-wider text-[var(--sea-ink-soft,#576c64)] uppercase dark:text-stone-400">
                Jejak Rekam Verifikasi & Status Surat
              </h3>

              {request.statusLogs.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[var(--line,#d5ded9)] p-6 text-center text-xs text-[var(--sea-ink-soft,#576c64)] dark:border-[#22352f] dark:text-stone-400">
                  Belum ada riwayat perubahan status pada berkas ini.
                </div>
              ) : (
                <div className="relative space-y-4 border-l-2 border-blue-200 pl-4 ml-2 dark:border-blue-800">
                  {request.statusLogs.map((log) => {
                    const logBadge = getStatusBadge(log.newStatus)
                    const LogIcon = logBadge.icon
                    return (
                      <div key={log.id} className="relative">
                        <div className="absolute -left-[25px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white dark:bg-blue-500">
                          <LogIcon className="h-2.5 w-2.5" />
                        </div>

                        <div className="rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] p-3 shadow-xs dark:border-[#22352f] dark:bg-[#121c19]">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span
                              className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold ${logBadge.cls}`}
                            >
                              <LogIcon className="h-2.5 w-2.5" />
                              <span>{logBadge.label}</span>
                            </span>
                            <span className="text-[11px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                              {formatDateTimeIndonesian(log.createdAt)}
                            </span>
                          </div>

                          <div className="mt-2 text-xs text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                            Aktor: <strong className="font-semibold">{log.actorName || 'Petugas Layanan Terpadu'}</strong>
                          </div>

                          {log.notes && (
                            <div className="mt-1.5 rounded-lg bg-stone-50 p-2 text-xs text-[var(--sea-ink-soft,#576c64)] dark:bg-white/[0.03] dark:text-stone-300">
                              Catatan: {log.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
