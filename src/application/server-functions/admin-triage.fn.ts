import { createServerFn } from '@tanstack/react-start'
import { prisma } from '../../infrastructure/db/prisma.js'
import {
  triageFilterSchema,
  updateTriageStatusSchema,
} from '../dtos/triage-desk.dto.js'
import type {
  TriageFilterDTO,
  UpdateTriageStatusDTO,
} from '../dtos/triage-desk.dto.js'
import type {
  ComplaintCategory,
  ComplaintPriority,
  ComplaintStatus,
} from '../../domain/entities/complaint.entity.js'

export interface TriageStatusLogItem {
  id: string
  previousStatus: ComplaintStatus | null
  newStatus: ComplaintStatus
  actionNote: string | null
  proofPhotoUrl: string | null
  createdAt: string
  actorName?: string | null
}

export interface TriageComplaintItem {
  id: string
  ticketCode: string
  reporterName: string
  reporterPhone: string | null
  title: string
  description: string
  banjarId: string
  banjarName: string
  specificLocation: string
  photoUrl: string | null
  status: ComplaintStatus
  category: ComplaintCategory | null
  priority: ComplaintPriority | null
  aiSummary: string | null
  createdAt: string
  updatedAt: string
  resolvedAt: string | null
  aiEvaluation: {
    id: string
    predictedCategory: ComplaintCategory
    priority: ComplaintPriority
    confidenceScore: number
    executiveSummary: string
    recommendedAction: string
    evaluatedAt: string
  } | null
  statusLogs: TriageStatusLogItem[]
}

export interface TriageCounters {
  totalCount: number
  emergencyCount: number
  openCount: number
  inProgressCount: number
  resolvedCount: number
  rejectedCount: number
}

export interface BanjarOption {
  id: string
  name: string
}

export interface TriageDeskData {
  complaints: TriageComplaintItem[]
  counters: TriageCounters
  banjars: BanjarOption[]
}

export async function fetchTriageDeskData(
  filterInput?: Partial<TriageFilterDTO>,
): Promise<TriageDeskData> {
  const filter = triageFilterSchema.parse(filterInput ?? {})

  // 1. Ambil opsi Banjar untuk dropdown filter
  const banjarsRaw = await prisma.banjar.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })
  const banjars: BanjarOption[] = banjarsRaw.map((b) => ({
    id: b.id,
    name: b.name,
  }))

  // 2. Hitung statistik counter tab secara paralel dan aman
  const [
    totalCount,
    emergencyCount,
    openCount,
    inProgressCount,
    resolvedCount,
    rejectedCount,
  ] = await Promise.all([
    prisma.complaint.count(),
    prisma.complaint.count({
      where: {
        priority: 'EMERGENCY',
        status: { in: ['OPEN', 'IN_PROGRESS'] },
      },
    }),
    prisma.complaint.count({ where: { status: 'OPEN' } }),
    prisma.complaint.count({ where: { status: 'IN_PROGRESS' } }),
    prisma.complaint.count({ where: { status: 'RESOLVED' } }),
    prisma.complaint.count({ where: { status: 'REJECTED' } }),
  ])

  // 3. Susun kriteria filter query
  const where: Record<string, unknown> = {}

  if (filter.banjarId && filter.banjarId !== 'ALL') {
    where.banjarId = filter.banjarId
  }

  if (filter.status && filter.status !== 'ALL') {
    where.status = filter.status
  }

  if (filter.priority && filter.priority !== 'ALL') {
    where.priority = filter.priority
  }

  if (filter.category && filter.category !== 'ALL') {
    where.category = filter.category
  }

  if (filter.search && filter.search.trim().length > 0) {
    const term = filter.search.trim()
    where.OR = [
      { ticketCode: { contains: term, mode: 'insensitive' } },
      { title: { contains: term, mode: 'insensitive' } },
      { description: { contains: term, mode: 'insensitive' } },
      { reporterName: { contains: term, mode: 'insensitive' } },
      { specificLocation: { contains: term, mode: 'insensitive' } },
    ]
  }

  // 4. Ambil daftar pengaduan dengan relasi lengkap
  const rawComplaints = await prisma.complaint.findMany({
    where,
    orderBy: [
      { priority: 'asc' }, // Prioritaskan EMERGENCY & HIGH
      { createdAt: 'desc' },
    ],
    take: 100,
    include: {
      banjar: { select: { id: true, name: true } },
      aiEvaluation: true,
      statusLogs: {
        orderBy: { createdAt: 'desc' },
        include: {
          actor: { select: { name: true } },
        },
      },
    },
  })

  const complaints: TriageComplaintItem[] = rawComplaints.map((item) => ({
    id: item.id,
    ticketCode: item.ticketCode,
    reporterName: item.reporterName,
    reporterPhone: item.reporterPhone,
    title: item.title,
    description: item.description,
    banjarId: item.banjarId,
    banjarName: item.banjar?.name || 'Wilayah Desa',
    specificLocation: item.specificLocation,
    photoUrl: item.photoUrl,
    status: item.status,
    category: item.category,
    priority: item.priority,
    aiSummary: item.aiSummary,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    resolvedAt: item.resolvedAt ? item.resolvedAt.toISOString() : null,
    aiEvaluation: item.aiEvaluation
      ? {
          id: item.aiEvaluation.id,
          predictedCategory: item.aiEvaluation.predictedCategory,
          priority: item.aiEvaluation.priority,
          confidenceScore: item.aiEvaluation.confidenceScore,
          executiveSummary: item.aiEvaluation.executiveSummary,
          recommendedAction: item.aiEvaluation.recommendedAction,
          evaluatedAt: item.aiEvaluation.evaluatedAt.toISOString(),
        }
      : null,
    statusLogs: item.statusLogs.map((log) => ({
      id: log.id,
      previousStatus: log.previousStatus,
      newStatus: log.newStatus,
      actionNote: log.actionNote,
      proofPhotoUrl: log.proofPhotoUrl,
      createdAt: log.createdAt.toISOString(),
      actorName: log.actor?.name || null,
    })),
  }))

  return {
    complaints,
    counters: {
      totalCount,
      emergencyCount,
      openCount,
      inProgressCount,
      resolvedCount,
      rejectedCount,
    },
    banjars,
  }
}

export async function updateTriageComplaintStatus(
  input: UpdateTriageStatusDTO,
): Promise<{ success: boolean; complaintId: string; newStatus: ComplaintStatus }> {
  const validated = updateTriageStatusSchema.parse(input)

  const existing = await prisma.complaint.findUnique({
    where: { id: validated.complaintId },
    select: { id: true, status: true },
  })

  if (!existing) {
    throw new Error(`Pengaduan dengan ID "${validated.complaintId}" tidak ditemukan`)
  }

  const previousStatus = existing.status
  const newStatus = validated.status

  await prisma.$transaction(async (tx) => {
    await tx.complaint.update({
      where: { id: validated.complaintId },
      data: {
        status: newStatus,
        resolvedAt:
          newStatus === 'RESOLVED'
            ? new Date()
            : newStatus === 'OPEN'
              ? null
              : undefined,
      },
    })

    await tx.complaintLog.create({
      data: {
        complaintId: validated.complaintId,
        previousStatus,
        newStatus,
        actionNote: validated.notes,
        proofPhotoUrl: validated.proofPhotoUrl ?? null,
        actorId: validated.actorId ?? null,
      },
    })
  })

  return {
    success: true,
    complaintId: validated.complaintId,
    newStatus,
  }
}

export const fetchTriageDeskDataServerFn = createServerFn({
  method: 'GET',
})
  .validator((params: unknown) => triageFilterSchema.parse(params ?? {}))
  .handler(async ({ data }) => {
    return fetchTriageDeskData(data)
  })

export const updateTriageComplaintStatusServerFn = createServerFn({
  method: 'POST',
})
  .validator((body: unknown) => updateTriageStatusSchema.parse(body))
  .handler(async ({ data }) => {
    return updateTriageComplaintStatus(data)
  })
