import { GoogleGenAI } from '@google/genai'
import type { IEmbeddingService } from '../../domain/repositories/i-embedding.service.js'

export interface GeminiEmbeddingOptions {
  apiKey?: string
  modelName?: string
  outputDimensionality?: number
}

const DEFAULT_DIMENSIONALITY = 768

export class GeminiEmbeddingService implements IEmbeddingService {
  private readonly aiClient: GoogleGenAI | null = null
  private readonly modelName: string
  private readonly outputDimensionality: number

  constructor(options?: GeminiEmbeddingOptions) {
    const apiKey = options?.apiKey || process.env.GEMINI_API_KEY || ''
    this.modelName = options?.modelName || 'gemini-embedding-001'
    this.outputDimensionality =
      options?.outputDimensionality || DEFAULT_DIMENSIONALITY

    if (apiKey.trim()) {
      this.aiClient = new GoogleGenAI({ apiKey: apiKey.trim() })
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!text || text.trim().length === 0) {
      return new Array(this.outputDimensionality).fill(0)
    }

    if (!this.aiClient) {
      return this.generateDeterministicFallbackVector(text)
    }

    try {
      const response = await this.aiClient.models.embedContent({
        model: this.modelName,
        contents: text.trim(),
        config: {
          outputDimensionality: this.outputDimensionality,
        },
      })

      const values = response.embeddings?.[0]?.values
      if (values && values.length > 0) {
        return values
      }

      return this.generateDeterministicFallbackVector(text)
    } catch (error) {
      console.warn(
        '[GeminiEmbeddingService] Failed to generate embedding with Gemini API, using deterministic fallback:',
        error instanceof Error ? error.message : error,
      )
      return this.generateDeterministicFallbackVector(text)
    }
  }

  async generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = []
    for (const text of texts) {
      const vec = await this.generateEmbedding(text)
      embeddings.push(vec)
    }
    return embeddings
  }

  /**
   * Deterministic pseudo-embedding generator used for offline testing or fallback when API key is unavailable.
   * Emits normalized 768-dim vector influenced by word frequencies and character hashes.
   */
  private generateDeterministicFallbackVector(text: string): number[] {
    const dim = this.outputDimensionality
    const vector = new Array(dim).fill(0)

    const clean = text.toLowerCase()
    const words = clean.split(/\s+/)

    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      for (let j = 0; j < word.length; j++) {
        const charCode = word.charCodeAt(j)
        const index = (charCode * 31 + j * 17 + i) % dim
        vector[index] += 1 / (j + 1)
      }
    }

    // Normalize to unit length
    let norm = 0
    for (let i = 0; i < dim; i++) {
      norm += vector[i] * vector[i]
    }

    if (norm > 0) {
      const sqrtNorm = Math.sqrt(norm)
      for (let i = 0; i < dim; i++) {
        vector[i] /= sqrtNorm
      }
    } else {
      vector[0] = 1.0
    }

    return vector
  }
}
