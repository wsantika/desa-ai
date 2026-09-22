import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  FileText,
  AlertCircle,
  Bot,
  Search,
  Clock,
  MapPin,
  ArrowRight,
  Phone,
  Calendar,
  Building2,
  CheckCircle2,
} from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/')({ component: DesaAIHome })

const PRIMARY_ACTIONS = [
  {
    id: 'surat',
    title: 'Layanan Surat Desa',
    desc: 'Urus Surat Keterangan Domisili, Usaha (SKU), Pengantar SKCK, dan SKTM secara mandiri dari HP tanpa antre fisik.',
    link: '/layanan',
    btnText: 'Mulai Buat Surat',
    icon: FileText,
    badge: 'Proses 1 - 2 Hari',
  },
  {
    id: 'pengaduan',
    title: 'Lapor Kendala Warga',
    desc: 'Laporkan lampu jalan padam, jalan rusak, saluran mampet, atau masalah sampah di lingkungan banjar Anda.',
    link: '/pengaduan',
    btnText: 'Kirim Laporan',
    icon: AlertCircle,
    badge: 'Respon Cepat Petugas',
  },
  {
    id: 'asisten',
    title: 'Tanya Asisten Made',
    desc: 'Punya pertanyaan mengenai syarat berkas, jadwal kantor, atau bantuan bansos? Tanyakan langsung ke asisten cerdas desa.',
    link: '/asisten',
    btnText: 'Mulai Tanya Jawab',
    icon: Bot,
    badge: 'Siap Membantu 24 Jam',
  },
]

const ANNOUNCEMENTS = [
  {
    date: '20 Sep 2026',
    banjar: 'Banjar Kaja',
    title: 'Jadwal Posyandu Balita dan Lansia Rutin',
    desc: 'Pelayanan kesehatan berkala bertempat di Balai Banjar Kaja mulai pukul 08.30 WITA.',
  },
  {
    date: '22 Sep 2026',
    banjar: 'Semua Banjar',
    title: 'Sosialisasi Pemilahan Sampah Rumah Tangga',
    desc: 'Penyuluhan TPS3R Desa Tegal Tugu tentang pemilahan sampah organik dan anorganik berbasis sumber.',
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
    <div className="page-wrap px-4 py-6 sm:py-10 max-w-5xl mx-auto space-y-8 sm:space-y-12">
      {/* 1. SAMBUTAN & IDENTITAS DESA (BERSIH & MUDAH DIBACA) */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-10 dark:border-slate-800 dark:bg-slate-900">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/60 dark:text-blue-300">
            <Building2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Pemerintah Desa Tegal Tugu, Gianyar</span>
          </div>

          <h1 className="mt-4 text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Layanan Warga Desa Tegal Tugu
          </h1>
          <p className="mt-3 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Selamat datang di pusat layanan resmi warga. Silakan pilih menu di bawah
            ini untuk membuat surat keterangan, melaporkan kendala lingkungan, atau
            bertanya kepada asisten desa.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
            <div className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span>Jam Buka Kantor: 08:00 - 15:00 WITA</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
              <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span>Wilayah 5 Banjar Adat &amp; Dinas</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TIGA MENU UTAMA WARGA (BESAR, JELAS, & RAMAH LANSIA) */}
      <section aria-labelledby="main-actions-heading">
        <h2 id="main-actions-heading" className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Apa yang Ingin Anda Lakukan Hari Ini?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PRIMARY_ACTIONS.map((action) => {
            const Icon = action.icon
            return (
              <div
                key={action.id}
                className="flex flex-col justify-between rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-xs transition hover:border-blue-600 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
                      <Icon className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {action.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {action.title}
                  </h3>
                  <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    {action.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    to={action.link}
                    className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                  >
                    <span>{action.btnText}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 3. LACAK STATUS BERKAS / ADUAN (SIMPEL & JELAS) */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900" aria-labelledby="track-heading">
        <div className="max-w-2xl">
          <h2 id="track-heading" className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Sudah Pernah Mengajukan Surat atau Aduan?
          </h2>
          <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Ketik nomor tiket yang Anda terima untuk melihat tahapan pengerjaan saat ini.
          </p>

          <form onSubmit={handleTrackSubmit} className="mt-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                type="text"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                placeholder="Contoh: REQ-202609-0001"
                aria-label="Nomor Tiket Permohonan Surat atau Pengaduan"
                className="w-full rounded-xl border-2 border-slate-300 bg-slate-50 py-3 pl-12 pr-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-blue-700 px-7 py-3 text-base font-bold text-white shadow-xs transition hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Cek Status
            </button>
          </form>
        </div>
      </section>

      {/* 4. BANTUAN TELEPON & KANTOR (SANGAT MEMBANTU ORANG TUA / LANSIA) */}
      <section className="rounded-2xl border border-blue-200 bg-blue-50/60 p-6 sm:p-8 dark:border-blue-900/40 dark:bg-blue-950/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-800 dark:bg-blue-900/60 dark:text-blue-200">
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Bantuan Langsung Warga</span>
            </div>
            <h2 className="mt-2 text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Kesulitan Mengisi Formulir dari Ponsel?
            </h2>
            <p className="mt-1 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 max-w-xl">
              Perangkat Desa Tegal Tugu siap mendampingi Anda. Anda dapat menghubungi
              hotline telepon kami atau datang langsung ke kantor desa pada jam pelayanan.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <a
              href="tel:0361123456"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm sm:text-base font-bold text-white shadow-xs transition hover:bg-blue-700"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span>Telepon: (0361) 123456</span>
            </a>
          </div>
        </div>
      </section>

      {/* 5. PENGUMUMAN & AGENDA DESA (RINGKAS & NYAMAN DIPANDANG) */}
      <section aria-labelledby="announcements-heading">
        <div className="mb-4">
          <h2 id="announcements-heading" className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Pengumuman Terkini Desa Tegal Tugu
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Informasi kegiatan dan agenda penting di lingkungan banjar.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {ANNOUNCEMENTS.map((item, idx) => (
            <article
              key={idx}
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-400">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  <span>{item.date}</span>
                </span>
                <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {item.banjar}
                </span>
              </div>
              <h3 className="mt-3 text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {item.desc}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
