import { GoogleGenAI, Type } from '@google/genai'
import type {
  AIEvaluationResult,
  IAIEvaluatorService,
} from '../../domain/repositories/i-ai-evaluator.service.js'
import type {
  ComplaintCategory,
  ComplaintPriority,
} from '../../domain/entities/complaint.entity.js'
import { MockAIEvaluatorService } from './mock-ai-evaluator.service.js'

export interface GeminiAIEvaluatorOptions {
  apiKey?: string
  modelName?: string
  temperature?: number
  fallbackEvaluator?: IAIEvaluatorService
}

const VALID_CATEGORIES: ComplaintCategory[] = [
  'INFRASTRUKTUR',
  'KEBERSIHAN_LINGKUNGAN',
  'KEAMANAN_KETERTIBAN',
  'PELAYANAN_PUBLIK',
  'BANTUAN_SOSIAL',
  'LAINNYA',
]

const VALID_PRIORITIES: ComplaintPriority[] = [
  'LOW',
  'MEDIUM',
  'HIGH',
  'EMERGENCY',
]

const COMPLAINT_SYSTEM_INSTRUCTION = `
Anda adalah AI Complaint Intelligence & Urgency Triage Engine untuk DesaAI, sebuah Sistem Operasi Desa Cerdas (Smart Village OS di Indonesia / Bali).
Tugas Anda adalah menganalisis setiap keluhan warga desa secara objektif dan menghasilkan klasifikasi terstruktur:

1. Kategori (category):
- INFRASTRUKTUR: Kerusakan jalan umum, aspal berlubang, lampu jalan/PJU mati, tiang roboh, jembatan rusak, pipa air bersih desa bocor, gorong-gorong fisik ambles.
- KEBERSIHAN_LINGKUNGAN: Tumpukan sampah liar, bau busuk, saluran air got tersumbat limbah, pencemaran sungai, jadwal penjemputan sampah terlambat.
- KEAMANAN_KETERTIBAN: Pencurian, perselisihan/keributan warga, balap liar, orang mabuk/miras, gangguan pos kamling, gangguan ketertiban umum.
- PELAYANAN_PUBLIK: Antrean kantor desa, pengurusan surat administrasi lambat, ketidaksesuaian jam buka pelayanan, kendala staf kantor desa.
- BANTUAN_SOSIAL: Penyaluran BLT desa, verifikasi data bansos/DTKS, beras bantuan, ketidaktepatan penerima bantuan.
- LAINNYA: Laporan di luar lingkup kewenangan atau umum.

2. Tingkat Prioritas (priority):
- EMERGENCY: Ancaman langsung terhadap keselamatan jiwa atau bahaya fatal seketika (contoh: jembatan amblas memutus akses darurat, tanah longsor menimbun jalan, kebakaran, pohon tumbang menimpa kabel bertegangan tinggi, kerusuhan fisik).
- HIGH: Masalah mendesak yang mengganggu keselamatan umum atau fasilitas utama warga yang berlarut (contoh: lampu jalan mati >=3 hari di jalur rawan, selokan meluap masuk rumah warga, pencurian berulang).
- MEDIUM: Masalah operasional standar yang mengganggu kenyamanan tapi tidak mengancam nyawa segera (contoh: sampah belum diangkut 2 hari, lubang jalan sedang, pengurusan surat tertunda).
- LOW: Saran perbaikan, permohonan informasi rutin, pengecatan fasilitas, usulan non-kritis.

3. Confidence Score:
- Nilai desimal 0.0 sampai 1.0 yang menunjukkan tingkat keyakinan AI atas analisis teks tersebut.

4. Executive Summary (summary):
- Ringkasan tepat dan profesional dalam 1 kalimat bahasa Indonesia untuk ditinjau oleh Kepala Desa atau Perangkat Desa.

5. Recommended Action (recommendedAction):
- Rekomendasi langkah konkret taktis untuk perangkat desa atau seksi terkait (misal: "Disposisikan Kasi Pelayanan untuk inspeksi lapangan dan berkoordinasi dengan Dinas PUPR/PLN").
`.trim()

export class GeminiAIEvaluatorService implements IAIEvaluatorService {
  private readonly aiClient: GoogleGenAI | null = null
  private readonly modelName: string
  private readonly fallbackEvaluator: IAIEvaluatorService

  constructor(options?: GeminiAIEvaluatorOptions) {
    const apiKey = options?.apiKey || process.env.GEMINI_API_KEY || ''
    this.modelName = options?.modelName || 'gemini-2.5-flash'
    this.fallbackEvaluator =
      options?.fallbackEvaluator || new MockAIEvaluatorService()

    if (apiKey.trim()) {
      this.aiClient = new GoogleGenAI({ apiKey: apiKey.trim() })
    }
  }

  async evaluateComplaint(
    title: string,
    description: string,
    locationContext?: string,
  ): Promise<AIEvaluationResult> {
    // If no client available, fallback gracefully
    if (!this.aiClient) {
      return this.fallbackEvaluator.evaluateComplaint(
        title,
        description,
        locationContext,
      )
    }

    try {
      const userPrompt = [
        `Judul Laporan: ${title}`,
        `Deskripsi Laporan: ${description}`,
        locationContext ? `Konteks Lokasi: ${locationContext}` : null,
      ]
        .filter(Boolean)
        .join('\n')

      const response = await this.aiClient.models.generateContent({
        model: this.modelName,
        contents: userPrompt,
        config: {
          systemInstruction: COMPLAINT_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: {
                type: Type.STRING,
                enum: VALID_CATEGORIES,
              },
              priority: {
                type: Type.STRING,
                enum: VALID_PRIORITIES,
              },
              confidenceScore: {
                type: Type.NUMBER,
              },
              summary: {
                type: Type.STRING,
              },
              recommendedAction: {
                type: Type.STRING,
              },
            },
            required: [
              'category',
              'priority',
              'confidenceScore',
              'summary',
              'recommendedAction',
            ],
          },
        },
      })

      const rawText = response.text?.trim() ?? ''
      const parsed = this.parseAndValidateResponse(rawText)

      return {
        ...parsed,
        rawResponse: {
          model: this.modelName,
          text: rawText,
        },
      }
    } catch (error) {
      // Graceful fallback to heuristic evaluator on any API error
      console.warn(
        '[GeminiAIEvaluatorService] LLM API call failed, falling back to heuristic evaluator:',
        error instanceof Error ? error.message : error,
      )
      const fallbackResult = await this.fallbackEvaluator.evaluateComplaint(
        title,
        description,
        locationContext,
      )
      return {
        ...fallbackResult,
        rawResponse: {
          fallback: true,
          error: error instanceof Error ? error.message : String(error),
        },
      }
    }
  }

  private parseAndValidateResponse(rawText: string): {
    category: ComplaintCategory
    priority: ComplaintPriority
    confidenceScore: number
    summary: string
    recommendedAction: string
  } {
    // Strip possible markdown wrapping: ```json ... ```
    let cleanJson = rawText
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/, '')
        .replace(/\s*```$/, '')
        .trim()
    }

    const data = JSON.parse(cleanJson)

    const category: ComplaintCategory = VALID_CATEGORIES.includes(data.category)
      ? data.category
      : 'LAINNYA'

    const priority: ComplaintPriority = VALID_PRIORITIES.includes(data.priority)
      ? data.priority
      : 'MEDIUM'

    const confidenceScore =
      typeof data.confidenceScore === 'number' &&
      !isNaN(data.confidenceScore) &&
      data.confidenceScore >= 0 &&
      data.confidenceScore <= 1
        ? data.confidenceScore
        : 0.85

    const summary =
      typeof data.summary === 'string' && data.summary.trim()
        ? data.summary.trim()
        : 'Laporan warga diterima dan sedang dalam peninjauan.'

    const recommendedAction =
      typeof data.recommendedAction === 'string' &&
      data.recommendedAction.trim()
        ? data.recommendedAction.trim()
        : 'Koordinasikan dengan petugas terkait untuk verifikasi lokasi.'

    return {
      category,
      priority,
      confidenceScore,
      summary,
      recommendedAction,
    }
  }
}
