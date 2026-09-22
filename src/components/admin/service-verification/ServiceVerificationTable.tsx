import {
  FileText,
  Clock,
  User,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Eye,
  Inbox,
  Calendar,
} from 'lucide-react'
import type { ServiceVerificationItem } from '../../application/server-functions/admin-service-verification.fn.js'
import type { ServiceRequestStatus } from '../../domain/entities/service-request.entity.js'

interface ServiceVerificationTableProps {
  requests: ServiceVerificationItem[]
  onSelectRequest: (request: ServiceVerificationItem) => void
}

function getStatusBadge(status: ServiceRequestStatus) {
  switch (status) {
    case 'PENDING':
      return {
        label: 'Menunggu',
        bg: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800',
        icon: Clock,
      }
    case 'IN_REVIEW':
      return {
        label: 'Diproses',
        bg: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800',
        icon: AlertCircle,
      }
    case 'REVISION':
      return {
        label: 'Perlu Revisi',
        bg: 'bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-950/80 dark:text-orange-300 dark:border-orange-800',
        icon: AlertCircle,
      }
    case 'APPROVED':
      return {
        label: 'Disetujui',
        bg: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800',
        icon: CheckCircle2,
      }
    case 'REJECTED':
      return {
        label: 'Ditolak',
        bg: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800',
        icon: XCircle,
      }
    default:
      return {
        label: status,
        bg: 'bg-stone-100 text-stone-900 border-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700',
        icon: AlertCircle,
      }
  }
}

function getServiceTypeBadge(code: string) {
  switch (code) {
    case 'DOMISILI':
      return 'border-sky-500/30 bg-sky-50 text-sky-900 dark:bg-sky-950/40 dark:text-sky-300'
    case 'SKU':
      return 'border-emerald-500/30 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300'
    case 'SKCK':
      return 'border-indigo-500/30 bg-indigo-50 text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300'
    case 'SKTM':
      return 'border-amber-500/30 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300'
    default:
      return 'border-stone-500/30 bg-stone-50 text-stone-900 dark:bg-stone-900/40 dark:text-stone-300'
  }
}

export function ServiceVerificationTable({
  requests,
  onSelectRequest,
}: ServiceVerificationTableProps) {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] p-12 text-center dark:border-[#22352f] dark:bg-[#121c19]">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
          <Inbox className="h-6 w-6" />
        </div>
        <h3 className="mt-4 mb-1 text-sm font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-100">
          Tidak Ada Berkas Permohonan Sesuai Kriteria
        </h3>
        <p className="m-0 max-w-sm text-xs text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
          Semua permohonan surat pada filter ini telah ditangani atau belum ada pengajuan baru dari warga.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 1. Desktop Table View */}
      <div className="hidden overflow-hidden rounded-2xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] shadow-xs lg:block dark:border-[#22352f] dark:bg-[#121c19]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--line,#d5ded9)] bg-stone-50/75 dark:border-[#22352f] dark:bg-[#152320]">
                <th scope="col" className="py-3 px-4 font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                  Tiket &amp; Tanggal
                </th>
                <th scope="col" className="py-3 px-4 font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                  Pemohon
                </th>
                <th scope="col" className="py-3 px-4 font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                  Layanan Surat
                </th>
                <th scope="col" className="py-3 px-4 font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                  Keperluan
                </th>
                <th scope="col" className="py-3 px-4 font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                  Berkas
                </th>
                <th scope="col" className="py-3 px-4 font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                  Status
                </th>
                <th scope="col" className="py-3 px-4 text-right font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line,#d5ded9)] dark:divide-[#22352f]">
              {requests.map((item) => {
                const statusBadge = getStatusBadge(item.status)
                const StatusIcon = statusBadge.icon
                const formattedDate = new Date(item.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
                const formattedTime = new Date(item.createdAt).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                })

                return (
                  <tr
                    key={item.id}
                    className="transition hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                  >
                    {/* Tiket & Tanggal */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                        {item.trackingCode}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 text-[11px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                        <Calendar className="h-3 w-3" />
                        <span>{formattedDate}, {formattedTime}</span>
                      </div>
                    </td>

                    {/* Pemohon */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="flex items-center gap-1.5 font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-100">
                        <User className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>{item.applicantName}</span>
                      </div>
                      <div className="mt-0.5 font-mono text-[11px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                        NIK: {item.applicantNik}
                      </div>
                      {item.applicantBanjarName && (
                        <div className="mt-0.5 text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                          {item.applicantBanjarName}
                        </div>
                      )}
                    </td>

                    {/* Jenis Surat */}
                    <td className="py-3.5 px-4 align-top">
                      <span
                        className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-bold ${getServiceTypeBadge(
                          item.serviceTypeCode,
                        )}`}
                      >
                        {item.serviceTypeTitle}
                      </span>
                      <div className="mt-1 flex items-center gap-1 text-[11px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                        <Clock className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                        <span>Estimasi {item.estimatedDays} hari kerja</span>
                      </div>
                    </td>

                    {/* Keperluan */}
                    <td className="py-3.5 px-4 align-top max-w-xs">
                      <p className="m-0 line-clamp-2 text-xs text-[var(--sea-ink-soft,#576c64)] dark:text-stone-300">
                        {item.purpose}
                      </p>
                    </td>

                    {/* Berkas */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="inline-flex items-center gap-1 rounded-md border border-[var(--line,#d5ded9)] bg-black/[0.02] px-2 py-1 text-[11px] font-semibold text-[var(--sea-ink-soft,#576c64)] dark:border-[#22352f] dark:bg-white/[0.02] dark:text-stone-300">
                        <Paperclip className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                        <span>{item.attachments.length} Berkas</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 align-top">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusBadge.bg}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        <span>{statusBadge.label}</span>
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="py-3.5 px-4 align-top text-right">
                      <button
                        type="button"
                        onClick={() => onSelectRequest(item)}
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Periksa Berkas</span>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Mobile / Tablet Card View */}
      <div className="space-y-3 lg:hidden">
        {requests.map((item) => {
          const statusBadge = getStatusBadge(item.status)
          const StatusIcon = statusBadge.icon
          const formattedDate = new Date(item.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] p-4 shadow-xs dark:border-[#22352f] dark:bg-[#121c19]"
            >
              <div className="flex items-start justify-between gap-2 border-b border-[var(--line,#d5ded9)] pb-3 dark:border-[#22352f]">
                <div>
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                    {item.trackingCode}
                  </span>
                  <p className="m-0 mt-0.5 text-sm font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-100">
                    {item.applicantName}
                  </p>
                  <p className="m-0 font-mono text-[11px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                    NIK: {item.applicantNik}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusBadge.bg}`}
                >
                  <StatusIcon className="h-3 w-3" />
                  <span>{statusBadge.label}</span>
                </span>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-bold ${getServiceTypeBadge(
                      item.serviceTypeCode,
                    )}`}
                  >
                    {item.serviceTypeTitle}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                    <Paperclip className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    <span>{item.attachments.length} Berkas</span>
                  </div>
                </div>

                <p className="m-0 text-xs text-[var(--sea-ink-soft,#576c64)] line-clamp-2 dark:text-stone-300">
                  <span className="font-semibold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">Keperluan:</span> {item.purpose}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <span className="flex items-center gap-1 text-[10px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                    <Calendar className="h-3 w-3" />
                    <span>Diajukan {formattedDate}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => onSelectRequest(item)}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Periksa Berkas</span>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
