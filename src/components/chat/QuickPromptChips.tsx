import { Sparkles } from 'lucide-react'

export interface QuickPromptItem {
  id: string
  label: string
  query: string
  category: 'surat' | 'layanan' | 'bansos' | 'pengaduan'
}

export const POPULAR_PROMPTS: QuickPromptItem[] = [
  {
    id: 'p-domisili',
    label: 'Syarat Surat Domisili',
    query: 'Apa saja syarat dan berkas yang diperlukan untuk membuat Surat Keterangan Domisili?',
    category: 'surat',
  },
  {
    id: 'p-jam',
    label: 'Jam Layanan Kantor Desa',
    query: 'Kapan jam buka operasional pelayanan publik di Kantor Desa Tegal Tugu?',
    category: 'layanan',
  },
  {
    id: 'p-bansos',
    label: 'Cara Dapat Bansos & SKTM',
    query: 'Bagaimana alur dan kriteria pengajuan Surat Keterangan Tidak Mampu (SKTM) untuk bansos/beasiswa?',
    category: 'bansos',
  },
  {
    id: 'p-sku',
    label: 'Syarat Izin Usaha (SKU)',
    query: 'Apa persyaratan membuat Surat Keterangan Usaha (SKU) untuk modal UMKM?',
    category: 'surat',
  },
  {
    id: 'p-lapor',
    label: 'Alur Lapor Fasilitas Rusak',
    query: 'Bagaimana cara warga melaporkan lampu jalan yang padam atau jalan rusak di banjar?',
    category: 'pengaduan',
  },
]

interface QuickPromptChipsProps {
  onSelectPrompt: (query: string) => void
  disabled?: boolean
}

export default function QuickPromptChips({ onSelectPrompt, disabled }: QuickPromptChipsProps) {
  return (
    <div className="py-2">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-[var(--sea-ink-soft)]">
        <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
        <span>Pertanyaan Populer Warga:</span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {POPULAR_PROMPTS.map((prompt) => (
          <button
            key={prompt.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectPrompt(prompt.query)}
            className="inline-flex min-h-[40px] shrink-0 items-center rounded-xl border border-[var(--line)] bg-[var(--chip-bg)] px-3.5 py-1.5 text-xs font-medium text-[var(--sea-ink)] shadow-sm transition hover:border-blue-300 hover:bg-blue-50/60 active:scale-95 disabled:opacity-50 dark:hover:border-blue-700 dark:hover:bg-blue-950/40"
          >
            {prompt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
