import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
import { Bot, Send, User, Sparkles, BookOpen, ExternalLink, Loader2 } from 'lucide-react'
import { askAssistantServerFn } from '../application/server-functions/assistant.fn'

export const Route = createFileRoute('/asisten')({
  component: AsistenChatPage,
})

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  actionLinks?: { label: string; url: string; category?: string }[]
  groundingSources?: { title: string; score: number }[]
  createdAt: Date
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'msg-welcome',
  role: 'assistant',
  content:
    'Om Swastyastu! Tiang Made Mandara, asisten AI resmi Desa Mandara. Ada yang bisa tiang bantu seputar persyaratan surat, jadwal pelayanan, atau informasi kegiatan desa nggih?',
  createdAt: new Date(),
}

const QUICK_PROMPTS = [
  'Apa saja syarat membuat Surat Keterangan Domisili?',
  'Bagaimana cara mengurus Surat Keterangan Usaha (SKU)?',
  'Kapan jam operasional pelayanan kantor desa?',
  'Bagaimana alur melaporkan lampu jalan yang padam?',
]

function AsistenChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input
    if (!textToSend.trim() || loading) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    if (!queryText) setInput('')
    setLoading(true)

    try {
      // Build conversation history for context
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
        createdAt: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch {
      const errorMessage: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        role: 'assistant',
        content:
          'Matur suksma atas pertanyaannya. Saat ini sistem sedang sibuk, mohon coba kembali beberapa saat lagi atau hubungi langsung Kantor Desa Mandara.',
        createdAt: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-wrap flex flex-col px-4 py-4 sm:py-6" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Top Header Card */}
      <div className="island-shell mb-3 flex items-center justify-between rounded-2xl px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/15 text-emerald-700 dark:text-emerald-400">
            <Bot className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[var(--sea-ink)] sm:text-base">
              Made Mandara — Asisten AI Desa
            </h1>
            <p className="text-[11px] text-[var(--sea-ink-soft)] sm:text-xs">
              Terverifikasi Dokumen SOP Resmi Desa Mandara (RAG Grounded)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
          <span>Online</span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="island-shell flex-1 overflow-y-auto rounded-2xl p-4 sm:p-6">
        <div className="space-y-4">
          {messages.map((msg) => {
            const isBot = msg.role === 'assistant'
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isBot ? 'items-start' : 'items-end justify-end'}`}
              >
                {isBot && (
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white shadow-sm dark:bg-emerald-600">
                    <Bot className="h-4 w-4" aria-hidden="true" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed sm:max-w-[75%] sm:text-sm ${
                    isBot
                      ? 'border border-[var(--line)] bg-[var(--header-bg)] text-[var(--sea-ink)]'
                      : 'bg-emerald-700 text-white dark:bg-emerald-600'
                  }`}
                >
                  <p className="m-0 whitespace-pre-line">{msg.content}</p>

                  {/* Action Links */}
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

                  {/* Grounding Source Info */}
                  {msg.groundingSources && msg.groundingSources.length > 0 && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-[var(--sea-ink-soft)]">
                      <BookOpen className="h-3 w-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                      <span>Rujukan: {msg.groundingSources[0].title}</span>
                    </div>
                  )}
                </div>

                {!isBot && (
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600/20 text-emerald-800 dark:bg-emerald-400/20 dark:text-emerald-300">
                    <User className="h-4 w-4" aria-hidden="true" />
                  </div>
                )}
              </div>
            )
          })}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white shadow-sm dark:bg-emerald-600">
                <Bot className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-[var(--line)] bg-[var(--header-bg)] px-4 py-3 text-xs text-[var(--sea-ink-soft)]">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" aria-hidden="true" />
                <span>Made Mandara sedang memeriksa dokumen SOP desa...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested Question Chips */}
      {messages.length <= 2 && (
        <div className="mt-3 flex flex-wrap gap-2 overflow-x-auto py-1">
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(prompt)}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--chip-bg)] px-3 py-1 text-xs text-[var(--sea-ink)] transition hover:border-emerald-600/40 hover:bg-emerald-500/10 active:scale-95"
            >
              <Sparkles className="h-3 w-3 text-emerald-600" aria-hidden="true" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input Form Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
        className="island-shell mt-3 flex items-center gap-2 rounded-2xl p-2 sm:p-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanyakan syarat surat, jam pelayanan, atau info desa..."
          aria-label="Pesan untuk Made Mandara"
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
