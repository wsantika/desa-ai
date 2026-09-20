import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  SubmitServiceRequestSchema,
  TrackServiceRequestSchema,
} from '../../src/application/dtos/service-request.dto.js'
import { SubmitServiceRequestUseCase } from '../../src/application/use-cases/submit-service-request.use-case.js'
import { TrackServiceRequestUseCase } from '../../src/application/use-cases/track-service-request.use-case.js'
import type { IServiceRequestRepository } from '../../src/domain/repositories/i-service-request.repository.js'
import type { ServiceRequestEntity } from '../../src/domain/entities/service-request.entity.js'

describe('Issue #13: Self-Service Letter Request & Tracking Engine', () => {
  // Mock In-Memory Repository for clean unit testing
  class MockServiceRequestRepository implements IServiceRequestRepository {
    private requests: Map<string, ServiceRequestEntity> = new Map()

    async findById(id: string): Promise<ServiceRequestEntity | null> {
      return this.requests.get(id) ?? null
    }

    async findByTrackingCode(trackingCode: string): Promise<ServiceRequestEntity | null> {
      for (const req of this.requests.values()) {
        if (req.trackingCode === trackingCode) return req
      }
      return null
    }

    async create(input: {
      trackingCode: string
      citizenId: string
      serviceTypeId: string
      applicantName: string
      applicantNik: string
      applicantPhone: string
      purpose: string
      officerNotes?: string | null
      attachments?: Array<{ fileName: string; fileUrl: string; fileType: string }>
    }): Promise<ServiceRequestEntity> {
      const entity: ServiceRequestEntity = {
        id: `srv-mock-${Date.now()}`,
        trackingCode: input.trackingCode,
        citizenId: input.citizenId,
        serviceTypeId: input.serviceTypeId,
        serviceTypeCode: 'DOMISILI',
        serviceTypeTitle: 'Surat Keterangan Domisili',
        applicantName: input.applicantName,
        applicantNik: input.applicantNik,
        applicantPhone: input.applicantPhone,
        purpose: input.purpose,
        status: 'PENDING',
        officerNotes: input.officerNotes ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: null,
        statusLogs: [
          {
            id: 'log-1',
            requestId: 'srv-mock-1',
            previousStatus: null,
            newStatus: 'PENDING',
            actorId: null,
            notes: 'Permohonan surat baru berhasil diajukan',
            createdAt: new Date(),
          },
        ],
      }
      this.requests.set(entity.id, entity)
      return entity
    }

    async updateStatus(
      id: string,
      status: 'PENDING' | 'IN_REVIEW' | 'REVISION' | 'APPROVED' | 'REJECTED',
    ): Promise<void> {
      const existing = this.requests.get(id)
      if (existing) {
        existing.status = status
      }
    }

    async listRecent(): Promise<ServiceRequestEntity[]> {
      return Array.from(this.requests.values())
    }

    async countByStatus(): Promise<Record<'PENDING' | 'IN_REVIEW' | 'REVISION' | 'APPROVED' | 'REJECTED', number>> {
      return {
        PENDING: this.requests.size,
        IN_REVIEW: 0,
        REVISION: 0,
        APPROVED: 0,
        REJECTED: 0,
      }
    }
  }

  it('validates tracking code generator matches REQ-YYYYMM-XXXX pattern', () => {
    const mockRepo = new MockServiceRequestRepository()
    const useCase = new SubmitServiceRequestUseCase(mockRepo)

    const date = new Date(2026, 8, 20) // September 2026
    const code = useCase.generateTrackingCode(date)

    assert.match(code, /^REQ-202609-\d{4}$/, 'Tracking code must match REQ-YYYYMM-XXXX')
  })

  it('validates SubmitServiceRequestSchema constraints', () => {
    // Valid input
    const valid = SubmitServiceRequestSchema.safeParse({
      serviceTypeCode: 'DOMISILI',
      applicantName: 'I Wayan Agus Pratama',
      applicantNik: '5171010303920003',
      applicantPhone: '081234567890',
      banjarName: 'Banjar Kaja',
      purpose: 'Persyaratan pembukaan rekening bank Mandiri',
    })
    assert.ok(valid.success, 'Valid input must pass schema validation')

    // Invalid NIK length (< 16 digits)
    const invalidNik = SubmitServiceRequestSchema.safeParse({
      serviceTypeCode: 'DOMISILI',
      applicantName: 'I Wayan Agus',
      applicantNik: '12345',
      applicantPhone: '081234567890',
      banjarName: 'Banjar Kaja',
      purpose: 'Tujuan surat',
    })
    assert.strictEqual(invalidNik.success, false, 'Short NIK must fail')

    // Invalid phone
    const invalidPhone = SubmitServiceRequestSchema.safeParse({
      serviceTypeCode: 'DOMISILI',
      applicantName: 'I Wayan Agus',
      applicantNik: '5171010303920003',
      applicantPhone: 'abc',
      banjarName: 'Banjar Kaja',
      purpose: 'Tujuan surat',
    })
    assert.strictEqual(invalidPhone.success, false, 'Alpha phone must fail')
  })

  it('executes TrackServiceRequestUseCase with found and not-found cases', async () => {
    const mockRepo = new MockServiceRequestRepository()
    const trackUseCase = new TrackServiceRequestUseCase(mockRepo)

    // Not found case
    const notFoundResult = await trackUseCase.execute('REQ-202609-9999')
    assert.strictEqual(notFoundResult.found, false)
    assert.strictEqual(notFoundResult.trackingCode, 'REQ-202609-9999')

    // Seed mock record
    const created = await mockRepo.create({
      trackingCode: 'REQ-202609-0001',
      citizenId: 'citizen-1',
      serviceTypeId: 'st-domisili',
      applicantName: 'Ni Ketut Dewi Lestari',
      applicantNik: '5171010404950004',
      applicantPhone: '084444444444',
      purpose: 'Syarat beasiswa anak sekolah',
      officerNotes: 'Surat selesai ditandatangani Kepala Desa Tegal Tugu',
    })

    // Found case
    const foundResult = await trackUseCase.execute('req-202609-0001') // case insensitive
    assert.strictEqual(foundResult.found, true)
    assert.strictEqual(foundResult.trackingCode, 'REQ-202609-0001')
    assert.strictEqual(foundResult.status, 'PENDING')
    assert.strictEqual(foundResult.statusLabel, 'Menunggu Antrean Verifikasi')
    assert.strictEqual(foundResult.applicantName, 'Ni Ketut Dewi Lestari')
    assert.strictEqual(foundResult.applicantNikMasked, '517101******0004')
    assert.ok(foundResult.statusLogs && foundResult.statusLogs.length > 0)
  })

  it('validates TrackServiceRequestSchema normalization', () => {
    const parsed = TrackServiceRequestSchema.parse({ trackingCode: '  req-202609-1234  ' })
    assert.strictEqual(parsed.trackingCode, 'REQ-202609-1234')
  })
})
