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

  // 3. Susun kriteria filter database
  const whereClause: Record<string, unknown> = {}

  if (filter.status && filter.status !== 'ALL') {
    whereClause.status = filter.status
  }

  if (filter.priority && filter.priority !== 'ALL') {
    whereClause.priority = filter.priority
  }

  if (filter.category && filter.category !== 'ALL') {
    whereClause.category = filter.category
  }

  if (filter.banjarId && filter.banjarId !== 'ALL') {
    whereClause.banjarId = filter.banjarId
  }

  if (filter.search && filter.search.trim().length > 0) {
    const q = filter.search.trim()
    whereClause.OR = [
      { ticketCode: { contains: q, mode: 'insensitive' } },
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { reporterName: { contains: q, mode: 'insensitive' } },
      { specificLocation: { contains: q, mode: 'insensitive' } },
    ]
  }

  // 4. Query data pengaduan masuk
  const rawComplaints = await prisma.complaint.findMany({
    where: whereClause,
    include: {
      banjar: { select: { id: true, name: true } },
      aiEvaluation: true,
      statusLogs: {
        orderBy: { createdAt: 'desc' },
        include: {
          actor: {
            select: {
              email: true,
              profile: { select: { fullName: true } },
            },
          },
        },
      },
    },
    orderBy: [
      { priority: 'asc' }, // Prioritas EMERGENCY & HIGH di atas
      { createdAt: 'desc' },
    ],
  })

  // 5. Transformasi ke format aman JSON serializable
  const complaints: TriageComplaintItem[] = rawComplaints.map((c) => ({
    id: c.id,
    ticketCode: c.ticketCode,
    reporterName: c.reporterName,
    reporterPhone: c.reporterPhone,
    title: c.title,
    description: c.description,
    banjarId: c.banjarId,
    banjarName: c.banjar?.name || 'Banjar Tidak Diketahui',
    specificLocation: c.specificLocation,
    photoUrl: c.photoUrl,
    status: c.status,
    category: c.category,
    priority: c.priority,
    aiSummary: c.aiSummary,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    resolvedAt: c.resolvedAt ? c.resolvedAt.toISOString() : null,
    aiEvaluation: c.aiEvaluation
      ? {
          id: c.aiEvaluation.id,
          predictedCategory: c.aiEvaluation.predictedCategory,
          priority: c.aiEvaluation.priority,
          confidenceScore: c.aiEvaluation.confidenceScore,
          executiveSummary: c.aiEvaluation.executiveSummary,
          recommendedAction: c.aiEvaluation.recommendedAction,
          evaluatedAt: c.aiEvaluation.evaluatedAt.toISOString(),
        }
      : null,
    statusLogs: c.statusLogs.map((log) => ({
      id: log.id,
      previousStatus: log.previousStatus,
      newStatus: log.newStatus,
      actionNote: log.actionNote,
      proofPhotoUrl: log.proofPhotoUrl,
      createdAt: log.createdAt.toISOString(),
      actorName:
        log.actor?.profile?.fullName ||
        log.actor?.email ||
        'Petugas Pelayanan Desa',
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
    // 1. Perbarui status pengaduan
    await tx.complaint.update({
      where: { id: validated.complaintId },
      data: {
        status: newStatus,
        resolvedAt: newStatus === 'RESOLVED' ? new Date() : null,
      },
    })

    // 2. Buat log catatan tindakan baru
    await tx.complaintLog.create({
      data: {
        complaintId: validated.complaintId,
        previousStatus,
        newStatus,
        actionNote: validated.notes,
        proofPhotoUrl: validated.proofPhotoUrl || null,
        actorId: validated.actorId || null,
      },
    })
  })

  return {
    success: true,
    complaintId: validated.complaintId,
    newStatus,
  }
}
