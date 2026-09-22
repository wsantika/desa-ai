import { Timer, CheckCircle, AlertTriangle, Zap, Target } from 'lucide-react'
import type { ResolutionTimeMetric } from '../../application/dtos/analytics.dto.js'

interface ResolutionTimeMetricsCardProps {
  metrics: ResolutionTimeMetric
}

export function ResolutionTimeMetricsCard({
  metrics,
}: ResolutionTimeMetricsCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <Timer className="h-4 w-4" />
          </div>
          <div>
            <h3 className="m-0 text-sm font-bold text-slate-900 dark:text-slate-100">
              Analisis Waktu Penyelesaian (ATTR & Kepatuhan SLA)
            </h3>
            <p className="m-0 text-xs text-slate-500 dark:text-slate-400">
              Evaluasi kecepatan respon perangkat desa dan pemenuhan standar
              pelayanan minimal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Kepatuhan: {metrics.slaComplianceRate}%</span>
          </span>
        </div>
      </div>

      {/* Primary ATTR Highlights */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Rata-rata Umum */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Target className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Rata-rata Waktu Tuntas (ATTR)</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {metrics.overallAverageHours}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Jam ({metrics.overallAverageDays} Hari)
            </span>
          </div>
          <p className="mt-1 m-0 text-xs text-slate-500 dark:text-slate-400">
            Target SLA Desa: Maksimal {metrics.slaTargetHours} Jam
          </p>
        </div>

        {/* Waktu Tercepat */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <Zap className="h-3.5 w-3.5" />
            <span>Resolusi Tercepat</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-extrabold text-blue-700 dark:text-blue-300">
              {metrics.fastestResolutionHours}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Jam
            </span>
          </div>
          <p className="mt-1 m-0 text-xs text-slate-500 dark:text-slate-400">
            Kasus kebisingan & pipa bocor darurat
          </p>
        </div>

        {/* Waktu Terlama */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Resolusi Kasus Terpanjang</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-extrabold text-amber-800 dark:text-amber-300">
              {metrics.longestResolutionHours}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Jam
            </span>
          </div>
          <p className="mt-1 m-0 text-xs text-slate-500 dark:text-slate-400">
            Koordinasi fogging & validasi bansos lansia
          </p>
        </div>
      </div>

      {/* Target Pelayanan Minimal (SLA) per Sektor */}
      <div className="mt-5 space-y-3">
        <h4 className="m-0 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Kepatuhan Batas Waktu SLA Berdasarkan Sektor Masalah
        </h4>

        <div className="space-y-2">
          {metrics.evaluations.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-1.5 rounded-lg border border-slate-200 p-3 text-xs dark:border-slate-800"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 dark:text-slate-200">
                  {item.targetLabel}
                </span>
                <span className="rounded-xs bg-blue-50 px-2 py-0.5 font-mono font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  Capaian: {item.compliancePercentage}%
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>Rata-rata aktual: {item.actualAvgHours} Jam</span>
                <span>Sampel: {item.totalEvaluated} laporan tuntas</span>
              </div>
              {/* Bar indicator */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-blue-600 dark:bg-blue-500"
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
