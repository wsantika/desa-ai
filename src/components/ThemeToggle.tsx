import { useEffect, useState } from 'react'
import { Sun, Moon, Laptop } from 'lucide-react'

type ThemeMode = 'light' | 'dark' | 'auto'

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'auto'
  }

  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark' || stored === 'auto') {
    return stored
  }

  return 'auto'
}

function applyThemeMode(mode: ThemeMode) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const resolved = mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode

  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(resolved)

  if (mode === 'auto') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', mode)
  }

  document.documentElement.style.colorScheme = resolved
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('auto')

  useEffect(() => {
    const initialMode = getInitialMode()
    setMode(initialMode)
    applyThemeMode(initialMode)
  }, [])

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (
        e.key === 'theme' &&
        (e.newValue === 'light' || e.newValue === 'dark' || e.newValue === 'auto')
      ) {
        setMode(e.newValue)
        applyThemeMode(e.newValue)
      }
    }
    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeMode>
      if (customEvent.detail) {
        setMode(customEvent.detail)
      }
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener('theme-change', handleCustomChange)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('theme-change', handleCustomChange)
    }
  }, [])

  useEffect(() => {
    if (mode !== 'auto') {
      return
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyThemeMode('auto')

    media.addEventListener('change', onChange)
    return () => {
      media.removeEventListener('change', onChange)
    }
  }, [mode])

  function toggleMode() {
    let nextMode: ThemeMode
    if (mode === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      nextMode = prefersDark ? 'light' : 'dark'
    } else if (mode === 'light') {
      nextMode = 'dark'
    } else {
      nextMode = 'auto'
    }

    setMode(nextMode)
    applyThemeMode(nextMode)
    window.localStorage.setItem('theme', nextMode)
    window.dispatchEvent(new CustomEvent('theme-change', { detail: nextMode }))
  }

  const label =
    mode === 'auto'
      ? 'Mode tema: otomatis (sistem). Klik untuk beralih mode.'
      : `Mode tema: ${mode}. Klik untuk beralih mode.`

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={label}
      title={label}
      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--sea-ink)] shadow-[0_2px_8px_rgba(30,90,72,0.06)] transition hover:-translate-y-0.5 whitespace-nowrap shrink-0 dark:border-[#22352f] dark:text-stone-200"
    >
      {mode === 'auto' && (
        <Laptop
          className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400 shrink-0"
          aria-hidden="true"
        />
      )}
      {mode === 'light' && (
        <Sun className="h-3.5 w-3.5 text-amber-500 shrink-0" aria-hidden="true" />
      )}
      {mode === 'dark' && (
        <Moon className="h-3.5 w-3.5 text-sky-400 shrink-0" aria-hidden="true" />
      )}
      <span>{mode === 'auto' ? 'Auto' : mode === 'dark' ? 'Dark' : 'Light'}</span>
    </button>
  )
}
