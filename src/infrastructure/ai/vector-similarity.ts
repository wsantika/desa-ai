import type { KnowledgeSearchResult } from '../../domain/entities/knowledge.entity.js'
import type { KnowledgeChunkWithDocument } from '../../domain/repositories/i-knowledge.repository.js'

/**
 * Computes Cosine Similarity between two numeric vectors.
 * Returns a value between -1.0 and 1.0 (typically 0.0 to 1.0 for normalized embeddings).
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a || !b || a.length === 0 || b.length === 0 || a.length !== b.length) {
    return 0
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    const valA = a[i]
    const valB = b[i]
    dotProduct += valA * valB
    normA += valA * valA
    normB += valB * valB
  }

  if (normA === 0 || normB === 0) {
    return 0
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

export interface RankChunksOptions {
  topK?: number
  minSimilarityThreshold?: number
}

/**
 * Filters and ranks knowledge chunks based on cosine similarity to the query embedding.
 */
export function rankChunksBySimilarity(
  queryEmbedding: number[],
  chunks: KnowledgeChunkWithDocument[],
  options?: RankChunksOptions,
): KnowledgeSearchResult[] {
  const topK = options?.topK ?? 4
  const minThreshold = options?.minSimilarityThreshold ?? 0.35

  const scoredResults: KnowledgeSearchResult[] = []

  for (const chunk of chunks) {
    if (!chunk.embedding || chunk.embedding.length === 0) {
      continue
    }

    const similarity = cosineSimilarity(queryEmbedding, chunk.embedding)

    if (similarity >= minThreshold) {
      scoredResults.push({
        chunkId: chunk.id,
        documentId: chunk.documentId,
        documentTitle: chunk.document.title,
        category: chunk.document.category,
        chunkContent: chunk.chunkContent,
        similarityScore: similarity,
        metadata:
          chunk.document.metadata && typeof chunk.document.metadata === 'object'
            ? (chunk.document.metadata as Record<string, unknown>)
            : null,
      })
    }
  }

  // Sort descending by similarity score
  scoredResults.sort((a, b) => b.similarityScore - a.similarityScore)

  return scoredResults.slice(0, topK)
}
