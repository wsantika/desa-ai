export type KnowledgeCategory =
  | 'REGULASI'
  | 'SOP_LAYANAN'
  | 'FAQ'
  | 'PROFIL_DESA'

export interface KnowledgeChunkEntity {
  id: string
  documentId: string
  chunkIndex: number
  chunkContent: string
  embedding: number[]
  createdAt: Date
}

export interface KnowledgeDocumentEntity {
  id: string
  title: string
  category: KnowledgeCategory
  sourceUrl?: string | null
  contentText: string
  metadata?: Record<string, unknown> | null
  isPublished: boolean
  chunks?: KnowledgeChunkEntity[]
  createdAt: Date
  updatedAt: Date
}

export interface KnowledgeSearchResult {
  chunkId: string
  documentId: string
  documentTitle: string
  category: KnowledgeCategory
  chunkContent: string
  similarityScore: number
  metadata?: Record<string, unknown> | null
}
