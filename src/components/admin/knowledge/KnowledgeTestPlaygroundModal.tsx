import { useState } from 'react'
import {
  X,
  Sparkles,
  Search,
  Bot,
  Layers,
  CheckCircle2,
  Loader2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react'
import type {
  KnowledgeCategory,
  TestKnowledgeQueryResult,
} from '../../../application/dtos/knowledge-desk.dto.js'
import MarkdownContent from '../../chat/MarkdownContent.js'

interface KnowledgeTestPlaygroundModalProps {
  isOpen: boolean
  onClose: () => void
  onRunTest: (
    query: string,
    category?: KnowledgeCategory,
  ) => Promise<TestKnowledgeQueryResult>
}

const SAMPLE_QUERIES = [
  'Berapa lama waktu penyelesaian surat domisili?',
  'Apa saja syarat mengurus surat di desa?',
  'Bagaimana aturan jadwal sampah dan sanksinya?',
  'Kapan jam buka kantor desa melayani warga?',
]

export function KnowledgeTestPlaygroundModal({
  isOpen,
  onClose,
  onRunTest,
}: KnowledgeTestPlaygroundModalProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'ALL' | KnowledgeCategory>('ALL')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<TestKnowledgeQueryResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!isOpen) return null

  const handleExecuteTest = async (testQuery?: string) => {
    const q = (testQuery || query).trim()
    if (q.length < 2) {
      setErrorMsg('Pertanyaan uji coba minimal 2 karakter.')
      return
    }

    try {
      setIsLoading(true)
      setErrorMsg(null)
      const res = await onRunTest(q, category === 'ALL' ? undefined : category)
      setResult(res)
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Terjadi kegagalan saat menguji retrieval RAG.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleChipClick = (sample: string) => {
    setQuery(sample)
    handleExecuteTest(sample)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="test-modal-title"
    >
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col rounded-2xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] shadow-2xl dark:border-[#22352f] dark:bg-[#121c19]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--line,#d5ded9)] px-5 py-4 dark:border-[#22352f]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3
                id="test-modal-title"
                className="m-0 text-base font-bold text-stone-900 dark:text-stone-100"
              >
                Uji Coba Grounding Asisten AI Desa
              </h3>
              <p className="m-0 text-xs text-stone-500 dark:text-stone-400">
                Uji apakah perubahan SOP atau Perdes terbaru langsung dijawab
                tepat oleh model AI.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-slate-100 hover:text-stone-700 dark:hover:bg-white/5 dark:hover:text-stone-200"
            aria-label="Tutup uji coba"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form & Playground Body */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5 text-xs">
          {errorMsg && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
              {errorMsg}
            </div>
          )}

          {/* Prompt Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleExecuteTest()
            }}
            className="space-y-3"
          >
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search
                  className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-stone-500"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ketik pertanyaan warga untuk menguji grounding dokumen..."
                  className="w-full rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f4f7f5)] py-2 pr-3 pl-9 text-xs text-stone-900 placeholder-stone-400 focus:border-blue-600 focus:bg-white focus:outline-hidden dark:border-[#22352f] dark:bg-[#182622] dark:text-stone-100 dark:placeholder-stone-500 dark:focus:border-blue-500 dark:focus:bg-[#14201d]"
                />
              </div>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as 'ALL' | KnowledgeCategory)
                }
                className="rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f4f7f5)] px-3 py-2 text-xs font-semibold text-stone-800 focus:border-blue-600 focus:outline-hidden dark:border-[#22352f] dark:bg-[#182622] dark:text-stone-200 dark:focus:border-blue-500"
              >
                <option value="ALL">Semua Kategori</option>
                <option value="SOP_LAYANAN">SOP Layanan</option>
                <option value="REGULASI">Regulasi Desa</option>
                <option value="FAQ">Tanya Jawab</option>
                <option value="PROFIL_DESA">Profil Desa</option>
              </select>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Menguji...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Uji Jawaban</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Sample Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                Uji cepat:
              </span>
              {SAMPLE_QUERIES.map((sq, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChipClick(sq)}
                  className="rounded-md border border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f4f7f5)] px-2 py-0.5 text-[11px] text-stone-700 hover:border-blue-500 hover:text-blue-600 dark:border-[#22352f] dark:bg-[#182622] dark:text-stone-300 dark:hover:border-blue-400 dark:hover:text-blue-300 transition"
                >
                  {sq}
                </button>
              ))}
            </div>
          </form>

          {/* Test Results Display */}
          {result && (
            <div className="space-y-4 pt-2 border-t border-[var(--line,#d5ded9)] dark:border-[#22352f]">
              {/* 1. AI Grounded Answer Preview */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/60 dark:bg-blue-950/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white dark:bg-blue-600">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-bold text-xs text-blue-950 dark:text-blue-200">
                    Simulasi Jawaban Asisten AI Made
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Grounded ({result.groundedSourceCount} Sumber)</span>
                  </span>
                </div>
                <div className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed pl-8">
                  <MarkdownContent content={result.aiAnswer} />
                </div>
              </div>

              {/* 2. Retrieved Chunks Inspector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="m-0 font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 text-[11px]">
                    Potongan Vektor Terambil ({result.retrievedChunks.length}{' '}
                    Chunks)
                  </h4>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                    Diurutkan berdasarkan skor kemiripan kosinus
                  </span>
                </div>

                {result.retrievedChunks.length > 0 ? (
                  <div className="space-y-2">
                    {result.retrievedChunks.map((rc, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f4f7f5)] p-3 dark:border-[#22352f] dark:bg-[#182622]"
                      >
                        <div className="flex items-center justify-between mb-1 text-[11px]">
                          <span className="font-bold text-stone-900 dark:text-stone-100 truncate pr-2">
                            {rc.documentTitle} (Chunk #{rc.chunkIndex})
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300 shrink-0">
                            <Layers className="h-3 w-3" />
                            <span>
                              Kecocokan: {Math.round(rc.similarityScore * 100)}%
                            </span>
                          </span>
                        </div>
                        <p className="m-0 font-mono text-[11px] text-stone-700 dark:text-stone-300 leading-relaxed bg-white/70 dark:bg-black/20 p-2 rounded">
                          {rc.chunkContent}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>
                        Tidak ada potongan vektor yang memenuhi ambang batas
                        kemiripan. Model AI akan menjawab menggunakan
                        pengetahuan umum atau merujuk ke kantor desa.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f4f7f5)] px-5 py-3 dark:border-[#22352f] dark:bg-[#182622]">
          <span className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>
              Kriteria Pengujian: Verifikasi bahwa jawaban AI sesuai dengan
              konten terbaru yang disimpan.
            </span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] px-4 py-2 text-xs font-semibold text-stone-800 hover:bg-black/5 dark:border-[#22352f] dark:bg-[#121c19] dark:text-stone-200"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
