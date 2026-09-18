import type {
  ComplaintCategory,
  ComplaintEntity,
  ComplaintPriority,
  ComplaintStatus,
} from '../entities/complaint.entity'

export interface IComplaintRepository {
  findById(id: string): Promise<ComplaintEntity | null>
  findByTicketCode(ticketCode: string): Promise<ComplaintEntity | null>
  create(
    complaint: Omit<ComplaintEntity, 'id' | 'createdAt'>,
  ): Promise<ComplaintEntity>
  updateStatus(
    id: string,
    status: ComplaintStatus,
    notes?: string,
  ): Promise<void>
  listRecent(filter?: {
    banjarId?: string
    status?: ComplaintStatus
    priority?: ComplaintPriority
    category?: ComplaintCategory
    limit?: number
  }): Promise<ComplaintEntity[]>
}
