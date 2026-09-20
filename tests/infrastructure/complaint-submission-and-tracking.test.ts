import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  createComplaintSchema,
  trackComplaintSchema,
} from '../../src/application/dtos/complaint.dto.js'
import { SubmitComplaintUseCase } from '../../src/application/use-cases/submit-complaint.use-case.js'
import { TrackComplaintUseCase } from '../../src/application/use-cases/track-complaint.use-case.js'
import type { IComplaintRepository } from '../../src/domain/repositories/i-complaint.repository.js'
import type { ComplaintEntity } from '../../src/domain/entities/complaint.entity.js'
import type {
  IAIEvaluatorService,
  AIEvaluationResult,
} from '../../src/domain/repositories/i-ai-evaluator.service.js'

describe('Issue #14: Complaint Submission & Tracking Status Engine', () => {
  // Mock In-Memory Repository
  class MockComplaintRepository implements IComplaintRepository {
    private complaints: Map<string, ComplaintEntity> = new Map()

    async findById(id: string): Promise<ComplaintEntity | null> {
      for (const comp of this.complaints.values()) {
        if (comp.id === id) return comp
      }
      return null
    }

    async findByTicketCode(ticketCode: string): Promise<ComplaintEntity | null> {
      for (const comp of this.complaints.values()) {
        if (comp.ticketCode === ticketCode) return comp
      }
      return null
    }

    async create(input: {
      ticketCode: string
      title: string
      description: string
      citizenId?: string | null
      banjarId: string
      banjarName?: string
      specificLocation?: string | null
      photoUrl?: string | null
      reporterName?: string | null
      reporterPhone?: string | null
      category?: ComplaintEntity['category']
      priority?: ComplaintEntity['priority']
      aiSummary?: string | null
      aiEvaluation?: AIEvaluationResult
    }): Promise<ComplaintEntity> {
      const entity: ComplaintEntity = {
        id: `cmp-mock-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        ticketCode: input.ticketCode,
        citizenId: input.citizenId ?? null,
        banjarId: input.banjarId,
        banjarName: input.banjarName ?? 'Banjar Kaja',
        title: input.title,
        description: input.description,
        specificLocation: input.specificLocation ?? null,
        photoUrl: input.photoUrl ?? null,
        reporterName: input.reporterName ?? 'Warga Tegal Tugu',
        reporterPhone: input.reporterPhone ?? null,
        status: 'OPEN',
        category: input.category ?? null,
        priority: input.priority ?? null,
        aiSummary: input.aiSummary ?? null,
        aiEvaluation: input.aiEvaluation,
        createdAt: new Date(),
        updatedAt: new Date(),
        resolvedAt: null,
        statusLogs: [
          {
            id: 'log-1',
            complaintId: `cmp-mock-1`,
            previousStatus: null,
            newStatus: 'OPEN',
            actionNote: 'Pengaduan baru diajukan melalui portal warga Desa Tegal Tugu',
            changedById: null,
            createdAt: new Date(),
          },
        ],
      }
      this.complaints.set(entity.ticketCode, entity)
      return entity
    }

    async updateStatus(input: {
      id: string
      status: ComplaintEntity['status']
      actionNote?: string | null
      changedById?: string | null
    }): Promise<ComplaintEntity> {
      for (const comp of this.complaints.values()) {
        if (comp.id === input.id) {
          const previousStatus = comp.status
          comp.status = input.status
          comp.updatedAt = new Date()
          if (input.status === 'RESOLVED') {
            comp.resolvedAt = new Date()
          }
          comp.statusLogs = comp.statusLogs || []
          comp.statusLogs.push({
            id: `log-${comp.statusLogs.length + 1}`,
            complaintId: comp.id,
            previousStatus,
            newStatus: input.status,
            actionNote: input.actionNote ?? null,
            changedById: input.changedById ?? null,
            createdAt: new Date(),
          })
          return comp
        }
      }
      throw new Error('Complaint not found')
    }

    async findRecent(): Promise<ComplaintEntity[]> {
      return Array.from(this.complaints.values())
    }

    async countByStatus(): Promise<Record<string, number>> {
      return {}
    }
  }

  // Mock AI Evaluator
  class MockEvaluator implements IAIEvaluatorService {
    async evaluateComplaint(title: string, description: string): Promise<AIEvaluationResult> {
      return {
        category: 'INFRASTRUKTUR',
        priority: 'HIGH',
        confidenceScore: 0.95,
        summary: `Keluhan fasilitas: ${title}`,
        recommendedAction: 'Kirim regu pemeliharaan jalan desa',
        keywords: ['jalan', 'rusak', 'banjar'],
      }
    }
  }

  it('validates ticket code generator matches CMP-YYYYMM-XXXX pattern', async () => {
    const repo = new MockComplaintRepository()
    const evaluator = new MockEvaluator()
    const useCase = new SubmitComplaintUseCase(repo, evaluator)

    const { complaint } = await useCase.execute({
      title: 'Jalan Rusak Berlubang Parah',
      description: 'Ada lubang besar di persimpangan jalan utama banjar kaja membahayakan pengendara motor.',
      banjarId: 'banjar-kaja',
      specificLocation: 'Dekat wantilan Banjar Kaja',
      reporterName: 'Wayan Sudirga',
      reporterPhone: '081234567890',
    })

    const regex = /^CMP-\d{6}-\d{4}$/
    assert.match(
      complaint.ticketCode,
      regex,
      `Expected ${complaint.ticketCode} to match CMP-YYYYMM-XXXX format`
    )
    assert.equal(complaint.status, 'OPEN')
    assert.equal(complaint.category, 'INFRASTRUKTUR')
    assert.equal(complaint.priority, 'HIGH')
    assert.equal(complaint.reporterName, 'Wayan Sudirga')
    assert.ok(complaint.aiEvaluation)
    assert.equal(complaint.aiEvaluation.recommendedAction, 'Kirim regu pemeliharaan jalan desa')
  })

  it('validates createComplaintSchema constraints', () => {
    // Valid input
    const valid = createComplaintSchema.safeParse({
      title: 'Lampu Penerangan Jalan Mati',
      description: 'Sudah 3 hari lampu jalan di gang mawar mati gelap gulita.',
      banjarId: 'banjar-kelod',
      specificLocation: 'Jalan Kenanga Gang 2',
      reporterName: 'Ketut Astawa',
    })
    assert.equal(valid.success, true)

    // Missing specificLocation
    const missingLocation = createComplaintSchema.safeParse({
      title: 'Lampu Penerangan Jalan Mati',
      description: 'Sudah 3 hari lampu jalan di gang mawar mati gelap gulita.',
      banjarId: 'banjar-kelod',
      reporterName: 'Ketut Astawa',
    })
    assert.equal(missingLocation.success, false)

    // Title too short (< 5 chars)
    const tooShortTitle = createComplaintSchema.safeParse({
      title: 'Hai',
      description: 'Deskripsi lengkap kendala di pemukiman warga desa.',
      banjarId: 'banjar-kelod',
      specificLocation: 'Depan wantilan',
      reporterName: 'Ketut Astawa',
    })
    assert.equal(tooShortTitle.success, false)

    // Description too short (< 10 chars)
    const tooShortDesc = createComplaintSchema.safeParse({
      title: 'Lampu Jalan Mati',
      description: 'Pendek',
      banjarId: 'banjar-kelod',
      specificLocation: 'Depan wantilan',
      reporterName: 'Ketut Astawa',
    })
    assert.equal(tooShortDesc.success, false)
  })

  it('validates trackComplaintSchema normalization and formatting', () => {
    // Trims and capitalizes lowercase input
    const parsed = trackComplaintSchema.parse({
      ticketCode: '  cmp-202609-1234  ',
    })
    assert.equal(parsed.ticketCode, 'CMP-202609-1234')

    // Rejects empty code
    const invalidEmpty = trackComplaintSchema.safeParse({
      ticketCode: '   ',
    })
    assert.equal(invalidEmpty.success, false)
  })

  it('executes TrackComplaintUseCase returning found tracking details with formatted labels', async () => {
    const repo = new MockComplaintRepository()
    const evaluator = new MockEvaluator()
    const submitUseCase = new SubmitComplaintUseCase(repo, evaluator)
    const trackUseCase = new TrackComplaintUseCase(repo)

    const { complaint: created } = await submitUseCase.execute({
      title: 'Pipa Air Bersih Banjar Bocor',
      description: 'Saluran pipa air bersih banjar tengah bocor menggenangi jalan warga.',
      banjarId: 'banjar-tengah',
      specificLocation: 'Dekat wantilan Banjar Tengah',
      reporterName: 'Made Artha',
    })

    // Query with valid uppercase code
    const foundResult = await trackUseCase.execute(created.ticketCode)
    assert.equal(foundResult.found, true)
    assert.equal(foundResult.ticketCode, created.ticketCode)
    assert.equal(foundResult.status, 'OPEN')
    assert.equal(foundResult.statusLabel, 'Laporan Diterima — Menunggu Disposisi')
    assert.equal(foundResult.category, 'INFRASTRUKTUR')
    assert.equal(foundResult.categoryLabel, 'Infrastruktur Jalan & Bangunan')
    assert.equal(foundResult.priority, 'HIGH')
    assert.equal(foundResult.priorityLabel, 'Tinggi (High)')
    assert.ok(foundResult.recommendedAction)
    assert.equal(foundResult.logs?.length, 1)

    // Query non-existent ticket code
    const notFoundResult = await trackUseCase.execute('CMP-999999-XXXX')
    assert.equal(notFoundResult.found, false)
    assert.equal(notFoundResult.ticketCode, 'CMP-999999-XXXX')
    assert.equal(notFoundResult.title, undefined)
  })

  it('handles status transitions and formats progress statuses correctly in tracking', async () => {
    const repo = new MockComplaintRepository()
    const evaluator = new MockEvaluator()
    const submitUseCase = new SubmitComplaintUseCase(repo, evaluator)
    const trackUseCase = new TrackComplaintUseCase(repo)

    const { complaint: created } = await submitUseCase.execute({
      title: 'Penumpukan Sampah di Dekat Sungai',
      description: 'Tumpukan sampah plastik liar belum diangkut di dekat jembatan perbatasan.',
      banjarId: 'banjar-kangin',
      specificLocation: 'Jembatan perbatasan banjar',
      reporterName: 'Warga Banjar Kangin',
    })

    // Advance to IN_PROGRESS
    await repo.updateStatus({
      id: created.id,
      status: 'IN_PROGRESS',
      actionNote: 'Petugas kebersihan DLHK Desa Tegal Tugu dikerahkan ke lokasi',
    })

    let tracked = await trackUseCase.execute(created.ticketCode)
    assert.equal(tracked.status, 'IN_PROGRESS')
    assert.equal(tracked.statusLabel, 'Sedang Ditangani di Lapangan')
    assert.equal(tracked.logs?.length, 2)
    assert.equal(tracked.logs?.[1].actionNote, 'Petugas kebersihan DLHK Desa Tegal Tugu dikerahkan ke lokasi')

    // Advance to RESOLVED
    await repo.updateStatus({
      id: created.id,
      status: 'RESOLVED',
      actionNote: 'Lokasi telah bersih, sampah diangkut ke TPS3R Desa Tegal Tugu',
    })

    tracked = await trackUseCase.execute(created.ticketCode)
    assert.equal(tracked.status, 'RESOLVED')
    assert.equal(tracked.statusLabel, 'Selesai Ditindaklanjuti')
    assert.ok(tracked.resolvedAt)
    assert.equal(tracked.logs?.length, 3)
  })
})
