import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { describe, it } from 'node:test'
import {
  KnowledgeCategorySchema,
  KnowledgeFilterSchema,
  SaveKnowledgeDocumentSchema,
  ToggleKnowledgePublishSchema,
  DeleteKnowledgeDocumentSchema,
  TestKnowledgeQuerySchema,
} from '../../src/application/dtos/knowledge-desk.dto.js'
import { AdminKnowledgeService } from '../../src/application/services/admin-knowledge.service.js'
import { GeminiEmbeddingService } from '../../src/infrastructure/ai/gemini-embedding.service.js'
import { GeminiAssistantService } from '../../src/infrastructure/ai/gemini-assistant.service.js'
import type {
  CreateKnowledgeDocumentInput,
  IKnowledgeRepository,
  KnowledgeChunkWithDocument,
} from '../../src/domain/repositories/i-knowledge.repository.js'
import type { KnowledgeDocumentEntity } from '../../src/domain/entities/knowledge.entity.js'
import { KnowledgeStatCards } from '../../src/components/admin/knowledge/KnowledgeStatCards.js'
import { KnowledgeFilterToolbar } from '../../src/components/admin/knowledge/KnowledgeFilterToolbar.js'
import { KnowledgeDocumentTable } from '../../src/components/admin/knowledge/KnowledgeDocumentTable.js'
import { KnowledgeEditorModal } from '../../src/components/admin/knowledge/KnowledgeEditorModal.js'
import { KnowledgeDocumentPreviewModal } from '../../src/components/admin/knowledge/KnowledgeDocumentPreviewModal.js'
import { KnowledgeTestPlaygroundModal } from '../../src/components/admin/knowledge/KnowledgeTestPlaygroundModal.js'

describe('Admin Knowledge Base Desk & RAG Synchronization (Issue #19)', () => {
  describe('DTO Validation Schemas', () => {
    it('validates KnowledgeCategorySchema', () => {
      assert.equal(KnowledgeCategorySchema.parse('REGULASI'), 'REGULASI')
      assert.equal(KnowledgeCategorySchema.parse('SOP_LAYANAN'), 'SOP_LAYANAN')
      assert.equal(KnowledgeCategorySchema.parse('FAQ'), 'FAQ')
      assert.equal(KnowledgeCategorySchema.parse('PROFIL_DESA'), 'PROFIL_DESA')

      assert.throws(() => {
        KnowledgeCategorySchema.parse('INVALID_CAT')
      })
    })

    it('validates KnowledgeFilterSchema defaults and custom queries', () => {
      const defaultParsed = KnowledgeFilterSchema.parse({})
      assert.equal(defaultParsed.category, 'ALL')
      assert.equal(defaultParsed.status, 'ALL')
      assert.equal(defaultParsed.search, '')

      const customParsed = KnowledgeFilterSchema.parse({
        category: 'SOP_LAYANAN',
        status: 'PUBLISHED',
        search: 'domisili',
      })
      assert.equal(customParsed.category, 'SOP_LAYANAN')
      assert.equal(customParsed.status, 'PUBLISHED')
      assert.equal(customParsed.search, 'domisili')

      assert.throws(() => {
        KnowledgeFilterSchema.parse({ status: 'UNKNOWN_STATUS' })
      })
    })

    it('validates SaveKnowledgeDocumentSchema constraints', () => {
      const valid = SaveKnowledgeDocumentSchema.parse({
        title: '  SOP Surat Keterangan Usaha  ',
        category: 'SOP_LAYANAN',
        contentText: '## Syarat SKU\n1. KTP Pemohon\n2. Foto tempat usaha',
        sourceUrl: 'https://desamandara.id/sop-sku',
        isPublished: true,
      })

      assert.equal(valid.title, 'SOP Surat Keterangan Usaha')
      assert.equal(valid.category, 'SOP_LAYANAN')
      assert.equal(valid.isPublished, true)

      // Title too short should throw
      assert.throws(() => {
        SaveKnowledgeDocumentSchema.parse({
          title: 'AB',
          category: 'FAQ',
          contentText: 'Konten dokumen',
        })
      })

      // Content too short should throw
      assert.throws(() => {
        SaveKnowledgeDocumentSchema.parse({
          title: 'Judul Valid',
          category: 'FAQ',
          contentText: 'pendek',
        })
      })
    })

    it('validates ToggleKnowledgePublishSchema', () => {
      const parsed = ToggleKnowledgePublishSchema.parse({
        id: 'doc-123',
        isPublished: false,
      })
      assert.equal(parsed.id, 'doc-123')
      assert.equal(parsed.isPublished, false)

      assert.throws(() => {
        ToggleKnowledgePublishSchema.parse({ id: '', isPublished: true })
      })
    })

    it('validates DeleteKnowledgeDocumentSchema', () => {
      const parsed = DeleteKnowledgeDocumentSchema.parse({
        id: 'doc-to-delete',
      })
      assert.equal(parsed.id, 'doc-to-delete')

      assert.throws(() => {
        DeleteKnowledgeDocumentSchema.parse({ id: '' })
      })
    })

    it('validates TestKnowledgeQuerySchema', () => {
      const parsed = TestKnowledgeQuerySchema.parse({
        query: 'Bagaimana cara buat surat domisili?',
      })
      assert.equal(parsed.query, 'Bagaimana cara buat surat domisili?')
      assert.equal(parsed.topK, 3)

      assert.throws(() => {
        TestKnowledgeQuerySchema.parse({ query: 'a' })
      })
    })
  })

  describe('AdminKnowledgeService (Business Logic & Orchestration)', () => {
    // In-memory mock repository implementing IKnowledgeRepository
    function createMockRepo(
      initialDocs: KnowledgeDocumentEntity[] = [],
    ): IKnowledgeRepository {
      const docs = new Map<string, KnowledgeDocumentEntity>()
      for (const d of initialDocs) {
        docs.set(d.id, d)
      }

      return {
        saveDocumentWithChunks: async (input: CreateKnowledgeDocumentInput) => {
          const id =
            input.id ||
            `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
          const entity: KnowledgeDocumentEntity = {
            id,
            title: input.title,
            category: input.category,
            sourceUrl: input.sourceUrl ?? null,
            contentText: input.contentText,
            metadata: input.metadata ?? null,
            isPublished: input.isPublished ?? true,
            createdAt: docs.has(id) ? docs.get(id)!.createdAt : new Date(),
            updatedAt: new Date(),
            chunks: input.chunks.map((c, idx) => ({
              id: `chunk-${id}-${idx + 1}`,
              documentId: id,
              chunkIndex: c.chunkIndex,
              chunkContent: c.chunkContent,
              embedding: c.embedding ?? [],
              createdAt: new Date(),
            })),
          }
          docs.set(id, entity)
          return entity
        },
        findById: async (id: string) => docs.get(id) || null,
        listDocuments: async () => Array.from(docs.values()),
        getAllChunksWithEmbeddings: async () => {
          const chunks: KnowledgeChunkWithDocument[] = []
          for (const doc of docs.values()) {
            if (!doc.isPublished) continue
            if (doc.chunks) {
              for (const c of doc.chunks) {
                chunks.push({
                  id: c.id,
                  documentId: doc.id,
                  chunkIndex: c.chunkIndex,
                  chunkContent: c.chunkContent,
                  embedding: c.embedding,
                  createdAt: c.createdAt,
                  document: {
                    id: doc.id,
                    title: doc.title,
                    category: doc.category,
                  },
                })
              }
            }
          }
          return chunks
        },
        updatePublishStatus: async (id: string, isPublished: boolean) => {
          const existing = docs.get(id)
          if (!existing) {
            throw new Error(`Dokumen dengan ID "${id}" tidak ditemukan`)
          }
          const updated: KnowledgeDocumentEntity = {
            ...existing,
            isPublished,
            updatedAt: new Date(),
          }
          docs.set(id, updated)
          return updated
        },
        deleteDocument: async (id: string) => {
          docs.delete(id)
        },
      }
    }

    const sampleDocs: KnowledgeDocumentEntity[] = [
      {
        id: 'doc-1',
        title: 'SOP Pembuatan Surat Pengantar Domisili',
        category: 'SOP_LAYANAN',
        sourceUrl: 'https://desamandara.id/sop-domisili',
        contentText:
          '## Syarat Domisili\n1. KTP dan Kartu Keluarga asli.\n2. Proses 1 hari kerja gratis.',
        metadata: { versi: '1.2' },
        isPublished: true,
        createdAt: new Date('2026-01-01T08:00:00Z'),
        updatedAt: new Date('2026-01-02T10:00:00Z'),
        chunks: [
          {
            id: 'c-1',
            documentId: 'doc-1',
            chunkIndex: 1,
            chunkContent:
              '## Syarat Domisili\n1. KTP dan Kartu Keluarga asli.\n2. Proses 1 hari kerja gratis.',
            embedding: new Array(768).fill(0.1),
            createdAt: new Date(),
          },
        ],
      },
      {
        id: 'doc-2',
        title: 'Perdes Kebersihan dan Pengolahan Sampah Banjar',
        category: 'REGULASI',
        sourceUrl: null,
        contentText:
          '## Perdes No. 04/2025\nWajib memilah sampah organik dan anorganik.',
        metadata: null,
        isPublished: false,
        createdAt: new Date('2026-01-05T08:00:00Z'),
        updatedAt: new Date('2026-01-05T08:00:00Z'),
        chunks: [
          {
            id: 'c-2',
            documentId: 'doc-2',
            chunkIndex: 1,
            chunkContent:
              '## Perdes No. 04/2025\nWajib memilah sampah organik dan anorganik.',
            embedding: new Array(768).fill(0.2),
            createdAt: new Date(),
          },
        ],
      },
    ]

    it('fetches knowledge desk data with accurate metrics and category counts', async () => {
      const mockRepo = createMockRepo(sampleDocs)
      const embeddingService = new GeminiEmbeddingService({ apiKey: '' })
      const service = new AdminKnowledgeService(mockRepo, embeddingService)

      const data = await service.fetchKnowledgeDeskData()
      assert.equal(data.documents.length, 2)
      assert.equal(data.metrics.totalDocuments, 2)
      assert.equal(data.metrics.publishedDocuments, 1)
      assert.equal(data.metrics.draftDocuments, 1)
      assert.equal(data.metrics.totalChunks, 2)
      assert.equal(data.metrics.categoryCounts.SOP_LAYANAN, 1)
      assert.equal(data.metrics.categoryCounts.REGULASI, 1)
      assert.equal(data.metrics.categoryCounts.FAQ, 0)
      assert.ok(data.metrics.lastSyncedAt)
    })

    it('filters documents by category, status, and search query', async () => {
      const mockRepo = createMockRepo(sampleDocs)
      const embeddingService = new GeminiEmbeddingService({ apiKey: '' })
      const service = new AdminKnowledgeService(mockRepo, embeddingService)

      // Filter by category
      const perdesOnly = await service.fetchKnowledgeDeskData({
        category: 'REGULASI',
      })
      assert.equal(perdesOnly.documents.length, 1)
      assert.equal(perdesOnly.documents[0].id, 'doc-2')

      // Filter by status PUBLISHED
      const publishedOnly = await service.fetchKnowledgeDeskData({
        status: 'PUBLISHED',
      })
      assert.equal(publishedOnly.documents.length, 1)
      assert.equal(publishedOnly.documents[0].id, 'doc-1')

      // Filter by status DRAFT
      const draftOnly = await service.fetchKnowledgeDeskData({
        status: 'DRAFT',
      })
      assert.equal(draftOnly.documents.length, 1)
      assert.equal(draftOnly.documents[0].id, 'doc-2')

      // Filter by search query
      const searchRes = await service.fetchKnowledgeDeskData({
        search: 'domisili',
      })
      assert.equal(searchRes.documents.length, 1)
      assert.equal(searchRes.documents[0].id, 'doc-1')
    })

    it('saves a new document, chunks it, and generates embeddings', async () => {
      const mockRepo = createMockRepo([])
      const embeddingService = new GeminiEmbeddingService({ apiKey: '' })
      const service = new AdminKnowledgeService(mockRepo, embeddingService)

      const saved = await service.saveDocument({
        title: 'FAQ Layanan Desa Digital Mandara',
        category: 'FAQ',
        contentText:
          'Pertanyaan: Berapa lama pembuatan surat di desa?\nJawaban: Maksimal 1 hari kerja untuk surat keterangan biasa.',
        isPublished: true,
      })

      assert.ok(saved.id)
      assert.equal(saved.title, 'FAQ Layanan Desa Digital Mandara')
      assert.equal(saved.category, 'FAQ')
      assert.equal(saved.isPublished, true)
      assert.ok(saved.chunkCount >= 1)

      const listAfter = await service.fetchKnowledgeDeskData()
      assert.equal(listAfter.metrics.totalDocuments, 1)
    })

    it('toggles document publish status seamlessly', async () => {
      const mockRepo = createMockRepo(sampleDocs)
      const embeddingService = new GeminiEmbeddingService({ apiKey: '' })
      const service = new AdminKnowledgeService(mockRepo, embeddingService)

      // Toggle doc-2 to published
      const updated = await service.togglePublishStatus('doc-2', true)
      assert.equal(updated.isPublished, true)

      const deskData = await service.fetchKnowledgeDeskData()
      assert.equal(deskData.metrics.publishedDocuments, 2)
      assert.equal(deskData.metrics.draftDocuments, 0)
    })

    it('deletes a document and updates metrics', async () => {
      const mockRepo = createMockRepo(sampleDocs)
      const embeddingService = new GeminiEmbeddingService({ apiKey: '' })
      const service = new AdminKnowledgeService(mockRepo, embeddingService)

      await service.deleteDocument('doc-2')

      const deskData = await service.fetchKnowledgeDeskData()
      assert.equal(deskData.metrics.totalDocuments, 1)
      assert.equal(deskData.documents[0].id, 'doc-1')
    })

    it('reindexes all documents and reports count', async () => {
      const mockRepo = createMockRepo(sampleDocs)
      const embeddingService = new GeminiEmbeddingService({ apiKey: '' })
      const service = new AdminKnowledgeService(mockRepo, embeddingService)

      const result = await service.reindexAllDocuments()
      assert.equal(result.reindexedDocuments, 2)
      assert.ok(result.totalChunks >= 2)
    })
  })

  describe('Acceptance Criteria: Admin SOP Update Immediately Grounding AI', () => {
    it('updates SOP document and AI retrieval immediately grounds on the latest updated rule', async () => {
      const mockRepo: IKnowledgeRepository = (() => {
        let currentDoc: KnowledgeDocumentEntity = {
          id: 'sop-ktp-1',
          title: 'SOP Permohonan Pengantar KTP',
          category: 'SOP_LAYANAN',
          sourceUrl: null,
          contentText:
            'Syarat pengantar KTP lama: Membawa Kartu Keluarga versi fotokopi.',
          metadata: null,
          isPublished: true,
          createdAt: new Date('2026-01-01'),
          updatedAt: new Date('2026-01-01'),
          chunks: [],
        }

        return {
          saveDocumentWithChunks: async (input) => {
            currentDoc = {
              id: input.id || 'sop-ktp-1',
              title: input.title,
              category: input.category,
              sourceUrl: input.sourceUrl ?? null,
              contentText: input.contentText,
              metadata: input.metadata ?? null,
              isPublished: input.isPublished ?? true,
              createdAt: currentDoc.createdAt,
              updatedAt: new Date(),
              chunks: input.chunks.map((c, i) => ({
                id: `chunk-${i}`,
                documentId: input.id || 'sop-ktp-1',
                chunkIndex: c.chunkIndex,
                chunkContent: c.chunkContent,
                embedding: c.embedding ?? [],
                createdAt: new Date(),
              })),
            }
            return currentDoc
          },
          findById: async () => currentDoc,
          listDocuments: async () => [currentDoc],
          getAllChunksWithEmbeddings: async () => {
            return (currentDoc.chunks || []).map((c) => ({
              id: c.id,
              documentId: currentDoc.id,
              chunkIndex: c.chunkIndex,
              chunkContent: c.chunkContent,
              embedding: c.embedding,
              createdAt: c.createdAt,
              document: {
                id: currentDoc.id,
                title: currentDoc.title,
                category: currentDoc.category,
              },
            }))
          },
          updatePublishStatus: async (_, isPublished) => {
            currentDoc.isPublished = isPublished
            return currentDoc
          },
          deleteDocument: async () => {},
        }
      })()

      const embeddingService = new GeminiEmbeddingService({ apiKey: '' })
      const assistantService = new GeminiAssistantService({ apiKey: '' })
      const service = new AdminKnowledgeService(
        mockRepo,
        embeddingService,
        assistantService,
      )

      // Step 1: Initial ingest of original SOP
      await service.saveDocument({
        id: 'sop-ktp-1',
        title: 'SOP Permohonan Pengantar KTP',
        category: 'SOP_LAYANAN',
        contentText: 'Syarat awal: Warga cukup membawa fotokopi KK.',
        isPublished: true,
      })

      // Query before update
      const initialTest = await service.testQuery({
        query: 'Apa syarat pengantar KTP?',
        category: 'SOP_LAYANAN',
      })
      assert.ok(initialTest.retrievedChunks.length > 0)
      assert.ok(
        initialTest.retrievedChunks[0].chunkContent.includes('fotokopi KK'),
      )

      // Step 2: Administrator updates SOP with new stringent rules
      const updatedRuleText =
        'ATURAN BARU 2026: Warga wajib membawa KTP-el asli, Kartu Keluarga barcode resmi, dan surat pengantar Kepala Dusun terbaru.'
      await service.saveDocument({
        id: 'sop-ktp-1',
        title: 'SOP Permohonan Pengantar KTP',
        category: 'SOP_LAYANAN',
        contentText: updatedRuleText,
        isPublished: true,
      })

      // Step 3: Immediate query simulation
      const afterUpdateTest = await service.testQuery({
        query: 'Apa syarat pengantar KTP?',
        category: 'SOP_LAYANAN',
      })

      assert.ok(afterUpdateTest.retrievedChunks.length > 0)
      const topChunk = afterUpdateTest.retrievedChunks[0]

      // AI retrieval immediately contains the updated regulation
      assert.ok(
        topChunk.chunkContent.includes('ATURAN BARU 2026'),
        'Top chunk must reflect new rule',
      )
      assert.ok(
        topChunk.chunkContent.includes('surat pengantar Kepala Dusun terbaru'),
        'Top chunk must contain the new requirement',
      )
      assert.ok(
        !topChunk.chunkContent.includes('fotokopi KK'),
        'Obsolete text must no longer be returned',
      )
      assert.ok(afterUpdateTest.aiAnswer.length > 0)
    })
  })

  describe('UI Components Export and Structure', () => {
    it('exports all admin knowledge components as valid React components', () => {
      assert.equal(typeof KnowledgeStatCards, 'function')
      assert.equal(typeof KnowledgeFilterToolbar, 'function')
      assert.equal(typeof KnowledgeDocumentTable, 'function')
      assert.equal(typeof KnowledgeEditorModal, 'function')
      assert.equal(typeof KnowledgeDocumentPreviewModal, 'function')
      assert.equal(typeof KnowledgeTestPlaygroundModal, 'function')
    })
  })

  describe('Antislop Compliance (Zero Em Dash Rule R-02)', () => {
    it('verifies that no em dash characters (—) exist in any Issue #19 files', () => {
      const filesToCheck = [
        'src/application/dtos/knowledge-desk.dto.ts',
        'src/application/services/admin-knowledge.service.ts',
        'src/application/server-functions/admin-knowledge.fn.ts',
        'src/components/admin/knowledge/KnowledgeStatCards.tsx',
        'src/components/admin/knowledge/KnowledgeFilterToolbar.tsx',
        'src/components/admin/knowledge/KnowledgeDocumentTable.tsx',
        'src/components/admin/knowledge/KnowledgeEditorModal.tsx',
        'src/components/admin/knowledge/KnowledgeDocumentPreviewModal.tsx',
        'src/components/admin/knowledge/KnowledgeTestPlaygroundModal.tsx',
        'src/routes/admin/knowledge.tsx',
      ]

      for (const relPath of filesToCheck) {
        const fullPath = path.resolve(process.cwd(), relPath)
        assert.ok(fs.existsSync(fullPath), `File ${relPath} must exist`)
        const content = fs.readFileSync(fullPath, 'utf-8')
        assert.ok(
          !content.includes('—'),
          `File ${relPath} contains forbidden em dash character (—)`,
        )
      }
    })
  })
})
