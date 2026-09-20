import { Link } from '@tanstack/react-router'
import {
  AlertTriangle,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle,
  Sparkles,
} from 'lucide-react'
import type { RecentUrgentComplaint } from '../../application/server-functions/admin-dashboard.fn.js'

export interface UrgentComplaintListProps {
  complaints: RecentUrgentComplaint[]
}

export default function UrgentComplaintList({ complaints }: UrgentComplaintListProps) {
  const priorityStyles: Record<
    RecentUrgentComplaint['priority'],
    { label: string; badge: string }
  > = {
    EMERGENCY: {
      label: 'DARURAT',
      badge: 'bg-red-600 text-white dark:bg-red-500',
    },
    HIGH: {
      label: 'TINGGI',
      badge: 'bg-amber-600 text-white dark:bg-amber-500',
    },
    MEDIUM: {
      label: 'SEDANG',
      badge: 'bg-stone-600 text-white dark:bg-stone-500',
    },
    LOW: {
      label: 'RENDAH',
      badge: 'bg-emerald-700 text-white dark:bg-emerald-600',
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
    <div className="rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] p-5 shadow-xs dark:border-[#22352f] dark:bg-[#121c19]">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--line,#d5ded9)] pb-4 dark:border-[#22352f]">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2 className="m-0 text-sm font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-100">
              Antrean Triage Pengaduan Kritis
            </h2>
            <p className="m-0 text-xs text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
              Laporan warga prioritas darurat dan tinggi yang perlu ditindaklanjuti
            </p>
          </div>
        </div>

        <Link
          to="/admin/pengaduan"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 dark:text-emerald-300 dark:hover:text-emerald-100"
        >
          <span>Buka Meja Triage</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      {complaints.length === 0 ? (
        /* Empty State (R-27) */
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <CheckCircle className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="mt-3 mb-1 text-sm font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-100">
            Kondisi Wilayah Terkendali
          </p>
          <p className="m-0 max-w-sm text-xs text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
            Tidak ada laporan berkategori darurat atau kritis yang belum tertangani saat ini.
          </p>
        </div>
      ) : (
        /* List of Urgent Complaints */
        <div className="mt-4 divide-y divide-[var(--line,#d5ded9)] dark:divide-[#22352f]">
          {complaints.map((item) => {
            const config = priorityStyles[item.priority] || priorityStyles.MEDIUM

            return (
              <div
                key={item.id}
                className="py-3.5 first:pt-0 last:pb-0 transition-colors hover:bg-black/[0.01] dark:hover:bg-white/[0.01]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      {item.ticketCode}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${config.badge}`}
                    >
                      {config.label}
                    </span>
                    <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[11px] font-semibold text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{formatRelativeTime(item.createdAt)}</span>
                  </div>
                </div>

                <p className="mt-1.5 mb-1 text-sm font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-100">
                  {item.title}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                  <MapPin className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                  <span>
                    {item.banjarName} ({item.specificLocation})
                  </span>
                </div>

                {item.aiSummary && (
                  <div className="mt-2 flex items-start gap-2 rounded-lg bg-emerald-50/50 p-2 text-xs text-emerald-950 dark:bg-emerald-950/20 dark:text-emerald-200">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="m-0 leading-relaxed font-medium">
                      <span className="font-bold">Analisis AI:</span> {item.aiSummary}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
