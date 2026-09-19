import type {
  ActionLink,
  AssistantResponse,
  ChatMessage,
  GroundingSource,
} from '../../domain/entities/assistant-conversation.entity.js'
import type { KnowledgeCategory } from '../../domain/entities/knowledge.entity.js'
import type { IVillageAssistantService } from '../../domain/repositories/i-village-assistant.service.js'
import type { SearchKnowledgeUseCase } from './search-knowledge.use-case.js'
import {
  buildGroundingPrompt,
  detectActionLinks,
} from '../../infrastructure/ai/assistant-prompts.js'

export interface AskAssistantDTO {
  query: string
  conversationHistory?: ChatMessage[]
  category?: KnowledgeCategory
}

export interface StreamAssistantResult {
  stream: AsyncIterable<string>
  actionLinks: ActionLink[]
  groundingSources: GroundingSource[]
}

export class AskVillageAssistantUseCase {
  constructor(
    private readonly searchKnowledgeUseCase: SearchKnowledgeUseCase,
    private readonly assistantService: IVillageAssistantService,
  ) {}

  async execute(dto: AskAssistantDTO): Promise<AssistantResponse> {
    const { groundingContext, groundingSources } = await this.retrieveGrounding(
      dto.query,
      dto.category,
    )

    return this.assistantService.generateResponse({
      query: dto.query,
      groundingContext,
      groundingSources,
      conversationHistory: dto.conversationHistory,
    })
  }

  async executeStream(dto: AskAssistantDTO): Promise<StreamAssistantResult> {
    const { groundingContext, groundingSources } = await this.retrieveGrounding(
      dto.query,
      dto.category,
    )

    const actionLinks = detectActionLinks(dto.query, groundingSources)

    const stream = this.assistantService.generateStream({
      query: dto.query,
      groundingContext,
      groundingSources,
      conversationHistory: dto.conversationHistory,
    })

    return {
      stream,
      actionLinks,
      groundingSources,
    }
  }

  private async retrieveGrounding(
    query: string,
    category?: KnowledgeCategory,
  ): Promise<{
    groundingContext: string
    groundingSources: GroundingSource[]
  }> {
    // 1. Perform semantic search over knowledge base
    const searchResults = await this.searchKnowledgeUseCase.execute({
      query,
      topK: 3,
      category,
      minSimilarityThreshold: 0.25,
    })

    // 2. Map to domain GroundingSources
    const groundingSources: GroundingSource[] = searchResults.map((r) => ({
      documentId: r.documentId,
      documentTitle: r.documentTitle,
      category: r.category,
      excerpt: r.chunkContent,
      similarityScore: r.similarityScore,
    }))

    // 3. Format structured grounding context for LLM prompt
    const groundingContext = buildGroundingPrompt(groundingSources)

    return { groundingContext, groundingSources }
  }
}
