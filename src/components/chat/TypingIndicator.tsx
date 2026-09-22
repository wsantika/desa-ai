import { Bot } from 'lucide-react'

interface TypingIndicatorProps {
  label?: string
}

export default function TypingIndicator({
  label = 'Made Mandara sedang memeriksa dokumen SOP desa...',
}: TypingIndicatorProps) {
  return (
    <div className="flex items-start gap-3" aria-live="polite" aria-label="Mengetik respons">
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm dark:bg-blue-600">
        <Bot className="h-4 w-4" aria-hidden="true" />
      </div>

      <div className="rounded-2xl rounded-tl-sm border border-[var(--line)] bg-[var(--header-bg)] px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          {/* Animated 3 Dots */}
          <div className="flex items-center gap-1">
            <span
              className="inline-block h-2 w-2 animate-bounce rounded-full bg-blue-600 dark:bg-blue-400"
              style={{ animationDelay: '0ms' }}
            />
            <span
              className="inline-block h-2 w-2 animate-bounce rounded-full bg-blue-600 dark:bg-blue-400"
              style={{ animationDelay: '150ms' }}
            />
            <span
              className="inline-block h-2 w-2 animate-bounce rounded-full bg-blue-600 dark:bg-blue-400"
              style={{ animationDelay: '300ms' }}
            />
          </div>
          <span className="text-xs text-[var(--sea-ink-soft)]">{label}</span>
        </div>
      </div>
    </div>
  )
}
