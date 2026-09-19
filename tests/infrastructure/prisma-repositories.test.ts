import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { PrismaComplaintRepository } from '../../src/infrastructure/repositories/prisma-complaint.repository.js'
import { PrismaServiceRequestRepository } from '../../src/infrastructure/repositories/prisma-service-request.repository.js'
import type { PrismaClient } from '../../src/infrastructure/db/prisma.js'

describe('PrismaComplaintRepository', () => {
  it('creates complaint and status log inside transaction', async () => {
    let createdComplaintData: Record<string, unknown> | null = null
    let createdLogData: Record<string, unknown> | null = null

    const mockClient = {
      $transaction: async (fn: (tx: unknown) => Promise<unknown>) => {
        const tx = {
          complaint: {
            create: async (args: {
              data: Record<string, unknown>
              include?: unknown
            }) => {
              createdComplaintData = args.data
              return {
                id: 'cmp-123',
                ticketCode: args.data.ticketCode,
                citizenId: args.data.citizenId,
                reporterName: args.data.reporterName,
                reporterPhone: args.data.reporterPhone,
                title: args.data.title,
                description: args.data.description,
                banjarId: args.data.banjarId,
                specificLocation: args.data.specificLocation,
                photoUrl: args.data.photoUrl,
                status: args.data.status,
                category: args.data.category,
                priority: args.data.priority,
                aiSummary: args.data.aiSummary,
                createdAt: new Date(),
                updatedAt: new Date(),
                resolvedAt: null,
                banjar: { name: 'Banjar Kaja' },
                aiEvaluation: null,
                statusLogs: [],
              }
            },
          },
          complaintLog: {
            create: async (args: { data: Record<string, unknown> }) => {
              createdLogData = args.data
              return { id: 'log-1', ...args.data, createdAt: new Date() }
            },
          },
        }
        return fn(tx)
      },
    } as unknown as PrismaClient

    const repo = new PrismaComplaintRepository(mockClient)
    const result = await repo.create({
      ticketCode: 'CMP-202609-001',
      reporterName: 'Wayan Agus',
      reporterPhone: '08123456789',
      title: 'Penerangan Jalan Mati',
      description: 'Lampu penerangan di jalan utama mati',
      banjarId: 'bj-01',
      specificLocation: 'Depan Balai Banjar',
      status: 'OPEN',
      category: 'INFRASTRUKTUR',
      priority: 'MEDIUM',
      aiSummary: 'Lampu jalan mati di depan balai banjar',
    })

    assert.equal(result.id, 'cmp-123')
    assert.equal(result.ticketCode, 'CMP-202609-001')
    assert.equal(result.banjarName, 'Banjar Kaja')
    assert.ok(createdComplaintData)
    assert.ok(createdLogData)
    assert.equal(createdLogData?.complaintId, 'cmp-123')
    assert.equal(createdLogData?.newStatus, 'OPEN')
  })

  it('updates complaint status and logs audit entry', async () => {
    let updatedData: Record<string, unknown> | null = null
    let logEntry: Record<string, unknown> | null = null

    const mockClient = {
      $transaction: async (fn: (tx: unknown) => Promise<unknown>) => {
        const tx = {
          complaint: {
            findUnique: async () => ({ status: 'OPEN' }),
            update: async (args: {
              where: { id: string }
              data: Record<string, unknown>
            }) => {
              updatedData = args.data
              return { id: args.where.id }
            },
          },
          complaintLog: {
            create: async (args: { data: Record<string, unknown> }) => {
              logEntry = args.data
              return { id: 'log-2', ...args.data, createdAt: new Date() }
            },
          },
        }
        return fn(tx)
      },
    } as unknown as PrismaClient

    const repo = new PrismaComplaintRepository(mockClient)
    await repo.updateStatus('cmp-123', 'RESOLVED', {
      notes: 'Perbaikan lampu selesai dilakukan',
      actorId: 'officer-1',
    })

    assert.equal(updatedData?.status, 'RESOLVED')
    assert.ok(updatedData?.resolvedAt instanceof Date)
    assert.equal(logEntry?.previousStatus, 'OPEN')
    assert.equal(logEntry?.newStatus, 'RESOLVED')
    assert.equal(logEntry?.actionNote, 'Perbaikan lampu selesai dilakukan')
  })

  it('finds complaint by id and by ticket code', async () => {
    const mockComplaint = {
      id: 'cmp-999',
      ticketCode: 'CMP-202609-999',
      citizenId: 'c-1',
      reporterName: 'Ketut',
      reporterPhone: '08111',
      title: 'Saluran Tersumbat',
      description: 'Saluran air meluap',
      banjarId: 'bj-02',
      specificLocation: 'Jalan Kenanga',
      photoUrl: null,
      status: 'IN_PROGRESS',
      category: 'KEBERSIHAN_LINGKUNGAN',
      priority: 'HIGH',
      aiSummary: 'Saluran meluap butuh dinas PU',
      createdAt: new Date(),
      updatedAt: new Date(),
      resolvedAt: null,
      banjar: { name: 'Banjar Kelod' },
      aiEvaluation: null,
      statusLogs: [],
    }

    const mockClient = {
      complaint: {
        findUnique: async () => mockComplaint,
      },
    } as unknown as PrismaClient

    const repo = new PrismaComplaintRepository(mockClient)
    const byId = await repo.findById('cmp-999')
    const byTicket = await repo.findByTicketCode('CMP-202609-999')

    assert.equal(byId?.id, 'cmp-999')
    assert.equal(byTicket?.ticketCode, 'CMP-202609-999')
    assert.equal(byId?.banjarName, 'Banjar Kelod')
  })

  it('lists recent complaints with filters', async () => {
    let capturedWhere: Record<string, unknown> | null = null

    const mockClient = {
      complaint: {
        findMany: async (args: { where: Record<string, unknown> }) => {
          capturedWhere = args.where
          return []
        },
      },
    } as unknown as PrismaClient

    const repo = new PrismaComplaintRepository(mockClient)
    await repo.listRecent({
      banjarId: 'bj-10',
      status: 'OPEN',
      search: 'sampah',
    })

    assert.equal(capturedWhere?.banjarId, 'bj-10')
    assert.equal(capturedWhere?.status, 'OPEN')
    assert.ok(Array.isArray(capturedWhere?.OR))
  })

  it('aggregates complaint counts by status', async () => {
    const mockClient = {
      complaint: {
        groupBy: async () => [
          { status: 'OPEN', _count: { _all: 5 } },
          { status: 'IN_PROGRESS', _count: { _all: 3 } },
          { status: 'RESOLVED', _count: { _all: 8 } },
        ],
      },
    } as unknown as PrismaClient

    const repo = new PrismaComplaintRepository(mockClient)
    const counts = await repo.countByStatus()

    assert.equal(counts.OPEN, 5)
    assert.equal(counts.IN_PROGRESS, 3)
    assert.equal(counts.RESOLVED, 8)
    assert.equal(counts.REJECTED, 0)
  })
})

describe('PrismaServiceRequestRepository', () => {
  it('creates service request and initial status log', async () => {
    let createdRequestData: Record<string, unknown> | null = null
    let createdStatusLog: Record<string, unknown> | null = null

    const mockClient = {
      $transaction: async (fn: (tx: unknown) => Promise<unknown>) => {
        const tx = {
          serviceRequest: {
            create: async (args: {
              data: Record<string, unknown>
              include?: unknown
            }) => {
              createdRequestData = args.data
              return {
                id: 'req-456',
                trackingCode: args.data.trackingCode,
                userId: args.data.userId,
                serviceTypeId: args.data.serviceTypeId,
                applicantName: args.data.applicantName,
                applicantNik: args.data.applicantNik,
                applicantPhone: args.data.applicantPhone,
                purpose: args.data.purpose,
                officerNotes: null,
                status: 'PENDING',
                createdAt: new Date(),
                updatedAt: new Date(),
                completedAt: null,
                serviceType: {
                  code: 'DOMISILI',
                  title: 'Surat Keterangan Domisili',
                },
                attachments: [
                  {
                    id: 'att-1',
                    requestId: 'req-456',
                    fileName: 'ktp.jpg',
                    fileUrl: 'https://storage/ktp.jpg',
                    fileType: 'image/jpeg',
                    createdAt: new Date(),
                  },
                ],
                statusLogs: [],
              }
            },
          },
          serviceStatusLog: {
            create: async (args: { data: Record<string, unknown> }) => {
              createdStatusLog = args.data
              return { id: 'slog-1', ...args.data, createdAt: new Date() }
            },
          },
        }
        return fn(tx)
      },
    } as unknown as PrismaClient

    const repo = new PrismaServiceRequestRepository(mockClient)
    const result = await repo.create({
      trackingCode: 'REQ-202609-001',
      citizenId: 'user-001',
      serviceTypeId: 'st-domisili',
      applicantName: 'Made Suarta',
      applicantNik: '5171012345670001',
      applicantPhone: '081333444555',
      purpose: 'Pengurusan rekening bank',
      attachments: [
        {
          fileName: 'ktp.jpg',
          fileUrl: 'https://storage/ktp.jpg',
          fileType: 'image/jpeg',
        },
      ],
    })

    assert.equal(result.id, 'req-456')
    assert.equal(result.trackingCode, 'REQ-202609-001')
    assert.equal(result.serviceTypeCode, 'DOMISILI')
    assert.equal(result.attachments?.length, 1)
    assert.ok(createdRequestData)
    assert.ok(createdStatusLog)
    assert.equal(createdStatusLog?.requestId, 'req-456')
    assert.equal(createdStatusLog?.newStatus, 'PENDING')
  })

  it('updates service request status and logs status change', async () => {
    let updatedData: Record<string, unknown> | null = null
    let logData: Record<string, unknown> | null = null

    const mockClient = {
      $transaction: async (fn: (tx: unknown) => Promise<unknown>) => {
        const tx = {
          serviceRequest: {
            findUnique: async () => ({ status: 'PENDING' }),
            update: async (args: {
              where: { id: string }
              data: Record<string, unknown>
            }) => {
              updatedData = args.data
              return { id: args.where.id }
            },
          },
          serviceStatusLog: {
            create: async (args: { data: Record<string, unknown> }) => {
              logData = args.data
              return { id: 'slog-2', ...args.data, createdAt: new Date() }
            },
          },
        }
        return fn(tx)
      },
    } as unknown as PrismaClient

    const repo = new PrismaServiceRequestRepository(mockClient)
    await repo.updateStatus('req-456', 'APPROVED', {
      notes: 'Berkas lengkap dan telah disetujui',
      actorId: 'officer-02',
    })

    assert.equal(updatedData?.status, 'APPROVED')
    assert.ok(updatedData?.completedAt instanceof Date)
    assert.equal(logData?.previousStatus, 'PENDING')
    assert.equal(logData?.newStatus, 'APPROVED')
    assert.equal(logData?.notes, 'Berkas lengkap dan telah disetujui')
  })

  it('finds service request by tracking code and lists recent with filters', async () => {
    let capturedWhere: Record<string, unknown> | null = null

    const mockClient = {
      serviceRequest: {
        findUnique: async () => ({
          id: 'req-1',
          trackingCode: 'REQ-202609-001',
          userId: 'u-1',
          serviceTypeId: 'st-1',
          applicantName: 'Nyoman',
          applicantNik: '517101',
          applicantPhone: '08123',
          purpose: 'Kredit Usaha Rakyat',
          status: 'PENDING',
          officerNotes: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          completedAt: null,
          serviceType: { code: 'SKU', title: 'Surat Keterangan Usaha' },
          attachments: [],
          statusLogs: [],
        }),
        findMany: async (args: { where: Record<string, unknown> }) => {
          capturedWhere = args.where
          return []
        },
        groupBy: async () => [
          { status: 'PENDING', _count: { _all: 10 } },
          { status: 'APPROVED', _count: { _all: 25 } },
        ],
      },
    } as unknown as PrismaClient

    const repo = new PrismaServiceRequestRepository(mockClient)
    const req = await repo.findByTrackingCode('REQ-202609-001')
    assert.equal(req?.trackingCode, 'REQ-202609-001')
    assert.equal(req?.serviceTypeCode, 'SKU')

    await repo.listRecent({
      citizenId: 'u-1',
      status: 'PENDING',
      search: 'Kredit',
    })
    assert.equal(capturedWhere?.userId, 'u-1')
    assert.equal(capturedWhere?.status, 'PENDING')
    assert.ok(Array.isArray(capturedWhere?.OR))

    const counts = await repo.countByStatus()
    assert.equal(counts.PENDING, 10)
    assert.equal(counts.APPROVED, 25)
    assert.equal(counts.REJECTED, 0)
  })
})
