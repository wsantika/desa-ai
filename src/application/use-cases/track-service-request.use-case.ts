import type { IServiceRequestRepository } from '../../domain/repositories/i-service-request.repository.js'
import type { ServiceRequestStatus } from '../../domain/entities/service-request.entity.js'

export interface TrackingDetailResult {
  found: boolean
  trackingCode: string
  status?: ServiceRequestStatus
  statusLabel?: string
  serviceTypeCode?: string
  serviceTypeTitle?: string
  applicantName?: string
  applicantNikMasked?: string
  purpose?: string
  officerNotes?: string | null
  createdAt?: Date
  completedAt?: Date | null
  statusLogs?: Array<{
    status: ServiceRequestStatus
    label: string
    notes: string | null
    createdAt: Date
  }>
}

export class TrackServiceRequestUseCase {
  constructor(private readonly serviceRequestRepo: IServiceRequestRepository) {}

  private getStatusLabel(status: ServiceRequestStatus): string {
    switch (status) {
      case 'PENDING':
        return 'Menunggu Antrean Verifikasi'
      case 'IN_REVIEW':
        return 'Sedang Diverifikasi Petugas'
      case 'REVISION':
        return 'Perlu Perbaikan Dokumen'
      case 'APPROVED':
        return 'Disetujui — Surat Siap Diambil'
      case 'REJECTED':
        return 'Permohonan Ditolak'
      default:
        return status
    }
  }

  private maskNik(nik: string): string {
    if (nik.length < 8) return nik
    return nik.slice(0, 6) + '******' + nik.slice(-4)
  }

  async execute(trackingCode: string): Promise<TrackingDetailResult> {
    const formattedCode = trackingCode.trim().toUpperCase()
    const request = await this.serviceRequestRepo.findByTrackingCode(formattedCode)

    if (!request) {
      return {
        found: false,
        trackingCode: formattedCode,
      }
    }

    return {
      found: true,
      trackingCode: request.trackingCode,
      status: request.status,
      statusLabel: this.getStatusLabel(request.status),
      serviceTypeCode: request.serviceTypeCode,
      serviceTypeTitle: request.serviceTypeTitle ?? 'Layanan Administrasi Surat',
      applicantName: request.applicantName,
      applicantNikMasked: this.maskNik(request.applicantNik),
      purpose: request.purpose,
      officerNotes: request.officerNotes,
      createdAt: request.createdAt,
      completedAt: request.completedAt,
      statusLogs: request.statusLogs?.map((log) => ({
        status: log.newStatus,
        label: this.getStatusLabel(log.newStatus),
        notes: log.notes,
        createdAt: log.createdAt,
      })),
    }
  }
}
