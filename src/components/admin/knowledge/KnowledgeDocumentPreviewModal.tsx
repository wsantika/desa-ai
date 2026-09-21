import {
  X,
  Layers,
  Edit,
  ExternalLink,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import type { KnowledgeDocumentItem } from '../../../application/dtos/knowledge-desk.dto.js'
import { getCategoryMeta, formatWitaDate } from './KnowledgeDocumentTable.js'
import MarkdownContent from '../../chat/MarkdownContent.js'

interface KnowledgeDocumentPreviewModalProps {
  document: KnowledgeDocumentItem | null
  isOpen: boolean
  onClose: () => void
  onEdit: (doc: KnowledgeDocumentItem) => void
}

export function KnowledgeDocumentPreviewModal({
  document,
  isOpen,
  onClose,
  onEdit,
}: KnowledgeDocumentPreviewModalProps) {
  if (!isOpen || !document) return null

  const categoryMeta = getCategoryMeta(document.category)
  const CategoryIcon = categoryMeta.icon

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
    >
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] shadow-2xl dark:border-[#22352f] dark:bg-[#121c19]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[var(--line,#d5ded9)] p-5 dark:border-[#22352f]">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-semibold ${categoryMeta.badgeClass}`}
              >
                <CategoryIcon className="h-3.5 w-3.5" />
                <span>{categoryMeta.label}</span>
              </span>

              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  document.isPublished
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                    : 'bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                }`}
              >
                {document.isPublished ? (
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertCircle className="h-3 w-3" />
                )}
                <span>
                  {document.isPublished ? 'Aktif dalam RAG' : 'Draf Nonaktif'}
                </span>
              </span>
            </div>

            <h3
              id="preview-modal-title"
              className="m-0 text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100"
            >
              {document.title}
            </h3>

            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 dark:text-stone-400 pt-0.5">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>Diperbarui: {formatWitaDate(document.updatedAt)}</span>
              </span>
              {document.sourceUrl && (
                <a
                  href={document.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-800 hover:underline dark:text-emerald-400"
                >
                  <span>Lihat Sumber Acuan</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-black/5 hover:text-stone-700 dark:hover:bg-white/5 dark:hover:text-stone-200"
            aria-label="Tutup pratinjau dokumen"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 space-y-6 overflow-y-auto p-5 text-xs">
          {/* Document Content rendered in Markdown */}
          <div>
            <h4 className="mb-2 font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 text-[11px]">
              Isi Dokumen Acuan (Markdown)
            </h4>
            <div className="rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f4f7f5)] p-4 text-stone-800 dark:border-[#22352f] dark:bg-[#182622] dark:text-stone-200">
              <MarkdownContent content={document.contentText} />
            </div>
          </div>

          {/* Vector Chunks Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="m-0 font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 text-[11px]">
                Daftar Potongan Vektor ({document.chunkCount} Chunks)
              </h4>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                Semua terindeks dengan dense embedding
              </span>
            </div>

            {document.chunks && document.chunks.length > 0 ? (
              <div className="space-y-2">
                {document.chunks.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] p-3 text-xs dark:border-[#22352f] dark:bg-[#121c19]"
                  >
                    <div className="flex items-center justify-between mb-1.5 text-[11px]">
                      <span className="inline-flex items-center gap-1 font-mono font-bold text-teal-800 dark:text-teal-300">
                        <Layers className="h-3 w-3" />
                        <span>Potongan #{c.chunkIndex}</span>
                      </span>
                      <span className="font-mono text-stone-500 dark:text-stone-400">
                        {c.chunkContent.length} karakter
                      </span>
                    </div>
                    <p className="m-0 font-mono text-[11px] text-stone-700 dark:text-stone-300 leading-relaxed bg-[var(--surface-secondary,#f4f7f5)]/60 dark:bg-[#182622]/60 p-2 rounded">
                      {c.chunkContent}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f4f7f5)] p-4 text-center text-stone-500 dark:border-[#22352f] dark:bg-[#182622] dark:text-stone-400">
                Dokumen ini memiliki {document.chunkCount} potongan tersimpan di
                database.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f4f7f5)] px-5 py-3 dark:border-[#22352f] dark:bg-[#182622]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] px-4 py-2 text-xs font-semibold text-stone-800 hover:bg-black/5 dark:border-[#22352f] dark:bg-[#121c19] dark:text-stone-200"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={() => {
              onClose()
              onEdit(document)
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600"
          >
            <Edit className="h-3.5 w-3.5" />
            <span>Sunting Dokumen</span>
          </button>
        </div>
      </div>
    </div>
  )
}
