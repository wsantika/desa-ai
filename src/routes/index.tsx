import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  FileText,
  AlertCircle,
  Bot,
  Search,
  ArrowRight,
  Sparkles,
  Building2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Phone,
  MapPin,
  FileCheck,
} from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/')({ component: DesaAILandingPage })

const FEATURES = [
  {
    id: 'surat',
    title: 'Surat Menyurat Mandiri',
    subtitle: 'Domisili, Usaha (SKU), SKCK, & SKTM',
    desc: 'Ajukan permohonan surat resmi langsung dari ponsel. Berkas diperiksa secara online oleh staf desa, transparan tanpa biaya dan tanpa perlu antre fisik.',
    icon: FileCheck,
    link: '/layanan',
    linkText: 'Buka Layanan Surat',
    badge: 'Administrasi Kependudukan',
  },
  {
    id: 'pengaduan',
    title: 'Pengaduan Fasilitas Warga',
    subtitle: 'Lampu Padam, Jalan Rusak, & Sampah',
    desc: 'Laporkan kerusakan fasilitas umum atau keluhan lingkungan di banjar Anda. Sistem cerdas otomatis meneruskan laporan ke perangkat desa untuk penanganan cepat.',
    icon: AlertCircle,
    link: '/pengaduan',
    linkText: 'Kirim Laporan Warga',
    badge: 'Respon Cepat Lingkungan',
  },
  {
    id: 'asisten',
    title: 'Asisten Cerdas Made Mandara',
    subtitle: 'Informasi & Panduan Resmi 24 Jam',
    desc: 'Butuh informasi persyaratan dokumen, jadwal kantor, atau agenda posyandu? Tanyakan langsung ke asisten AI desa yang terhubung dengan basis pengetahuan resmi.',
    icon: Bot,
    link: '/asisten',
    linkText: 'Mulai Tanya Asisten',
    badge: 'Didukung AI Desa',
  },
]

const STEPS = [
  {
    step: '01',
    title: 'Pilih Layanan',
    desc: 'Pilih jenis surat keterangan yang dibutuhkan atau kategori kendala lingkungan yang ingin dilaporkan.',
  },
  {
    step: '02',
    title: 'Isi Data & Unggah Foto',
    desc: 'Lengkapi data identitas NIK dan unggah dokumen persyaratan atau foto bukti fasilitas dari HP Anda.',
  },
  {
    step: '03',
    title: 'Pantau Status Real-Time',
    desc: 'Gunakan nomor tiket untuk memantau proses verifikasi perangkat desa hingga dokumen siap diambil atau diunduh.',
  },
]

const BANJARS = [
  { name: 'Banjar Tengah', desc: 'Pusat pemerintahan desa dan balai wantilan' },
  { name: 'Banjar Kaja', desc: 'Kawasan utara desa dan sentra pertanian' },
  { name: 'Banjar Kelod', desc: 'Kawasan selatan desa dan permukiman warga' },
  { name: 'Banjar Pande', desc: 'Sentra kerajinan dan tradisi lokal warga' },
  { name: 'Banjar Kauh', desc: 'Wilayah barat desa dan penghubung antar-dusun' },
]

function DesaAILandingPage() {
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
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION (STANDAR MODERN LANDING PAGE) */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-blue-50/50 via-white to-white py-12 sm:py-20 dark:border-slate-800 dark:from-slate-900/50 dark:via-slate-900 dark:to-slate-900">
        <div className="mx-auto max-w-5xl px-4 text-center">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs sm:text-sm font-semibold text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/60 dark:text-blue-300 shadow-xs">
            <Building2 className="h-4 w-4 text-blue-700 dark:text-blue-400" aria-hidden="true" />
            <span>Pemerintah Desa Tegal Tugu, Kecamatan Gianyar</span>
          </div>

          {/* Headline Utama */}
          <h1 className="mt-6 text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Layanan Administrasi &amp; Pengaduan Warga Desa dalam Satu Pintu
          </h1>

          {/* Subheadline Penjelas */}
          <p className="mx-auto mt-5 max-w-3xl text-base sm:text-xl leading-relaxed text-slate-600 dark:text-slate-300">
            Urus surat resmi dari rumah, laporkan kendala fasilitas lingkungan secara transparan,
            dan dapatkan panduan cerdas 24 jam tanpa perlu antre di kantor desa.
          </p>

          {/* Action CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/layanan"
              className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
            >
              <FileText className="h-5 w-5" aria-hidden="true" />
              <span>Buat Surat Online</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <Link
              to="/pengaduan"
              className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-base font-bold text-slate-800 shadow-xs transition hover:bg-slate-50 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 active:scale-[0.98]"
            >
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span>Lapor Masalah Warga</span>
            </Link>

            <Link
              to="/asisten"
              className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50/80 px-6 py-3.5 text-base font-bold text-blue-700 transition hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300 active:scale-[0.98]"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span>Tanya Asisten AI</span>
            </Link>
          </div>

          {/* Key Value Propositions Bar */}
          <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100/80 text-blue-700 dark:bg-blue-950/80 dark:text-blue-400">
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">100% Gratis</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Tanpa biaya permohonan</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100/80 text-blue-700 dark:bg-blue-950/80 dark:text-blue-400">
                <Clock className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Proses Cepat</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Target selesai 1-2 hari</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100/80 text-blue-700 dark:bg-blue-950/80 dark:text-blue-400">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Resmi &amp; Sah</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Verifikasi perangkat desa</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100/80 text-blue-700 dark:bg-blue-950/80 dark:text-blue-400">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">5 Banjar Dinas</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Terintegrasi menyeluruh</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FITUR UTAMA / VALUE PROPOSITION SECTION */}
      <section className="mx-auto max-w-6xl px-4" aria-labelledby="features-heading">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            <span>Pelayanan Terpadu</span>
          </div>
          <h2 id="features-heading" className="mt-3 text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Tiga Layanan Utama untuk Kebutuhan Warga
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Didesain sederhana agar mudah diakses oleh seluruh lapisan masyarakat Desa Tegal Tugu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {FEATURES.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-xs transition duration-200 hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-blue-700 dark:text-blue-400">
                    {item.subtitle}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    to={item.link}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>{item.linkText}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 3. ALUR KERJA (HOW IT WORKS) */}
      <section className="mx-auto max-w-6xl px-4" aria-labelledby="steps-heading">
        <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-8 sm:p-12 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 id="steps-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Alur Pelayanan Sangat Mudah
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Hanya membutuhkan 3 langkah sederhana untuk menyelesaikan pengajuan Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {STEPS.map((s) => (
              <div
                key={s.step}
                className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="inline-block font-mono text-3xl font-extrabold text-blue-600/30 dark:text-blue-400/30">
                  {s.step}
                </span>
                <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TRACKING LOOKUP WIDGET (LACAK TIKET DENGAN MUDAH) */}
      <section className="mx-auto max-w-4xl px-4" aria-labelledby="tracking-heading">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-center max-w-xl mx-auto">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 mb-3">
              <Search className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 id="tracking-heading" className="text-2xl font-bold text-slate-900 dark:text-white">
              Lacak Pengajuan Surat atau Aduan
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Masukkan nomor tiket permohonan Anda (contoh: REQ-202609-0001 atau CMP-202609-0001)
              untuk melihat posisi berkas secara real-time.
            </p>

            <form onSubmit={handleTrackSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  placeholder="Ketik Nomor Tiket Anda..."
                  aria-label="Nomor Tiket Permohonan Surat atau Pengaduan"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-blue-600 px-8 py-3 text-base font-bold text-white shadow-xs transition hover:bg-blue-700 active:scale-[0.98]"
              >
                Lacak Status
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 5. WILAYAH LAYANAN 5 BANJAR (COMMUNITY TRUST) */}
      <section className="mx-auto max-w-6xl px-4" aria-labelledby="banjar-heading">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 id="banjar-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Melayani Seluruh Warga di 5 Wilayah Banjar
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Platform Desa Tegal Tugu terintegrasi dengan data kependudukan dan perangkat wilayah masing-masing banjar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {BANJARS.map((b) => (
            <div
              key={b.name}
              className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 mb-2">
                <MapPin className="h-4 w-4" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{b.name}</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION (FOOTER BANNER) */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="rounded-3xl bg-blue-700 p-8 sm:p-12 text-white shadow-lg text-center dark:bg-blue-800">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Mulai Urus Kebutuhan Desa Anda Hari Ini
            </h2>
            <p className="mt-3 text-base sm:text-lg text-blue-100 leading-relaxed">
              Manfaatkan kemudahan administrasi digital resmi dari Pemerintah Desa Tegal Tugu.
              Cepat, transparan, dan tanpa dipungut biaya apa pun.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/layanan"
                className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white px-7 py-3 text-base font-bold text-blue-800 shadow-sm transition hover:bg-blue-50 active:scale-[0.98]"
              >
                <span>Ajukan Surat Sekarang</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>

              <a
                href="tel:0361123456"
                className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-blue-400/60 bg-blue-800/40 px-6 py-3 text-base font-bold text-white transition hover:bg-blue-800/80 active:scale-[0.98]"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                <span>Hotline Kantor: (0361) 123456</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
