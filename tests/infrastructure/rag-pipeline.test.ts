import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { chunkDocumentText } from '../../src/infrastructure/ai/chunker.js'
import {
  cosineSimilarity,
  rankChunksBySimilarity,
} from '../../src/infrastructure/ai/vector-similarity.js'
import { GeminiEmbeddingService } from '../../src/infrastructure/ai/gemini-embedding.service.js'
import { IngestDocumentUseCase } from '../../src/application/use-cases/ingest-document.use-case.js'
import { SearchKnowledgeUseCase } from '../../src/application/use-cases/search-knowledge.use-case.js'
import type {
  CreateKnowledgeDocumentInput,
  IKnowledgeRepository,
  KnowledgeChunkWithDocument,
} from '../../src/domain/repositories/i-knowledge.repository.js'
import type { KnowledgeDocumentEntity } from '../../src/domain/entities/knowledge.entity.js'

describe('RAG Pipeline & Document Ingestion (Issue #9)', () => {
  describe('Document Chunker (chunker.ts)', () => {
    it('returns empty array when given empty string', () => {
      const chunks = chunkDocumentText('')
      assert.deepEqual(chunks, [])
    })

    it('keeps short text as a single chunk', () => {
      const text = 'SOP Pelayanan surat desa Mandara tahun 2026.'
      const chunks = chunkDocumentText(text, { maxChunkSize: 200 })
      assert.equal(chunks.length, 1)
      assert.equal(chunks[0], text)
    })

    it('splits long markdown document by headers and paragraphs respecting max size', () => {
      const markdown = `
# Judul Utama SOP
Paragraf pembuka alur administrasi desa cerdas yang memuat aturan awal.

## Syarat Administrasi
Warga wajib membawa Kartu Keluarga asli dan KTP-el untuk verifikasi di loket pelayanan kantor desa.

## Alur Verifikasi
Petugas memeriksa berkas dalam 1 hari kerja dan mencetak surat resmi ber-QR code.
      `.trim()

      const chunks = chunkDocumentText(markdown, {
        maxChunkSize: 150,
        chunkOverlap: 20,
      })

      assert.ok(chunks.length >= 2, `Expected at least 2 chunks, got ${chunks.length}`)
      for (const chunk of chunks) {
        assert.ok(chunk.length > 0)
      }
    })
  })

  describe('Vector Cosine Similarity & Ranking (vector-similarity.ts)', () => {
    it('calculates exact 1.0 for identical vectors', () => {
      const vec = [0.2, 0.5, 0.8]
      const sim = cosineSimilarity(vec, vec)
      assert.ok(Math.abs(sim - 1.0) < 0.0001)
    })

    it('calculates 0.0 for orthogonal vectors', () => {
      const vecA = [1, 0, 0]
      const vecB = [0, 1, 0]
      const sim = cosineSimilarity(vecA, vecB)
      assert.equal(sim, 0)
    })

    it('ranks chunks properly and filters out below threshold', () => {
      const queryVec = [1, 0, 0]
      const chunks: KnowledgeChunkWithDocument[] = [
        {
          id: 'chunk-1',
          documentId: 'doc-1',
          chunkIndex: 1,
          chunkContent: 'Dokumen relevan',
          embedding: [0.95, 0.05, 0],
          createdAt: new Date(),
          document: {
            id: 'doc-1',
            title: 'SOP Domisili',
            category: 'SOP_LAYANAN',
          },
        },
        {
          id: 'chunk-2',
          documentId: 'doc-2',
          chunkIndex: 1,
          chunkContent: 'Dokumen tidak relevan',
          embedding: [0, 1, 0],
          createdAt: new Date(),
          document: {
            id: 'doc-2',
            title: 'Profil Desa',
            category: 'PROFIL_DESA',
          },
        },
      ]

      const ranked = rankChunksBySimilarity(queryVec, chunks, {
        topK: 2,
        minSimilarityThreshold: 0.3,
      })

      assert.equal(ranked.length, 1)
      assert.equal(ranked[0].documentTitle, 'SOP Domisili')
      assert.ok(ranked[0].similarityScore > 0.9)
    })
  })

  describe('IngestDocumentUseCase & SearchKnowledgeUseCase', () => {
    it('chunks, embeds, and saves document via IngestDocumentUseCase', async () => {
      let savedDoc: CreateKnowledgeDocumentInput | null = null

      const mockRepo: IKnowledgeRepository = {
        saveDocumentWithChunks: async (input) => {
          savedDoc = input
          return {
            id: input.id || 'doc-saved-1',
            title: input.title,
            category: input.category,
            sourceUrl: input.sourceUrl,
            contentText: input.contentText,
            metadata: input.metadata,
            isPublished: input.isPublished ?? true,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        },
        findById: async () => null,
        listDocuments: async () => [],
        getAllChunksWithEmbeddings: async () => [],
        deleteDocument: async () => {},
      }

      // Offline embedding service with deterministic fallback
      const embeddingService = new GeminiEmbeddingService({ apiKey: '' })
      const ingestUseCase = new IngestDocumentUseCase(mockRepo, embeddingService)

      const doc = await ingestUseCase.execute({
        title: 'SOP Pelayanan KTP Desa',
        category: 'SOP_LAYANAN',
        contentText: 'Syarat mengurus pengantar KTP di kantor desa Mandara harus membawa surat pengantar banjar.',
      })

      assert.equal(doc.title, 'SOP Pelayanan KTP Desa')
      assert.ok(savedDoc)
      const nonNullDoc: CreateKnowledgeDocumentInput = savedDoc
      assert.ok(nonNullDoc.chunks.length > 0)
      assert.equal(nonNullDoc.chunks[0].embedding?.length, 768)
    })

    it('executes SearchKnowledgeUseCase and returns ranked relevant chunks', async () => {
      const embeddingService = new GeminiEmbeddingService({ apiKey: '' })

      const mockChunks: KnowledgeChunkWithDocument[] = [
        {
          id: 'c-1',
          documentId: 'd-1',
          chunkIndex: 1,
          chunkContent: 'Surat Domisili diterbitkan dalam 1 hari kerja bebas biaya.',
          embedding: await embeddingService.generateEmbedding('Surat Domisili alur syarat biaya'),
          createdAt: new Date(),
          document: {
            id: 'd-1',
            title: 'SOP Surat Domisili',
            category: 'SOP_LAYANAN',
          },
        },
        {
          id: 'c-2',
          documentId: 'd-2',
          chunkIndex: 1,
          chunkContent: 'Dilarang membuang sampah ke sungai adat banjar.',
          embedding: await embeddingService.generateEmbedding('Sampah sungai sanksi banjar'),
          createdAt: new Date(),
          document: {
            id: 'd-2',
            title: 'Perdes Kebersihan',
            category: 'REGULASI',
          },
        },
      ]

      const mockRepo: IKnowledgeRepository = {
        getAllChunksWithEmbeddings: async () => mockChunks,
        findById: async () => null,
        listDocuments: async () => [],
        saveDocumentWithChunks: async () => ({} as KnowledgeDocumentEntity),
        deleteDocument: async () => {},
      }

      const searchUseCase = new SearchKnowledgeUseCase(mockRepo, embeddingService)
      const results = await searchUseCase.execute({
        query: 'Surat Domisili syarat',
        topK: 1,
      })

      assert.ok(results.length > 0)
      assert.equal(results[0].documentTitle, 'SOP Surat Domisili')
    })
  })

  // Live acceptance criteria test with real Gemini Embedding API
  const envKey = process.env.GEMINI_API_KEY
  if (envKey && envKey.trim()) {
    it('meets acceptance criteria: finds relevant SOP chunk from natural language query with live Gemini embeddings', async () => {
      const liveEmbedding = new GeminiEmbeddingService({ apiKey: envKey.trim() })

      const domisiliChunk = 'SOP Pelayanan Persuratan Desa Mandara: Warga dapat mengajukan permohonan surat domisili dan SKU melalui aplikasi DesaAI tanpa dipungut biaya retribusi.'
      const sampahChunk = 'Peraturan Desa No 03/2025: Pemilahan sampah residu dan organik wajib dilakukan setiap warga banjar, jadwal angkut hari Selasa dan Kamis.'

      const [queryVec, domisiliVec, sampahVec] = await liveEmbedding.generateBatchEmbeddings([
        'Bagaimana alur mengurus surat domisili di desa mandara?',
        domisiliChunk,
        sampahChunk,
      ])

      const simDomisili = cosineSimilarity(queryVec, domisiliVec)
      const simSampah = cosineSimilarity(queryVec, sampahVec)

      // Natural language query about domisili must score significantly higher on the domisili chunk
      assert.ok(
        simDomisili > simSampah,
        `Expected Domisili similarity (${simDomisili.toFixed(3)}) > Sampah similarity (${simSampah.toFixed(3)})`,
      )
      assert.ok(
        simDomisili > 0.5,
        `Expected similarity > 0.5, got ${simDomisili.toFixed(3)}`,
      )
    })
  }
})
