import { createServerFn } from '@tanstack/react-start'
import { analyticsFilterSchema } from '../dtos/analytics.dto.js'
import type {
  AdminAnalyticsData,
  AnalyticsFilterInput,
  BanjarDistributionItem,
  CategoryDistributionItem,
  MusrenbangdesExecutiveSummary,
  MusrenbangdesPriorityRecommendation,
  ResolutionTimeMetric,
} from '../dtos/analytics.dto.js'
import { fetchAdminAnalyticsData } from '../services/admin-analytics.service.js'

export const getAdminAnalyticsServerFn = createServerFn({
  method: 'GET',
})
  .validator((d: unknown) => analyticsFilterSchema.parse(d))
  .handler(async ({ data }: { data: AnalyticsFilterInput }) => {
    return fetchAdminAnalyticsData(data)
  })

export type {
  AdminAnalyticsData,
  AnalyticsFilterInput,
  BanjarDistributionItem,
  CategoryDistributionItem,
  MusrenbangdesExecutiveSummary,
  MusrenbangdesPriorityRecommendation,
  ResolutionTimeMetric,
}
