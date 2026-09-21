import { z } from 'zod'

export const analyticsFilterSchema = z.object({
  banjarId: z.string().optional().default('ALL'),
  timeRange: z.enum(['all', '30d', '90d', 'year']).optional().default('all'),
})

export type AnalyticsFilterInput = z.infer<typeof analyticsFilterSchema>

export interface BanjarDistributionItem {
  banjarId: string
  banjarName: string
  dusun: string
  total: number
  open: number
  inProgress: number
  resolved: number
  emergencyCount: number
  avgResolutionHours: number
  topCategory: string | null
}

export interface CategoryDistributionItem {
  category: string
  label: string
  count: number
  percentage: number
  resolvedCount: number
  avgResolutionHours: number
  color: string
}

export interface SLAEvaluationItem {
  targetLabel: string
  targetHours: number
  actualAvgHours: number
  compliancePercentage: number
  totalEvaluated: number
  status: 'OPTIMAL' | 'PERLU_PERHATIAN' | 'TERLAMBAT'
}

export interface ResolutionTimeMetric {
  overallAverageHours: number
  overallAverageDays: number
  slaTargetHours: number
  slaComplianceRate: number
  fastestResolutionHours: number
  longestResolutionHours: number
  evaluations: SLAEvaluationItem[]
  categoryBreakdown: Array<{
    category: string
    label: string
    avgHours: number
    resolvedCount: number
  }>
}

export interface MusrenbangdesPriorityRecommendation {
  id: string
  pillar: string
  title: string
  targetBanjar: string
  justification: string
  proposedAction: string
  urgency: 'MENDESAK' | 'TINGGI' | 'SEDANG'
  estimatedFundingSource: string
}

export interface MusrenbangdesExecutiveSummary {
  villageName: string
  subdistrict: string
  district: string
  evaluationPeriod: string
  generatedAt: string
  perbekelName: string
  topConcernBanjar: {
    name: string
    issueCount: number
    mainCategory: string
  }
  dominantProblemCategory: {
    label: string
    count: number
    percentage: number
  }
  recommendations: MusrenbangdesPriorityRecommendation[]
  executiveNotes: string
}

export interface AnalyticsSummaryMetrics {
  totalComplaints: number
  resolvedComplaints: number
  inProgressComplaints: number
  openComplaints: number
  resolutionRatePercent: number
  emergencyComplaintsCount: number
  averageResolutionHours: number
  slaComplianceRatePercent: number
  totalServiceRequests: number
  approvedServiceRequests: number
}

export interface AdminAnalyticsData {
  metrics: AnalyticsSummaryMetrics
  banjarDistribution: BanjarDistributionItem[]
  categoryDistribution: CategoryDistributionItem[]
  resolutionMetrics: ResolutionTimeMetric
  musrenbangdesSummary: MusrenbangdesExecutiveSummary
  selectedBanjarId: string
  selectedTimeRange: string
}
