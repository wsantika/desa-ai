import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { PrismaKnowledgeRepository } from '../../infrastructure/repositories/prisma-knowledge.repository.js'
import { GeminiEmbeddingService } from '../../infrastructure/ai/gemini-embedding.service.js'
import { GeminiAssistantService } from '../../infrastructure/ai/gemini-assistant.service.js'
import { SearchKnowledgeUseCase } from '../use-cases/search-knowledge.use-case.js'
import { AskVillageAssistantUseCase } from '../use-cases/ask-village-assistant.use-case.js'

export const AskAssistantSchema = z.object({
  query: z.string().min(1),
  category: z.enum(['REGULASI', 'SOP_LAYANAN', 'FAQ', 'PROFIL_DESA']).optional(),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string(),
      }),
    )
    .optional(),
})

export const askAssistantServerFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => AskAssistantSchema.parse(data))
  .handler(async ({ data }) => {
    const knowledgeRepo = new PrismaKnowledgeRepository()
    const embeddingService = new GeminiEmbeddingService()
    const searchUseCase = new SearchKnowledgeUseCase(knowledgeRepo, embeddingService)
    const assistantService = new GeminiAssistantService()

    const useCase = new AskVillageAssistantUseCase(searchUseCase, assistantService)
    return useCase.execute(data)
  })
