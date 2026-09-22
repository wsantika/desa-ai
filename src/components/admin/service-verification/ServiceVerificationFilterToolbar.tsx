import { Search, X, Filter } from 'lucide-react'
import type {
  ServiceVerificationFilterDTO,
} from '../../application/dtos/service-verification.dto.js'
import type {
  ServiceVerificationCounters,
  ServiceTypeOption,
} from '../../application/server-functions/admin-service-verification.fn.js'

interface ServiceVerificationFilterToolbarProps {
  filter: ServiceVerificationFilterDTO
  counters: ServiceVerificationCounters
  serviceTypes: ServiceTypeOption[]
  onFilterChange: (updates: Partial<ServiceVerificationFilterDTO>) => void
  onReset: () => void
}

type StatusTab = {
  key: ServiceVerificationFilterDTO['status']
  label: string
  count: number
  badgeColor: string
}

export function ServiceVerificationFilterToolbar({
  filter,
  counters,
  serviceTypes,
  onFilterChange,
  onReset,
}: ServiceVerificationFilterToolbarProps) {
  const statusTabs: StatusTab[] = [
    {
      key: 'ALL',
      label: 'Semua Berkas',
      count: counters.totalCount,
      badgeColor: 'bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-300',
    },
    {
      key: 'PENDING',
      label: 'Menunggu Verifikasi',
      count: counters.pendingCount,
      badgeColor: 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300',
    },
    {
      key: 'IN_REVIEW',
      label: 'Sedang Diproses',
      count: counters.inReviewCount,
      badgeColor: 'bg-blue-100 text-blue-900 dark:bg-blue-950/80 dark:text-blue-300',
    },
    {
      key: 'REVISION',
      label: 'Perlu Revisi',
      count: counters.revisionCount,
      badgeColor: 'bg-orange-100 text-orange-900 dark:bg-orange-950/80 dark:text-orange-300',
    },
    {
      key: 'APPROVED',
      label: 'Disetujui',
      count: counters.approvedCount,
      badgeColor: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300',
    },
    {
      key: 'REJECTED',
      label: 'Ditolak',
      count: counters.rejectedCount,
      badgeColor: 'bg-rose-100 text-rose-900 dark:bg-rose-950/80 dark:text-rose-300',
    },
  ]

  const isFiltered =
    filter.status !== 'ALL' ||
    filter.serviceCode !== 'ALL' ||
    Boolean(filter.search && filter.search.trim().length > 0)

  return (
    <div className="space-y-4">
      {/* Horizontal Status Tabs with Counter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {statusTabs.map((tab) => {
          const isActive = filter.status === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onFilterChange({ status: tab.key })}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs dark:bg-blue-600'
                  : 'border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] text-[var(--sea-ink-soft,#576c64)] hover:bg-black/5 dark:border-[#22352f] dark:bg-[#121c19] dark:text-stone-300 dark:hover:bg-white/5'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : tab.badgeColor
                }`}
              >
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] p-3.5 shadow-xs sm:flex-row sm:items-center dark:border-[#22352f] dark:bg-[#121c19]">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--sea-ink-soft,#576c64)]" />
          <input
            type="text"
            value={filter.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Cari nomor tiket REQ, nama pemohon, NIK, atau keperluan..."
            className="w-full rounded-xl border border-[var(--line,#d5ded9)] bg-black/[0.02] py-2 pr-4 pl-9 text-xs text-[var(--sea-ink,#1b2a26)] placeholder-[var(--sea-ink-soft,#576c64)] focus:border-blue-600 focus:outline-hidden dark:border-[#22352f] dark:bg-white/[0.02] dark:text-stone-100"
          />
        </div>

        {/* Filter Dropdown: Service Type */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-[var(--sea-ink-soft,#576c64)]" />
            <select
              value={filter.serviceCode || 'ALL'}
              onChange={(e) => onFilterChange({ serviceCode: e.target.value as ServiceVerificationFilterDTO['serviceCode'] })}
              className="rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] px-3 py-2 text-xs font-semibold text-[var(--sea-ink,#1b2a26)] focus:border-blue-600 focus:outline-hidden dark:border-[#22352f] dark:bg-[#121c19] dark:text-stone-200"
            >
              <option value="ALL">Semua Jenis Layanan Surat</option>
              {serviceTypes.map((st) => (
                <option key={st.code} value={st.code}>
                  {st.title}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filter Button */}
          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-800 transition hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
            >
              <X className="h-3.5 w-3.5" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
