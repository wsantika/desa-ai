import { BookOpen, Sparkles, Layers, RefreshCw } from 'lucide-react'
import type { KnowledgeDeskMetrics } from '../../../application/dtos/knowledge-desk.dto.js'

interface KnowledgeStatCardsProps {
  metrics: KnowledgeDeskMetrics
  isSyncing?: boolean
  onSyncAll?: () => void
}

export function KnowledgeStatCards({
  metrics,
  isSyncing = false,
  onSyncAll,
}: KnowledgeStatCardsProps) {
  const formattedSyncTime = metrics.lastSyncedAt
    ? new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Makassar',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(metrics.lastSyncedAt)) + ' WITA'
    : 'Belum pernah'

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Total Documents */}
      <div className="rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] p-4 shadow-xs transition hover:shadow-sm dark:border-[#22352f] dark:bg-[#121c19]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">
            Total Dokumen Acuan
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-mono text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            {metrics.totalDocuments}
          </span>
          <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
            berkas tersimpan
          </span>
        </div>
        <p className="mt-1 mb-0 text-[11px] text-stone-500 dark:text-stone-400">
          {metrics.categoryCounts.REGULASI} Regulasi,{' '}
          {metrics.categoryCounts.SOP_LAYANAN} SOP
        </p>
      </div>

      {/* 2. Published / Active in AI */}
      <div className="rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] p-4 shadow-xs transition hover:shadow-sm dark:border-[#22352f] dark:bg-[#121c19]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">
            Aktif Digunakan AI
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-mono text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
            {metrics.publishedDocuments}
          </span>
          <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
            dokumen publik
          </span>
        </div>
        <p className="mt-1 mb-0 text-[11px] text-stone-500 dark:text-stone-400">
          {metrics.draftDocuments > 0
            ? `${metrics.draftDocuments} berkas dalam draf (nonaktif)`
            : '100% dokumen aktif dalam RAG'}
        </p>
      </div>

      {/* 3. Vector Chunks Indexed */}
      <div className="rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] p-4 shadow-xs transition hover:shadow-sm dark:border-[#22352f] dark:bg-[#121c19]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">
            Potongan Vektor (Chunks)
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <Layers className="h-4 w-4" aria-hidden="true" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-mono text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            {metrics.totalChunks}
          </span>
          <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
            vektor semantik
          </span>
        </div>
        <p className="mt-1 mb-0 text-[11px] text-stone-500 dark:text-stone-400">
          Ukuran optimal 400 karakter per chunk
        </p>
      </div>

      {/* 4. RAG Index Status & Action */}
      <div className="rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] p-4 shadow-xs transition hover:shadow-sm dark:border-[#22352f] dark:bg-[#121c19]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">
            Status Vektor RAG
          </span>
          {onSyncAll && (
            <button
              type="button"
              onClick={onSyncAll}
              disabled={isSyncing}
              className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold text-blue-600 hover:bg-blue-50 disabled:opacity-50 dark:text-blue-400 dark:hover:bg-blue-950/50"
              title="Perbarui seluruh vektor embedding RAG sekarang"
            >
              <RefreshCw
                className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              <span>Sinkron</span>
            </button>
          )}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
          </span>
          <span className="font-bold text-sm text-stone-900 dark:text-stone-100">
            {isSyncing ? 'Sedang Sinkronisasi...' : 'Terkalibrasi Aktif'}
          </span>
        </div>
        <p className="mt-1 mb-0 text-[11px] text-stone-500 dark:text-stone-400 truncate">
          Pembaruan: {formattedSyncTime}
        </p>
      </div>
    </div>
  )
}
