import { GoogleGenAI } from '@google/genai'
import type {
  AssistantGenerateInput,
  AssistantResponse,
} from '../../domain/entities/assistant-conversation.entity.js'
import type { IVillageAssistantService } from '../../domain/repositories/i-village-assistant.service.js'
import {
  VILLAGE_ASSISTANT_SYSTEM_INSTRUCTION,
  detectActionLinks,
} from './assistant-prompts.js'

export interface GeminiAssistantOptions {
  apiKey?: string
  modelName?: string
}

export class GeminiAssistantService implements IVillageAssistantService {
  private readonly aiClient: GoogleGenAI | null = null
  private readonly modelName: string

  constructor(options?: GeminiAssistantOptions) {
    const apiKey = options?.apiKey || process.env.GEMINI_API_KEY || ''
    this.modelName = options?.modelName || 'gemini-flash-latest'

    if (apiKey.trim()) {
      this.aiClient = new GoogleGenAI({ apiKey: apiKey.trim() })
    }
  }

  async generateResponse(input: AssistantGenerateInput): Promise<AssistantResponse> {
    const actionLinks = detectActionLinks(input.query, input.groundingSources)

    if (!this.aiClient) {
      const fallbackReply = this.generateFallbackReply(input)
      return {
        replyText: fallbackReply,
        actionLinks,
        groundingSources: input.groundingSources,
      }
    }

    try {
      const promptContents = this.buildPromptContents(input)

      const response = await this.aiClient.models.generateContent({
        model: this.modelName,
        contents: promptContents,
        config: {
          systemInstruction: VILLAGE_ASSISTANT_SYSTEM_INSTRUCTION,
          temperature: 0.3,
        },
      })

      const replyText =
        response.text?.trim() ||
        'Halo Bapak/Ibu, terima kasih telah menghubungi DesaAI. Mohon maaf sistem sedang sibuk, silakan coba beberapa saat lagi.'

      return {
        replyText,
        actionLinks,
        groundingSources: input.groundingSources,
      }
    } catch (error) {
      console.warn(
        '[GeminiAssistantService] API call failed, using grounded fallback reply:',
        error instanceof Error ? error.message : error,
      )
      return {
        replyText: this.generateFallbackReply(input),
        actionLinks,
        groundingSources: input.groundingSources,
      }
    }
  }

  async *generateStream(input: AssistantGenerateInput): AsyncIterable<string> {
    if (!this.aiClient) {
      const fallback = this.generateFallbackReply(input)
      yield fallback
      return
    }

    try {
      const promptContents = this.buildPromptContents(input)

      const stream = await this.aiClient.models.generateContentStream({
        model: this.modelName,
        contents: promptContents,
        config: {
          systemInstruction: VILLAGE_ASSISTANT_SYSTEM_INSTRUCTION,
          temperature: 0.3,
        },
      })

      for await (const chunk of stream) {
        const text = chunk.text
        if (text) {
          yield text
        }
      }
    } catch (error) {
      console.warn(
        '[GeminiAssistantService] Streaming failed, falling back to static reply:',
        error instanceof Error ? error.message : error,
      )
      yield this.generateFallbackReply(input)
    }
  }

  private buildPromptContents(input: AssistantGenerateInput): string {
    const parts: string[] = []

    // Inject grounding documents
    parts.push(input.groundingContext)

    // Inject conversation history if available
    if (input.conversationHistory && input.conversationHistory.length > 0) {
      parts.push('\n[RIWAYAT PERCAKAPAN SEBELUMNYA]:')
      for (const msg of input.conversationHistory.slice(-4)) {
        const sender = msg.role === 'user' ? 'Warga' : 'Asisten'
        parts.push(`${sender}: ${msg.content}`)
      }
    }

    // Current query
    parts.push(`\n[PERTANYAAN WARGA SAAT INI]:\n${input.query}`)

    return parts.join('\n')
  }

  private generateFallbackReply(input: AssistantGenerateInput): string {
    if (input.groundingSources.length > 0) {
      const top = input.groundingSources[0]
      return `Halo Bapak/Ibu warga Desa Mandara. Berdasarkan dokumen resmi **${top.documentTitle}**:\n\n${top.excerpt}\n\nSeluruh pelayanan administrasi di Desa Mandara adalah bebas biaya (Rp 0). Jam pelayanan kantor desa adalah Senin s/d Jumat pukul 08.00 - 15.30 WITA.`
    }

    return `Halo Bapak/Ibu warga Desa Mandara. Mohon maaf informasi spesifik mengenai hal tersebut belum tercatat dalam dokumen digital desa saat ini. Silakan berkunjung ke Kantor Desa Mandara pada jam kerja (Senin - Jumat pukul 08.00 - 15.30 WITA) atau tanyakan kepada Kelian Banjar Anda.`
  }
}
