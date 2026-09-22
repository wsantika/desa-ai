import { Link, useLocation } from '@tanstack/react-router'
import { Building2, FileText, AlertCircle, Bot, PhoneCall, ShieldCheck } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const location = useLocation()
  if (location.pathname.startsWith('/admin')) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 py-2 sm:gap-4 sm:py-3">
        {/* Brand & Village Identity */}
        <div className="flex items-center gap-4 lg:gap-6 shrink-0">
          <Link
            to="/"
            className="inline-flex shrink-0 items-center gap-2.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-900 no-underline shadow-xs hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:px-4 sm:py-2 whitespace-nowrap"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-700 text-white shadow-inner dark:bg-blue-600">
              <Building2 className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="flex flex-col text-left">
              <span className="leading-none tracking-tight font-bold">Desa Tegal Tugu</span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                Kec. Gianyar, Gianyar
              </span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-x-1 text-sm font-medium sm:flex shrink-0">
            <Link
              to="/"
              className="nav-link whitespace-nowrap shrink-0 px-3 py-1.5"
              activeProps={{ className: 'nav-link is-active font-semibold text-blue-700 dark:text-blue-400' }}
              activeOptions={{ exact: true }}
            >
              Beranda
            </Link>
            <Link
              to="/layanan"
              className="nav-link whitespace-nowrap shrink-0 px-3 py-1.5"
              activeProps={{ className: 'nav-link is-active font-semibold text-blue-700 dark:text-blue-400' }}
            >
              <FileText className="mr-1.5 inline-block h-4 w-4 shrink-0" aria-hidden="true" />
              Layanan Surat
            </Link>
            <Link
              to="/pengaduan"
              className="nav-link whitespace-nowrap shrink-0 px-3 py-1.5"
              activeProps={{ className: 'nav-link is-active font-semibold text-blue-700 dark:text-blue-400' }}
            >
              <AlertCircle className="mr-1.5 inline-block h-4 w-4 shrink-0" aria-hidden="true" />
              Pengaduan
            </Link>
            <Link
              to="/asisten"
              className="nav-link whitespace-nowrap shrink-0 px-3 py-1.5"
              activeProps={{ className: 'nav-link is-active font-semibold text-blue-700 dark:text-blue-400' }}
            >
              <Bot className="mr-1.5 inline-block h-4 w-4 shrink-0" aria-hidden="true" />
              Asisten AI
            </Link>
          </div>
        </div>

        {/* Right Action: Village Status & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Operational Hours Badge (shown on wider viewports) */}
          <div className="hidden items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/60 dark:text-blue-300 xl:inline-flex whitespace-nowrap shrink-0">
            <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0" aria-hidden="true" />
            <span>Buka: 08.00 - 15.00 WITA</span>
          </div>

          <a
            href="tel:0361123456"
            className="inline-flex min-h-[38px] shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-xs transition hover:border-blue-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 sm:px-3 sm:py-1.5"
            title="Telepon Hotline Kantor Desa Tegal Tugu"
          >
            <PhoneCall className="h-3.5 w-3.5 text-blue-700 dark:text-blue-400 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Darurat</span>
          </a>

          <Link
            to="/admin"
            className="inline-flex min-h-[38px] shrink-0 items-center gap-1.5 rounded-full border border-blue-700/20 bg-blue-700/10 px-2.5 py-1 text-xs font-semibold text-blue-800 whitespace-nowrap transition hover:bg-blue-700/20 dark:border-blue-500/30 dark:bg-blue-950/40 dark:text-blue-300 sm:px-3 sm:py-1.5"
            title="Buka Meja Kerja Perangkat Desa"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-blue-700 dark:text-blue-400 shrink-0" aria-hidden="true" />
            <span className="hidden md:inline">Meja Kerja Desa</span>
          </Link>

          <div className="shrink-0">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  )
}
