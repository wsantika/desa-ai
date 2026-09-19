import type {
  KnowledgeCategory,
  KnowledgeSearchResult,
} from '../../domain/entities/knowledge.entity.js'
import type { IKnowledgeRepository } from '../../domain/repositories/i-knowledge.repository.js'
import type { IEmbeddingService } from '../../domain/repositories/i-embedding.service.js'
import { rankChunksBySimilarity } from '../../infrastructure/ai/vector-similarity.js'

export interface SearchKnowledgeDTO {
  query: string
  topK?: number
  category?: KnowledgeCategory
  minSimilarityThreshold?: number
}

export class SearchKnowledgeUseCase {
  constructor(
    private readonly knowledgeRepo: IKnowledgeRepository,
    private readonly embeddingService: IEmbeddingService,
  ) {}

  async execute(dto: SearchKnowledgeDTO): Promise<KnowledgeSearchResult[]> {
    if (!dto.query || dto.query.trim().length === 0) {
      return []
    }

    // 1. Generate dense embedding vector for the user query
    const queryEmbedding = await this.embeddingService.generateEmbedding(
      dto.query.trim(),
    )

    // 2. Fetch all published indexed chunks from knowledge repository
    const allChunks = await this.knowledgeRepo.getAllChunksWithEmbeddings()

    // 3. Filter by category if requested
    const targetChunks = dto.category
      ? allChunks.filter((c) => c.document.category === dto.category)
      : allChunks

    // 4. Compute cosine similarities and return top-K ranked chunks
    return rankChunksBySimilarity(queryEmbedding, targetChunks, {
      topK: dto.topK ?? 4,
      minSimilarityThreshold: dto.minSimilarityThreshold ?? 0.3,
    })
  }
}
