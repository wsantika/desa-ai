import { Link } from '@tanstack/react-router'
import { FileCheck, Clock, ArrowRight, CheckCircle, User } from 'lucide-react'
import type { RecentServiceRequestItem } from '../../application/server-functions/admin-dashboard.fn.js'

export interface PendingServiceRequestListProps {
  requests: RecentServiceRequestItem[]
}

export default function PendingServiceRequestList({
  requests,
}: PendingServiceRequestListProps) {
  const statusStyles: Record<
    RecentServiceRequestItem['status'],
    { label: string; badge: string }
  > = {
    PENDING: {
      label: 'MENUNGGU',
      badge: 'bg-amber-600 text-white dark:bg-amber-500',
    },
    IN_REVIEW: {
      label: 'DITINJAU',
      badge: 'bg-blue-600 text-white dark:bg-blue-500',
    },
    REVISION: {
      label: 'REVISI',
      badge: 'bg-purple-600 text-white dark:bg-purple-500',
    },
    APPROVED: {
      label: 'DISETUJUI',
      badge: 'bg-emerald-600 text-white dark:bg-emerald-500',
    },
    REJECTED: {
      label: 'DITOLAK',
      badge: 'bg-slate-600 text-white dark:bg-slate-500',
    },
  }

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString)
      return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Makassar',
      }).format(date)
    } catch {
      return isoString
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
            <FileCheck className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2 className="m-0 text-sm font-bold text-slate-900 dark:text-white">
              Antrean Verifikasi Surat Layanan
            </h2>
            <p className="m-0 text-xs text-slate-500 dark:text-slate-400">
              Permohonan surat warga mandiri yang menunggu pemeriksaan berkas
            </p>
          </div>
        </div>

        <Link
          to="/admin/layanan"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <span>Buka Meja Layanan</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      {requests.length === 0 ? (
        /* Empty State (R-27) */
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            <CheckCircle className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="mt-3 mb-1 text-sm font-bold text-slate-900 dark:text-white">
            Semua Permohonan Terproses
          </p>
          <p className="m-0 max-w-sm text-xs text-slate-500 dark:text-slate-400">
            Tidak ada berkas permohonan surat yang sedang menunggu verifikasi saat ini.
          </p>
        </div>
      ) : (
        /* List of Pending Requests */
        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
          {requests.map((item) => {
            const config = statusStyles[item.status] || statusStyles.PENDING

            return (
              <div
                key={item.id}
                className="py-3.5 first:pt-0 last:pb-0 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400">
                      {item.trackingCode}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${config.badge}`}
                    >
                      {config.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{formatRelativeTime(item.createdAt)}</span>
                  </div>
                </div>

                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <p className="m-0 text-sm font-bold text-slate-900 dark:text-white">
                    {item.serviceName}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <User className="h-3 w-3 text-blue-700 dark:text-blue-400" aria-hidden="true" />
                    <span className="font-medium">{item.applicantName}</span>
                  </span>
                </div>

                <p className="mt-1 mb-0 text-xs text-slate-500 line-clamp-1 dark:text-slate-400">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Keperluan:</span> {item.purpose}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
