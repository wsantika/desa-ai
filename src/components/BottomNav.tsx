import { Link, useLocation } from '@tanstack/react-router'
import { Home, FileText, AlertCircle, Bot } from 'lucide-react'

interface NavItem {
  to: '/' | '/layanan' | '/pengaduan' | '/asisten'
  label: string
  icon: typeof Home
  exact?: boolean
}

const NAV_ITEMS: NavItem[] = [
  {
    to: '/',
    label: 'Beranda',
    icon: Home,
    exact: true,
  },
  {
    to: '/layanan',
    label: 'Layanan',
    icon: FileText,
  },
  {
    to: '/pengaduan',
    label: 'Pengaduan',
    icon: AlertCircle,
  },
  {
    to: '/asisten',
    label: 'Asisten AI',
    icon: Bot,
  },
]

export default function BottomNav() {
  const location = useLocation()
  const currentPath = location.pathname

  return (
    <nav
      aria-label="Navigasi Bawah Layanan Warga"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--line)] bg-[var(--header-bg)]/95 shadow-[0_-4px_20px_rgba(23,58,64,0.06)] backdrop-blur-lg sm:hidden"
      style={{
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
      }}
    >
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = item.exact
            ? currentPath === item.to
            : currentPath.startsWith(item.to)

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`group flex min-h-[52px] min-w-[64px] flex-1 flex-col items-center justify-center rounded-xl px-1 py-1 transition-colors ${
                isActive
                  ? 'text-emerald-700 dark:text-emerald-300'
                  : 'text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className={`relative flex h-8 w-12 items-center justify-center rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-600/15 dark:bg-emerald-400/20'
                    : 'group-hover:bg-black/5 dark:group-hover:bg-white/5'
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.25]' : 'stroke-[1.75]'
                  }`}
                  aria-hidden="true"
                />
              </div>
              <span
                className={`mt-0.5 text-[11px] leading-tight tracking-tight ${
                  isActive ? 'font-bold' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
