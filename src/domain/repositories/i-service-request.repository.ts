import type {
  ServiceAttachmentEntity,
  ServiceRequestEntity,
  ServiceRequestStatus,
} from '../entities/service-request.entity'

export interface CreateServiceRequestAttachmentInput {
  fileName: string
  fileUrl: string
  fileType: string
}

export interface CreateServiceRequestInput {
  trackingCode: string
  citizenId: string
  serviceTypeId: string
  applicantName: string
  applicantNik: string
  applicantPhone: string
  purpose: string
  officerNotes?: string | null
  attachments?: CreateServiceRequestAttachmentInput[]
}

export interface UpdateServiceStatusOptions {
  notes?: string
  actorId?: string
}

export interface ServiceRequestFilterOptions {
  citizenId?: string
  serviceTypeId?: string
  status?: ServiceRequestStatus
  search?: string
  limit?: number
  offset?: number
}

export interface IServiceRequestRepository {
  findById(id: string): Promise<ServiceRequestEntity | null>
  findByTrackingCode(trackingCode: string): Promise<ServiceRequestEntity | null>
  create(input: CreateServiceRequestInput): Promise<ServiceRequestEntity>
  updateStatus(
    id: string,
    status: ServiceRequestStatus,
    options?: string | UpdateServiceStatusOptions,
  ): Promise<void>
  listRecent(filter?: ServiceRequestFilterOptions): Promise<ServiceRequestEntity[]>
  countByStatus(): Promise<Record<ServiceRequestStatus, number>>
}
