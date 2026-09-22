import {
  BookOpen,
  FileText,
  HelpCircle,
  Building,
  Layers,
  Sparkles,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  RotateCcw,
} from 'lucide-react'
import type {
  KnowledgeCategory,
  KnowledgeDocumentItem,
} from '../../../application/dtos/knowledge-desk.dto.js'

interface KnowledgeDocumentTableProps {
  documents: KnowledgeDocumentItem[]
  onEditDocument: (doc: KnowledgeDocumentItem) => void
  onPreviewDocument: (doc: KnowledgeDocumentItem) => void
  onTogglePublish: (id: string, currentStatus: boolean) => void
  onDeleteDocument: (doc: KnowledgeDocumentItem) => void
  onResetFilter?: () => void
}

export function getCategoryMeta(category: KnowledgeCategory) {
  switch (category) {
    case 'SOP_LAYANAN':
      return {
        label: 'SOP Layanan',
        badgeClass:
          'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60',
        icon: FileText,
      }
    case 'REGULASI':
      return {
        label: 'Regulasi Desa',
        badgeClass:
          'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60',
        icon: BookOpen,
      }
    case 'FAQ':
      return {
        label: 'Tanya Jawab',
        badgeClass:
          'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/60',
        icon: HelpCircle,
      }
    case 'PROFIL_DESA':
    default:
      return {
        label: 'Profil Wilayah',
        badgeClass:
          'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/60',
        icon: Building,
      }
  }
}

export function formatWitaDate(isoString: string): string {
  try {
    return (
      new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Makassar',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date(isoString)) + ' WITA'
    )
  } catch {
    return isoString
  }
}

export function KnowledgeDocumentTable({
  documents,
  onEditDocument,
  onPreviewDocument,
  onTogglePublish,
  onDeleteDocument,
  onResetFilter,
}: KnowledgeDocumentTableProps) {
  if (documents.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] p-12 text-center shadow-xs dark:border-[#22352f] dark:bg-[#121c19]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-secondary,#f4f7f5)] text-stone-500 dark:bg-[#182622] dark:text-stone-400">
          <BookOpen className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="mt-4 mb-1 text-sm font-bold text-stone-900 dark:text-stone-100">
          Tidak Ada Dokumen yang Ditemukan
        </h3>
        <p className="m-0 mx-auto max-w-sm text-xs text-stone-500 dark:text-stone-400">
          Tidak ditemukan dokumen acuan dengan kriteria filter saat ini. Coba
          sesuaikan kata kunci atau tambah dokumen baru.
        </p>
        {onResetFilter && (
          <button
            type="button"
            onClick={onResetFilter}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] px-3 py-1.5 text-xs font-semibold text-stone-800 hover:bg-black/5 dark:border-[#22352f] dark:bg-[#182622] dark:text-stone-200 dark:hover:bg-[#20322d]"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Reset Filter</span>
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden overflow-hidden rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] shadow-xs md:block dark:border-[#22352f] dark:bg-[#121c19]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-800 dark:text-stone-200">
            <thead className="border-b border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f4f7f5)] text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:border-[#22352f] dark:bg-[#182622] dark:text-stone-400">
              <tr>
                <th scope="col" className="py-3 pr-4 pl-5">
                  Dokumen Acuan
                </th>
                <th scope="col" className="px-3 py-3">
                  Kategori
                </th>
                <th scope="col" className="px-3 py-3">
                  Vektor Chunks
                </th>
                <th scope="col" className="px-3 py-3">
                  Status AI RAG
                </th>
                <th scope="col" className="px-3 py-3">
                  Terakhir Diubah
                </th>
                <th scope="col" className="py-3 pr-5 pl-3 text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line,#d5ded9)] dark:divide-[#22352f]">
              {documents.map((doc) => {
                const categoryMeta = getCategoryMeta(doc.category)
                const CategoryIcon = categoryMeta.icon

                return (
                  <tr
                    key={doc.id}
                    className="transition-colors hover:bg-[var(--surface-secondary,#f4f7f5)]/60 dark:hover:bg-[#182622]/60"
                  >
                    {/* Document Title & Reference Link */}
                    <td className="py-3.5 pr-4 pl-5">
                      <div className="font-bold text-stone-900 dark:text-stone-100 max-w-sm line-clamp-1">
                        {doc.title}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400">
                        {doc.sourceUrl ? (
                          <a
                            href={doc.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400"
                            title={doc.sourceUrl}
                          >
                            <span>Tautan Acuan</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span>Dokumen Internal Desa</span>
                        )}
                        <span>•</span>
                        <span>{doc.contentText.length} karakter</span>
                      </div>
                    </td>

                    {/* Category Badge */}
                    <td className="px-3 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-semibold ${categoryMeta.badgeClass}`}
                      >
                        <CategoryIcon
                          className="h-3.5 w-3.5 shrink-0"
                          aria-hidden="true"
                        />
                        <span>{categoryMeta.label}</span>
                      </span>
                    </td>

                    {/* Vector Chunks Badge */}
                    <td className="px-3 py-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 rounded-md bg-[var(--surface-secondary,#f4f7f5)] px-2.5 py-1 font-mono text-[11px] font-semibold text-stone-700 dark:bg-[#182622] dark:text-stone-300">
                        <Layers className="h-3 w-3 text-teal-700 dark:text-teal-400" />
                        <span>{doc.chunkCount} Chunks</span>
                      </span>
                    </td>

                    {/* Publication Status Toggle */}
                    <td className="px-3 py-3.5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onTogglePublish(doc.id, doc.isPublished)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold transition ${
                          doc.isPublished
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-950/80 dark:text-blue-300 dark:hover:bg-blue-900'
                            : 'bg-stone-200 text-stone-700 hover:bg-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700'
                        }`}
                        title="Klik untuk mengubah status aktif/nonaktif pada asisten AI"
                      >
                        <Sparkles
                          className={`h-3 w-3 ${
                            doc.isPublished
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-stone-400'
                          }`}
                        />
                        <span>
                          {doc.isPublished ? 'Digunakan AI' : 'Draf (Nonaktif)'}
                        </span>
                      </button>
                    </td>

                    {/* Updated At */}
                    <td className="px-3 py-3.5 text-[11px] text-stone-500 dark:text-stone-400 whitespace-nowrap">
                      {formatWitaDate(doc.updatedAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 pr-5 pl-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onPreviewDocument(doc)}
                          className="rounded-lg p-1.5 text-stone-600 hover:bg-black/5 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-white/5 dark:hover:text-stone-100"
                          title="Pratinjau isi dokumen & potongan vektor"
                          aria-label={`Pratinjau ${doc.title}`}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditDocument(doc)}
                          className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/50"
                          title="Sunting isi dokumen & markdown"
                          aria-label={`Sunting ${doc.title}`}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteDocument(doc)}
                          className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 hover:text-red-800 dark:text-red-400 dark:hover:bg-red-950/50"
                          title="Hapus dokumen dari knowledge base"
                          aria-label={`Hapus ${doc.title}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards View */}
      <div className="space-y-3 md:hidden">
        {documents.map((doc) => {
          const categoryMeta = getCategoryMeta(doc.category)
          const CategoryIcon = categoryMeta.icon

          return (
            <div
              key={`m-${doc.id}`}
              className="rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] p-4 shadow-xs dark:border-[#22352f] dark:bg-[#121c19]"
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-semibold ${categoryMeta.badgeClass}`}
                >
                  <CategoryIcon
                    className="h-3 w-3 shrink-0"
                    aria-hidden="true"
                  />
                  <span>{categoryMeta.label}</span>
                </span>

                <button
                  type="button"
                  onClick={() => onTogglePublish(doc.id, doc.isPublished)}
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    doc.isPublished
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300'
                      : 'bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                  }`}
                >
                  <Sparkles className="h-2.5 w-2.5" />
                  <span>{doc.isPublished ? 'Aktif' : 'Draf'}</span>
                </button>
              </div>

              <h4 className="mt-2.5 mb-1 text-sm font-bold text-stone-900 dark:text-stone-100 line-clamp-2">
                {doc.title}
              </h4>

              <p className="mt-1 mb-3 text-xs text-stone-600 dark:text-stone-400 line-clamp-2">
                {doc.contentText}
              </p>

              <div className="flex items-center justify-between border-t border-[var(--line,#d5ded9)] pt-3 text-[11px] text-stone-500 dark:border-[#22352f] dark:text-stone-400">
                <span className="inline-flex items-center gap-1 font-mono">
                  <Layers className="h-3 w-3 text-teal-700 dark:text-teal-400" />
                  <span>{doc.chunkCount} Chunks</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onPreviewDocument(doc)}
                    className="rounded-md border border-[var(--line,#d5ded9)] px-2.5 py-1 text-xs font-semibold text-stone-800 hover:bg-black/5 dark:border-[#22352f] dark:text-stone-200"
                  >
                    Pratinjau
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditDocument(doc)}
                    className="rounded-md bg-blue-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-blue-700 dark:bg-blue-600"
                  >
                    Sunting
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteDocument(doc)}
                    className="rounded-md p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50"
                    aria-label={`Hapus ${doc.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
