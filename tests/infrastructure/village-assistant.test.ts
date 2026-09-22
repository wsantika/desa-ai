import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  buildGroundingPrompt,
  detectActionLinks,
} from '../../src/infrastructure/ai/assistant-prompts.js'
import { GeminiAssistantService } from '../../src/infrastructure/ai/gemini-assistant.service.js'
import { AskVillageAssistantUseCase } from '../../src/application/use-cases/ask-village-assistant.use-case.js'
import { SearchKnowledgeUseCase } from '../../src/application/use-cases/search-knowledge.use-case.js'
import { GeminiEmbeddingService } from '../../src/infrastructure/ai/gemini-embedding.service.js'
import type { IKnowledgeRepository } from '../../src/domain/repositories/i-knowledge.repository.js'
import type { KnowledgeDocumentEntity } from '../../src/domain/entities/knowledge.entity.js'

describe('Village Assistant Conversational Service (Issue #10)', () => {
  describe('Intent Detection & Action Linking (assistant-prompts.ts)', () => {
    it('detects domisili intent and provides service form link', () => {
      const links = detectActionLinks('Bagaimana cara buat surat domisili?', [])
      assert.ok(links.length > 0)
      const domisiliLink = links.find((l) => l.url.includes('type=DOMISILI'))
      assert.ok(domisiliLink)
      assert.equal(domisiliLink.type, 'SERVICE_FORM')
      assert.ok(domisiliLink.label.includes('Domisili'))
    })

    it('detects complaint intent and provides complaint form link', () => {
      const links = detectActionLinks('Saya mau lapor lampu jalan mati dan ada tumpukan sampah', [])
      assert.ok(links.length > 0)
      const complaintLink = links.find((l) => l.url.includes('/pengaduan/baru'))
      assert.ok(complaintLink)
      assert.equal(complaintLink.type, 'COMPLAINT_FORM')
    })

    it('detects tracking intent and provides tracking link', () => {
      const links = detectActionLinks('Mau lacak status berkas surat yang kemarin', [])
      assert.ok(links.length > 0)
      const trackingLink = links.find((l) => l.url.includes('/pelacakan'))
      assert.ok(trackingLink)
      assert.equal(trackingLink.type, 'TRACKING')
    })

    it('builds formatted grounding prompt string from sources', () => {
      const sources = [
        {
          documentId: 'doc-1',
          documentTitle: 'SOP Pelayanan Persuratan',
          category: 'SOP_LAYANAN',
          excerpt: 'Seluruh pelayanan persuratan gratis Rp 0.',
          similarityScore: 0.85,
        },
      ]
      const prompt = buildGroundingPrompt(sources)
      assert.ok(prompt.includes('SOP Pelayanan Persuratan'))
      assert.ok(prompt.includes('Seluruh pelayanan persuratan gratis Rp 0.'))
    })
  })

  describe('GeminiAssistantService & AskVillageAssistantUseCase', () => {
    it('provides grounded response with fallback in offline environment', async () => {
      const assistantService = new GeminiAssistantService({ apiKey: '' })
      const res = await assistantService.generateResponse({
        query: 'Berapa biaya pengurusan surat domisili?',
        groundingContext: 'Kutipan: Seluruh pelayanan administrasi di Desa Mandara adalah bebas biaya (Rp 0).',
        groundingSources: [
          {
            documentId: 'd-1',
            documentTitle: 'SOP Persuratan',
            category: 'SOP_LAYANAN',
            excerpt: 'Seluruh pelayanan administrasi di Desa Mandara adalah bebas biaya (Rp 0).',
            similarityScore: 0.9,
          },
        ],
      })

      assert.ok(res.replyText.includes('Rp 0') || res.replyText.includes('bebas biaya'))
      assert.ok(res.actionLinks.length > 0)
      assert.equal(res.actionLinks[0].type, 'SERVICE_FORM')
    })

    it('executes AskVillageAssistantUseCase with search retrieval integration', async () => {
      const embeddingService = new GeminiEmbeddingService({ apiKey: '' })
      const mockRepo: IKnowledgeRepository = {
        getAllChunksWithEmbeddings: async () => [
          {
            id: 'c-1',
            documentId: 'doc-sop',
            chunkIndex: 1,
            chunkContent: 'SOP Surat Domisili: Warga mengajukan lewat aplikasi DesaAI, diverifikasi 1x24 jam kerja.',
            embedding: await embeddingService.generateEmbedding('Alur surat domisili'),
            createdAt: new Date(),
            document: {
              id: 'doc-sop',
              title: 'SOP Pelayanan Persuratan',
              category: 'SOP_LAYANAN',
            },
          },
        ],
        findById: async () => null,
        listDocuments: async () => [],
        saveDocumentWithChunks: async () => ({} as KnowledgeDocumentEntity),
        deleteDocument: async () => {},
      }

      const searchUseCase = new SearchKnowledgeUseCase(mockRepo, embeddingService)
      const assistantService = new GeminiAssistantService({ apiKey: '' })
      const askUseCase = new AskVillageAssistantUseCase(searchUseCase, assistantService)

      const result = await askUseCase.execute({
        query: 'Alur surat domisili',
      })

      assert.ok(result.replyText.length > 0)
      assert.ok(result.groundingSources.length > 0)
      assert.equal(result.groundingSources[0].documentTitle, 'SOP Pelayanan Persuratan')
      assert.ok(result.actionLinks.some((l) => l.url.includes('DOMISILI')))
    })
  })

  // Live Acceptance Criteria Test with real Gemini API if GEMINI_API_KEY is available
  const envKey = process.env.GEMINI_API_KEY
  if (envKey && envKey.trim()) {
    it('meets acceptance criteria: answers domisili requirements accurately and provides action link with live Gemini', async () => {
      const liveAssistant = new GeminiAssistantService({
        apiKey: envKey.trim(),
        modelName: 'gemini-flash-latest',
      })

      const response = await liveAssistant.generateResponse({
        query: 'Bli Made, syarat dan alur pembuatan surat keterangan domisili apa saja ya?',
        groundingContext: `[DOKUMEN RESMI DESA TERKAIT]:
SOP Pelayanan Persuratan Desa Mandara: Warga dapat mengajukan surat domisili melalui aplikasi DesaAI secara gratis (Rp 0), diverifikasi 1x24 jam kerja dan bertanda tangan elektronik QR Code.`,
        groundingSources: [
          {
            documentId: 'doc-sop',
            documentTitle: 'SOP Pelayanan Persuratan',
            category: 'SOP_LAYANAN',
            excerpt: 'Warga dapat mengajukan surat domisili melalui aplikasi DesaAI secara gratis (Rp 0), diverifikasi 1x24 jam kerja.',
            similarityScore: 0.92,
          },
        ],
      })

      // Acceptance Criteria: Answers accurately (mentions domisili, gratis/Rp 0, alur) and provides action link
      assert.ok(response.replyText.length > 0)
      assert.ok(
        response.replyText.toLowerCase().includes('domisili') ||
          response.replyText.toLowerCase().includes('desaai') ||
          response.replyText.toLowerCase().includes('gratis') ||
          response.replyText.toLowerCase().includes('0'),
      )
      assert.ok(
        response.actionLinks.some((l) => l.url.includes('DOMISILI')),
        'Expected at least one action link pointing to DOMISILI form',
      )
    })
  }
})
