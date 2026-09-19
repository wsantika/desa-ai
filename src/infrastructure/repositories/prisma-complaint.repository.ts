import { prisma } from '../db/prisma.js'
import type { PrismaClient } from '../db/prisma.js'
import type {
  ComplaintCategory,
  ComplaintEntity,
  ComplaintPriority,
  ComplaintStatus,
} from '../../domain/entities/complaint.entity.js'
import type {
  ComplaintFilterOptions,
  CreateComplaintInput,
  IComplaintRepository,
  UpdateComplaintStatusOptions,
} from '../../domain/repositories/i-complaint.repository.js'

export class PrismaComplaintRepository implements IComplaintRepository {
  constructor(private readonly client: PrismaClient = prisma) {}

  async findById(id: string): Promise<ComplaintEntity | null> {
    const complaint = await this.client.complaint.findUnique({
      where: { id },
      include: {
        banjar: true,
        aiEvaluation: true,
        statusLogs: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!complaint) return null
    return this.toDomainEntity(complaint)
  }

  async findByTicketCode(ticketCode: string): Promise<ComplaintEntity | null> {
    const complaint = await this.client.complaint.findUnique({
      where: { ticketCode },
      include: {
        banjar: true,
        aiEvaluation: true,
        statusLogs: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!complaint) return null
    return this.toDomainEntity(complaint)
  }

  async create(input: CreateComplaintInput): Promise<ComplaintEntity> {
    return this.client.$transaction(async (tx) => {
      const created = await tx.complaint.create({
        data: {
          ticketCode: input.ticketCode,
          citizenId: input.citizenId ?? null,
          reporterName: input.reporterName,
          reporterPhone: input.reporterPhone ?? null,
          title: input.title,
          description: input.description,
          banjarId: input.banjarId,
          specificLocation: input.specificLocation,
          photoUrl: input.photoUrl ?? null,
          status: input.status ?? 'OPEN',
          category: input.category ?? null,
          priority: input.priority ?? null,
          aiSummary: input.aiSummary ?? null,
          aiEvaluation: input.aiEvaluation
            ? {
                create: {
                  predictedCategory: input.category ?? 'LAINNYA',
                  priority: input.priority ?? 'MEDIUM',
                  confidenceScore: input.aiEvaluation.confidenceScore,
                  executiveSummary: input.aiEvaluation.executiveSummary,
                  recommendedAction: input.aiEvaluation.recommendedAction,
                  rawAIResponse: input.aiEvaluation.rawAIResponse
                    ? JSON.parse(
                        JSON.stringify(input.aiEvaluation.rawAIResponse),
                      )
                    : undefined,
                },
              }
            : undefined,
        },
        include: {
          banjar: true,
          aiEvaluation: true,
        },
      })

      // Initial status log in transaction
      await tx.complaintLog.create({
        data: {
          complaintId: created.id,
          previousStatus: null,
          newStatus: created.status,
          actionNote: 'Pengaduan baru dibuat dalam sistem',
        },
      })

      return this.toDomainEntity(created)
    })
  }

  async updateStatus(
    id: string,
    status: ComplaintStatus,
    options?: string | UpdateComplaintStatusOptions,
  ): Promise<void> {
    const opts: UpdateComplaintStatusOptions =
      typeof options === 'string' ? { notes: options } : (options ?? {})

    await this.client.$transaction(async (tx) => {
      const existing = await tx.complaint.findUnique({
        where: { id },
        select: { status: true },
      })

      if (!existing) {
        throw new Error(`Complaint with id "${id}" not found`)
      }

      await tx.complaint.update({
        where: { id },
        data: {
          status,
          resolvedAt: status === 'RESOLVED' ? new Date() : undefined,
        },
      })

      await tx.complaintLog.create({
        data: {
          complaintId: id,
          previousStatus: existing.status,
          newStatus: status,
          actorId: opts.actorId ?? null,
          actionNote: opts.notes ?? null,
          proofPhotoUrl: opts.proofPhotoUrl ?? null,
        },
      })
    })
  }

  async listRecent(
    filter?: ComplaintFilterOptions,
  ): Promise<ComplaintEntity[]> {
    const where: Record<string, unknown> = {}

    if (filter?.banjarId) where.banjarId = filter.banjarId
    if (filter?.status) where.status = filter.status
    if (filter?.priority) where.priority = filter.priority
    if (filter?.category) where.category = filter.category
    if (filter?.citizenId) where.citizenId = filter.citizenId
    if (filter?.search) {
      where.OR = [
        { title: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } },
        { ticketCode: { contains: filter.search, mode: 'insensitive' } },
      ]
    }

    const complaints = await this.client.complaint.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filter?.limit ?? 50,
      skip: filter?.offset ?? 0,
      include: {
        banjar: true,
        aiEvaluation: true,
      },
    })

    return complaints.map((c) => this.toDomainEntity(c))
  }

  async countByStatus(): Promise<Record<ComplaintStatus, number>> {
    const counts = await this.client.complaint.groupBy({
      by: ['status'],
      _count: { _all: true },
    })

    const initial: Record<ComplaintStatus, number> = {
      OPEN: 0,
      IN_PROGRESS: 0,
      RESOLVED: 0,
      REJECTED: 0,
    }

    for (const item of counts) {
      initial[item.status] = item._count._all
    }

    return initial
  }

  private toDomainEntity(record: {
    id: string
    ticketCode: string
    citizenId: string | null
    reporterName: string
    reporterPhone: string | null
    title: string
    description: string
    banjarId: string
    specificLocation: string
    photoUrl: string | null
    status: string
    category: string | null
    priority: string | null
    aiSummary: string | null
    createdAt: Date
    updatedAt: Date
    resolvedAt: Date | null
    banjar?: { name: string } | null
    aiEvaluation?: {
      id: string
      complaintId: string
      predictedCategory: string
      priority: string
      confidenceScore: number
      executiveSummary: string
      recommendedAction: string
      rawAIResponse?: unknown
      evaluatedAt: Date
    } | null
    statusLogs?: Array<{
      id: string
      complaintId: string
      previousStatus: string | null
      newStatus: string
      actorId: string | null
      actionNote: string | null
      proofPhotoUrl: string | null
      createdAt: Date
    }>
  }): ComplaintEntity {
    return {
      id: record.id,
      ticketCode: record.ticketCode,
      citizenId: record.citizenId,
      reporterName: record.reporterName,
      reporterPhone: record.reporterPhone,
      title: record.title,
      description: record.description,
      banjarId: record.banjarId,
      banjarName: record.banjar?.name,
      specificLocation: record.specificLocation,
      photoUrl: record.photoUrl,
      status: record.status as ComplaintStatus,
      category: record.category as ComplaintCategory | null,
      priority: record.priority as ComplaintPriority | null,
      aiSummary: record.aiSummary,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      resolvedAt: record.resolvedAt,
      aiEvaluation: record.aiEvaluation
        ? {
            id: record.aiEvaluation.id,
            complaintId: record.aiEvaluation.complaintId,
            predictedCategory: record.aiEvaluation
              .predictedCategory as ComplaintCategory,
            priority: record.aiEvaluation.priority as ComplaintPriority,
            confidenceScore: record.aiEvaluation.confidenceScore,
            executiveSummary: record.aiEvaluation.executiveSummary,
            recommendedAction: record.aiEvaluation.recommendedAction,
            rawAIResponse: record.aiEvaluation.rawAIResponse,
            evaluatedAt: record.aiEvaluation.evaluatedAt,
          }
        : null,
      statusLogs: record.statusLogs?.map((log) => ({
        id: log.id,
        complaintId: log.complaintId,
        previousStatus: log.previousStatus as ComplaintStatus | null,
        newStatus: log.newStatus as ComplaintStatus,
        actorId: log.actorId,
        actionNote: log.actionNote,
        proofPhotoUrl: log.proofPhotoUrl,
        createdAt: log.createdAt,
      })),
    }
  }
}
