import { PrismaKnowledgeRepository } from '../../infrastructure/repositories/prisma-knowledge.repository.js'
import { GeminiEmbeddingService } from '../../infrastructure/ai/gemini-embedding.service.js'
import { GeminiAssistantService } from '../../infrastructure/ai/gemini-assistant.service.js'
import { IngestDocumentUseCase } from '../use-cases/ingest-document.use-case.js'
import { SearchKnowledgeUseCase } from '../use-cases/search-knowledge.use-case.js'
import type { IKnowledgeRepository } from '../../domain/repositories/i-knowledge.repository.js'
import type {
  KnowledgeCategory,
  KnowledgeDocumentEntity,
} from '../../domain/entities/knowledge.entity.js'
import type {
  KnowledgeDeskData,
  KnowledgeDeskMetrics,
  KnowledgeDocumentItem,
  KnowledgeFilterDTO,
  SaveKnowledgeDocumentDTO,
  TestKnowledgeQueryDTO,
  TestKnowledgeQueryResult,
} from '../dtos/knowledge-desk.dto.js'
import { buildGroundingPrompt } from '../../infrastructure/ai/assistant-prompts.js'

export class AdminKnowledgeService {
  constructor(
    private readonly repo: IKnowledgeRepository = new PrismaKnowledgeRepository(),
    private readonly embeddingService: GeminiEmbeddingService = new GeminiEmbeddingService(),
    private readonly assistantService: GeminiAssistantService = new GeminiAssistantService(),
  ) {}

  /**
   * Fetch all knowledge documents and calculate desk metrics.
   */
  async fetchKnowledgeDeskData(
    filter?: Partial<KnowledgeFilterDTO>,
  ): Promise<KnowledgeDeskData> {
    const rawDocuments = await this.repo.listDocuments()

    // Calculate aggregated metrics across all documents
    const totalDocuments = rawDocuments.length
    const publishedDocuments = rawDocuments.filter((d) => d.isPublished).length
    const draftDocuments = totalDocuments - publishedDocuments

    let totalChunks = 0
    let latestUpdate: Date | null = null

    const categoryCounts: Record<KnowledgeCategory, number> = {
      REGULASI: 0,
      SOP_LAYANAN: 0,
      FAQ: 0,
      PROFIL_DESA: 0,
    }

    for (const doc of rawDocuments) {
      const chunkLen = doc.chunks?.length || 0
      totalChunks += chunkLen

      if (doc.category in categoryCounts) {
        categoryCounts[doc.category]++
      }

      if (!latestUpdate || doc.updatedAt > latestUpdate) {
        latestUpdate = doc.updatedAt
      }
    }

    const metrics: KnowledgeDeskMetrics = {
      totalDocuments,
      publishedDocuments,
      draftDocuments,
      totalChunks,
      categoryCounts,
      lastSyncedAt: latestUpdate ? latestUpdate.toISOString() : null,
    }

    // Apply optional filter
    let filtered = rawDocuments
    if (filter) {
      if (filter.category && filter.category !== 'ALL') {
        filtered = filtered.filter((d) => d.category === filter.category)
      }
      if (filter.status === 'PUBLISHED') {
        filtered = filtered.filter((d) => d.isPublished)
      } else if (filter.status === 'DRAFT') {
        filtered = filtered.filter((d) => !d.isPublished)
      }
      if (filter.search && filter.search.trim().length > 0) {
        const q = filter.search.toLowerCase().trim()
        filtered = filtered.filter(
          (d) =>
            d.title.toLowerCase().includes(q) ||
            d.contentText.toLowerCase().includes(q) ||
            (d.sourceUrl && d.sourceUrl.toLowerCase().includes(q)) ||
            (d.metadata &&
              JSON.stringify(d.metadata).toLowerCase().includes(q)),
        )
      }
    }

    const documents: KnowledgeDocumentItem[] = filtered.map((d) =>
      this.toDocumentItem(d),
    )

    return {
      documents,
      metrics,
    }
  }

  /**
   * Save (create or update) a knowledge document, re-chunk and generate vector embeddings.
   */
  async saveDocument(
    dto: SaveKnowledgeDocumentDTO,
  ): Promise<KnowledgeDocumentItem> {
    const ingestUseCase = new IngestDocumentUseCase(
      this.repo,
      this.embeddingService,
    )

    const saved = await ingestUseCase.execute({
      id: dto.id,
      title: dto.title.trim(),
      category: dto.category,
      sourceUrl: dto.sourceUrl ? dto.sourceUrl.trim() : null,
      contentText: dto.contentText.trim(),
      metadata: dto.metadata ?? null,
    })

    // If publication status is explicitly provided and different, update it
    if (
      dto.isPublished !== undefined &&
      saved.isPublished !== dto.isPublished
    ) {
      const updated = await this.repo.updatePublishStatus(
        saved.id,
        dto.isPublished,
      )
      return this.toDocumentItem(updated)
    }

    return this.toDocumentItem(saved)
  }

  /**
   * Toggle publication status of a document (determines whether AI assistant retrieves it).
   */
  async togglePublishStatus(
    id: string,
    isPublished: boolean,
  ): Promise<KnowledgeDocumentItem> {
    const updated = await this.repo.updatePublishStatus(id, isPublished)
    return this.toDocumentItem(updated)
  }

  /**
   * Delete a knowledge document and its associated vector chunks.
   */
  async deleteDocument(id: string): Promise<void> {
    await this.repo.deleteDocument(id)
  }

  /**
   * Re-indexes all published documents in batch into vector chunks.
   */
  async reindexAllDocuments(): Promise<{
    reindexedDocuments: number
    totalChunks: number
  }> {
    const allDocs = await this.repo.listDocuments()
    const ingestUseCase = new IngestDocumentUseCase(
      this.repo,
      this.embeddingService,
    )

    let totalChunks = 0
    let reindexedDocuments = 0

    for (const doc of allDocs) {
      const ingested = await ingestUseCase.execute({
        id: doc.id,
        title: doc.title,
        category: doc.category,
        sourceUrl: doc.sourceUrl,
        contentText: doc.contentText,
        metadata: doc.metadata,
      })

      // Maintain original publication state
      if (doc.isPublished !== ingested.isPublished) {
        await this.repo.updatePublishStatus(doc.id, doc.isPublished)
      }

      totalChunks += ingested.chunks?.length || 0
      reindexedDocuments++
    }

    return {
      reindexedDocuments,
      totalChunks,
    }
  }

  /**
   * Test retrieval and simulate AI assistant grounded answer.
   */
  async testQuery(
    dto: TestKnowledgeQueryDTO,
  ): Promise<TestKnowledgeQueryResult> {
    const searchUseCase = new SearchKnowledgeUseCase(
      this.repo,
      this.embeddingService,
    )

    const searchResults = await searchUseCase.execute({
      query: dto.query,
      category: dto.category,
      topK: dto.topK ?? 3,
    })

    const retrievedChunks = searchResults.map((r, idx) => ({
      chunkIndex: idx + 1,
      chunkContent: r.chunkContent,
      documentTitle: r.documentTitle,
      category: r.category,
      similarityScore: Math.round(r.similarityScore * 100) / 100,
    }))

    const groundingSources = searchResults.map((r) => ({
      documentId: r.documentId,
      documentTitle: r.documentTitle,
      category: r.category,
      excerpt: r.chunkContent,
      similarityScore: r.similarityScore,
    }))

    const groundingContext = buildGroundingPrompt(groundingSources)

    const assistantResponse = await this.assistantService.generateResponse({
      query: dto.query,
      groundingContext,
      groundingSources,
    })

    return {
      query: dto.query,
      retrievedChunks,
      aiAnswer: assistantResponse.replyText,
      groundedSourceCount: searchResults.length,
    }
  }

  private toDocumentItem(doc: KnowledgeDocumentEntity): KnowledgeDocumentItem {
    return {
      id: doc.id,
      title: doc.title,
      category: doc.category,
      sourceUrl: doc.sourceUrl,
      contentText: doc.contentText,
      metadata: doc.metadata ?? null,
      isPublished: doc.isPublished,
      chunkCount: doc.chunks ? doc.chunks.length : 0,
      chunks: doc.chunks
        ? doc.chunks.map((c) => ({
            id: c.id,
            chunkIndex: c.chunkIndex,
            chunkContent: c.chunkContent,
            hasEmbedding: Array.isArray(c.embedding) && c.embedding.length > 0,
            createdAt: c.createdAt.toISOString(),
          }))
        : undefined,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    }
  }
}
