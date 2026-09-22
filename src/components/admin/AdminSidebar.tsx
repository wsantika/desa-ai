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
    <div className="flex h-full flex-col justify-between bg-white text-slate-900 border-r border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100">
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-white shadow-xs dark:bg-blue-600">
              <Building2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
                  DesaAI Workspace
                </span>
                <span className="rounded bg-blue-50 border border-blue-200 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-950/60 dark:border-blue-900/50 dark:text-blue-300">
                  Gov
                </span>
              </div>
              <p className="m-0 text-xs font-medium text-slate-500 dark:text-slate-400">
                Pemerintah Desa Tegal Tugu
              </p>
            </div>
          </div>

          {/* Close button on mobile drawer */}
          {isOpenMobile && onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white md:hidden"
              aria-label="Tutup menu navigasi"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav aria-label="Navigasi Meja Kerja Desa" className="p-3 space-y-1">
          <p className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
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
                className={`group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors no-underline ${
                  isActive
                    ? 'bg-blue-700 !text-white shadow-xs dark:bg-blue-600'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-transform group-hover:scale-110 shrink-0 ${
                      isActive
                        ? '!text-white'
                        : 'text-slate-500 group-hover:text-blue-700 dark:text-slate-400 dark:group-hover:text-blue-400'
                    }`}
                    aria-hidden="true"
                  />
                  <span
                    className={
                      isActive
                        ? '!text-white font-semibold'
                        : 'text-slate-700 dark:text-slate-300'
                    }
                  >
                    {item.label}
                  </span>
                </div>

                {item.badgeCount !== undefined && item.badgeCount > 0 && (
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold tracking-tight shrink-0 ${
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
      <div className="border-t border-slate-200 p-3 space-y-3 dark:border-slate-800">
        {/* Officer Active Profile */}
        <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/60">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white shadow-inner dark:bg-blue-600">
            WS
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="m-0 truncate text-xs font-bold text-slate-900 dark:text-white">
                I Wayan Sudarma
              </p>
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-blue-500 ring-2 ring-blue-200 dark:ring-blue-900"
                title="Piket Aktif"
              />
            </div>
            <p className="m-0 truncate text-[11px] text-slate-500 dark:text-slate-400">
              Kaur Tata Usaha dan Pelayanan
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-2 px-1 pt-1">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold text-blue-700 no-underline hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-slate-800"
            title="Buka portal publik layanan warga"
          >
            <ExternalLink className="h-3.5 w-3.5 text-blue-700 dark:text-blue-400" aria-hidden="true" />
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
