import { Clock, ShieldCheck, Inbox, MapPin, CheckCircle2 } from 'lucide-react'
import type { AnalyticsSummaryMetrics } from '../../application/dtos/analytics.dto.js'

interface AnalyticsStatCardsProps {
  metrics: AnalyticsSummaryMetrics
  topBanjarName: string
  topBanjarCount: number
}

export function AnalyticsStatCards({
  metrics,
  topBanjarName,
  topBanjarCount,
}: AnalyticsStatCardsProps) {
  const avgDays = Math.round((metrics.averageResolutionHours / 24) * 10) / 10

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Total Pengaduan */}
      <div className="flex flex-col justify-between rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] p-5 shadow-xs transition-shadow hover:shadow-md dark:border-[#22352f] dark:bg-[#121c19]">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
            Total Pengaduan Warga
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <Inbox className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-3xl font-extrabold tracking-tight text-[var(--sea-ink,#1b2a26)] dark:text-stone-100">
            {metrics.totalComplaints}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-3 w-3" />
              {metrics.resolvedComplaints} Selesai
            </span>
            <span>•</span>
            <span className="text-amber-700 dark:text-amber-400">
              {metrics.inProgressComplaints} Proses
            </span>
            <span>•</span>
            <span className="text-rose-700 dark:text-rose-400">
              {metrics.openComplaints} Terbuka
            </span>
          </div>
        </div>
      </div>

      {/* 2. Average Time to Resolution (ATTR) */}
      <div className="flex flex-col justify-between rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] p-5 shadow-xs transition-shadow hover:shadow-md dark:border-[#22352f] dark:bg-[#121c19]">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
            Rata-rata Waktu Resolusi (ATTR)
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-extrabold tracking-tight text-[var(--sea-ink,#1b2a26)] dark:text-stone-100">
              {metrics.averageResolutionHours}
            </div>
            <span className="text-sm font-bold text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
              Jam
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
              Setara {avgDays} hari kerja
            </span>
            <span className="rounded-md bg-teal-50 px-2 py-0.5 font-bold text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
              Target SLA &lt; 48 Jam
            </span>
          </div>
        </div>
      </div>

      {/* 3. Tingkat Kepatuhan SLA */}
      <div className="flex flex-col justify-between rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] p-5 shadow-xs transition-shadow hover:shadow-md dark:border-[#22352f] dark:bg-[#121c19]">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
            Kepatuhan SLA Desa
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-1">
            <div className="text-3xl font-extrabold tracking-tight text-emerald-800 dark:text-emerald-400">
              {metrics.slaComplianceRatePercent}%
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
              Selesai sesuai target
            </span>
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              Kinerja Optimal
            </span>
          </div>
        </div>
      </div>

      {/* 4. Wilayah Banjar Terpadat */}
      <div className="flex flex-col justify-between rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] p-5 shadow-xs transition-shadow hover:shadow-md dark:border-[#22352f] dark:bg-[#121c19]">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
            Wilayah Terpadat Aduan
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            <MapPin className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="truncate text-2xl font-extrabold tracking-tight text-[var(--sea-ink,#1b2a26)] dark:text-stone-100">
            {topBanjarName}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
              {topBanjarCount} laporan terdata
            </span>
            <span className="rounded-md bg-amber-50 px-2 py-0.5 font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
              Prioritas RKPDes
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
