import { Search, X, RotateCcw } from 'lucide-react'
import type {
  KnowledgeCategory,
  KnowledgeFilterDTO,
} from '../../../application/dtos/knowledge-desk.dto.js'

interface KnowledgeFilterToolbarProps {
  filter: KnowledgeFilterDTO
  categoryCounts: Record<KnowledgeCategory, number>
  totalDocuments: number
  onFilterChange: (updates: Partial<KnowledgeFilterDTO>) => void
  onReset: () => void
}

export function KnowledgeFilterToolbar({
  filter,
  categoryCounts,
  totalDocuments,
  onFilterChange,
  onReset,
}: KnowledgeFilterToolbarProps) {
  const categoryTabs: Array<{
    id: 'ALL' | KnowledgeCategory
    label: string
    count: number
  }> = [
    { id: 'ALL', label: 'Semua Kategori', count: totalDocuments },
    {
      id: 'SOP_LAYANAN',
      label: 'SOP Layanan',
      count: categoryCounts.SOP_LAYANAN,
    },
    {
      id: 'REGULASI',
      label: 'Regulasi Desa',
      count: categoryCounts.REGULASI,
    },
    {
      id: 'FAQ',
      label: 'Tanya Jawab (FAQ)',
      count: categoryCounts.FAQ,
    },
    {
      id: 'PROFIL_DESA',
      label: 'Profil Desa',
      count: categoryCounts.PROFIL_DESA,
    },
  ]

  const isFiltered =
    filter.category !== 'ALL' ||
    filter.status !== 'ALL' ||
    filter.search.trim().length > 0

  return (
    <div className="space-y-3 rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] p-4 shadow-xs dark:border-[#22352f] dark:bg-[#121c19]">
      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--line,#d5ded9)] pb-3 dark:border-[#22352f]">
        {categoryTabs.map((tab) => {
          const isActive = filter.category === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onFilterChange({ category: tab.id })}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs dark:bg-blue-600'
                  : 'bg-[var(--surface-secondary,#f4f7f5)] text-stone-700 hover:bg-slate-100 dark:bg-[#182622] dark:text-stone-300 dark:hover:bg-[#20322d]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-black/10 text-stone-600 dark:bg-white/10 dark:text-stone-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Search & Status Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-stone-500"
            aria-hidden="true"
          />
          <input
            type="text"
            value={filter.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Cari judul dokumen, perdes, nomor SOP, atau isi acuan..."
            className="w-full rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f4f7f5)] py-2 pr-8 pl-9 text-xs text-stone-900 placeholder-stone-400 focus:border-blue-600 focus:bg-white focus:outline-hidden dark:border-[#22352f] dark:bg-[#182622] dark:text-stone-100 dark:placeholder-stone-500 dark:focus:border-blue-500 dark:focus:bg-[#14201d]"
          />
          {filter.search && (
            <button
              type="button"
              onClick={() => onFilterChange({ search: '' })}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 text-stone-400 hover:text-black dark:text-stone-400 dark:hover:text-white"
              aria-label="Bersihkan kata kunci pencarian"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Publication Status & Reset */}
        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="filter-status" className="sr-only">
            Filter Status Publikasi Dokumen
          </label>
          <select
            id="filter-status"
            value={filter.status}
            onChange={(e) =>
              onFilterChange({
                status: e.target.value as KnowledgeFilterDTO['status'],
              })
            }
            className="rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f4f7f5)] px-3 py-2 text-xs font-semibold text-stone-800 focus:border-blue-600 focus:outline-hidden dark:border-[#22352f] dark:bg-[#182622] dark:text-stone-200 dark:focus:border-blue-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="PUBLISHED">Aktif Digunakan AI</option>
            <option value="DRAFT">Draf (Nonaktif)</option>
          </select>

          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f4f7f5)] px-2.5 py-2 text-xs font-semibold text-stone-700 hover:bg-black/5 dark:border-[#22352f] dark:bg-[#182622] dark:text-stone-300 dark:hover:bg-[#20322d]"
              title="Bersihkan semua penyaring"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
