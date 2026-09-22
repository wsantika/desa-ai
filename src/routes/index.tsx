import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  FileText,
  AlertCircle,
  Bot,
  Search,
  Clock,
  MapPin,
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
    desc: 'Pengantar ke Polsek Gianyar untuk melamar pekerjaan.',
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
    banjar: 'Banjar Kaja',
    title: 'Jadwal Posyandu Balita & Lansia Rutin',
    desc: 'Pelaksanaan posyandu bertempat di Balai Banjar Kaja mulai pukul 08.30 WITA.',
  },
  {
    date: '22 Sep 2026',
    banjar: 'Semua Banjar',
    title: 'Sosialisasi Pemilahan Sampah Berbasis Sumber',
    desc: 'Penyuluhan TPS3R Desa Tegal Tugu terkait jadwal pengangkutan sampah organik & anorganik.',
  },
]

function DesaAIHome() {
  const navigate = useNavigate()
  const [trackingCode, setTrackingCode] = useState('')

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const query = trackingCode.trim().toUpperCase()
    if (!query) return

    if (query.startsWith('REQ')) {
      navigate({ to: '/layanan', search: { track: query } })
    } else {
      navigate({ to: '/pengaduan', search: { track: query } })
    }
  }

  return (
    <div className="page-wrap px-4 py-4 sm:py-8">
      {/* 1. HERO & VILLAGE IDENTITY BANNER */}
      <section className="rise-in relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-10 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/60 dark:text-blue-300">
              <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Pemerintah Desa Tegal Tugu, Kec. Gianyar, Gianyar</span>
            </div>

            <h1 className="display-title mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Portal Layanan Mandiri &amp; Informasi Warga
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
              Urus permohonan surat administrasi, laporkan kendala fasilitas umum,
              dan konsultasikan kebutuhan Anda secara instan bersama Asisten AI Desa.
            </p>

            {/* Quick Status Pill */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 font-semibold text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/60 dark:text-blue-300">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Pelayanan: 08:00 - 15:00 WITA</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <MapPin className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                <span>Wilayah 5 Banjar Dinas &amp; Adat</span>
              </span>
            </div>
          </div>

          {/* Quick AI Highlight Box */}
          <div className="flex shrink-0 flex-col justify-between rounded-2xl border border-blue-200 bg-blue-50/70 p-5 lg:max-w-xs dark:border-blue-900/50 dark:bg-blue-950/40">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-200">
                <Bot className="h-4 w-4 text-blue-700 dark:text-blue-400" aria-hidden="true" />
                <span>Made Mandara (Asisten AI)</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                &ldquo;Om Swastyastu! Butuh info persyaratan surat atau jadwal kantor desa? Tiang siap membantu 24 jam.&rdquo;
              </p>
            </div>
            <Link
              to="/asisten"
              className="mt-4 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Tanya Made Mandara</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. QUICK TRACKING LOOKUP BAR */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-6 dark:border-slate-800 dark:bg-slate-900" aria-labelledby="track-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="track-heading" className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">
              Lacak Status Surat atau Pengaduan
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Masukkan nomor tiket permohonan Anda (contoh: REQ-202609-0001 atau CMP-202609-0001)
            </p>
          </div>

          <form onSubmit={handleTrackSubmit} className="flex flex-1 max-w-md items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                type="text"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                placeholder="Nomor Tiket..."
                aria-label="Nomor Tiket Permohonan atau Laporan"
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pl-10 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="inline-flex min-h-[42px] items-center justify-center rounded-xl bg-blue-700 px-5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 sm:text-sm"
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
            <h2 id="services-heading" className="text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
              Layanan Surat Mandiri Warga
            </h2>
            <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
              Pengajuan dokumen bebas antrean, proses transparan, dan gratis tanpa biaya.
            </p>
          </div>
          <Link
            to="/layanan"
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 sm:text-sm"
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
              className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-blue-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
            >
              <div>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/60 dark:text-blue-400">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400">
                  {srv.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {srv.desc}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
                <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <Clock className="h-3 w-3 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  <span>{srv.sla}</span>
                </span>
                <span className="font-bold text-blue-700 dark:text-blue-400">
                  Ajukan &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. EMERGENCY & COMPLAINT ACTION BANNER */}
      <section className="mt-8 rounded-2xl border border-rose-200 bg-rose-50/40 p-6 shadow-xs sm:p-8 dark:border-rose-900/30 dark:bg-rose-950/20" aria-labelledby="complaint-heading">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-100/70 px-2.5 py-0.5 text-xs font-bold text-rose-800 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300">
              <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Saluran Pengaduan Lingkungan &amp; Fasilitas</span>
            </span>
            <h2 id="complaint-heading" className="mt-3 text-lg font-bold text-slate-900 sm:text-2xl dark:text-white">
              Temukan Lampu Mati, Jalan Berlubang, atau Sampah Liar?
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
              Laporkan langsung melalui HP Anda. Sistem AI Desa Tegal Tugu akan memilah kategori
              dan level urgensi secara otomatis agar segera ditangani tim teknis lapangan.
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
            <Link
              to="/pengaduan"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-rose-700 sm:text-sm"
            >
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              <span>Laporkan Sekarang</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. AGENDA & PENGUMUMAN BANJAR */}
      <section className="mt-8" aria-labelledby="announcements-heading">
        <h2 id="announcements-heading" className="mb-3 text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
              Pengumuman &amp; Agenda Terkini Desa
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {ANNOUNCEMENTS.map((item, idx) => (
            <article key={idx} className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 dark:text-blue-400">
                  <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{item.date}</span>
                </span>
                <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {item.banjar}
                </span>
              </div>
              <h3 className="mt-2 text-sm font-bold text-slate-900 sm:text-base dark:text-white">
                {item.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-400">
                {item.desc}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* 6. CARA KERJA SISTEM TERPADU (CLOSED LOOP) */}
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg dark:text-white">
          Alur Pelayanan Digital Warga yang Transparan
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              1
            </span>
            <h3 className="mt-2 text-xs font-bold text-slate-900 sm:text-sm dark:text-white">
              Warga Mengajukan Berkas
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Isi formulir dari ponsel Anda kapan saja tanpa perlu antre fisik di kantor desa.
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              2
            </span>
            <h3 className="mt-2 text-xs font-bold text-slate-900 sm:text-sm dark:text-white">
              Verifikasi Staf &amp; Triage AI
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              AI mengecek kelengkapan data dan memprioritaskan penanganan dengan cepat.
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              3
            </span>
            <h3 className="mt-2 text-xs font-bold text-slate-900 sm:text-sm dark:text-white">
              Selesai &amp; Lacak Real-time
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Warga menerima status pembaruan langsung serta surat siap unduh / ambil.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
