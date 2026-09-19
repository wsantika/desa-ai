export type ServiceRequestStatus =
  | 'PENDING'
  | 'IN_REVIEW'
  | 'REVISION'
  | 'APPROVED'
  | 'REJECTED'

export interface ServiceAttachmentEntity {
  id: string
  requestId: string
  fileName: string
  fileUrl: string
  fileType: string
  createdAt: Date
}

export interface ServiceStatusLogEntity {
  id: string
  requestId: string
  previousStatus?: ServiceRequestStatus | null
  newStatus: ServiceRequestStatus
  actorId?: string | null
  notes?: string | null
  createdAt: Date
}

export interface ServiceRequestEntity {
  id: string
  trackingCode: string
  citizenId: string
  serviceTypeId: string
  serviceTypeCode?: string
  serviceTypeTitle?: string
  applicantName: string
  applicantNik: string
  applicantPhone: string
  purpose: string
  status: ServiceRequestStatus
  officerNotes?: string | null
  attachments?: ServiceAttachmentEntity[]
  statusLogs?: ServiceStatusLogEntity[]
  createdAt: Date
  updatedAt?: Date
  completedAt?: Date | null
}
