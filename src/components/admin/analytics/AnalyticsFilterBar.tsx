import { Filter, RefreshCw, Printer, Calendar, MapPin } from 'lucide-react'

interface AnalyticsFilterBarProps {
  selectedBanjar: string
  onSelectBanjar: (banjarId: string) => void
  banjars: Array<{ id: string; name: string }>
  timeRange: 'all' | '30d' | '90d' | 'year'
  onSelectTimeRange: (range: 'all' | '30d' | '90d' | 'year') => void
  isLoading: boolean
  onRefresh: () => void
  onPrint: () => void
}

export function AnalyticsFilterBar({
  selectedBanjar,
  onSelectBanjar,
  banjars,
  timeRange,
  onSelectTimeRange,
  isLoading,
  onRefresh,
  onPrint,
}: AnalyticsFilterBarProps) {
  const timeRangeOptions: Array<{
    id: 'all' | '30d' | '90d' | 'year'
    label: string
  }> = [
    { id: 'all', label: 'Semua Periode' },
    { id: '30d', label: '30 Hari Terakhir' },
    { id: '90d', label: 'Triwulan Ini (90 Hari)' },
    { id: 'year', label: 'Tahun Berjalan 2026' },
  ]

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] p-4 shadow-xs dark:border-[#22352f] dark:bg-[#121c19] lg:flex-row lg:items-center lg:justify-between">
      {/* Banjar Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
          <MapPin className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          <span>Wilayah Banjar:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => onSelectBanjar('ALL')}
            className={`min-h-[44px] sm:min-h-[34px] rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 ${
              selectedBanjar === 'ALL'
                ? 'bg-blue-600 text-white shadow-xs dark:bg-blue-600'
                : 'bg-black/5 text-[var(--sea-ink,#1b2a26)] hover:bg-black/10 dark:bg-white/5 dark:text-stone-300 dark:hover:bg-white/10'
            }`}
          >
            Semua Banjar
          </button>
          {banjars.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => onSelectBanjar(b.id)}
              className={`min-h-[44px] sm:min-h-[34px] rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                selectedBanjar === b.id
                  ? 'bg-blue-600 text-white shadow-xs dark:bg-blue-600'
                  : 'bg-black/5 text-[var(--sea-ink,#1b2a26)] hover:bg-black/10 dark:bg-white/5 dark:text-stone-300 dark:hover:bg-white/10'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {/* Time Window & Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
          <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          <span>Rentang Waktu:</span>
        </div>

        <select
          value={timeRange}
          onChange={(e) =>
            onSelectTimeRange(e.target.value as 'all' | '30d' | '90d' | 'year')
          }
          className="min-h-[44px] sm:min-h-[34px] rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] px-3 py-1.5 text-xs font-medium text-[var(--sea-ink,#1b2a26)] focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-[#22352f] dark:bg-[#121c19] dark:text-stone-200"
          aria-label="Filter Rentang Waktu"
        >
          {timeRangeOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex min-h-[44px] sm:min-h-[34px] items-center gap-1.5 rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] px-3 py-1.5 text-xs font-semibold text-[var(--sea-ink,#1b2a26)] transition-colors hover:bg-black/5 disabled:opacity-50 dark:border-[#22352f] dark:bg-[#121c19] dark:text-stone-200"
          title="Segarkan Data Analitik"
          aria-label="Segarkan Data Analitik"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 text-blue-600 dark:text-blue-400 ${
              isLoading ? 'animate-spin' : ''
            }`}
          />
          <span className="hidden sm:inline">Perbarui</span>
        </button>

        <button
          type="button"
          onClick={onPrint}
          className="inline-flex min-h-[44px] sm:min-h-[34px] items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
          title="Cetak Lembar Laporan Eksekutif Musrenbangdes"
          aria-label="Cetak Lembar Laporan Eksekutif Musrenbangdes"
        >
          <Printer className="h-3.5 w-3.5" />
          <span>Cetak Musrenbangdes</span>
        </button>
      </div>
    </div>
  )
}
