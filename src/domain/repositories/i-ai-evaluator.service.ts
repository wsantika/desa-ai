import type {
  ComplaintCategory,
  ComplaintPriority,
} from '../entities/complaint.entity'

export interface AIEvaluationResult {
  category: ComplaintCategory
  priority: ComplaintPriority
  confidenceScore: number
  summary: string
  recommendedAction: string
  rawResponse?: unknown
}

export interface IAIEvaluatorService {
  evaluateComplaint(
    title: string,
    description: string,
    locationContext?: string,
  ): Promise<AIEvaluationResult>
}
