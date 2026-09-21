import { createServerFn } from '@tanstack/react-start'
import {
  KnowledgeFilterSchema,
  SaveKnowledgeDocumentSchema,
  ToggleKnowledgePublishSchema,
  DeleteKnowledgeDocumentSchema,
  TestKnowledgeQuerySchema,
} from '../dtos/knowledge-desk.dto.js'
import type {
  KnowledgeDeskData,
  KnowledgeDocumentItem,
  TestKnowledgeQueryResult,
} from '../dtos/knowledge-desk.dto.js'
import { AdminKnowledgeService } from '../services/admin-knowledge.service.js'

/**
 * Fetch knowledge desk data including all documents and aggregated RAG metrics.
 */
export const getAdminKnowledgeDeskDataServerFn = createServerFn({
  method: 'GET',
})
  .validator((d: unknown) => (d ? KnowledgeFilterSchema.parse(d) : undefined))
  .handler(async ({ data }): Promise<KnowledgeDeskData> => {
    const service = new AdminKnowledgeService()
    return service.fetchKnowledgeDeskData(data)
  })

/**
 * Save (create or update) a knowledge document with automatic chunking and embedding.
 */
export const saveKnowledgeDocumentServerFn = createServerFn({
  method: 'POST',
})
  .validator((d: unknown) => SaveKnowledgeDocumentSchema.parse(d))
  .handler(async ({ data }): Promise<KnowledgeDocumentItem> => {
    const service = new AdminKnowledgeService()
    return service.saveDocument(data)
  })

/**
 * Toggle whether a document is actively used by the AI assistant.
 */
export const toggleKnowledgePublishServerFn = createServerFn({
  method: 'POST',
})
  .validator((d: unknown) => ToggleKnowledgePublishSchema.parse(d))
  .handler(async ({ data }): Promise<KnowledgeDocumentItem> => {
    const service = new AdminKnowledgeService()
    return service.togglePublishStatus(data.id, data.isPublished)
  })

/**
 * Delete a knowledge document and its vector chunks.
 */
export const deleteKnowledgeDocumentServerFn = createServerFn({
  method: 'POST',
})
  .validator((d: unknown) => DeleteKnowledgeDocumentSchema.parse(d))
  .handler(async ({ data }): Promise<{ success: boolean }> => {
    const service = new AdminKnowledgeService()
    await service.deleteDocument(data.id)
    return { success: true }
  })

/**
 * Re-index all published documents into fresh vector embeddings.
 */
export const reindexKnowledgeDocumentsServerFn = createServerFn({
  method: 'POST',
}).handler(
  async (): Promise<{
    reindexedDocuments: number
    totalChunks: number
  }> => {
    const service = new AdminKnowledgeService()
    return service.reindexAllDocuments()
  },
)

/**
 * Test RAG retrieval and generate sample grounded answer for administrators.
 */
export const testKnowledgeRetrievalServerFn = createServerFn({
  method: 'POST',
})
  .validator((d: unknown) => TestKnowledgeQuerySchema.parse(d))
  .handler(async ({ data }): Promise<TestKnowledgeQueryResult> => {
    const service = new AdminKnowledgeService()
    return service.testQuery(data)
  })
