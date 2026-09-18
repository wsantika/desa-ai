import type { IComplaintRepository } from '../../domain/repositories/i-complaint.repository'
import type { IAIEvaluatorService } from '../../domain/repositories/i-ai-evaluator.service'
import type { CreateComplaintDTO } from '../dtos/complaint.dto'

export class SubmitComplaintUseCase {
  constructor(
    private readonly complaintRepo: IComplaintRepository,
    private readonly aiEvaluator: IAIEvaluatorService,
  ) {}

  async execute(dto: CreateComplaintDTO) {
    // 1. Generate unique ticket code: CMP-YYYYMM-XXXX
    const datePrefix = new Date().toISOString().slice(0, 7).replace('-', '')
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString()
    const ticketCode = `CMP-${datePrefix}-${randomSuffix}`

    // 2. Run AI evaluation for intelligent triage
    const aiResult = await this.aiEvaluator.evaluateComplaint(
      dto.title,
      dto.description,
      dto.specificLocation,
    )

    // 3. Persist entity via repository
    const createdComplaint = await this.complaintRepo.create({
      ticketCode,
      reporterName: dto.reporterName,
      reporterPhone: dto.reporterPhone,
      title: dto.title,
      description: dto.description,
      banjarId: dto.banjarId,
      specificLocation: dto.specificLocation,
      photoUrl: dto.photoUrl,
      status: 'OPEN',
      category: aiResult.category,
      priority: aiResult.priority,
      aiSummary: aiResult.summary,
    })

    return {
      complaint: createdComplaint,
      evaluation: aiResult,
    }
  }
}
