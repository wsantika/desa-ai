import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface MetricCardProps {
  title: string
  value: string | number
  description: string
  icon: LucideIcon
  tone?: 'default' | 'success' | 'warning' | 'emergency'
  actionTo?: string
  actionLabel?: string
}

export default function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  tone = 'default',
  actionTo,
  actionLabel,
}: MetricCardProps) {
  const toneStyles = {
    default: {
      card: 'border-[var(--line,#d5ded9)] dark:border-[#22352f]',
      iconWrap: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
      valueText: 'text-[var(--sea-ink,#1b2a26)] dark:text-stone-100',
    },
    success: {
      card: 'border-emerald-600/30 bg-emerald-50/20 dark:border-emerald-900/40 dark:bg-emerald-950/20',
      iconWrap: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
      valueText: 'text-emerald-900 dark:text-emerald-200',
    },
    warning: {
      card: 'border-amber-600/30 bg-amber-50/20 dark:border-amber-900/40 dark:bg-amber-950/20',
      iconWrap: 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300',
      valueText: 'text-amber-950 dark:text-amber-200',
    },
    emergency: {
      card: 'border-red-600/40 bg-red-50/30 dark:border-red-900/50 dark:bg-red-950/30',
      iconWrap: 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300',
      valueText: 'text-red-950 dark:text-red-200',
    },
  }[tone]

  return (
    <div
      className={`relative flex flex-col justify-between rounded-xl border bg-[var(--surface-primary,#ffffff)] p-5 shadow-xs transition-shadow hover:shadow-sm dark:bg-[#121c19] ${toneStyles.card}`}
    >
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
            {title}
          </span>
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${toneStyles.iconWrap}`}
            aria-hidden="true"
          >
            <Icon className="h-4 w-4" />
          </span>
        </div>

        <div className="mt-3">
          <p className={`m-0 text-3xl font-extrabold tracking-tight ${toneStyles.valueText}`}>
            {value}
          </p>
          <p className="mt-1 mb-0 text-xs font-medium text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
            {description}
          </p>
        </div>
      </div>

      {actionTo && actionLabel && (
        <div className="mt-4 pt-3 border-t border-[var(--line,#d5ded9)] dark:border-[#22352f]">
          <Link
            to={actionTo}
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 dark:text-emerald-300 dark:hover:text-emerald-100"
          >
            <span>{actionLabel}</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  )
}
