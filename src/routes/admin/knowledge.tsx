import { useState, useMemo } from 'react'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { ArrowLeft, Plus, Sparkles, RefreshCw, BookOpen } from 'lucide-react'
import {
  getAdminKnowledgeDeskDataServerFn,
  saveKnowledgeDocumentServerFn,
  toggleKnowledgePublishServerFn,
  deleteKnowledgeDocumentServerFn,
  reindexKnowledgeDocumentsServerFn,
  testKnowledgeRetrievalServerFn,
} from '../../application/server-functions/admin-knowledge.fn.js'
import type {
  KnowledgeDeskData,
  KnowledgeDocumentItem,
  KnowledgeFilterDTO,
  SaveKnowledgeDocumentDTO,
  KnowledgeCategory,
} from '../../application/dtos/knowledge-desk.dto.js'
import { KnowledgeStatCards } from '../../components/admin/knowledge/KnowledgeStatCards.js'
import { KnowledgeFilterToolbar } from '../../components/admin/knowledge/KnowledgeFilterToolbar.js'
import { KnowledgeDocumentTable } from '../../components/admin/knowledge/KnowledgeDocumentTable.js'
import { KnowledgeEditorModal } from '../../components/admin/knowledge/KnowledgeEditorModal.js'
import { KnowledgeDocumentPreviewModal } from '../../components/admin/knowledge/KnowledgeDocumentPreviewModal.js'
import { KnowledgeTestPlaygroundModal } from '../../components/admin/knowledge/KnowledgeTestPlaygroundModal.js'

export const Route = createFileRoute('/admin/knowledge')({
  loader: async (): Promise<KnowledgeDeskData> => {
    return getAdminKnowledgeDeskDataServerFn()
  },
  component: AdminKnowledgeDeskPage,
})

const defaultFilter: KnowledgeFilterDTO = {
  category: 'ALL',
  status: 'ALL',
  search: '',
}

function AdminKnowledgeDeskPage() {
  const initialData = Route.useLoaderData()
  const router = useRouter()

  const [filter, setFilter] = useState<KnowledgeFilterDTO>(defaultFilter)
  const [editingDoc, setEditingDoc] = useState<KnowledgeDocumentItem | null>(
    null,
  )
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [previewDoc, setPreviewDoc] = useState<KnowledgeDocumentItem | null>(
    null,
  )
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isTestModalOpen, setIsTestModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSyncingAll, setIsSyncingAll] = useState(false)
  const [alertMessage, setAlertMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  // Reactive client-side filtering over loader data for snappy UX
  const filteredDocuments = useMemo(() => {
    return initialData.documents.filter((doc) => {
      // 1. Category Filter
      if (filter.category !== 'ALL' && doc.category !== filter.category) {
        return false
      }

      // 2. Status Filter
      if (filter.status === 'PUBLISHED' && !doc.isPublished) {
        return false
      }
      if (filter.status === 'DRAFT' && doc.isPublished) {
        return false
      }

      // 3. Search Query
      if (filter.search.trim().length > 0) {
        const q = filter.search.toLowerCase().trim()
        const matchTitle = doc.title.toLowerCase().includes(q)
        const matchContent = doc.contentText.toLowerCase().includes(q)
        const matchSource = doc.sourceUrl?.toLowerCase().includes(q) || false
        if (!matchTitle && !matchContent && !matchSource) {
          return false
        }
      }

      return true
    })
  }, [initialData.documents, filter])

  const handleFilterChange = (updates: Partial<KnowledgeFilterDTO>) => {
    setFilter((prev) => ({ ...prev, ...updates }))
  }

  const handleResetFilter = () => {
    setFilter(defaultFilter)
  }

  const handleOpenCreate = () => {
    setEditingDoc(null)
    setIsEditorOpen(true)
  }

  const handleOpenEdit = (doc: KnowledgeDocumentItem) => {
    setEditingDoc(doc)
    setIsEditorOpen(true)
  }

  const handleOpenPreview = (doc: KnowledgeDocumentItem) => {
    setPreviewDoc(doc)
    setIsPreviewOpen(true)
  }

  const handleSaveDocument = async (formData: SaveKnowledgeDocumentDTO) => {
    try {
      setIsSaving(true)
      await saveKnowledgeDocumentServerFn({ data: formData })
      await router.invalidate()
      setAlertMessage({
        type: 'success',
        text: `Dokumen "${formData.title}" berhasil disimpan dan diindeks ke dalam vektor RAG.`,
      })
      setTimeout(() => setAlertMessage(null), 5000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await toggleKnowledgePublishServerFn({
        data: { id, isPublished: !currentStatus },
      })
      await router.invalidate()
    } catch (err) {
      setAlertMessage({
        type: 'error',
        text:
          err instanceof Error ? err.message : 'Gagal mengubah status dokumen.',
      })
    }
  }

  const handleDeleteDocument = async (doc: KnowledgeDocumentItem) => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus dokumen "${doc.title}" beserta seluruh potongan vektornya? Tindakan ini tidak dapat dibatalkan.`,
    )
    if (!confirmed) return

    try {
      await deleteKnowledgeDocumentServerFn({ data: { id: doc.id } })
      await router.invalidate()
      setAlertMessage({
        type: 'success',
        text: `Dokumen "${doc.title}" berhasil dihapus dari knowledge base.`,
      })
      setTimeout(() => setAlertMessage(null), 5000)
    } catch (err) {
      setAlertMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Gagal menghapus dokumen.',
      })
    }
  }

  const handleSyncAll = async () => {
    try {
      setIsSyncingAll(true)
      const res = await reindexKnowledgeDocumentsServerFn()
      await router.invalidate()
      setAlertMessage({
        type: 'success',
        text: `Sinkronisasi selesai: ${res.reindexedDocuments} dokumen dan ${res.totalChunks} potongan vektor berhasil dikalibrasi ulang.`,
      })
      setTimeout(() => setAlertMessage(null), 5000)
    } catch (err) {
      setAlertMessage({
        type: 'error',
        text:
          err instanceof Error
            ? err.message
            : 'Gagal melakukan sinkronisasi vektor.',
      })
    } finally {
      setIsSyncingAll(false)
    }
  }

  const handleRunTestQuery = async (query: string, cat?: KnowledgeCategory) => {
    return testKnowledgeRetrievalServerFn({
      data: {
        query,
        category: cat,
        topK: 3,
      },
    })
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 dark:text-emerald-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke Ringkasan Eksekutif</span>
            </Link>
          </div>

          <div className="mt-1 flex items-center gap-2">
            <h2 className="m-0 text-xl font-bold tracking-tight text-[var(--sea-ink,#1b2a26)] dark:text-stone-100">
              Pusat Regulasi & Basis Pengetahuan AI Desa
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
              <BookOpen className="h-3 w-3" />
              <span>RAG Knowledge Base</span>
            </span>
          </div>

          <p className="mt-1 mb-0 text-xs text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
            Manajemen dokumen kebijakan, SOP layanan desa, dan sinkronisasi
            embedding vektor asisten AI Made Tegal Tugu.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsTestModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-700/20 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60"
            title="Uji coba jawaban AI secara langsung berdasarkan dokumen terbaru"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>Uji Coba Asisten AI</span>
          </button>

          <button
            type="button"
            onClick={handleSyncAll}
            disabled={isSyncingAll}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] px-3 py-2 text-xs font-semibold text-stone-800 hover:bg-black/5 disabled:opacity-50 dark:border-[#22352f] dark:bg-[#182622] dark:text-stone-200"
            title="Sinkronisasikan seluruh vektor dokumen ke database"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isSyncingAll ? 'animate-spin' : ''}`}
            />
            <span>{isSyncingAll ? 'Sinkronisasi...' : 'Sinkronkan Semua'}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Dokumen Baru</span>
          </button>
        </div>
      </div>

      {/* Alert Banner if any */}
      {alertMessage && (
        <div
          className={`flex items-center justify-between gap-3 rounded-xl p-3.5 text-xs font-semibold border ${
            alertMessage.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200'
              : 'border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200'
          }`}
          role="alert"
        >
          <span>{alertMessage.text}</span>
          <button
            type="button"
            onClick={() => setAlertMessage(null)}
            className="rounded p-1 hover:bg-black/10 dark:hover:bg-white/10"
            aria-label="Tutup notifikasi"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <KnowledgeStatCards
        metrics={initialData.metrics}
        isSyncing={isSyncingAll}
        onSyncAll={handleSyncAll}
      />

      {/* Filter Toolbar */}
      <KnowledgeFilterToolbar
        filter={filter}
        categoryCounts={initialData.metrics.categoryCounts}
        totalDocuments={initialData.metrics.totalDocuments}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilter}
      />

      {/* Documents Table / Cards */}
      <KnowledgeDocumentTable
        documents={filteredDocuments}
        onEditDocument={handleOpenEdit}
        onPreviewDocument={handleOpenPreview}
        onTogglePublish={handleTogglePublish}
        onDeleteDocument={handleDeleteDocument}
        onResetFilter={handleResetFilter}
      />

      {/* Create / Edit Document Modal */}
      <KnowledgeEditorModal
        isOpen={isEditorOpen}
        initialDocument={editingDoc}
        isSaving={isSaving}
        onClose={() => {
          setIsEditorOpen(false)
          setEditingDoc(null)
        }}
        onSave={handleSaveDocument}
      />

      {/* Preview Document & Chunks Modal */}
      <KnowledgeDocumentPreviewModal
        isOpen={isPreviewOpen}
        document={previewDoc}
        onClose={() => {
          setIsPreviewOpen(false)
          setPreviewDoc(null)
        }}
        onEdit={(doc) => {
          setIsPreviewOpen(false)
          setPreviewDoc(null)
          handleOpenEdit(doc)
        }}
      />

      {/* Interactive AI Retrieval Testing Playground */}
      <KnowledgeTestPlaygroundModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        onRunTest={handleRunTestQuery}
      />
    </div>
  )
}
