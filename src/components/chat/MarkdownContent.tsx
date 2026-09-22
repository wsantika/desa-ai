import React from 'react'

interface MarkdownContentProps {
  content?: string | null
  className?: string
}

/**
 * Lightweight, hydration-safe Markdown renderer for citizen chat.
 * Supports bold, italic, headings, bullet lists, numbered lists, and line breaks.
 */
export default function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  const safeContent = typeof content === 'string' ? content : (content ? String(content) : '')
  if (!safeContent) {
    return <div className={`chat-markdown ${className}`} />
  }

  const lines = safeContent.split('\n')
  const elements: React.ReactNode[] = []
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null

  const flushList = () => {
    if (!currentList) return
    if (currentList.type === 'ul') {
      elements.push(
        <ul key={`ul-${elements.length}`} className="my-2 ml-4 list-disc space-y-1 text-inherit">
          {currentList.items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ul>
      )
    } else {
      elements.push(
        <ol key={`ol-${elements.length}`} className="my-2 ml-4 list-decimal space-y-1 text-inherit">
          {currentList.items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ol>
      )
    }
    currentList = null
  }

  lines.forEach((line, index) => {
    const trimmed = line.trim()

    // Empty line
    if (!trimmed) {
      flushList()
      return
    }

    // Bullet list (- or * )
    if (/^[-*]\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^[-*]\s+/, '')
      if (!currentList || currentList.type !== 'ul') {
        flushList()
        currentList = { type: 'ul', items: [] }
      }
      currentList.items.push(itemText)
      return
    }

    // Numbered list (1. or 2. )
    if (/^\d+\.\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^\d+\.\s+/, '')
      if (!currentList || currentList.type !== 'ol') {
        flushList()
        currentList = { type: 'ol', items: [] }
      }
      currentList.items.push(itemText)
      return
    }

    // Normal line - flush any active list first
    flushList()

    // Headings (### or ##)
    if (/^###\s+/.test(trimmed)) {
      elements.push(
        <h4 key={`h4-${index}`} className="my-2 text-sm font-bold text-[var(--sea-ink)]">
          {renderInline(trimmed.replace(/^###\s+/, ''))}
        </h4>
      )
      return
    }

    if (/^##\s+/.test(trimmed)) {
      elements.push(
        <h3 key={`h3-${index}`} className="my-2 text-base font-bold text-[var(--sea-ink)]">
          {renderInline(trimmed.replace(/^##\s+/, ''))}
        </h3>
      )
      return
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${index}`} className="my-1.5 leading-relaxed text-inherit">
        {renderInline(trimmed)}
      </p>
    )
  })

  flushList()

  return <div className={`chat-markdown ${className}`}>{elements}</div>
}

/**
 * Parses bold (**text**), italic (*text*), and code (`code`) inline
 */
function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  // Matches **bold**, *italic*, `code`
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }

    const token = match[0]
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={`b-${match.index}`} className="font-bold text-inherit">
          {token.slice(2, -2)}
        </strong>
      )
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={`i-${match.index}`} className="italic text-inherit">
          {token.slice(1, -1)}
        </em>
      )
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={`c-${match.index}`}
          className="rounded bg-black/10 px-1.5 py-0.5 font-mono text-[11px] text-blue-800 dark:bg-white/10 dark:text-blue-300"
        >
          {token.slice(1, -1)}
        </code>
      )
    }

    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }

  return parts
}
