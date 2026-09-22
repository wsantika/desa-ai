import { useLocation } from '@tanstack/react-router'

export default function Footer() {
  const location = useLocation()
  if (location.pathname.startsWith('/admin')) {
    return null
  }

  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white px-4 pb-28 pt-10 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 sm:pb-12">
      <div className="page-wrap flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <div>
          <p className="m-0 text-sm font-semibold text-slate-900 dark:text-white">
            DesaAI: Sistem Operasi Desa Cerdas Tegal Tugu
          </p>
          <p className="m-0 text-xs text-slate-500 dark:text-slate-400">
            Pemerintah Desa Tegal Tugu, Gianyar, Bali • APTIKOM Hackathon {year}
          </p>
        </div>
        <p className="island-kicker m-0 text-xs font-semibold text-blue-700 dark:text-blue-400">
          Terhubung Tertutup (Closed-Loop) Warga &amp; Pemerintah Desa
        </p>
      </div>
    </footer>
  )
}
