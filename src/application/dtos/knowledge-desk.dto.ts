import { z } from 'zod'
import type { KnowledgeCategory } from '../../domain/entities/knowledge.entity.js'

export const KnowledgeCategorySchema = z.enum([
  'REGULASI',
  'SOP_LAYANAN',
  'FAQ',
  'PROFIL_DESA',
])

export const KnowledgeFilterSchema = z.object({
  category: z
    .enum(['ALL', 'REGULASI', 'SOP_LAYANAN', 'FAQ', 'PROFIL_DESA'])
    .default('ALL'),
  status: z.enum(['ALL', 'PUBLISHED', 'DRAFT']).default('ALL'),
  search: z.string().default(''),
})

export type KnowledgeFilterDTO = z.infer<typeof KnowledgeFilterSchema>

export const SaveKnowledgeDocumentSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .trim()
    .min(3, 'Judul dokumen minimal 3 karakter')
    .max(200, 'Judul dokumen maksimal 200 karakter'),
  category: KnowledgeCategorySchema,
  sourceUrl: z
    .string()
    .trim()
    .url('Format tautan URL tidak valid')
    .optional()
    .nullable()
    .or(z.literal('')),
  contentText: z
    .string()
    .trim()
    .min(10, 'Isi konten dokumen minimal 10 karakter untuk diindeks AI'),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
  isPublished: z.boolean().default(true),
})

export type SaveKnowledgeDocumentDTO = z.infer<
  typeof SaveKnowledgeDocumentSchema
>

export const ToggleKnowledgePublishSchema = z.object({
  id: z.string().min(1, 'ID dokumen wajib disertakan'),
  isPublished: z.boolean(),
})

export type ToggleKnowledgePublishDTO = z.infer<
  typeof ToggleKnowledgePublishSchema
>

export const DeleteKnowledgeDocumentSchema = z.object({
  id: z.string().min(1, 'ID dokumen wajib disertakan'),
})

export type DeleteKnowledgeDocumentDTO = z.infer<
  typeof DeleteKnowledgeDocumentSchema
>

export const TestKnowledgeQuerySchema = z.object({
  query: z.string().min(2, 'Pertanyaan uji coba minimal 2 karakter'),
  category: KnowledgeCategorySchema.optional(),
  topK: z.number().int().min(1).max(10).default(3),
})

export type TestKnowledgeQueryDTO = z.infer<typeof TestKnowledgeQuerySchema>

export interface KnowledgeDocumentChunkItem {
  id: string
  chunkIndex: number
  chunkContent: string
  hasEmbedding: boolean
  createdAt: string
}

export interface KnowledgeDocumentItem {
  id: string
  title: string
  category: KnowledgeCategory
  sourceUrl: string | null
  contentText: string
  metadata: Record<string, unknown> | null
  isPublished: boolean
  chunkCount: number
  chunks?: KnowledgeDocumentChunkItem[]
  createdAt: string
  updatedAt: string
}

export interface KnowledgeDeskMetrics {
  totalDocuments: number
  publishedDocuments: number
  draftDocuments: number
  totalChunks: number
  categoryCounts: Record<KnowledgeCategory, number>
  lastSyncedAt: string | null
}

export interface KnowledgeDeskData {
  documents: KnowledgeDocumentItem[]
  metrics: KnowledgeDeskMetrics
}

export interface TestRetrievalMatchItem {
  chunkIndex: number
  chunkContent: string
  documentTitle: string
  category: KnowledgeCategory
  similarityScore: number
}

export interface TestKnowledgeQueryResult {
  query: string
  retrievedChunks: TestRetrievalMatchItem[]
  aiAnswer: string
  groundedSourceCount: number
}
