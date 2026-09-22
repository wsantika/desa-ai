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

  if (currentPath.startsWith('/admin')) {
    return null
  }

  return (
    <nav
      aria-label="Navigasi Bawah Layanan Warga"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 shadow-xs backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/95 sm:hidden"
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
                  ? 'text-blue-700 dark:text-blue-400'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className={`relative flex h-8 w-12 items-center justify-center rounded-full transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-100/80 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300'
                    : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800'
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-transform duration-150 ${
                    isActive ? 'scale-110 stroke-[2.25]' : 'stroke-[1.75]'
                  }`}
                  aria-hidden="true"
                />
              </div>
              <span
                className={`mt-1 text-xs leading-tight ${
                  isActive ? 'font-bold text-blue-700 dark:text-blue-400' : 'font-semibold text-slate-600 dark:text-slate-400'
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
