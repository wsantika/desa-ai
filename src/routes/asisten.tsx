import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
import {
  Bot,
  Send,
  User,
  RotateCcw,
  BookOpen,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react'
import { askAssistantServerFn } from '../application/server-functions/assistant.fn'
import MarkdownContent from '../components/chat/MarkdownContent'
import TypingIndicator from '../components/chat/TypingIndicator'
import QuickPromptChips from '../components/chat/QuickPromptChips'

export const Route = createFileRoute('/asisten')({
  component: AsistenChatPage,
})

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  actionLinks?: { label: string; url: string; category?: string }[]
  groundingSources?: { title: string; score: number }[]
  createdAt: string
}

const STORAGE_KEY = 'desa_ai_asisten_history'

const INITIAL_MESSAGE: ChatMessage = {
  id: 'msg-welcome',
  role: 'assistant',
  content:
    '**Om Swastyastu!** 🙏\n\nTiang **Made Mandara**, asisten AI resmi pelayanan publik Desa Mandara. Ada yang bisa tiang bantu seputar:\n- Persyaratan surat administrasi desa (Domisili, SKU, SKCK, SKTM)\n- Jam operasional dan jadwal pelayanan kantor desa\n- Alur pengaduan fasilitas lingkungan atau bantuan sosial\n\nSilakan ketik pertanyaan Anda atau pilih topik di bawah nggih!',
  createdAt: new Date().toISOString(),
}

function AsistenChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 1. Load session history from localStorage on initial mount
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed)
        }
      }
    } catch {
      // Ignore storage read error
    }
  }, [])

  // 2. Save messages to localStorage whenever messages change
  useEffect(() => {
    try {
      if (messages.length > 1 || messages[0].id !== INITIAL_MESSAGE.id) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
      }
    } catch {
      // Ignore storage write error
    }
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  // Clear chat / Start new conversation
  const handleResetChat = () => {
    if (window.confirm('Mulai percakapan baru dengan Made Mandara? Riwayat obrolan ini akan dihapus.')) {
      setMessages([INITIAL_MESSAGE])
      try {
        window.localStorage.removeItem(STORAGE_KEY)
      } catch {
        // ignore
      }
    }
  }

  // Copy assistant response text to clipboard
  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // fallback
    }
  }

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || input).trim()
    if (!textToSend || loading) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    if (!queryText) setInput('')
    setLoading(true)

    try {
      // Pass the last 4 turns as context history
      const history = messages.slice(-4).map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const response = await askAssistantServerFn({
        data: {
          query: userMessage.content,
          conversationHistory: history,
        },
      })

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        actionLinks: response.actionLinks,
        groundingSources: response.groundingSources?.map((s) => ({
          title: s.documentTitle,
          score: s.similarity,
        })),
        createdAt: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch {
      const errorMessage: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        role: 'assistant',
        content:
          'Matur suksma atas pertanyaannya. Saat ini koneksi sistem sedang sibuk, mohon coba kembali beberapa saat lagi atau hubungi langsung Kantor Desa Mandara.',
        createdAt: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-wrap flex flex-col px-4 py-3 sm:py-6" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Top Header Room Bar */}
      <div className="island-shell mb-3 flex items-center justify-between rounded-2xl px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/15 text-emerald-700 dark:text-emerald-400">
            <Bot className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight text-[var(--sea-ink)] sm:text-base">
              Made Mandara — Asisten AI Desa
            </h1>
            <p className="text-[11px] text-[var(--sea-ink-soft)]">
              Grounded SOP Resmi Desa Mandara &bull; RAG Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetChat}
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-[var(--line)] px-2.5 py-1 text-xs text-[var(--sea-ink-soft)] transition hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-700 active:scale-95"
            title="Mulai Percakapan Baru"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Reset Sesi</span>
          </button>

          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            <span>Aktif</span>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="island-shell flex-1 overflow-y-auto rounded-2xl p-4 sm:p-6">
        <div className="space-y-4">
          {messages.map((msg) => {
            const isBot = msg.role === 'assistant'
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isBot ? 'items-start' : 'items-end justify-end'}`}
              >
                {/* Assistant Avatar */}
                {isBot && (
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white shadow-sm dark:bg-emerald-600">
                    <Bot className="h-4 w-4" aria-hidden="true" />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`group relative max-w-[88%] rounded-2xl px-4 py-3 text-xs leading-relaxed sm:max-w-[78%] sm:text-sm ${
                    isBot
                      ? 'rounded-tl-sm border border-[var(--line)] bg-[var(--header-bg)] text-[var(--sea-ink)] shadow-sm'
                      : 'rounded-tr-sm bg-emerald-700 text-white shadow dark:bg-emerald-600'
                  }`}
                >
                  {/* Content with Markdown Rendering */}
                  {isBot ? (
                    <MarkdownContent content={msg.content} />
                  ) : (
                    <p className="m-0 whitespace-pre-line">{msg.content}</p>
                  )}

                  {/* Action Links / Buttons */}
                  {msg.actionLinks && msg.actionLinks.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 border-t border-[var(--line)] pt-2.5">
                      {msg.actionLinks.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-emerald-600/30 bg-emerald-600/10 px-3 py-1.5 text-xs font-bold text-emerald-800 transition hover:bg-emerald-600/20 dark:text-emerald-300"
                        >
                          <span>{link.label}</span>
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Grounding Source Info Footer */}
                  {msg.groundingSources && msg.groundingSources.length > 0 && (
                    <div className="mt-2.5 flex items-center justify-between border-t border-[var(--line)]/60 pt-2 text-[10px] text-[var(--sea-ink-soft)]">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                        <span>Rujukan: {msg.groundingSources[0].title}</span>
                      </div>
                      <span className="rounded bg-black/5 px-1.5 py-0.2 dark:bg-white/5">
                        {Math.round(msg.groundingSources[0].score * 100)}% relevan
                      </span>
                    </div>
                  )}

                  {/* Copy Button for Assistant responses */}
                  {isBot && msg.id !== INITIAL_MESSAGE.id && (
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] text-[var(--sea-ink-soft)] opacity-80 transition hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/5"
                        title="Salin jawaban"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-600" aria-hidden="true" />
                            <span className="text-emerald-600">Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" aria-hidden="true" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Citizen / User Avatar */}
                {!isBot && (
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600/20 text-emerald-800 dark:bg-emerald-400/20 dark:text-emerald-300">
                    <User className="h-4 w-4" aria-hidden="true" />
                  </div>
                )}
              </div>
            )
          })}

          {/* Typing Indicator */}
          {loading && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Popular Quick Prompts Chips */}
      <QuickPromptChips onSelectPrompt={handleSend} disabled={loading} />

      {/* Input Message Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
        className="island-shell mt-2 flex items-center gap-2 rounded-2xl p-2 sm:p-2.5"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ketik pertanyaan untuk Made Mandara..."
          aria-label="Ketik pertanyaan untuk Made Mandara"
          disabled={loading}
          className="flex-1 rounded-xl bg-transparent px-3 py-2 text-xs text-[var(--sea-ink)] placeholder-[var(--sea-ink-soft)] focus:outline-none sm:text-sm"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-emerald-700 text-white transition hover:bg-emerald-800 disabled:opacity-40 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          aria-label="Kirim Pertanyaan"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  )
}
