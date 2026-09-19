import type {
  ComplaintCategory,
  ComplaintEntity,
  ComplaintPriority,
  ComplaintStatus,
} from '../entities/complaint.entity'

export interface CreateComplaintInput {
  ticketCode: string
  citizenId?: string | null
  reporterName: string
  reporterPhone?: string | null
  title: string
  description: string
  banjarId: string
  specificLocation: string
  photoUrl?: string | null
  status?: ComplaintStatus
  category?: ComplaintCategory | null
  priority?: ComplaintPriority | null
  aiSummary?: string | null
  aiEvaluation?: {
    confidenceScore: number
    recommendedAction: string
    executiveSummary: string
    rawAIResponse?: unknown
  }
}

export interface UpdateComplaintStatusOptions {
  notes?: string
  actorId?: string
  proofPhotoUrl?: string
}

export interface ComplaintFilterOptions {
  banjarId?: string
  status?: ComplaintStatus
  priority?: ComplaintPriority
  category?: ComplaintCategory
  citizenId?: string
  search?: string
  limit?: number
  offset?: number
}

export interface IComplaintRepository {
  findById(id: string): Promise<ComplaintEntity | null>
  findByTicketCode(ticketCode: string): Promise<ComplaintEntity | null>
  create(complaint: CreateComplaintInput): Promise<ComplaintEntity>
  updateStatus(
    id: string,
    status: ComplaintStatus,
    options?: string | UpdateComplaintStatusOptions,
  ): Promise<void>
  listRecent(filter?: ComplaintFilterOptions): Promise<ComplaintEntity[]>
  countByStatus(): Promise<Record<ComplaintStatus, number>>
}
