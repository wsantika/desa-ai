export type ComplaintCategory =
  | 'INFRASTRUKTUR'
  | 'KEBERSIHAN_LINGKUNGAN'
  | 'KEAMANAN_KETERTIBAN'
  | 'PELAYANAN_PUBLIK'
  | 'BANTUAN_SOSIAL'
  | 'LAINNYA'

export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY'

export type ComplaintStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED'

export interface ComplaintEntity {
  id: string
  ticketCode: string
  citizenId?: string | null
  reporterName: string
  reporterPhone?: string | null
  title: string
  description: string
  banjarId: string
  specificLocation: string
  photoUrl?: string | null
  status: ComplaintStatus
  category?: ComplaintCategory | null
  priority?: ComplaintPriority | null
  aiSummary?: string | null
  createdAt: Date
  updatedAt?: Date
}
