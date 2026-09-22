import {
  AlertTriangle,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  Inbox,
  RotateCcw,
} from 'lucide-react'
import type { TriageComplaintItem } from '../../../application/server-functions/admin-triage.fn.js'
import type {
  ComplaintCategory,
  ComplaintPriority,
  ComplaintStatus,
} from '../../../domain/entities/complaint.entity.js'

interface TriageComplaintTableProps {
  complaints: TriageComplaintItem[]
  onSelectComplaint: (complaint: TriageComplaintItem) => void
  onResetFilter: () => void
}

function getPriorityBadge(priority: ComplaintPriority | null) {
  switch (priority) {
    case 'EMERGENCY':
      return {
        label: 'Darurat (AI)',
        classes:
          'bg-red-100 text-red-900 border-red-300 dark:bg-red-950/80 dark:text-red-200 dark:border-red-800',
        icon: true,
      }
    case 'HIGH':
      return {
        label: 'Tinggi (AI)',
        classes:
          'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-800',
        icon: false,
      }
    case 'MEDIUM':
      return {
        label: 'Sedang',
        classes:
          'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/80 dark:text-sky-200 dark:border-sky-800',
        icon: false,
      }
    case 'LOW':
    default:
      return {
        label: 'Rendah',
        classes:
          'bg-stone-100 text-stone-800 border-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700',
        icon: false,
      }
  }
}

function getStatusBadge(status: ComplaintStatus) {
  switch (status) {
    case 'OPEN':
      return {
        label: 'Menunggu',
        classes:
          'bg-stone-100 text-stone-800 border-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700',
      }
    case 'IN_PROGRESS':
      return {
        label: 'Sedang Diproses',
        classes:
          'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-800',
      }
    case 'RESOLVED':
      return {
        label: 'Selesai',
        classes:
          'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-800',
      }
    case 'REJECTED':
      return {
        label: 'Ditolak',
        classes:
          'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-800',
      }
    default:
      return {
        label: status,
        classes:
          'bg-stone-100 text-stone-800 border-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700',
      }
  }
}

function getCategoryLabel(category: ComplaintCategory | null): string {
  switch (category) {
    case 'INFRASTRUKTUR':
      return 'Infrastruktur'
    case 'KEBERSIHAN_LINGKUNGAN':
      return 'Kebersihan Lingkungan'
    case 'KEAMANAN_KETERTIBAN':
      return 'Keamanan & Ketertiban'
    case 'PELAYANAN_PUBLIK':
      return 'Pelayanan Publik'
    case 'BANTUAN_SOSIAL':
      return 'Bantuan Sosial'
    case 'LAINNYA':
    default:
      return 'Lainnya'
  }
}

function formatTriageDate(isoString: string): string {
  try {
    const d = new Date(isoString)
    return (
      new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Makassar',
      }).format(d) + ' WITA'
    )
  } catch {
    return isoString
  }
}

export function TriageComplaintTable({
  complaints,
  onSelectComplaint,
  onResetFilter,
}: TriageComplaintTableProps) {
  if (complaints.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] p-12 text-center shadow-xs dark:border-[#22352f] dark:bg-[#121c19]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-secondary,#f4f7f5)] text-[var(--sea-ink-soft,#576c64)] dark:bg-[#182622] dark:text-stone-400">
          <Inbox className="h-6 w-6" />
        </div>
        <h3 className="mt-4 mb-1 text-sm font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-100">
          Tidak Ada Pengaduan yang Cocok
        </h3>
        <p className="m-0 mx-auto max-w-sm text-xs text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
          Tidak ditemukan laporan warga dengan kriteria filter saat ini. Coba ubah kata kunci atau bersihkan filter.
        </p>
        <button
          type="button"
          onClick={onResetFilter}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] px-3 py-1.5 text-xs font-semibold text-[var(--sea-ink,#1b2a26)] hover:bg-black/5 dark:border-[#22352f] dark:bg-[#182622] dark:text-stone-200 dark:hover:bg-[#20322d]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Filter</span>
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View (Hidden on mobile) */}
      <div className="hidden overflow-hidden rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] shadow-xs md:block dark:border-[#22352f] dark:bg-[#121c19]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f4f7f5)] font-semibold text-[var(--sea-ink-soft,#576c64)] dark:border-[#22352f] dark:bg-[#182622] dark:text-stone-400">
              <tr>
                <th className="py-3 pr-3 pl-4">Tiket & Waktu</th>
                <th className="px-3 py-3">Pelapor & Banjar</th>
                <th className="px-3 py-3">Substansi Keluhan</th>
                <th className="px-3 py-3">Analisis AI</th>
                <th className="px-3 py-3">Status</th>
                <th className="py-3 pr-4 pl-3 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line,#d5ded9)] dark:divide-[#22352f]">
              {complaints.map((item) => {
                const priorityBadge = getPriorityBadge(item.priority)
                const statusBadge = getStatusBadge(item.status)
                const isEmergency = item.priority === 'EMERGENCY'

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02] ${
                      isEmergency
                        ? 'bg-red-50/40 dark:bg-red-950/15'
                        : ''
                    }`}
                  >
                    {/* Tiket & Waktu */}
                    <td className="py-3.5 pr-3 pl-4 align-top">
                      <div className="font-mono font-bold text-blue-600 dark:text-blue-400">
                        {item.ticketCode}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 text-[11px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-500">
                        <Clock className="h-3 w-3" />
                        <span>{formatTriageDate(item.createdAt)}</span>
                      </div>
                    </td>

                    {/* Pelapor & Banjar */}
                    <td className="px-3 py-3.5 align-top">
                      <div className="font-semibold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                        {item.reporterName}
                      </div>
                      <div className="mt-0.5 inline-flex items-center gap-1 rounded bg-[var(--surface-secondary,#f4f7f5)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--sea-ink-soft,#576c64)] dark:bg-[#182622] dark:text-stone-400">
                        <MapPin className="h-2.5 w-2.5" />
                        <span>{item.banjarName}</span>
                      </div>
                    </td>

                    {/* Substansi Keluhan */}
                    <td className="max-w-xs px-3 py-3.5 align-top">
                      <div className="line-clamp-1 font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-100">
                        {item.title}
                      </div>
                      <div className="mt-0.5 line-clamp-2 text-[11px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                        {item.aiSummary || item.description}
                      </div>
                      <div className="mt-1 text-[10px] text-[var(--sea-ink-soft,#576c64)] italic dark:text-stone-500">
                        Patokan: {item.specificLocation}
                      </div>
                    </td>

                    {/* Analisis AI */}
                    <td className="px-3 py-3.5 align-top">
                      <div className="flex flex-col items-start gap-1">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold ${priorityBadge.classes}`}
                        >
                          {priorityBadge.icon && (
                            <AlertTriangle className="h-3 w-3" />
                          )}
                          <span>{priorityBadge.label}</span>
                        </span>

                        <span className="inline-flex items-center gap-1 rounded bg-[var(--surface-secondary,#f4f7f5)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--sea-ink-soft,#576c64)] dark:bg-[#182622] dark:text-stone-400">
                          <Sparkles className="h-2.5 w-2.5 text-blue-600 dark:text-blue-400" />
                          <span>{getCategoryLabel(item.category)}</span>
                        </span>
                      </div>
                    </td>

                    {/* Status Saat Ini */}
                    <td className="px-3 py-3.5 align-top">
                      <span
                        className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-bold ${statusBadge.classes}`}
                      >
                        {statusBadge.label}
                      </span>
                    </td>

                    {/* Tindakan */}
                    <td className="py-3.5 pr-4 pl-3 text-right align-top">
                      <button
                        type="button"
                        onClick={() => onSelectComplaint(item)}
                        className="inline-flex items-center gap-1 rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] px-2.5 py-1.5 text-xs font-semibold text-[var(--sea-ink,#1b2a26)] shadow-2xs hover:border-blue-500 hover:text-blue-600 dark:border-[#22352f] dark:bg-[#182622] dark:text-stone-200 dark:hover:border-blue-400 dark:hover:text-blue-300"
                      >
                        <span>Triage & Detail</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View (Shown only on small screens) */}
      <div className="space-y-3 md:hidden">
        {complaints.map((item) => {
          const priorityBadge = getPriorityBadge(item.priority)
          const statusBadge = getStatusBadge(item.status)
          const isEmergency = item.priority === 'EMERGENCY'

          return (
            <div
              key={`card-${item.id}`}
              className={`rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] p-4 shadow-xs dark:border-[#22352f] dark:bg-[#121c19] ${
                isEmergency ? 'border-red-300 dark:border-red-900/60' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                    {item.ticketCode}
                  </span>
                  <div className="text-[11px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-500">
                    {formatTriageDate(item.createdAt)}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold ${priorityBadge.classes}`}
                  >
                    {priorityBadge.icon && (
                      <AlertTriangle className="h-3 w-3" />
                    )}
                    <span>{priorityBadge.label}</span>
                  </span>
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${statusBadge.classes}`}
                  >
                    {statusBadge.label}
                  </span>
                </div>
              </div>

              <div className="mt-2.5">
                <h4 className="m-0 text-sm font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-100">
                  {item.title}
                </h4>
                <p className="mt-1 mb-0 text-xs text-[var(--sea-ink-soft,#576c64)] line-clamp-2 dark:text-stone-400">
                  {item.aiSummary || item.description}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line,#d5ded9)] pt-3 text-[11px] dark:border-[#22352f]">
                <div className="text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                  <span className="font-semibold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                    {item.reporterName}
                  </span>{' '}
                  ({item.banjarName})
                </div>

                <button
                  type="button"
                  onClick={() => onSelectComplaint(item)}
                  className="inline-flex min-h-[36px] items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                  <span>Triage Laporan</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
