import { createFileRoute, Link } from '@tanstack/react-router'
import {
  FileText,
  AlertCircle,
  Bot,
  Search,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Calendar,
  Building2,
} from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/')({ component: DesaAIHome })

const QUICK_SERVICES = [
  {
    id: 'domisili',
    title: 'Surat Keterangan Domisili',
    desc: 'Untuk perbankan, administrasi kependudukan, & pekerjaan.',
    sla: '1 Hari Kerja',
    link: '/layanan',
  },
  {
    id: 'sku',
    title: 'Surat Keterangan Usaha (SKU)',
    desc: 'Untuk pengajuan KUR, izin usaha mikro, & bantuan permodalan.',
    sla: '1 Hari Kerja',
    link: '/layanan',
  },
  {
    id: 'skck',
    title: 'Surat Pengantar SKCK',
    desc: 'Pengantar ke Polsek Kuta Selatan untuk melamar pekerjaan.',
    sla: '1 Hari Kerja',
    link: '/layanan',
  },
  {
    id: 'sktm',
    title: 'Surat Keterangan Tidak Mampu',
    desc: 'Untuk keringanan pengobatan RS & beasiswa pendidikan.',
    sla: '2 Hari Kerja',
    link: '/layanan',
  },
]

const ANNOUNCEMENTS = [
  {
    date: '20 Sep 2026',
    banjar: 'Banjar Tegeh',
    title: 'Jadwal Posyandu Balita & Lansia Rutin',
    desc: 'Pelaksanaan posyandu bertempat di Balai Banjar Tegeh mulai pukul 08.30 WITA.',
  },
  {
    date: '22 Sep 2026',
    banjar: 'Semua Banjar',
    title: 'Sosialisasi Pemilahan Sampah Berbasis Sumber',
    desc: 'Penyuluhan TPS3R Desa Mandara terkait jadwal pengangkutan sampah organik & anorganik.',
  },
]

function DesaAIHome() {
  const [trackingCode, setTrackingCode] = useState('')

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackingCode.trim()) return
    alert(`Mencari riwayat pengajuan tiket: ${trackingCode.toUpperCase()}`)
  }

  return (
    <div className="page-wrap px-4 py-4 sm:py-8">
      {/* 1. HERO & VILLAGE IDENTITY BANNER */}
      <section className="island-shell rise-in relative overflow-hidden rounded-3xl p-6 sm:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-600/10 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
              <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Pemerintah Desa Mandara, Kec. Kuta Selatan, Badung</span>
            </div>

            <h1 className="display-title mt-4 text-2xl font-extrabold tracking-tight text-[var(--sea-ink)] sm:text-4xl">
              Portal Layanan Mandiri &amp; Informasi Warga
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[var(--sea-ink-soft)] sm:text-base">
              Urus permohonan surat administrasi, laporkan kendala fasilitas umum,
              dan konsultasikan kebutuhan Anda secara instan bersama Asisten AI Desa.
            </p>

            {/* Quick Status Pill */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[var(--sea-ink-soft)]">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1 font-semibold text-emerald-700 dark:text-emerald-300">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Pelayanan: 08:00 - 15:00 WITA</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-black/5 px-2.5 py-1 font-medium dark:bg-white/5">
                <MapPin className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                <span>Wilayah 4 Banjar Adat</span>
              </span>
            </div>
          </div>

          {/* Quick AI Highlight Box */}
          <div className="flex shrink-0 flex-col justify-between rounded-2xl border border-emerald-600/30 bg-emerald-600/10 p-5 lg:max-w-xs">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <Bot className="h-4 w-4" aria-hidden="true" />
                <span>Made Mandara (Asisten AI)</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[var(--sea-ink-soft)]">
                &ldquo;Om Swastyastu! Butuh info persyaratan surat atau jadwal kantor desa? Tiang siap membantu 24 jam.&rdquo;
              </p>
            </div>
            <Link
              to="/asisten"
              className="mt-4 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Tanya Made Mandara</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. QUICK TRACKING LOOKUP BAR */}
      <section className="island-shell mt-6 rounded-2xl p-4 sm:p-6" aria-labelledby="track-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="track-heading" className="text-sm font-bold text-[var(--sea-ink)] sm:text-base">
              Lacak Status Surat atau Pengaduan
            </h2>
            <p className="text-xs text-[var(--sea-ink-soft)]">
              Masukkan nomor tiket permohonan Anda (contoh: SRV-2026-0001 atau CMP-2026-0001)
            </p>
          </div>

          <form onSubmit={handleTrackSubmit} className="flex flex-1 max-w-md items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--sea-ink-soft)]" aria-hidden="true" />
              <input
                type="text"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                placeholder="Nomor Tiket..."
                aria-label="Nomor Tiket Permohonan atau Laporan"
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--header-bg)] py-2.5 pl-10 pr-3 text-xs text-[var(--sea-ink)] placeholder-[var(--sea-ink-soft)] focus:border-emerald-600 focus:outline-none sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="inline-flex min-h-[42px] items-center justify-center rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-800 dark:bg-emerald-600 sm:text-sm"
            >
              Lacak
            </button>
          </form>
        </div>
      </section>

      {/* 3. MENU CEPAT LAYANAN SURAT */}
      <section className="mt-8" aria-labelledby="services-heading">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 id="services-heading" className="text-lg font-bold text-[var(--sea-ink)] sm:text-xl">
              Layanan Surat Mandiri Warga
            </h2>
            <p className="text-xs text-[var(--sea-ink-soft)] sm:text-sm">
              Pengajuan dokumen bebas antrean, proses transparan, dan gratis tanpa biaya.
            </p>
          </div>
          <Link
            to="/layanan"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline dark:text-emerald-400 sm:text-sm"
          >
            <span>Semua Layanan</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_SERVICES.map((srv) => (
            <Link
              key={srv.id}
              to={srv.link}
              className="island-shell group flex flex-col justify-between rounded-2xl p-5 transition hover:shadow-md"
            >
              <div>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-[var(--sea-ink)] group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                  {srv.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[var(--sea-ink-soft)]">
                  {srv.desc}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[var(--line)] pt-3 text-xs">
                <span className="flex items-center gap-1 text-[var(--sea-ink-soft)]">
                  <Clock className="h-3 w-3 text-emerald-600" aria-hidden="true" />
                  <span>{srv.sla}</span>
                </span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  Ajukan &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. EMERGENCY & COMPLAINT ACTION BANNER */}
      <section className="island-shell mt-8 rounded-3xl border border-rose-500/20 bg-rose-500/5 p-6 sm:p-8" aria-labelledby="complaint-heading">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-bold text-rose-700 dark:text-rose-300">
              <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Saluran Pengaduan Lingkungan &amp; Fasilitas</span>
            </span>
            <h2 id="complaint-heading" className="mt-3 text-lg font-bold text-[var(--sea-ink)] sm:text-2xl">
              Temukan Lampu Mati, Jalan Berlubang, atau Sampah Liar?
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-[var(--sea-ink-soft)] sm:text-sm">
              Laporkan langsung melalui HP Anda. Sistem AI Desa Mandara akan memilah kategori
              dan level urgensi secara otomatis agar segera ditangani tim teknis lapangan.
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
            <Link
              to="/pengaduan"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-rose-700 sm:text-sm"
            >
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              <span>Laporkan Sekarang</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. AGENDA & PENGUMUMAN BANJAR */}
      <section className="mt-8" aria-labelledby="announcements-heading">
        <h2 id="announcements-heading" className="mb-3 text-lg font-bold text-[var(--sea-ink)] sm:text-xl">
          Pengumuman &amp; Agenda Terkini Desa
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {ANNOUNCEMENTS.map((item, idx) => (
            <article key={idx} className="island-shell flex flex-col rounded-2xl p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{item.date}</span>
                </span>
                <span className="rounded-md border border-[var(--line)] bg-[var(--chip-bg)] px-2 py-0.5 text-[11px] font-medium text-[var(--sea-ink-soft)]">
                  {item.banjar}
                </span>
              </div>
              <h3 className="mt-2 text-sm font-bold text-[var(--sea-ink)] sm:text-base">
                {item.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[var(--sea-ink-soft)] sm:text-sm">
                {item.desc}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* 6. CARA KERJA SISTEM TERPADU (CLOSED LOOP) */}
      <section className="island-shell mt-8 rounded-2xl p-6 sm:p-8">
        <h2 className="text-base font-bold text-[var(--sea-ink)] sm:text-lg">
          Alur Pelayanan Digital Warga yang Transparan
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--line)] bg-black/[0.02] p-4 dark:bg-white/[0.02]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600/15 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              1
            </span>
            <h3 className="mt-2 text-xs font-bold text-[var(--sea-ink)] sm:text-sm">
              Warga Mengajukan Berkas
            </h3>
            <p className="mt-1 text-xs text-[var(--sea-ink-soft)]">
              Isi formulir dari ponsel Anda kapan saja tanpa perlu antre fisik di kantor desa.
            </p>
          </div>
          <div className="rounded-xl border border-[var(--line)] bg-black/[0.02] p-4 dark:bg-white/[0.02]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600/15 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              2
            </span>
            <h3 className="mt-2 text-xs font-bold text-[var(--sea-ink)] sm:text-sm">
              Verifikasi Staf &amp; Triage AI
            </h3>
            <p className="mt-1 text-xs text-[var(--sea-ink-soft)]">
              AI mengecek kelengkapan data dan memprioritaskan penanganan dengan cepat.
            </p>
          </div>
          <div className="rounded-xl border border-[var(--line)] bg-black/[0.02] p-4 dark:bg-white/[0.02]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600/15 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              3
            </span>
            <h3 className="mt-2 text-xs font-bold text-[var(--sea-ink)] sm:text-sm">
              Selesai &amp; Lacak Real-time
            </h3>
            <p className="mt-1 text-xs text-[var(--sea-ink-soft)]">
              Warga menerima status pembaruan langsung serta surat siap unduh / ambil.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
