import { createFileRoute, Link } from '@tanstack/react-router'
import { BookOpen, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react'

export const Route = createFileRoute('/admin/knowledge')({
  component: AdminKnowledgeDeskPage,
})

function AdminKnowledgeDeskPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 dark:text-emerald-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke Ringkasan</span>
            </Link>
          </div>
          <h2 className="mt-2 mb-0 text-xl font-bold tracking-tight text-[var(--sea-ink,#1b2a26)] dark:text-stone-100">
            Pusat Regulasi dan Basis Pengetahuan Desa
          </h2>
          <p className="m-0 text-xs text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
            Manajemen dokumen kebijakan, SOP layanan, dan sinkronisasi embedding RAG asisten AI.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] p-8 text-center dark:border-[#22352f] dark:bg-[#121c19]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
          <BookOpen className="h-6 w-6" />
        </div>
        <h3 className="mt-4 mb-1 text-base font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-100">
          Sistem Ingest Dokumen dan RAG Vektor Siap
        </h3>
        <p className="m-0 mx-auto max-w-md text-xs text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
          Pipeline chunking dan vector similarity telah aktif di backend. Antarmuka input dokumen baru dan penampil regulasi siap diintegrasikan pada tahap berikutnya.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-900 dark:bg-emerald-700"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Lihat Ringkasan Eksekutif</span>
          </Link>
          <Link
            to="/asisten"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--line,#d5ded9)] px-4 py-2 text-xs font-bold text-[var(--sea-ink,#1b2a26)] hover:bg-black/5 dark:border-[#22352f] dark:text-stone-200"
          >
            <span>Uji Asisten AI Warga</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
