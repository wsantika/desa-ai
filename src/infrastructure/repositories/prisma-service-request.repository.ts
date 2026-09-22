import { prisma } from '../db/prisma.js'
import type { PrismaClient } from '../db/prisma.js'
import type {
  ServiceAttachmentEntity,
  ServiceRequestEntity,
  ServiceRequestStatus,
  ServiceStatusLogEntity,
} from '../../domain/entities/service-request.entity.js'
import type {
  CreateServiceRequestInput,
  IServiceRequestRepository,
  ServiceRequestFilterOptions,
  UpdateServiceStatusOptions,
} from '../../domain/repositories/i-service-request.repository.js'

export class PrismaServiceRequestRepository
  implements IServiceRequestRepository
{
  constructor(private readonly client: PrismaClient = prisma) {}

  async findById(id: string): Promise<ServiceRequestEntity | null> {
    const request = await this.client.serviceRequest.findUnique({
      where: { id },
      include: {
        serviceType: true,
        attachments: true,
        statusLogs: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!request) return null
    return this.toDomainEntity(request)
  }

  async findByTrackingCode(
    trackingCode: string,
  ): Promise<ServiceRequestEntity | null> {
    const request = await this.client.serviceRequest.findUnique({
      where: { trackingCode },
      include: {
        serviceType: true,
        attachments: true,
        statusLogs: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!request) return null
    return this.toDomainEntity(request)
  }

  async create(
    input: CreateServiceRequestInput,
  ): Promise<ServiceRequestEntity> {
    return this.client.$transaction(async (tx) => {
      const created = await tx.serviceRequest.create({
        data: {
          trackingCode: input.trackingCode,
          userId: input.citizenId,
          serviceTypeId: input.serviceTypeId,
          applicantName: input.applicantName,
          applicantNik: input.applicantNik,
          applicantPhone: input.applicantPhone,
          purpose: input.purpose,
          officerNotes: input.officerNotes ?? null,
          status: 'PENDING',
          attachments: input.attachments?.length
            ? {
                create: input.attachments.map((att) => ({
                  fileName: att.fileName,
                  fileUrl: att.fileUrl,
                  fileType: att.fileType,
                })),
              }
            : undefined,
        },
        include: {
          serviceType: true,
          attachments: true,
        },
      })

      // Initial status log in transaction
      await tx.serviceStatusLog.create({
        data: {
          requestId: created.id,
          previousStatus: null,
          newStatus: 'PENDING',
          notes: 'Permohonan surat baru berhasil diajukan',
        },
      })

      return this.toDomainEntity(created)
    })
  }

  async updateStatus(
    id: string,
    status: ServiceRequestStatus,
    options?: string | UpdateServiceStatusOptions,
  ): Promise<void> {
    const opts: UpdateServiceStatusOptions =
      typeof options === 'string' ? { notes: options } : (options ?? {})

    await this.client.$transaction(async (tx) => {
      const existing = await tx.serviceRequest.findUnique({
        where: { id },
        select: { status: true },
      })

      if (!existing) {
        throw new Error(`Service request with id "${id}" not found`)
      }

      await tx.serviceRequest.update({
        where: { id },
        data: {
          status,
          officerNotes: opts.notes !== undefined ? opts.notes : undefined,
          completedAt:
            status === 'APPROVED' || status === 'REJECTED'
              ? new Date()
              : undefined,
        },
      })

      await tx.serviceStatusLog.create({
        data: {
          requestId: id,
          previousStatus: existing.status,
          newStatus: status,
          actorId: opts.actorId ?? null,
          notes: opts.notes ?? null,
        },
      })
    })
  }

  async listRecent(
    filter?: ServiceRequestFilterOptions,
  ): Promise<ServiceRequestEntity[]> {
    const where: Record<string, unknown> = {}

    if (filter?.citizenId) where.userId = filter.citizenId
    if (filter?.serviceTypeId) where.serviceTypeId = filter.serviceTypeId
    if (filter?.status) where.status = filter.status
    if (filter?.search) {
      where.OR = [
        { trackingCode: { contains: filter.search, mode: 'insensitive' } },
        { applicantName: { contains: filter.search, mode: 'insensitive' } },
        { applicantNik: { contains: filter.search, mode: 'insensitive' } },
        { purpose: { contains: filter.search, mode: 'insensitive' } },
      ]
    }

    const records = await this.client.serviceRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filter?.limit ?? 50,
      skip: filter?.offset ?? 0,
      include: {
        serviceType: true,
        attachments: true,
        statusLogs: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    return records.map((record) => this.toDomainEntity(record))
  }

  async countByStatus(): Promise<Record<ServiceRequestStatus, number>> {
    const counts = await this.client.serviceRequest.groupBy({
      by: ['status'],
      _count: { _all: true },
    })

    const initial: Record<ServiceRequestStatus, number> = {
      PENDING: 0,
      IN_REVIEW: 0,
      REVISION: 0,
      APPROVED: 0,
      REJECTED: 0,
    }

    for (const item of counts) {
      initial[item.status] = item._count._all
    }

    return initial
  }

  private toDomainEntity(record: {
    id: string
    trackingCode: string
    userId: string
    serviceTypeId: string
    applicantName: string
    applicantNik: string
    applicantPhone: string
    purpose: string
    status: string
    officerNotes: string | null
    createdAt: Date
    updatedAt: Date
    completedAt: Date | null
    serviceType?: {
      code: string
      title: string
    } | null
    attachments?: Array<{
      id: string
      requestId: string
      fileName: string
      fileUrl: string
      fileType: string
      createdAt: Date
    }>
    statusLogs?: Array<{
      id: string
      requestId: string
      previousStatus: string | null
      newStatus: string
      actorId: string | null
      notes: string | null
      createdAt: Date
    }>
  }): ServiceRequestEntity {
    return {
      id: record.id,
      trackingCode: record.trackingCode,
      citizenId: record.userId,
      serviceTypeId: record.serviceTypeId,
      serviceTypeCode: record.serviceType?.code,
      serviceTypeTitle: record.serviceType?.title,
      applicantName: record.applicantName,
      applicantNik: record.applicantNik,
      applicantPhone: record.applicantPhone,
      purpose: record.purpose,
      status: record.status as ServiceRequestStatus,
      officerNotes: record.officerNotes,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      completedAt: record.completedAt,
      attachments: record.attachments?.map(
        (att): ServiceAttachmentEntity => ({
          id: att.id,
          requestId: att.requestId,
          fileName: att.fileName,
          fileUrl: att.fileUrl,
          fileType: att.fileType,
          createdAt: att.createdAt,
        }),
      ),
      statusLogs: record.statusLogs?.map(
        (log): ServiceStatusLogEntity => ({
          id: log.id,
          requestId: log.requestId,
          previousStatus: log.previousStatus as ServiceRequestStatus | null,
          newStatus: log.newStatus as ServiceRequestStatus,
          actorId: log.actorId,
          notes: log.notes,
          createdAt: log.createdAt,
        }),
      ),
    }
  }
}
