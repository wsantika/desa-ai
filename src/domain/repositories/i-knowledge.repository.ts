import type {
  KnowledgeCategory,
  KnowledgeChunkEntity,
  KnowledgeDocumentEntity,
} from '../entities/knowledge.entity.js'

export interface CreateKnowledgeChunkInput {
  chunkIndex: number
  chunkContent: string
  embedding?: number[]
}

export interface CreateKnowledgeDocumentInput {
  id?: string
  title: string
  category: KnowledgeCategory
  sourceUrl?: string | null
  contentText: string
  metadata?: Record<string, unknown> | null
  isPublished?: boolean
  chunks: CreateKnowledgeChunkInput[]
}

export interface KnowledgeChunkWithDocument extends KnowledgeChunkEntity {
  document: {
    id: string
    title: string
    category: KnowledgeCategory
    metadata?: unknown
  }
}

export interface IKnowledgeRepository {
  findById(id: string): Promise<KnowledgeDocumentEntity | null>
  listDocuments(filter?: {
    category?: KnowledgeCategory
    isPublished?: boolean
  }): Promise<KnowledgeDocumentEntity[]>
  saveDocumentWithChunks(
    input: CreateKnowledgeDocumentInput,
  ): Promise<KnowledgeDocumentEntity>
  getAllChunksWithEmbeddings(): Promise<KnowledgeChunkWithDocument[]>
  deleteDocument(id: string): Promise<void>
  updatePublishStatus(
    id: string,
    isPublished: boolean,
  ): Promise<KnowledgeDocumentEntity>
}
