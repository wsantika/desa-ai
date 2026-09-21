import { Search, X, AlertTriangle, Filter } from 'lucide-react'
import type {
  BanjarOption,
  TriageCounters,
} from '../../../application/server-functions/admin-triage.fn.js'
import type { TriageFilterDTO } from '../../../application/dtos/triage-desk.dto.js'

interface TriageFilterToolbarProps {
  filter: TriageFilterDTO
  counters: TriageCounters
  banjars: BanjarOption[]
  onFilterChange: (updates: Partial<TriageFilterDTO>) => void
  onReset: () => void
}

export function TriageFilterToolbar({
  filter,
  counters,
  banjars,
  onFilterChange,
  onReset,
}: TriageFilterToolbarProps) {
  const isFiltered =
    filter.status !== 'ALL' ||
    filter.priority !== 'ALL' ||
    filter.category !== 'ALL' ||
    filter.banjarId !== 'ALL' ||
    filter.search.trim().length > 0

  const quickStatusTabs: Array<{
    id: TriageFilterDTO['status']
    label: string
    count: number
    isEmergency?: boolean
  }> = [
    { id: 'ALL', label: 'Semua Laporan', count: counters.totalCount },
    {
      id: 'ALL', // Special visual filter for Emergency
      label: 'Darurat (AI)',
      count: counters.emergencyCount,
      isEmergency: true,
    },
    { id: 'OPEN', label: 'Menunggu', count: counters.openCount },
    { id: 'IN_PROGRESS', label: 'Diproses', count: counters.inProgressCount },
    { id: 'RESOLVED', label: 'Selesai', count: counters.resolvedCount },
  ]

  return (
    <div className="space-y-4 rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] p-4 shadow-xs dark:border-[#22352f] dark:bg-[#121c19]">
      {/* Quick Status & Urgency Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--line,#d5ded9)] pb-3 dark:border-[#22352f]">
        {quickStatusTabs.map((tab, idx) => {
          const isEmergencyTab = tab.isEmergency
          const isActive = isEmergencyTab
            ? filter.priority === 'EMERGENCY' &&
              (filter.status === 'ALL' ||
                filter.status === 'OPEN' ||
                filter.status === 'IN_PROGRESS')
            : filter.priority !== 'EMERGENCY' && filter.status === tab.id

          return (
            <button
              key={`${tab.label}-${idx}`}
              type="button"
              onClick={() => {
                if (isEmergencyTab) {
                  onFilterChange({
                    priority: 'EMERGENCY',
                    status: 'ALL',
                  })
                } else {
                  onFilterChange({
                    status: tab.id,
                    priority: filter.priority === 'EMERGENCY' ? 'ALL' : filter.priority,
                  })
                }
              }}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                isActive
                  ? isEmergencyTab
                    ? 'bg-red-600 text-white shadow-xs dark:bg-red-700'
                    : 'bg-emerald-800 text-white shadow-xs dark:bg-emerald-700'
                  : 'bg-[var(--surface-secondary,#f4f7f5)] text-[var(--sea-ink,#1b2a26)] hover:bg-black/5 dark:bg-[#182622] dark:text-stone-300 dark:hover:bg-[#20322d]'
              }`}
            >
              {isEmergencyTab && <AlertTriangle className="h-3.5 w-3.5" />}
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : isEmergencyTab && tab.count > 0
                      ? 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300'
                      : 'bg-black/5 text-[var(--sea-ink-soft,#576c64)] dark:bg-white/10 dark:text-stone-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Advanced Filters: Search + Banjar + Priority + Category */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {/* Search Input */}
        <div className="relative lg:col-span-2">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--sea-ink-soft,#576c64)] dark:text-stone-500" />
          <input
            type="text"
            value={filter.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Cari tiket, judul, warga, atau lokasi..."
            className="w-full rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f4f7f5)] py-2 pr-8 pl-9 text-xs text-[var(--sea-ink,#1b2a26)] placeholder-[var(--sea-ink-soft,#576c64)] focus:border-emerald-600 focus:bg-white focus:outline-hidden dark:border-[#22352f] dark:bg-[#182622] dark:text-stone-100 dark:placeholder-stone-500 dark:focus:border-emerald-500 dark:focus:bg-[#14201d]"
          />
          {filter.search && (
            <button
              type="button"
              onClick={() => onFilterChange({ search: '' })}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 text-[var(--sea-ink-soft,#576c64)] hover:text-black dark:text-stone-400 dark:hover:text-white"
              aria-label="Bersihkan pencarian"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Banjar */}
        <div>
          <label htmlFor="filter-banjar" className="sr-only">
            Wilayah Banjar
          </label>
          <select
            id="filter-banjar"
            value={filter.banjarId}
            onChange={(e) => onFilterChange({ banjarId: e.target.value })}
            className="w-full rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f4f7f5)] px-3 py-2 text-xs font-medium text-[var(--sea-ink,#1b2a26)] focus:border-emerald-600 focus:outline-hidden dark:border-[#22352f] dark:bg-[#182622] dark:text-stone-200 dark:focus:border-emerald-500"
          >
            <option value="ALL">Semua Banjar / Dusun</option>
            {banjars.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Prioritas AI */}
        <div>
          <label htmlFor="filter-priority" className="sr-only">
            Prioritas AI
          </label>
          <select
            id="filter-priority"
            value={filter.priority}
            onChange={(e) =>
              onFilterChange({
                priority: e.target.value as TriageFilterDTO['priority'],
              })
            }
            className="w-full rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f4f7f5)] px-3 py-2 text-xs font-medium text-[var(--sea-ink,#1b2a26)] focus:border-emerald-600 focus:outline-hidden dark:border-[#22352f] dark:bg-[#182622] dark:text-stone-200 dark:focus:border-emerald-500"
          >
            <option value="ALL">Semua Prioritas AI</option>
            <option value="EMERGENCY">Darurat (Emergency)</option>
            <option value="HIGH">Tinggi (High)</option>
            <option value="MEDIUM">Sedang (Medium)</option>
            <option value="LOW">Rendah (Low)</option>
          </select>
        </div>

        {/* Filter Kategori */}
        <div>
          <label htmlFor="filter-category" className="sr-only">
            Kategori
          </label>
          <select
            id="filter-category"
            value={filter.category}
            onChange={(e) =>
              onFilterChange({
                category: e.target.value as TriageFilterDTO['category'],
              })
            }
            className="w-full rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f4f7f5)] px-3 py-2 text-xs font-medium text-[var(--sea-ink,#1b2a26)] focus:border-emerald-600 focus:outline-hidden dark:border-[#22352f] dark:bg-[#182622] dark:text-stone-200 dark:focus:border-emerald-500"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="INFRASTRUKTUR">Infrastruktur</option>
            <option value="KEBERSIHAN_LINGKUNGAN">Kebersihan Lingkungan</option>
            <option value="KEAMANAN_KETERTIBAN">Keamanan & Ketertiban</option>
            <option value="PELAYANAN_PUBLIK">Pelayanan Publik</option>
            <option value="BANTUAN_SOSIAL">Bantuan Sosial</option>
            <option value="LAINNYA">Lainnya</option>
          </select>
        </div>
      </div>

      {/* Filter Reset Badge */}
      {isFiltered && (
        <div className="flex items-center justify-between pt-1">
          <div className="inline-flex items-center gap-1 text-[11px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
            <Filter className="h-3 w-3" />
            <span>Filter aktif diterapkan pada daftar pengaduan.</span>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:underline dark:text-emerald-300"
          >
            <X className="h-3 w-3" />
            <span>Reset Semua Filter</span>
          </button>
        </div>
      )}
    </div>
  )
}
