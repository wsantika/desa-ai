import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ArrowLeft,
  BarChart3,
  Download,
  Printer,
  Sparkles,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { getAdminAnalyticsServerFn } from '../../application/server-functions/admin-analytics.fn.js'
import type { AdminAnalyticsData } from '../../application/server-functions/admin-analytics.fn.js'
import { AnalyticsFilterBar } from '../../components/admin/analytics/AnalyticsFilterBar.js'
import { AnalyticsStatCards } from '../../components/admin/analytics/AnalyticsStatCards.js'
import { BanjarDistributionBarChart } from '../../components/admin/analytics/BanjarDistributionBarChart.js'
import { CategoryDonutChart } from '../../components/admin/analytics/CategoryDonutChart.js'
import { ResolutionTimeMetricsCard } from '../../components/admin/analytics/ResolutionTimeMetricsCard.js'
import { MusrenbangdesExecutiveSummary } from '../../components/admin/analytics/MusrenbangdesExecutiveSummary.js'

export const Route = createFileRoute('/admin/analitik')({
  loader: async () => {
    return await getAdminAnalyticsServerFn({
      data: { banjarId: 'ALL', timeRange: 'all' },
    })
  },
  component: AdminAnalitikDeskPage,
})

function AdminAnalitikDeskPage() {
  const initialData = Route.useLoaderData()
  const [data, setData] = useState<AdminAnalyticsData>(initialData)
  const [selectedBanjar, setSelectedBanjar] = useState<string>(
    initialData?.selectedBanjarId || 'ALL',
  )
  const [timeRange, setTimeRange] = useState<'all' | '30d' | '90d' | 'year'>(
    (initialData?.selectedTimeRange as 'all' | '30d' | '90d' | 'year') || 'all',
  )
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleFetchData = async (
    targetBanjar: string = selectedBanjar,
    targetRange: 'all' | '30d' | '90d' | 'year' = timeRange,
  ) => {
    setIsLoading(true)
    setErrorMsg(null)
    try {
      const result = await getAdminAnalyticsServerFn({
        data: { banjarId: targetBanjar, timeRange: targetRange },
      })
      setData(result)
    } catch (err) {
      console.error('Gagal memperbarui data analitik:', err)
      setErrorMsg('Gagal memuat data analitik terbaru. Silakan coba kembali.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectBanjar = (banjarId: string) => {
    setSelectedBanjar(banjarId)
    handleFetchData(banjarId, timeRange)
  }

  const handleSelectTimeRange = (range: 'all' | '30d' | '90d' | 'year') => {
    setTimeRange(range)
    handleFetchData(selectedBanjar, range)
  }

  const handlePrintMusrenbangdes = () => {
    window.print()
  }

  // Master banjars list for filter
  const banjarOptions = data.banjarDistribution.map((b) => ({
    id: b.banjarId,
    name: b.banjarName,
  }))

  const topBanjar = data.musrenbangdesSummary.topConcernBanjar

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Navigation & Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke Ringkasan Dashboard</span>
            </Link>
          </div>
          <h2 className="mt-1.5 mb-0 text-xl sm:text-2xl font-bold tracking-tight text-[var(--sea-ink,#1b2a26)] dark:text-stone-100">
            Analitik Tren Desa dan Sebaran Wilayah Banjar
          </h2>
          <p className="mt-1 mb-0 text-xs sm:text-sm text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
            Visualisasi data agregat pengaduan warga, kepatuhan batas waktu
            (SLA), dan briefing perencanaan Musrenbangdes Desa Tegal Tugu.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrintMusrenbangdes}
            className="inline-flex min-h-[44px] sm:min-h-[38px] items-center gap-1.5 rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] px-3.5 py-2 text-xs font-semibold text-[var(--sea-ink,#1b2a26)] transition-colors hover:bg-black/5 dark:border-[#22352f] dark:bg-[#121c19] dark:text-stone-200"
            title="Cetak format A4 untuk rapat koordinasi Musrenbangdes"
          >
            <Printer className="h-4 w-4 text-emerald-800 dark:text-emerald-400" />
            <span>Cetak Dokumen</span>
          </button>
        </div>
      </div>

      {/* Error state */}
      {errorMsg && (
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => handleFetchData()}
            className="rounded-md bg-rose-800 px-3 py-1 font-semibold text-white hover:bg-rose-900 dark:bg-rose-700"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <AnalyticsFilterBar
        selectedBanjar={selectedBanjar}
        onSelectBanjar={handleSelectBanjar}
        banjars={banjarOptions}
        timeRange={timeRange}
        onSelectTimeRange={handleSelectTimeRange}
        isLoading={isLoading}
        onRefresh={() => handleFetchData()}
        onPrint={handlePrintMusrenbangdes}
      />

      {/* High-Level Stat Cards */}
      <AnalyticsStatCards
        metrics={data.metrics}
        topBanjarName={topBanjar.name}
        topBanjarCount={topBanjar.issueCount}
      />

      {/* Interactive Charts: Banjar Bar Chart & Category Donut Chart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Bar Chart: 7 cols on lg */}
        <div className="lg:col-span-7">
          <BanjarDistributionBarChart
            data={data.banjarDistribution}
            selectedBanjarId={selectedBanjar}
            onSelectBanjar={handleSelectBanjar}
          />
        </div>

        {/* Donut Chart: 5 cols on lg */}
        <div className="lg:col-span-5">
          <CategoryDonutChart data={data.categoryDistribution} />
        </div>
      </div>

      {/* Average Time to Resolution (ATTR) & SLA Sector Breakdown */}
      <ResolutionTimeMetricsCard metrics={data.resolutionMetrics} />

      {/* Musrenbangdes Executive Briefing Card */}
      <MusrenbangdesExecutiveSummary summary={data.musrenbangdesSummary} />
    </div>
  )
}
