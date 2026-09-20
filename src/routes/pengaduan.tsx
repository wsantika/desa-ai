import { createFileRoute, Link } from '@tanstack/react-router'
import { AlertCircle, Search, ShieldAlert, Wrench, Lightbulb, Trash2, Shield } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/pengaduan')({
  component: PengaduanHubPage,
})

const CATEGORIES = [
  {
    icon: Wrench,
    title: 'Infrastruktur Jalan & Fasilitas',
    desc: 'Jalan rusak berlubang, jembatan banjar, balai banjar, atau saluran drainase tersumbat.',
  },
  {
    icon: Lightbulb,
    title: 'Penerangan Lampu Jalan (LPJU)',
    desc: 'Lampu jalan mati, tiang rapuh berbahaya, atau kabel kendor di pemukiman.',
  },
  {
    icon: Trash2,
    title: 'Kebersihan & Sampah Liar',
    desc: 'Tumpukan sampah liar, jadwal truk angkut terlambat, atau pencemaran sungai.',
  },
  {
    icon: Shield,
    title: 'Keamanan & Ketertiban Umum',
    desc: 'Hewan liar meresahkan, gangguan kebisingan, atau potensi sengketa ketertiban banjar.',
  },
]

function PengaduanHubPage() {
  const [ticketQuery, setTicketQuery] = useState('')

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketQuery.trim()) return
    alert(`Mencari status tiket pengaduan: ${ticketQuery.toUpperCase()}`)
  }

  return (
    <div className="page-wrap px-4 py-6 sm:py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-700 dark:text-rose-300">
          <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Pengaduan Terpadu Desa Mandara</span>
        </div>
        <h1 className="display-title mt-3 text-2xl font-extrabold tracking-tight text-[var(--sea-ink)] sm:text-4xl">
          Layanan Pengaduan &amp; Aspirasi Warga
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--sea-ink-soft)] sm:text-base">
          Laporkan kendala fasilitas umum atau aspirasi Anda di Desa Mandara.
          Setiap laporan diprioritaskan otomatis dengan AI dan ditindaklanjuti secara transparan oleh perangkat desa.
        </p>
      </div>

      {/* Quick Tracking Card */}
      <div className="island-shell mb-10 rounded-2xl p-5 sm:p-7">
        <h2 className="text-base font-bold text-[var(--sea-ink)] sm:text-lg">
          Lacak Status Pengaduan Anda
        </h2>
        <p className="mt-1 text-xs text-[var(--sea-ink-soft)] sm:text-sm">
          Punya kode tiket pengaduan? Masukkan di bawah ini untuk melihat progres penanganan langsung oleh tim desa.
        </p>

        <form onSubmit={handleTrack} className="mt-4 flex flex-col gap-2.5 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--sea-ink-soft)]" aria-hidden="true" />
            <input
              type="text"
              value={ticketQuery}
              onChange={(e) => setTicketQuery(e.target.value)}
              placeholder="Contoh: CMP-2026-0001"
              aria-label="Nomor Tiket Pengaduan"
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--header-bg)] py-2.5 pl-10 pr-4 text-sm text-[var(--sea-ink)] placeholder-[var(--sea-ink-soft)] focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>
          <button
            type="submit"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-emerald-700 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 sm:text-sm"
          >
            Lacak Status
          </button>
        </form>
      </div>

      {/* New Complaint CTA Banner */}
      <div className="island-shell mb-10 flex flex-col items-start justify-between gap-5 rounded-2xl border-2 border-emerald-600/30 bg-emerald-600/5 p-6 sm:flex-row sm:items-center">
        <div>
          <span className="rounded-md bg-emerald-600/10 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            Respon Cepat 24 Jam
          </span>
          <h2 className="mt-2 text-xl font-bold text-[var(--sea-ink)]">
            Ada Fasilitas Rusak di Lingkungan Anda?
          </h2>
          <p className="mt-1 text-xs text-[var(--sea-ink-soft)] sm:text-sm">
            Ambil foto, ceritakan kendalanya, dan kirim sekarang. AI akan otomatis menentukan kategori dan tingkat kedaruratan.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
        >
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          <span>Buat Pengaduan Baru</span>
        </Link>
      </div>

      {/* Category Grid */}
      <h2 className="mb-4 text-lg font-bold text-[var(--sea-ink)]">
        Kategori Bidang Pengaduan Warga
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((cat, idx) => {
          const Icon = cat.icon
          return (
            <div
              key={idx}
              className="island-shell flex flex-col rounded-2xl p-5"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold text-[var(--sea-ink)]">
                {cat.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--sea-ink-soft)]">
                {cat.desc}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
