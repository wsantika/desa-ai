import { Timer, CheckCircle, AlertTriangle, Zap, Target } from 'lucide-react'
import type { ResolutionTimeMetric } from '../../application/dtos/analytics.dto.js'

interface ResolutionTimeMetricsCardProps {
  metrics: ResolutionTimeMetric
}

export function ResolutionTimeMetricsCard({
  metrics,
}: ResolutionTimeMetricsCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] p-5 shadow-xs dark:border-[#22352f] dark:bg-[#121c19]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line,#d5ded9)] pb-4 dark:border-[#22352f]">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <Timer className="h-4 w-4" />
          </div>
          <div>
            <h3 className="m-0 text-sm font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-100">
              Analisis Waktu Penyelesaian (ATTR & Kepatuhan SLA)
            </h3>
            <p className="m-0 text-xs text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
              Evaluasi kecepatan respon perangkat desa dan pemenuhan standar
              pelayanan minimal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Kepatuhan: {metrics.slaComplianceRate}%</span>
          </span>
        </div>
      </div>

      {/* Primary ATTR Highlights */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Rata-rata Umum */}
        <div className="rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f8faf9)] p-3.5 dark:border-[#22352f] dark:bg-[#182522]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
            <Target className="h-3.5 w-3.5 text-emerald-800 dark:text-emerald-400" />
            <span>Rata-rata Waktu Tuntas (ATTR)</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-extrabold text-[var(--sea-ink,#1b2a26)] dark:text-stone-100">
              {metrics.overallAverageHours}
            </span>
            <span className="text-xs font-bold text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
              Jam ({metrics.overallAverageDays} Hari)
            </span>
          </div>
          <p className="mt-1 m-0 text-xs text-stone-500 dark:text-stone-400">
            Target SLA Desa: Maksimal {metrics.slaTargetHours} Jam
          </p>
        </div>

        {/* Waktu Tercepat */}
        <div className="rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f8faf9)] p-3.5 dark:border-[#22352f] dark:bg-[#182522]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <Zap className="h-3.5 w-3.5" />
            <span>Resolusi Tercepat</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-extrabold text-emerald-800 dark:text-emerald-300">
              {metrics.fastestResolutionHours}
            </span>
            <span className="text-xs font-bold text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
              Jam
            </span>
          </div>
          <p className="mt-1 m-0 text-xs text-stone-500 dark:text-stone-400">
            Kasus kebisingan & pipa bocor darurat
          </p>
        </div>

        {/* Waktu Terlama */}
        <div className="rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f8faf9)] p-3.5 dark:border-[#22352f] dark:bg-[#182522]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Resolusi Kasus Terpanjang</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-extrabold text-amber-800 dark:text-amber-300">
              {metrics.longestResolutionHours}
            </span>
            <span className="text-xs font-bold text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
              Jam
            </span>
          </div>
          <p className="mt-1 m-0 text-xs text-stone-500 dark:text-stone-400">
            Koordinasi fogging & validasi bansos lansia
          </p>
        </div>
      </div>

      {/* Target Pelayanan Minimal (SLA) per Sektor */}
      <div className="mt-5 space-y-3">
        <h4 className="m-0 text-xs font-bold uppercase tracking-wider text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
          Kepatuhan Batas Waktu SLA Berdasarkan Sektor Masalah
        </h4>

        <div className="space-y-2">
          {metrics.evaluations.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-1.5 rounded-lg border border-[var(--line,#d5ded9)] p-3 text-xs dark:border-[#22352f]"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                  {item.targetLabel}
                </span>
                <span className="rounded-xs bg-emerald-100 px-2 py-0.5 font-mono font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Capaian: {item.compliancePercentage}%
                </span>
              </div>
              <div className="flex items-center justify-between text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                <span>Rata-rata aktual: {item.actualAvgHours} Jam</span>
                <span>Sampel: {item.totalEvaluated} laporan tuntas</span>
              </div>
              {/* Bar indicator */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-emerald-600 dark:bg-emerald-400"
                  style={{ width: `${item.compliancePercentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
