import { useState, useEffect } from 'react'
import { Menu, Cpu, Bell, Clock, AlertTriangle } from 'lucide-react'

export interface AdminHeaderProps {
  title?: string
  subtitle?: string
  urgentCount?: number
  onToggleMobileSidebar?: () => void
}

export default function AdminHeader({
  title = 'Meja Kerja Terpadu',
  subtitle = 'Pemerintah Desa Mandara',
  urgentCount = 0,
  onToggleMobileSidebar,
}: AdminHeaderProps) {
  const [witaTime, setWitaTime] = useState<string>('')

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      const formatted = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Makassar',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(now)
      setWitaTime(formatted)
    }

    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)]/90 px-4 py-3 backdrop-blur-md dark:border-[#22352f] dark:bg-[#121c19]/90 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu Button & Breadcrumbs */}
        <div className="flex items-center gap-3">
          {onToggleMobileSidebar && (
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line,#d5ded9)] text-[var(--sea-ink,#1b2a26)] hover:bg-black/5 dark:border-[#22352f] dark:text-stone-200 dark:hover:bg-white/5 md:hidden"
              aria-label="Buka menu navigasi meja kerja"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div>
            <h1 className="m-0 text-base sm:text-lg font-bold tracking-tight text-[var(--sea-ink,#1b2a26)] dark:text-stone-100">
              {title}
            </h1>
            <p className="m-0 text-xs text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right Side: Status Badges & Live Information */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Urgent Alert Banner Badge */}
          {urgentCount > 0 && (
            <div
              className="inline-flex items-center gap-1.5 rounded-full border border-red-600/30 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 dark:bg-red-950/40 dark:text-red-300"
              role="status"
              aria-live="polite"
            >
              <AlertTriangle className="h-3.5 w-3.5 text-red-600 dark:text-red-400 shrink-0" aria-hidden="true" />
              <span>{urgentCount} Laporan Kritis</span>
            </div>
          )}

          {/* AI Intelligence Status Pill */}
          <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-600/20 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <Cpu className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>AI Triage Aktif</span>
          </div>

          {/* Live WITA Clock */}
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--line,#d5ded9)] px-2.5 py-1 text-xs font-medium text-[var(--sea-ink-soft,#576c64)] dark:border-[#22352f] dark:text-stone-300">
            <Clock className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" aria-hidden="true" />
            <span className="font-mono">{witaTime || '08.00.00'} WITA</span>
          </div>

          {/* Notification Button */}
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line,#d5ded9)] text-[var(--sea-ink,#1b2a26)] hover:bg-black/5 dark:border-[#22352f] dark:text-stone-200 dark:hover:bg-white/5"
            aria-label="Pusat notifikasi meja kerja"
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
            {urgentCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
