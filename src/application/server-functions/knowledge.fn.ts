import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { PrismaKnowledgeRepository } from '../../infrastructure/repositories/prisma-knowledge.repository.js'
import { GeminiEmbeddingService } from '../../infrastructure/ai/gemini-embedding.service.js'
import { IngestDocumentUseCase } from '../use-cases/ingest-document.use-case.js'
import { SearchKnowledgeUseCase } from '../use-cases/search-knowledge.use-case.js'

export const IngestKnowledgeSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3),
  category: z.enum(['REGULASI', 'SOP_LAYANAN', 'FAQ', 'PROFIL_DESA']),
  sourceUrl: z.string().url().optional().nullable(),
  contentText: z.string().min(10),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
  chunkSize: z.number().positive().optional(),
  chunkOverlap: z.number().nonnegative().optional(),
})

export const SearchKnowledgeSchema = z.object({
  query: z.string().min(1),
  topK: z.number().int().positive().optional(),
  category: z.enum(['REGULASI', 'SOP_LAYANAN', 'FAQ', 'PROFIL_DESA']).optional(),
  minSimilarityThreshold: z.number().min(0).max(1).optional(),
})

export const ingestDocumentServerFn = createServerFn({ method: 'POST' })
  .validator((d: unknown) => IngestKnowledgeSchema.parse(d))
  .handler(async ({ data }) => {
    const repo = new PrismaKnowledgeRepository()
    const embedding = new GeminiEmbeddingService()
    const useCase = new IngestDocumentUseCase(repo, embedding)
    return useCase.execute(data)
  })

export const searchKnowledgeServerFn = createServerFn({ method: 'GET' })
  .validator((d: unknown) => SearchKnowledgeSchema.parse(d))
  .handler(async ({ data }) => {
    const repo = new PrismaKnowledgeRepository()
    const embedding = new GeminiEmbeddingService()
    const useCase = new SearchKnowledgeUseCase(repo, embedding)
    return useCase.execute(data)
  })
