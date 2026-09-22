import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { PrismaServiceRequestRepository } from '../../src/infrastructure/repositories/prisma-service-request.repository.js'
import { PrismaComplaintRepository } from '../../src/infrastructure/repositories/prisma-complaint.repository.js'
import { SubmitServiceRequestUseCase } from '../../src/application/use-cases/submit-service-request.use-case.js'
import { TrackServiceRequestUseCase } from '../../src/application/use-cases/track-service-request.use-case.js'
import { SubmitComplaintUseCase } from '../../src/application/use-cases/submit-complaint.use-case.js'
import { TrackComplaintUseCase } from '../../src/application/use-cases/track-complaint.use-case.js'
import { GeminiAIEvaluatorService } from '../../src/infrastructure/ai/gemini-ai-evaluator.service.js'
import {
  fetchServiceVerificationData,
  updateServiceRequestStatus,
} from '../../src/application/services/admin-service-verification.service.js'
import {
  fetchTriageDeskData,
  updateTriageComplaintStatus,
} from '../../src/application/services/admin-triage.service.js'
import { detectActionLinks } from '../../src/infrastructure/ai/assistant-prompts.js'

describe('Closed-Loop Workflow Integration Testing (Citizen-to-Government)', () => {
  const serviceRequestRepo = new PrismaServiceRequestRepository()
  const complaintRepo = new PrismaComplaintRepository()
  const aiEvaluator = new GeminiAIEvaluatorService()

  describe('Scenario 1: Layanan Persuratan Mandiri Closed-Loop', () => {
    let generatedTrackingCode = ''
    let createdRequestId = ''

    it('Step 1: Citizen asks AI about letter requirements and gets directed to service form', async () => {
      const query = 'Bagaimana syarat mengurus Surat Keterangan Domisili di Desa Tegal Tugu?'
      const mockSources = [
        {
          documentId: 'doc-sop-layanan-surat',
          documentTitle: 'SOP Pelayanan Persuratan Mandiri Desa Tegal Tugu',
          category: 'SOP_LAYANAN' as const,
          excerpt:
            'Warga dapat mengajukan permohonan surat seperti Surat Domisili, SKU, SKCK melalui aplikasi atau portal warga.',
          similarityScore: 0.92,
        },
      ]

      // Verify AI prompts helper detects service intent and directs to /layanan
      const actionLinks = detectActionLinks(query, mockSources)
      assert.ok(actionLinks.length > 0, 'Must provide action links')
      const serviceLink = actionLinks.find((l) => l.url.startsWith('/layanan'))
      assert.ok(serviceLink, 'Must direct citizen to /layanan')
      assert.equal(serviceLink.type, 'SERVICE_FORM')
    })

    it('Step 2: Citizen submits service request through self-service portal', async () => {
      const submitUseCase = new SubmitServiceRequestUseCase(serviceRequestRepo)
      const input = {
        serviceTypeCode: 'DOMISILI' as const,
        applicantName: 'I Wayan Agus Pratama',
        applicantNik: '5171010303920003',
        applicantPhone: '083333333333',
        banjarName: 'Banjar Kaja',
        purpose: 'Pengurusan rekening tabungan bank BPD Bali Kantor Cabang Gianyar',
        attachments: [
          {
            fileName: 'KTP_Agus_Pratama.pdf',
            fileUrl: 'https://storage.desa-ai.id/demo/ktp_agus.pdf',
            fileType: 'application/pdf',
          },
          {
            fileName: 'KK_Agus_Pratama.pdf',
            fileUrl: 'https://storage.desa-ai.id/demo/kk_agus.pdf',
            fileType: 'application/pdf',
          },
        ],
      }

      const result = await submitUseCase.execute(input)

      assert.ok(result.id, 'Created request must have an ID')
      assert.ok(result.trackingCode, 'Created request must have a tracking code')
      assert.match(
        result.trackingCode,
        /^REQ-\d{6}-\d{4}$/,
        'Tracking code must match REQ-YYYYMM-XXXX pattern',
      )
      assert.equal(result.status, 'PENDING')
      assert.equal(result.applicantName, input.applicantName)
      assert.equal(result.applicantNik, input.applicantNik)

      generatedTrackingCode = result.trackingCode
      createdRequestId = result.id
    })

    it('Step 3: Village Officer receives and inspects request in Verification Desk', async () => {
      const deskData = await fetchServiceVerificationData({ status: 'ALL' })

      assert.ok(deskData.counters.totalCount >= 1, 'Total count must be >= 1')
      const targetRequest = deskData.requests.find(
        (r) => r.trackingCode === generatedTrackingCode,
      )

      assert.ok(targetRequest, 'Target request must appear in verification desk')
      assert.equal(targetRequest.status, 'PENDING')
      assert.equal(targetRequest.applicantName, 'I Wayan Agus Pratama')
      assert.equal(targetRequest.serviceTypeCode, 'DOMISILI')
      assert.ok(targetRequest.attachments.length >= 2, 'Attachments must be visible')
    })

    it('Step 4: Village Officer transitions request to IN_REVIEW then APPROVES with notes', async () => {
      // Transition to IN_REVIEW
      const reviewResult = await updateServiceRequestStatus({
        requestId: createdRequestId,
        status: 'IN_REVIEW',
        notes: 'Pemeriksaan berkas fisik KTP dan kesesuaian data KK oleh Kasi Pelayanan.',
        actorId: 'user-officer-01',
      })
      assert.equal(reviewResult.success, true)
      assert.equal(reviewResult.newStatus, 'IN_REVIEW')

      // Transition to APPROVED
      const approveResult = await updateServiceRequestStatus({
        requestId: createdRequestId,
        status: 'APPROVED',
        notes: 'Dokumen lengkap dan sah. Surat Keterangan Domisili telah ditandatangani Perbekel Desa Tegal Tugu.',
        actorId: 'user-officer-01',
      })
      assert.equal(approveResult.success, true)
      assert.equal(approveResult.newStatus, 'APPROVED')
    })

    it('Step 5: Citizen tracks request in real-time and sees completed status with officer notes', async () => {
      const trackUseCase = new TrackServiceRequestUseCase(serviceRequestRepo)
      const tracked = await trackUseCase.execute(generatedTrackingCode)

      assert.equal(tracked.found, true)
      assert.equal(tracked.status, 'APPROVED')
      assert.ok(tracked.statusLabel, 'Status label must be present')
      assert.ok(
        tracked.officerNotes?.includes('Perbekel Desa Tegal Tugu'),
        'Officer approval notes must be displayed to citizen',
      )
      assert.ok(tracked.completedAt, 'Completed timestamp must be recorded')

      // Validate status timeline history
      assert.ok(tracked.statusLogs, 'Status transition logs must exist')
      assert.ok(tracked.statusLogs.length >= 2, 'Must have at least 2 transition log entries')
      const logStatuses = tracked.statusLogs.map((l) => l.status)
      assert.ok(logStatuses.includes('APPROVED'), 'Timeline must include APPROVED state')
    })
  })

  describe('Scenario 2: Pengaduan Fasilitas Cerdas & AI Triage Closed-Loop', () => {
    let generatedTicketCode = ''
    let createdComplaintId = ''

    it('Step 1: Citizen submits complaint and AI Evaluator classifies category and priority', async () => {
      const submitComplaintUseCase = new SubmitComplaintUseCase(
        complaintRepo,
        aiEvaluator,
      )

      const complaintInput = {
        title: 'Lampu penerangan jalan umum mati total di tikungan Pura Dalem',
        description:
          'Lampu jalan mati selama empat malam berturut-turut di tikungan tajam pura, jalan gelap gulita dan sangat membahayakan pengendara motor.',
        banjarId: 'banjar-kauh',
        specificLocation: 'Tikungan barat Pura Dalem Banjar Kauh',
        reporterName: 'I Made Bagus Wijaya',
        reporterPhone: '087777777777',
      }

      const result = await submitComplaintUseCase.execute(complaintInput)

      assert.ok(result.complaint.id, 'Complaint must have ID')
      assert.ok(result.complaint.ticketCode, 'Complaint must have ticket code')
      assert.match(
        result.complaint.ticketCode,
        /^CMP-\d{6}-\d{4}$/,
        'Ticket code must match CMP-YYYYMM-XXXX pattern',
      )
      assert.equal(result.complaint.status, 'OPEN')
      assert.equal(result.complaint.banjarId, 'banjar-kauh')

      // AI evaluation assertions
      assert.ok(result.evaluation, 'Must contain AI evaluation result')
      assert.equal(
        result.evaluation.category,
        'INFRASTRUKTUR',
        'Street light report must be classified as INFRASTRUKTUR',
      )
      assert.ok(
        ['HIGH', 'EMERGENCY'].includes(result.evaluation.priority),
        'Night road hazard must be assigned HIGH or EMERGENCY priority',
      )
      assert.ok(
        result.evaluation.confidenceScore > 0 && result.evaluation.confidenceScore <= 1.0,
        'Confidence score must be valid normalized float',
      )

      generatedTicketCode = result.complaint.ticketCode
      createdComplaintId = result.complaint.id
    })

    it('Step 2: Village Officer inspects Triage Desk and views AI classification', async () => {
      const triageData = await fetchTriageDeskData({ status: 'ALL' })

      assert.ok(triageData.counters.totalCount >= 1, 'Total triage count must be >= 1')
      const targetComplaint = triageData.complaints.find(
        (c) => c.ticketCode === generatedTicketCode,
      )

      assert.ok(targetComplaint, 'Target complaint must appear in triage desk')
      assert.equal(targetComplaint.status, 'OPEN')
      assert.equal(targetComplaint.category, 'INFRASTRUKTUR')
      assert.ok(targetComplaint.aiEvaluation, 'AI evaluation card must be present')
      assert.ok(
        targetComplaint.aiEvaluation.recommendedAction.length > 5,
        'Recommended action must be descriptive',
      )
    })

    it('Step 3: Village Officer transitions complaint to IN_PROGRESS and assigns field crew', async () => {
      const progressResult = await updateTriageComplaintStatus({
        complaintId: createdComplaintId,
        status: 'IN_PROGRESS',
        notes: 'Petugas teknisi sarana desa ditugaskan ke lokasi untuk penggantian bohlam LED hemat energi.',
        actorId: 'user-officer-01',
      })

      assert.equal(progressResult.success, true)
      assert.equal(progressResult.newStatus, 'IN_PROGRESS')
    })

    it('Step 4: Village Officer resolves complaint with completion evidence note', async () => {
      const resolveResult = await updateTriageComplaintStatus({
        complaintId: createdComplaintId,
        status: 'RESOLVED',
        notes: 'Penggantian 2 titik bohlam LED selesai dan lampu jalan kembali menyala terang normal.',
        proofPhotoUrl: 'https://storage.desa-ai.id/demo/perbaikan_lampu_selesai.jpg',
        actorId: 'user-officer-01',
      })

      assert.equal(resolveResult.success, true)
      assert.equal(resolveResult.newStatus, 'RESOLVED')
    })

    it('Step 5: Citizen tracks complaint status and views end-to-end resolution timeline', async () => {
      const trackComplaintUseCase = new TrackComplaintUseCase(complaintRepo)
      const tracked = await trackComplaintUseCase.execute(generatedTicketCode)

      assert.equal(tracked.found, true)
      assert.equal(tracked.status, 'RESOLVED')
      assert.equal(tracked.statusLabel, 'Selesai Ditindaklanjuti')
      assert.equal(tracked.category, 'INFRASTRUKTUR')
      assert.ok(tracked.resolvedAt, 'ResolvedAt timestamp must be present')

      // Timeline verification
      assert.ok(tracked.logs, 'Complaint logs must exist')
      assert.ok(tracked.logs.length >= 2, 'Must contain status transition entries')
      const loggedStatuses = tracked.logs.map((l) => l.status)
      assert.ok(loggedStatuses.includes('RESOLVED'), 'Timeline must include RESOLVED')
      assert.ok(
        tracked.logs.some((l) =>
          l.actionNote?.includes('lampu jalan kembali menyala terang'),
        ),
        'Action note must describe completion to citizen',
      )
    })
  })

  describe('Scenario 3: Resiliency & Network Safety Checks (No-Crash Guarantees)', () => {
    it('gracefully handles non-existent tracking code without unhandled exceptions', async () => {
      const trackServiceUseCase = new TrackServiceRequestUseCase(serviceRequestRepo)
      const trackComplaintUseCase = new TrackComplaintUseCase(complaintRepo)

      const invalidService = await trackServiceUseCase.execute('REQ-999999-9999')
      assert.equal(invalidService.found, false)

      const invalidComplaint = await trackComplaintUseCase.execute('CMP-999999-9999')
      assert.equal(invalidComplaint.found, false)
    })

    it('gracefully throws readable business errors when updating non-existent entities', async () => {
      await assert.rejects(
        async () => {
          await updateServiceRequestStatus({
            requestId: 'non-existent-req-id',
            status: 'APPROVED',
            notes: 'Test error',
          })
        },
        /tidak ditemukan/,
        'Must reject with clear not-found error message',
      )

      await assert.rejects(
        async () => {
          await updateTriageComplaintStatus({
            complaintId: 'non-existent-cmp-id',
            status: 'RESOLVED',
            notes: 'Test error',
          })
        },
        /tidak ditemukan/,
        'Must reject with clear not-found error message',
      )
    })
  })
})
