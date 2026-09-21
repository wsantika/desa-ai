import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { describe, it } from 'node:test'
import { analyticsFilterSchema } from '../../src/application/dtos/analytics.dto.js'
import { fetchAdminAnalyticsData } from '../../src/application/services/admin-analytics.service.js'
import { AnalyticsFilterBar } from '../../src/components/admin/analytics/AnalyticsFilterBar.js'
import { AnalyticsStatCards } from '../../src/components/admin/analytics/AnalyticsStatCards.js'
import { BanjarDistributionBarChart } from '../../src/components/admin/analytics/BanjarDistributionBarChart.js'
import { CategoryDonutChart } from '../../src/components/admin/analytics/CategoryDonutChart.js'
import { ResolutionTimeMetricsCard } from '../../src/components/admin/analytics/ResolutionTimeMetricsCard.js'
import { MusrenbangdesExecutiveSummary } from '../../src/components/admin/analytics/MusrenbangdesExecutiveSummary.js'

describe('Admin Analytics & Village Trend Visualizer (Issue #18)', () => {
  it('validates analyticsFilterSchema defaults and parsing', () => {
    const defaultParsed = analyticsFilterSchema.parse({})
    assert.equal(defaultParsed.banjarId, 'ALL')
    assert.equal(defaultParsed.timeRange, 'all')

    const customParsed = analyticsFilterSchema.parse({
      banjarId: 'banjar-kaja',
      timeRange: '30d',
    })
    assert.equal(customParsed.banjarId, 'banjar-kaja')
    assert.equal(customParsed.timeRange, '30d')

    // Invalid range should throw
    assert.throws(() => {
      analyticsFilterSchema.parse({ timeRange: 'invalid-range' })
    })
  })

  it('validates fetchAdminAnalyticsData returns expected structure and metrics', async () => {
    const data = await fetchAdminAnalyticsData()

    assert.ok(data.metrics, 'Must return metrics object')
    assert.ok(
      data.metrics.totalComplaints >= 10,
      'Must have at least 10 complaints',
    )
    assert.ok(
      data.metrics.resolvedComplaints > 0,
      'Must have resolved complaints',
    )
    assert.ok(data.metrics.averageResolutionHours > 0, 'ATTR must be positive')
    assert.ok(
      data.metrics.slaComplianceRatePercent >= 0 &&
        data.metrics.slaComplianceRatePercent <= 100,
      'SLA compliance must be a percentage',
    )
    assert.ok(
      data.metrics.resolutionRatePercent >= 0 &&
        data.metrics.resolutionRatePercent <= 100,
      'Resolution rate must be a percentage',
    )
  })

  it('validates banjar distribution data contains all 4 banjars', async () => {
    const data = await fetchAdminAnalyticsData()

    assert.equal(data.banjarDistribution.length, 4, 'Must have 4 banjars')
    const expectedBanjarIds = [
      'banjar-kaja',
      'banjar-kelod',
      'banjar-tengah',
      'banjar-kangin',
    ]

    for (const b of data.banjarDistribution) {
      assert.ok(
        expectedBanjarIds.includes(b.banjarId),
        `Banjar ${b.banjarId} is unknown`,
      )
      assert.ok(
        b.banjarName.startsWith('Banjar '),
        'Banjar name must have Banjar prefix',
      )
      assert.ok(b.dusun, 'Dusun must be present')
      assert.equal(
        b.total,
        b.open + b.inProgress + b.resolved,
        `Total mismatch for ${b.banjarName}`,
      )
    }
  })

  it('validates category distribution covers all 6 complaint categories', async () => {
    const data = await fetchAdminAnalyticsData()

    assert.equal(data.categoryDistribution.length, 6, 'Must have 6 categories')
    const expectedCategories = [
      'INFRASTRUKTUR',
      'KEBERSIHAN_LINGKUNGAN',
      'KEAMANAN_KETERTIBAN',
      'PELAYANAN_PUBLIK',
      'BANTUAN_SOSIAL',
      'LAINNYA',
    ]

    let categorySum = 0
    for (const cat of data.categoryDistribution) {
      assert.ok(
        expectedCategories.includes(cat.category),
        `Unknown category: ${cat.category}`,
      )
      assert.ok(cat.label, 'Category must have label')
      assert.ok(cat.color, 'Category must have color hex')
      assert.ok(cat.color.startsWith('#'), 'Color must be hex string')
      categorySum += cat.count
    }

    assert.equal(
      categorySum,
      data.metrics.totalComplaints,
      'Sum of category counts must equal total complaints',
    )
  })

  it('validates ATTR (Average Time to Resolution) calculation and SLA targets', async () => {
    const data = await fetchAdminAnalyticsData()
    const { resolutionMetrics } = data

    assert.ok(
      resolutionMetrics.overallAverageHours > 0,
      'Must have positive average hours',
    )
    assert.equal(
      resolutionMetrics.overallAverageDays,
      Math.round((resolutionMetrics.overallAverageHours / 24) * 10) / 10,
      'Days must equal hours divided by 24 rounded to 1 decimal',
    )
    assert.equal(
      resolutionMetrics.slaTargetHours,
      48,
      'Village SLA target must be 48 hours',
    )
    assert.ok(
      resolutionMetrics.slaComplianceRate >= 0 &&
        resolutionMetrics.slaComplianceRate <= 100,
      'SLA compliance rate must be 0-100',
    )

    assert.ok(
      resolutionMetrics.evaluations.length >= 3,
      'Must evaluate at least 3 SLA sectors',
    )
    for (const ev of resolutionMetrics.evaluations) {
      assert.ok(ev.targetLabel, 'Evaluation must have label')
      assert.ok(ev.targetHours > 0, 'Target hours must be positive')
      assert.ok(ev.actualAvgHours > 0, 'Actual hours must be positive')
      assert.ok(['OPTIMAL', 'PERLU_PERHATIAN', 'TERLAMBAT'].includes(ev.status))
    }
  })

  it('validates Musrenbangdes executive summary structure and recommendations', async () => {
    const data = await fetchAdminAnalyticsData()
    const { musrenbangdesSummary } = data

    assert.equal(musrenbangdesSummary.villageName, 'Desa Tegal Tugu')
    assert.equal(musrenbangdesSummary.subdistrict, 'Kecamatan Gianyar')
    assert.equal(musrenbangdesSummary.district, 'Kabupaten Gianyar')
    assert.ok(musrenbangdesSummary.perbekelName, 'Must have Perbekel name')

    // Top concern banjar
    assert.ok(
      musrenbangdesSummary.topConcernBanjar.name,
      'Must have top concern banjar',
    )
    assert.ok(musrenbangdesSummary.topConcernBanjar.issueCount >= 0)

    // Dominant category
    assert.ok(musrenbangdesSummary.dominantProblemCategory.label)
    assert.ok(musrenbangdesSummary.dominantProblemCategory.count >= 0)

    // Recommendations
    assert.ok(
      musrenbangdesSummary.recommendations.length >= 3,
      'Must have at least 3 priority recommendations',
    )
    for (const rec of musrenbangdesSummary.recommendations) {
      assert.ok(rec.pillar, 'Must have strategic pillar')
      assert.ok(rec.title, 'Must have title')
      assert.ok(rec.targetBanjar, 'Must target a banjar')
      assert.ok(rec.justification, 'Must have justification')
      assert.ok(rec.proposedAction, 'Must have proposed action')
      assert.ok(['MENDESAK', 'TINGGI', 'SEDANG'].includes(rec.urgency))
      assert.ok(rec.estimatedFundingSource, 'Must state funding source')
    }
  })

  it('validates UI components exist and export valid React components', () => {
    assert.equal(typeof AnalyticsFilterBar, 'function')
    assert.equal(typeof AnalyticsStatCards, 'function')
    assert.equal(typeof BanjarDistributionBarChart, 'function')
    assert.equal(typeof CategoryDonutChart, 'function')
    assert.equal(typeof ResolutionTimeMetricsCard, 'function')
    assert.equal(typeof MusrenbangdesExecutiveSummary, 'function')
  })

  it('validates antislop compliance (zero em dash characters in all analytics files)', () => {
    const filesToCheck = [
      'src/application/dtos/analytics.dto.ts',
      'src/application/services/admin-analytics.service.ts',
      'src/application/server-functions/admin-analytics.fn.ts',
      'src/components/admin/analytics/AnalyticsFilterBar.tsx',
      'src/components/admin/analytics/AnalyticsStatCards.tsx',
      'src/components/admin/analytics/BanjarDistributionBarChart.tsx',
      'src/components/admin/analytics/CategoryDonutChart.tsx',
      'src/components/admin/analytics/ResolutionTimeMetricsCard.tsx',
      'src/components/admin/analytics/MusrenbangdesExecutiveSummary.tsx',
      'src/routes/admin/analitik.tsx',
    ]

    for (const file of filesToCheck) {
      const filePath = path.resolve(process.cwd(), file)
      assert.ok(fs.existsSync(filePath), `File ${file} must exist`)
      const content = fs.readFileSync(filePath, 'utf-8')
      assert.ok(
        !content.includes('—'),
        `File ${file} contains forbidden em dash character (—)`,
      )
    }
  })
})
