export type ServiceRequestStatus =
  | 'PENDING'
  | 'IN_REVIEW'
  | 'REVISION'
  | 'APPROVED'
  | 'REJECTED'

export interface ServiceRequestEntity {
  id: string
  trackingCode: string
  citizenId: string
  serviceTypeCode: string // e.g. 'DOMISILI', 'SKU', 'SKCK', 'SKTM'
  applicantName: string
  applicantNik: string
  applicantPhone: string
  purpose: string
  status: ServiceRequestStatus
  officerNotes?: string | null
  createdAt: Date
  completedAt?: Date | null
}
