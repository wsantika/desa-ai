import { Link } from '@tanstack/react-router'
import { Building2, FileText, AlertCircle, Bot, PhoneCall } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)]/90 px-4 backdrop-blur-md">
      <nav className="page-wrap flex items-center justify-between gap-3 py-2.5 sm:py-3.5">
        {/* Brand & Village Identity */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm font-bold text-[var(--sea-ink)] no-underline shadow-[0_2px_10px_rgba(47,106,74,0.06)] sm:px-4 sm:py-2"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-700 text-white shadow-inner dark:bg-emerald-600">
              <Building2 className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="flex flex-col text-left">
              <span className="leading-none tracking-tight">Desa Mandara</span>
              <span className="text-[10px] font-medium text-[var(--sea-ink-soft)]">
                Kuta Selatan, Badung
              </span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-x-1 text-sm font-medium sm:flex">
            <Link
              to="/"
              className="nav-link px-3 py-1.5"
              activeProps={{ className: 'nav-link is-active' }}
              activeOptions={{ exact: true }}
            >
              Beranda
            </Link>
            <Link
              to="/layanan"
              className="nav-link px-3 py-1.5"
              activeProps={{ className: 'nav-link is-active' }}
            >
              <FileText className="mr-1.5 inline-block h-4 w-4" aria-hidden="true" />
              Layanan Surat
            </Link>
            <Link
              to="/pengaduan"
              className="nav-link px-3 py-1.5"
              activeProps={{ className: 'nav-link is-active' }}
            >
              <AlertCircle className="mr-1.5 inline-block h-4 w-4" aria-hidden="true" />
              Pengaduan
            </Link>
            <Link
              to="/asisten"
              className="nav-link px-3 py-1.5"
              activeProps={{ className: 'nav-link is-active' }}
            >
              <Bot className="mr-1.5 inline-block h-4 w-4" aria-hidden="true" />
              Asisten AI
            </Link>
          </div>
        </div>

        {/* Right Action: Village Status & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Hotline / Operational status */}
          <div className="hidden items-center gap-1.5 rounded-full border border-emerald-600/20 bg-emerald-600/10 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 md:inline-flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            <span>Buka: 08.00 - 15.00 WITA</span>
          </div>

          <a
            href="tel:0361123456"
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-[var(--line)] px-2.5 py-1 text-xs font-semibold text-[var(--sea-ink)] transition hover:border-emerald-600/40 hover:bg-black/5 dark:hover:bg-white/5 sm:px-3 sm:py-1.5"
            title="Telepon Hotline Kantor Desa Mandara"
          >
            <PhoneCall className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
            <span className="hidden xs:inline">Darurat</span>
          </a>

          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
