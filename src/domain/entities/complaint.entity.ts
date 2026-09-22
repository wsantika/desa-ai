export type ComplaintCategory =
  | 'INFRASTRUKTUR'
  | 'KEBERSIHAN_LINGKUNGAN'
  | 'KEAMANAN_KETERTIBAN'
  | 'PELAYANAN_PUBLIK'
  | 'BANTUAN_SOSIAL'
  | 'LAINNYA'

export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY'

export type ComplaintStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED'

export interface ComplaintLogEntity {
  id: string
  complaintId: string
  previousStatus?: ComplaintStatus | null
  newStatus: ComplaintStatus
  actorId?: string | null
  actionNote?: string | null
  proofPhotoUrl?: string | null
  createdAt: Date
}

export interface ComplaintAIEvaluationEntity {
  id: string
  complaintId: string
  predictedCategory: ComplaintCategory
  priority: ComplaintPriority
  confidenceScore: number
  executiveSummary: string
  recommendedAction: string
  rawAIResponse?: unknown
  evaluatedAt: Date
}

export interface ComplaintEntity {
  id: string
  ticketCode: string
  citizenId?: string | null
  reporterName: string
  reporterPhone?: string | null
  title: string
  description: string
  banjarId: string
  banjarName?: string
  specificLocation: string
  photoUrl?: string | null
  status: ComplaintStatus
  category?: ComplaintCategory | null
  priority?: ComplaintPriority | null
  aiSummary?: string | null
  aiEvaluation?: ComplaintAIEvaluationEntity | null
  statusLogs?: ComplaintLogEntity[]
  createdAt: Date
  updatedAt?: Date
  resolvedAt?: Date | null
}

