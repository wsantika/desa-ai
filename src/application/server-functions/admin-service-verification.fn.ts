import { createServerFn } from '@tanstack/react-start'
import { prisma } from '../../infrastructure/db/prisma.js'
import {
  serviceVerificationFilterSchema,
  updateServiceVerificationStatusSchema,
} from '../dtos/service-verification.dto.js'
import type {
  ServiceVerificationFilterDTO,
  UpdateServiceVerificationStatusDTO,
} from '../dtos/service-verification.dto.js'
import type { ServiceRequestStatus } from '../../domain/entities/service-request.entity.js'

export interface ServiceVerificationStatusLogItem {
  id: string
  previousStatus: ServiceRequestStatus | null
  newStatus: ServiceRequestStatus
  notes: string | null
  createdAt: string
  actorId: string | null
  actorName?: string | null
}

export interface ServiceVerificationAttachmentItem {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  createdAt: string
}

export interface ServiceVerificationItem {
  id: string
  trackingCode: string
  serviceTypeId: string
  serviceTypeCode: 'DOMISILI' | 'SKU' | 'SKCK' | 'SKTM' | string
  serviceTypeTitle: string
  serviceTypeDescription: string
  requiredDocs: string[]
  estimatedDays: number
  status: ServiceRequestStatus
  applicantName: string
  applicantNik: string
  applicantPhone: string
  applicantBanjarName: string | null
  applicantAddress: string | null
  purpose: string
  officerNotes: string | null
  createdAt: string
  updatedAt: string
  completedAt: string | null
  attachments: ServiceVerificationAttachmentItem[]
  statusLogs: ServiceVerificationStatusLogItem[]
}

export interface ServiceVerificationCounters {
  totalCount: number
  pendingCount: number
  inReviewCount: number
  revisionCount: number
  approvedCount: number
  rejectedCount: number
}

export interface ServiceTypeOption {
  code: string
  title: string
}

export interface ServiceVerificationDeskData {
  requests: ServiceVerificationItem[]
  counters: ServiceVerificationCounters
  serviceTypes: ServiceTypeOption[]
}

export async function fetchServiceVerificationData(
  filterInput?: Partial<ServiceVerificationFilterDTO>,
): Promise<ServiceVerificationDeskData> {
  const filter = serviceVerificationFilterSchema.parse(filterInput ?? {})

  // 1. Ambil opsi katalog jenis surat
  const serviceTypesRaw = await prisma.serviceType.findMany({
    where: { isActive: true },
    select: { code: true, title: true },
    orderBy: { code: 'asc' },
  })
  const serviceTypes: ServiceTypeOption[] = serviceTypesRaw.map((st) => ({
    code: st.code,
    title: st.title,
  }))

  // 2. Hitung statistik counter tab secara paralel
  const [
    totalCount,
    pendingCount,
    inReviewCount,
    revisionCount,
    approvedCount,
    rejectedCount,
  ] = await Promise.all([
    prisma.serviceRequest.count(),
    prisma.serviceRequest.count({ where: { status: 'PENDING' } }),
    prisma.serviceRequest.count({ where: { status: 'IN_REVIEW' } }),
    prisma.serviceRequest.count({ where: { status: 'REVISION' } }),
    prisma.serviceRequest.count({ where: { status: 'APPROVED' } }),
    prisma.serviceRequest.count({ where: { status: 'REJECTED' } }),
  ])

  // 3. Susun kriteria filter database
  const whereClause: Record<string, unknown> = {}

  if (filter.status && filter.status !== 'ALL') {
    whereClause.status = filter.status
  }

  if (filter.serviceCode && filter.serviceCode !== 'ALL') {
    whereClause.serviceType = {
      code: filter.serviceCode,
    }
  }

  if (filter.search && filter.search.trim().length > 0) {
    const q = filter.search.trim()
    whereClause.OR = [
      { trackingCode: { contains: q, mode: 'insensitive' } },
      { applicantName: { contains: q, mode: 'insensitive' } },
      { applicantNik: { contains: q, mode: 'insensitive' } },
      { purpose: { contains: q, mode: 'insensitive' } },
    ]
  }

  // 4. Query data permohonan surat masuk
  const rawRequests = await prisma.serviceRequest.findMany({
    where: whereClause,
    include: {
      serviceType: {
        select: {
          id: true,
          code: true,
          title: true,
          description: true,
          requiredDocs: true,
          estimatedDays: true,
        },
      },
      user: {
        select: {
          id: true,
          email: true,
          profile: {
            select: {
              fullName: true,
              nik: true,
              address: true,
              banjar: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
      attachments: {
        select: {
          id: true,
          fileName: true,
          fileUrl: true,
          fileType: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
      },
      statusLogs: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          previousStatus: true,
          newStatus: true,
          notes: true,
          createdAt: true,
          actorId: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  // 5. Transformasi ke format aman JSON serializable
  const requests: ServiceVerificationItem[] = rawRequests.map((item) => {
    let parsedDocs: string[] = []
    if (Array.isArray(item.serviceType.requiredDocs)) {
      parsedDocs = item.serviceType.requiredDocs as string[]
    } else if (typeof item.serviceType.requiredDocs === 'string') {
      try {
        parsedDocs = JSON.parse(item.serviceType.requiredDocs) as string[]
      } catch {
        parsedDocs = []
      }
    }

    return {
      id: item.id,
      trackingCode: item.trackingCode,
      serviceTypeId: item.serviceTypeId,
      serviceTypeCode: item.serviceType.code,
      serviceTypeTitle: item.serviceType.title,
      serviceTypeDescription: item.serviceType.description,
      requiredDocs: parsedDocs,
      estimatedDays: item.serviceType.estimatedDays,
      status: item.status,
      applicantName: item.applicantName,
      applicantNik: item.applicantNik,
      applicantPhone: item.applicantPhone,
      applicantBanjarName: item.user?.profile?.banjar?.name ?? null,
      applicantAddress: item.user?.profile?.address ?? null,
      purpose: item.purpose,
      officerNotes: item.officerNotes,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      completedAt: item.completedAt ? item.completedAt.toISOString() : null,
      attachments: item.attachments.map((att) => ({
        id: att.id,
        fileName: att.fileName,
        fileUrl: att.fileUrl,
        fileType: att.fileType,
        createdAt: att.createdAt.toISOString(),
      })),
      statusLogs: item.statusLogs.map((log) => ({
        id: log.id,
        previousStatus: log.previousStatus,
        newStatus: log.newStatus,
        notes: log.notes,
        createdAt: log.createdAt.toISOString(),
        actorId: log.actorId,
        actorName: log.actorId ? 'Petugas Layanan Terpadu' : 'Sistem Otomatis',
      })),
    }
  })

  return {
    requests,
    counters: {
      totalCount,
      pendingCount,
      inReviewCount,
      revisionCount,
      approvedCount,
      rejectedCount,
    },
    serviceTypes,
  }
}

export async function updateServiceRequestStatus(
  input: UpdateServiceVerificationStatusDTO,
): Promise<{ success: boolean; requestId: string; newStatus: ServiceRequestStatus }> {
  const validated = updateServiceVerificationStatusSchema.parse(input)

  const existing = await prisma.serviceRequest.findUnique({
    where: { id: validated.requestId },
    select: { id: true, status: true },
  })

  if (!existing) {
    throw new Error(`Permohonan surat dengan ID "${validated.requestId}" tidak ditemukan`)
  }

  const previousStatus = existing.status
  const newStatus = validated.status

  await prisma.$transaction(async (tx) => {
    // 1. Perbarui status permohonan surat dan catatan petugas
    await tx.serviceRequest.update({
      where: { id: validated.requestId },
      data: {
        status: newStatus,
        officerNotes: validated.notes,
        completedAt:
          newStatus === 'APPROVED' || newStatus === 'REJECTED'
            ? new Date()
            : null,
      },
    })

    // 2. Catat riwayat perubahan ke tabel ServiceStatusLog untuk pelacakan warga
    await tx.serviceStatusLog.create({
      data: {
        requestId: validated.requestId,
        previousStatus,
        newStatus,
        notes: validated.notes,
        actorId: validated.actorId ?? null,
      },
    })
  })

  return {
    success: true,
    requestId: validated.requestId,
    newStatus,
  }
}

// Server functions untuk TanStack Start
export const fetchServiceVerificationDataServerFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  return fetchServiceVerificationData()
})

export const updateServiceRequestStatusServerFn = createServerFn({
  method: 'POST',
})
  .validator((d: unknown) => updateServiceVerificationStatusSchema.parse(d))
  .handler(async ({ data }) => {
    return updateServiceRequestStatus(data)
  })
