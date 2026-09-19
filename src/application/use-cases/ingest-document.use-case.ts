import type { KnowledgeCategory, KnowledgeDocumentEntity } from '../../domain/entities/knowledge.entity.js'
import type { IKnowledgeRepository } from '../../domain/repositories/i-knowledge.repository.js'
import type { IEmbeddingService } from '../../domain/repositories/i-embedding.service.js'
import { chunkDocumentText } from '../../infrastructure/ai/chunker.js'

export interface IngestDocumentDTO {
  id?: string
  title: string
  category: KnowledgeCategory
  sourceUrl?: string | null
  contentText: string
  metadata?: Record<string, unknown> | null
  chunkSize?: number
  chunkOverlap?: number
}

export class IngestDocumentUseCase {
  constructor(
    private readonly knowledgeRepo: IKnowledgeRepository,
    private readonly embeddingService: IEmbeddingService,
  ) {}

  async execute(dto: IngestDocumentDTO): Promise<KnowledgeDocumentEntity> {
    // 1. Chunk text into semantic chunks
    const chunkStrings = chunkDocumentText(dto.contentText, {
      maxChunkSize: dto.chunkSize,
      chunkOverlap: dto.chunkOverlap,
    })

    // 2. Generate vector embeddings in batch for all chunks
    const embeddings = await this.embeddingService.generateBatchEmbeddings(
      chunkStrings.length > 0 ? chunkStrings : [dto.contentText],
    )

    // 3. Assemble chunk input models
    const chunks = (chunkStrings.length > 0 ? chunkStrings : [dto.contentText]).map(
      (chunkContent, index) => ({
        chunkIndex: index + 1,
        chunkContent,
        embedding: embeddings[index] || [],
      }),
    )

    // 4. Persist document and indexed chunks into database
    return this.knowledgeRepo.saveDocumentWithChunks({
      id: dto.id,
      title: dto.title,
      category: dto.category,
      sourceUrl: dto.sourceUrl,
      contentText: dto.contentText,
      metadata: dto.metadata,
      chunks,
    })
  }
}
