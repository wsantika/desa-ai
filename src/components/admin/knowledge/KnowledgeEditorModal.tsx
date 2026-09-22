import { useState, useEffect, useRef } from 'react'
import {
  X,
  FileText,
  Upload,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Table,
  CheckCircle2,
  Sparkles,
  Loader2,
  FileCode,
} from 'lucide-react'
import type {
  KnowledgeCategory,
  KnowledgeDocumentItem,
  SaveKnowledgeDocumentDTO,
} from '../../../application/dtos/knowledge-desk.dto.js'
import MarkdownContent from '../../chat/MarkdownContent.js'

interface KnowledgeEditorModalProps {
  isOpen: boolean
  initialDocument?: KnowledgeDocumentItem | null
  isSaving: boolean
  onClose: () => void
  onSave: (data: SaveKnowledgeDocumentDTO) => Promise<void>
}

type EditorTab = 'WRITE' | 'PREVIEW' | 'SPLIT'

const SOP_TEMPLATE = `# STANDAR OPERASIONAL PROSEDUR (SOP) LAYANAN SURAT
Nomor Dokumen: SOP/05/LAYANAN/2026
Tanggal Berlaku: 2026-01-01

## 1. Deskripsi Layanan
Menjelaskan ketentuan dan persyaratan permohonan surat administrasi warga Desa Tegal Tugu.

## 2. Persyaratan Berkas
- Kartu Tanda Penduduk (KTP) asli / salinan
- Kartu Keluarga (KK) Desa Tegal Tugu
- Pengantar dari Kelian Banjar / Lingkungan setempat

## 3. Alur Pengajuan dan Verifikasi
1. Warga mengajukan permohonan melalui portal mandiri DesaAI.
2. Petugas pelayanan desa melakukan verifikasi berkas dalam waktu 1x24 jam kerja.
3. Setelah disetujui, surat ditandatangani secara elektronik (TTE).

## 4. Biaya dan Estimasi Waktu
- Biaya Retribusi: Bebas Biaya (Rp 0 / Gratis)
- Waktu Penyelesaian: Maksimal 1 hari kerja
`

const REGULASI_TEMPLATE = `# PERATURAN DESA TEGAL TUGU NOMOR 04 TAHUN 2026
TENTANG KETERTIBAN UMUM DAN KETENTERAMAN WILAYAH BANJAR

## BAB I: KETENTUAN UMUM
Pasal 1
Pemerintah Desa Tegal Tugu bersama Satgas Lingkungan Banjar menjaga ketenteraman dan ketertiban umum di seluruh wilayah banjar.

## BAB II: HAK DAN KEWAJIBAN WARGA
Pasal 2
Setiap warga dan pelaku usaha diwajibkan:
1. Memelihara kebersihan selokan dan saluran air di depan pekarangan masing-masing.
2. Membatasi penggunaan pengeras suara setelah pukul 22.00 WITA kecuali untuk kegiatan upacara keagamaan dengan izin Kelian Banjar.

## BAB III: SANKSI DAN PEMBINAAN
Pasal 3
Pelanggaran atas ketentuan ini dikenakan pembinaan musyawarah adat banjar dan teguran tertulis dari Kepala Desa.
`

const FAQ_TEMPLATE = `# TANYA JAWAB UMUM (FAQ) LAYANAN DESA TEGAL TUGU

## Pertanyaan 1: Bagaimana cara melacak status permohonan surat?
Setiap pengajuan surat otomatis menerbitkan kode lacak unik (contoh: REQ-202609-0001). Warga dapat memasukkan kode tersebut pada menu Lacak Surat untuk memantau proses verifikasi perangkat desa.

## Pertanyaan 2: Apakah pengaduan warga ditindaklanjuti secara langsung?
Ya, pengaduan fasilitas rusak atau ketertiban diproses melalui AI Triage ke petugas lapangan dan Kelian Banjar terkait maksimal dalam 24 jam untuk kategori darurat.

## Pertanyaan 3: Kapan jam pelayanan kantor desa buka?
Kantor Desa Tegal Tugu melayani warga pada hari Senin hingga Jumat, pukul 08.00 sampai 15.00 WITA. Layanan daring DesaAI aktif 24 jam.
`

export function KnowledgeEditorModal({
  isOpen,
  initialDocument,
  isSaving,
  onClose,
  onSave,
}: KnowledgeEditorModalProps) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<KnowledgeCategory>('SOP_LAYANAN')
  const [sourceUrl, setSourceUrl] = useState('')
  const [contentText, setContentText] = useState('')
  const [isPublished, setIsPublished] = useState(true)
  const [editorTab, setEditorTab] = useState<EditorTab>('WRITE')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialDocument) {
      setTitle(initialDocument.title)
      setCategory(initialDocument.category)
      setSourceUrl(initialDocument.sourceUrl || '')
      setContentText(initialDocument.contentText)
      setIsPublished(initialDocument.isPublished)
    } else {
      setTitle('')
      setCategory('SOP_LAYANAN')
      setSourceUrl('')
      setContentText('')
      setIsPublished(true)
    }
    setEditorTab('WRITE')
    setErrorMsg(null)
  }, [initialDocument, isOpen])

  if (!isOpen) return null

  const insertMarkdownSyntax = (prefix: string, suffix = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const currentVal = textarea.value
    const selectedText = currentVal.substring(start, end) || 'teks'

    const newVal =
      currentVal.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      currentVal.substring(end)

    setContentText(newVal)

    // Restore selection focus
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length,
      )
    }, 10)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result
      if (typeof result === 'string') {
        setContentText(result)
        if (!title) {
          const autoTitle = file.name
            .replace(/\.[^/.]+$/, '')
            .replace(/[-_]/g, ' ')
          setTitle(autoTitle.charAt(0).toUpperCase() + autoTitle.slice(1))
        }
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleApplyTemplate = (tpl: string) => {
    if (contentText.trim().length > 0) {
      const confirmReplace = window.confirm(
        'Ganti isi editor dengan template acuan resmi desa? Isi yang telah ditulis akan ditimpa.',
      )
      if (!confirmReplace) return
    }
    setContentText(tpl)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (title.trim().length < 3) {
      setErrorMsg('Judul dokumen wajib diisi minimal 3 karakter.')
      return
    }

    if (contentText.trim().length < 10) {
      setErrorMsg(
        'Konten dokumen minimal 10 karakter agar dapat diproses oleh AI.',
      )
      return
    }

    try {
      await onSave({
        id: initialDocument?.id,
        title: title.trim(),
        category,
        sourceUrl: sourceUrl.trim() || null,
        contentText: contentText.trim(),
        isPublished,
      })
      onClose()
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat menyimpan dokumen.',
      )
    }
  }

  const estimatedChunks = Math.max(1, Math.ceil(contentText.length / 400))

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="editor-modal-title"
    >
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] shadow-2xl dark:border-[#22352f] dark:bg-[#121c19]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[var(--line,#d5ded9)] px-5 py-4 dark:border-[#22352f]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3
                id="editor-modal-title"
                className="m-0 text-base font-bold text-stone-900 dark:text-stone-100"
              >
                {initialDocument
                  ? 'Sunting Dokumen Acuan AI'
                  : 'Tambah Dokumen Acuan Baru'}
              </h3>
              <p className="m-0 text-xs text-stone-500 dark:text-stone-400">
                Pembaruan konten otomatis di-chunking dan diindeks ke vektor RAG
                asisten desa.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-black/5 hover:text-stone-700 dark:hover:bg-white/5 dark:hover:text-stone-200"
            aria-label="Tutup form dokumen"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {errorMsg && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                {errorMsg}
              </div>
            )}

            {/* Title, Category & Source Reference Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Title */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="doc-title"
                  className="block text-xs font-bold text-stone-700 dark:text-stone-300"
                >
                  Judul Dokumen Acuan <span className="text-red-500">*</span>
                </label>
                <input
                  id="doc-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Standar Operasional Prosedur Pelayanan Surat Domisili"
                  className="mt-1 w-full rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f4f7f5)] px-3 py-2 text-xs font-semibold text-stone-900 placeholder-stone-400 focus:border-blue-600 focus:bg-white focus:outline-hidden dark:border-[#22352f] dark:bg-[#182622] dark:text-stone-100 dark:placeholder-stone-500 dark:focus:border-blue-500 dark:focus:bg-[#14201d]"
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="doc-category"
                  className="block text-xs font-bold text-stone-700 dark:text-stone-300"
                >
                  Kategori Pengetahuan <span className="text-red-500">*</span>
                </label>
                <select
                  id="doc-category"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as KnowledgeCategory)
                  }
                  className="mt-1 w-full rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f4f7f5)] px-3 py-2 text-xs font-semibold text-stone-800 focus:border-blue-600 focus:outline-hidden dark:border-[#22352f] dark:bg-[#182622] dark:text-stone-200 dark:focus:border-blue-500"
                >
                  <option value="SOP_LAYANAN">SOP Layanan</option>
                  <option value="REGULASI">Regulasi Desa (Perdes/SK)</option>
                  <option value="FAQ">Tanya Jawab (FAQ)</option>
                  <option value="PROFIL_DESA">Profil & Jam Kerja Desa</option>
                </select>
              </div>

              {/* Source URL or Document Number */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="doc-source-url"
                  className="block text-xs font-bold text-stone-700 dark:text-stone-300"
                >
                  Tautan Sumber / Nomor Perdes (Opsional)
                </label>
                <input
                  id="doc-source-url"
                  type="text"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://jdih.desa-tehaltugu.id/perdes-04-2026 atau No. Dokumen"
                  className="mt-1 w-full rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f4f7f5)] px-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:border-blue-600 focus:bg-white focus:outline-hidden dark:border-[#22352f] dark:bg-[#182622] dark:text-stone-100 dark:placeholder-stone-500 dark:focus:border-blue-500 dark:focus:bg-[#14201d]"
                />
              </div>

              {/* Upload Helper */}
              <div className="flex flex-col justify-end">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".md,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f4f7f5)] px-3 py-2 text-xs font-semibold text-stone-800 hover:bg-slate-100 dark:border-[#22352f] dark:bg-[#182622] dark:text-stone-200 dark:hover:bg-[#20322d]"
                  title="Muat teks dari berkas .md atau .txt"
                >
                  <Upload className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Unggah Berkas .md / .txt</span>
                </button>
              </div>
            </div>

            {/* Template Quick Pickers */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                Pilihan Template Cepat:
              </span>
              <button
                type="button"
                onClick={() => handleApplyTemplate(SOP_TEMPLATE)}
                className="inline-flex items-center gap-1 rounded-md border border-[var(--line,#d5ded9)] bg-blue-50/60 px-2 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-100 dark:border-[#22352f] dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900"
              >
                <FileCode className="h-3 w-3" />
                <span>Template SOP</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate(REGULASI_TEMPLATE)}
                className="inline-flex items-center gap-1 rounded-md border border-[var(--line,#d5ded9)] bg-amber-50/50 px-2 py-1 text-[11px] font-semibold text-amber-800 hover:bg-amber-100 dark:border-[#22352f] dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-950"
              >
                <FileCode className="h-3 w-3" />
                <span>Template Regulasi/Perdes</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate(FAQ_TEMPLATE)}
                className="inline-flex items-center gap-1 rounded-md border border-[var(--line,#d5ded9)] bg-sky-50/50 px-2 py-1 text-[11px] font-semibold text-sky-800 hover:bg-sky-100 dark:border-[#22352f] dark:bg-sky-950/40 dark:text-sky-300 dark:hover:bg-sky-950"
              >
                <FileCode className="h-3 w-3" />
                <span>Template FAQ Warga</span>
              </button>
            </div>

            {/* Editor Area with Markdown Toolbar & Tab Switcher */}
            <div className="rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] dark:border-[#22352f] dark:bg-[#121c19] overflow-hidden">
              {/* Toolbar & View Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f4f7f5)] px-3 py-2 dark:border-[#22352f] dark:bg-[#182622]">
                {/* Markdown Syntax Tools */}
                <div className="flex flex-wrap items-center gap-1">
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('**', '**')}
                    className="rounded p-1 text-stone-700 hover:bg-black/5 dark:text-stone-300 dark:hover:bg-white/5"
                    title="Cetak Tebal (Bold)"
                    aria-label="Cetak Tebal"
                  >
                    <Bold className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('*', '*')}
                    className="rounded p-1 text-stone-700 hover:bg-black/5 dark:text-stone-300 dark:hover:bg-white/5"
                    title="Cetak Miring (Italic)"
                    aria-label="Cetak Miring"
                  >
                    <Italic className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('## ')}
                    className="rounded p-1 text-stone-700 hover:bg-black/5 dark:text-stone-300 dark:hover:bg-white/5"
                    title="Subjudul Tingkat 2 (Heading 2)"
                    aria-label="Heading 2"
                  >
                    <Heading2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('### ')}
                    className="rounded p-1 text-stone-700 hover:bg-black/5 dark:text-stone-300 dark:hover:bg-white/5"
                    title="Subjudul Tingkat 3 (Heading 3)"
                    aria-label="Heading 3"
                  >
                    <Heading3 className="h-3.5 w-3.5" />
                  </button>
                  <span className="h-4 w-px bg-stone-300 dark:bg-stone-700 mx-1" />
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('- ')}
                    className="rounded p-1 text-stone-700 hover:bg-black/5 dark:text-stone-300 dark:hover:bg-white/5"
                    title="Daftar Poin (Bullet List)"
                    aria-label="Bullet List"
                  >
                    <List className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('1. ')}
                    className="rounded p-1 text-stone-700 hover:bg-black/5 dark:text-stone-300 dark:hover:bg-white/5"
                    title="Daftar Berurutan (Numbered List)"
                    aria-label="Numbered List"
                  >
                    <ListOrdered className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('> ')}
                    className="rounded p-1 text-stone-700 hover:bg-black/5 dark:text-stone-300 dark:hover:bg-white/5"
                    title="Kutipan (Quote)"
                    aria-label="Kutipan"
                  >
                    <Quote className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('`', '`')}
                    className="rounded p-1 text-stone-700 hover:bg-black/5 dark:text-stone-300 dark:hover:bg-white/5"
                    title="Kode Sebaris (Inline Code)"
                    aria-label="Kode"
                  >
                    <Code className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      insertMarkdownSyntax(
                        '| Kolom 1 | Kolom 2 |\n|---|---|\n| Data 1 | Data 2 |\n',
                      )
                    }
                    className="rounded p-1 text-stone-700 hover:bg-black/5 dark:text-stone-300 dark:hover:bg-white/5"
                    title="Tabel Format"
                    aria-label="Tabel"
                  >
                    <Table className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* View Tabs */}
                <div className="flex items-center gap-1 rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] p-0.5 text-xs font-semibold dark:border-[#22352f] dark:bg-[#121c19]">
                  <button
                    type="button"
                    onClick={() => setEditorTab('WRITE')}
                    className={`rounded-md px-2.5 py-1 transition ${
                      editorTab === 'WRITE'
                        ? 'bg-blue-600 text-white shadow-2xs dark:bg-blue-600'
                        : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
                    }`}
                  >
                    Tulis
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorTab('PREVIEW')}
                    className={`rounded-md px-2.5 py-1 transition ${
                      editorTab === 'PREVIEW'
                        ? 'bg-blue-600 text-white shadow-2xs dark:bg-blue-600'
                        : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
                    }`}
                  >
                    Pratinjau
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorTab('SPLIT')}
                    className={`hidden lg:inline-block rounded-md px-2.5 py-1 transition ${
                      editorTab === 'SPLIT'
                        ? 'bg-blue-600 text-white shadow-2xs dark:bg-blue-600'
                        : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
                    }`}
                  >
                    Berdampingan
                  </button>
                </div>
              </div>

              {/* Editor / Preview Content Body */}
              <div
                className={`${
                  editorTab === 'SPLIT'
                    ? 'grid grid-cols-2 divide-x divide-[var(--line,#d5ded9)] dark:divide-[#22352f]'
                    : ''
                }`}
              >
                {/* Editor Textarea */}
                {(editorTab === 'WRITE' || editorTab === 'SPLIT') && (
                  <textarea
                    ref={textareaRef}
                    required
                    value={contentText}
                    onChange={(e) => setContentText(e.target.value)}
                    placeholder="Tuliskan isi aturan desa, standar pelayanan, atau pedoman dalam format Markdown..."
                    rows={12}
                    className="w-full resize-y border-0 bg-transparent p-4 font-mono text-xs text-stone-900 focus:outline-hidden dark:text-stone-100 leading-relaxed"
                  />
                )}

                {/* Markdown Preview Area */}
                {(editorTab === 'PREVIEW' || editorTab === 'SPLIT') && (
                  <div className="max-h-[360px] overflow-y-auto p-4 text-xs text-stone-800 dark:text-stone-200">
                    {contentText.trim().length > 0 ? (
                      <MarkdownContent content={contentText} />
                    ) : (
                      <p className="italic text-stone-400 dark:text-stone-500">
                        Pratinjau markdown akan muncul di sini saat Anda mulai
                        mengetik.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Editor Status Bar */}
              <div className="flex items-center justify-between border-t border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f4f7f5)]/50 px-4 py-2 text-[11px] text-stone-500 dark:border-[#22352f] dark:bg-[#182622]/50 dark:text-stone-400 font-mono">
                <span>
                  {contentText.length} karakter •{' '}
                  {contentText.trim().split(/\s+/).filter(Boolean).length} kata
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  Estimasi: {estimatedChunks} Potongan Vektor RAG
                </span>
              </div>
            </div>

            {/* Publication AI Flag */}
            <div className="flex items-center gap-2 rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f4f7f5)] p-3 dark:border-[#22352f] dark:bg-[#182622]">
              <input
                id="doc-publish-toggle"
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-4 w-4 rounded-sm text-blue-600 focus:ring-blue-600"
              />
              <label
                htmlFor="doc-publish-toggle"
                className="cursor-pointer text-xs font-semibold text-stone-800 dark:text-stone-200 select-none"
              >
                Aktifkan dokumen ini langsung sebagai sumber jawaban Asisten AI
                Made (RAG Grounding)
              </label>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f4f7f5)] px-5 py-3 dark:border-[#22352f] dark:bg-[#182622]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] px-4 py-2 text-xs font-semibold text-stone-800 hover:bg-slate-100 disabled:opacity-50 dark:border-[#22352f] dark:bg-[#121c19] dark:text-stone-200 dark:hover:bg-[#20322d]"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Menyimpan & Indexing Vektor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Simpan & Sinkronkan Vektor</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
