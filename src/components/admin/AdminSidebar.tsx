import { Link, useLocation } from '@tanstack/react-router'
import {
  LayoutDashboard,
  AlertTriangle,
  FileCheck,
  BarChart3,
  BookOpen,
  Building2,
  ExternalLink,
  X,
} from 'lucide-react'
import ThemeToggle from '../ThemeToggle'

export interface AdminSidebarProps {
  urgentComplaintsCount?: number
  pendingRequestsCount?: number
  isOpenMobile?: boolean
  onCloseMobile?: () => void
}

interface NavItemDef {
  to: string
  label: string
  icon: typeof LayoutDashboard
  exact?: boolean
  badgeCount?: number
  badgeTone?: 'emergency' | 'warning' | 'neutral'
}

export default function AdminSidebar({
  urgentComplaintsCount = 0,
  pendingRequestsCount = 0,
  isOpenMobile = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const location = useLocation()
  const currentPath = location.pathname

  const navItems: NavItemDef[] = [
    {
      to: '/admin',
      label: 'Ringkasan Eksekutif',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      to: '/admin/pengaduan',
      label: 'Meja Triage Pengaduan',
      icon: AlertTriangle,
      badgeCount: urgentComplaintsCount,
      badgeTone: 'emergency',
    },
    {
      to: '/admin/layanan',
      label: 'Verifikasi Surat Layanan',
      icon: FileCheck,
      badgeCount: pendingRequestsCount,
      badgeTone: 'warning',
    },
    {
      to: '/admin/analitik',
      label: 'Analitik dan Sebaran Banjar',
      icon: BarChart3,
    },
    {
      to: '/admin/knowledge',
      label: 'Regulasi dan Knowledge Base',
      icon: BookOpen,
    },
  ]

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-[var(--surface-primary,#ffffff)] text-[var(--sea-ink,#1b2a26)] border-r border-[var(--line,#d5ded9)] dark:bg-[#121c19] dark:border-[#22352f]">
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between border-b border-[var(--line,#d5ded9)] px-5 py-4 dark:border-[#22352f]">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-800 text-white shadow-sm dark:bg-emerald-600">
              <Building2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-emerald-950 dark:text-emerald-100">
                  DesaAI Workspace
                </span>
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Gov
                </span>
              </div>
              <p className="m-0 text-xs font-medium text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                Pemerintah Desa Mandara
              </p>
            </div>
          </div>

          {/* Close button on mobile drawer */}
          {isOpenMobile && onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--sea-ink-soft,#576c64)] hover:bg-black/5 hover:text-[var(--sea-ink,#1b2a26)] dark:hover:bg-white/5 dark:hover:text-white md:hidden"
              aria-label="Tutup menu navigasi"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav aria-label="Navigasi Meja Kerja Desa" className="p-3 space-y-1">
          <p className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
            Meja Kerja Utama
          </p>

          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.exact
              ? currentPath === item.to
              : currentPath.startsWith(item.to)

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={isOpenMobile && onCloseMobile ? onCloseMobile : undefined}
                className={`group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-sm dark:bg-emerald-700'
                    : 'text-[var(--sea-ink,#1b2a26)] hover:bg-emerald-50 hover:text-emerald-950 dark:text-stone-200 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-200'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-emerald-800 dark:text-emerald-400'
                    }`}
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                </div>

                {item.badgeCount !== undefined && item.badgeCount > 0 && (
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold tracking-tight ${
                      item.badgeTone === 'emergency'
                        ? 'bg-red-600 text-white dark:bg-red-500'
                        : 'bg-amber-600 text-white dark:bg-amber-500'
                    }`}
                  >
                    {item.badgeCount}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer Profile & Actions */}
      <div className="border-t border-[var(--line,#d5ded9)] p-3 space-y-3 dark:border-[#22352f]">
        {/* Officer Active Profile */}
        <div className="flex items-center gap-3 rounded-lg bg-[var(--surface-secondary,#f4f7f5)] p-2.5 dark:bg-[#182622]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-xs font-bold text-white shadow-inner dark:bg-emerald-600">
            WS
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="m-0 truncate text-xs font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-100">
                I Wayan Sudarma
              </p>
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-900"
                title="Piket Aktif"
              />
            </div>
            <p className="m-0 truncate text-[11px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
              Kaur Tata Usaha dan Pelayanan
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-2 px-1 pt-1">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950/50"
            title="Buka portal publik layanan warga"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Portal Warga</span>
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        aria-label="Sidebar Meja Kerja Perangkat Desa"
        className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:z-30"
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-50 flex md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Panel Navigasi Meja Kerja"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div className="relative flex w-full max-w-xs flex-1 flex-col shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
