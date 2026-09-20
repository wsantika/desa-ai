import type { IComplaintRepository } from '../../domain/repositories/i-complaint.repository.js'
import type {
  ComplaintCategory,
  ComplaintPriority,
  ComplaintStatus,
} from '../../domain/entities/complaint.entity.js'

export interface ComplaintTrackingDetailResult {
  found: boolean
  ticketCode: string
  title?: string
  description?: string
  banjarName?: string
  specificLocation?: string
  status?: ComplaintStatus
  statusLabel?: string
  category?: ComplaintCategory | null
  categoryLabel?: string
  priority?: ComplaintPriority | null
  priorityLabel?: string
  aiSummary?: string | null
  recommendedAction?: string | null
  photoUrl?: string | null
  reporterName?: string
  createdAt?: Date
  resolvedAt?: Date | null
  logs?: Array<{
    status: ComplaintStatus
    label: string
    actionNote: string | null
    createdAt: Date
  }>
}

export class TrackComplaintUseCase {
  constructor(private readonly complaintRepo: IComplaintRepository) {}

  private getStatusLabel(status: ComplaintStatus): string {
    switch (status) {
      case 'OPEN':
        return 'Laporan Diterima — Menunggu Disposisi'
      case 'IN_PROGRESS':
        return 'Sedang Ditangani di Lapangan'
      case 'RESOLVED':
        return 'Selesai Ditindaklanjuti'
      case 'REJECTED':
        return 'Laporan Ditolak / Tidak Valid'
      default:
        return status
    }
  }

  private getCategoryLabel(cat?: ComplaintCategory | null): string {
    switch (cat) {
      case 'INFRASTRUKTUR':
        return 'Infrastruktur Jalan & Bangunan'
      case 'KEBERSIHAN_LINGKUNGAN':
        return 'Kebersihan & Sampah Lingkungan'
      case 'KEAMANAN_KETERTIBAN':
        return 'Ketertiban & Keamanan Umum'
      case 'PELAYANAN_PUBLIK':
        return 'Pelayanan Aparatur Desa'
      case 'BANTUAN_SOSIAL':
        return 'Bantuan Sosial & Kesejahteraan'
      default:
        return 'Lainnya / Umum'
    }
  }

  private getPriorityLabel(pri?: ComplaintPriority | null): string {
    switch (pri) {
      case 'EMERGENCY':
        return 'Darurat (Emergency)'
      case 'HIGH':
        return 'Tinggi (High)'
      case 'MEDIUM':
        return 'Sedang (Medium)'
      case 'LOW':
        return 'Rendah (Low)'
      default:
        return 'Normal'
    }
  }

  async execute(ticketCode: string): Promise<ComplaintTrackingDetailResult> {
    const formattedCode = ticketCode.trim().toUpperCase()
    const complaint = await this.complaintRepo.findByTicketCode(formattedCode)

    if (!complaint) {
      return {
        found: false,
        ticketCode: formattedCode,
      }
    }

    return {
      found: true,
      ticketCode: complaint.ticketCode,
      title: complaint.title,
      description: complaint.description,
      banjarName: complaint.banjarName ?? 'Desa Tegal Tugu',
      specificLocation: complaint.specificLocation,
      status: complaint.status,
      statusLabel: this.getStatusLabel(complaint.status),
      category: complaint.category,
      categoryLabel: this.getCategoryLabel(complaint.category),
      priority: complaint.priority,
      priorityLabel: this.getPriorityLabel(complaint.priority),
      aiSummary: complaint.aiSummary,
      recommendedAction: complaint.aiEvaluation?.recommendedAction ?? null,
      photoUrl: complaint.photoUrl,
      reporterName: complaint.reporterName,
      createdAt: complaint.createdAt,
      resolvedAt: complaint.resolvedAt,
      logs: complaint.statusLogs?.map((log) => ({
        status: log.newStatus,
        label: this.getStatusLabel(log.newStatus),
        actionNote: log.actionNote ?? null,
        createdAt: log.createdAt,
      })),
    }
  }
}
