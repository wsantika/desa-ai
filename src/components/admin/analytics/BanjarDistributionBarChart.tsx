import { useState } from 'react'
import { BarChart3, MapPin, AlertCircle } from 'lucide-react'
import type { BanjarDistributionItem } from '../../application/dtos/analytics.dto.js'

interface BanjarDistributionBarChartProps {
  data: BanjarDistributionItem[]
  onSelectBanjar?: (banjarId: string) => void
  selectedBanjarId?: string
}

function getTopRoundedRectPath(
  x: number,
  y: number,
  w: number,
  h: number,
  r = 4,
) {
  if (h <= 0) return ''
  const effectiveR = Math.min(r, h / 2, w / 2)
  return `M ${x} ${y + h} L ${x} ${y + effectiveR} Q ${x} ${y} ${x + effectiveR} ${y} L ${x + w - effectiveR} ${y} Q ${x + w} ${y} ${x + w} ${y + effectiveR} L ${x + w} ${y + h} Z`
}

export function BanjarDistributionBarChart({
  data,
  onSelectBanjar,
  selectedBanjarId = 'ALL',
}: BanjarDistributionBarChartProps) {
  const [activeBanjarId, setActiveBanjarId] = useState<string | null>(null)

  // Determine maximum count to scale bars proportionally
  const maxTotal = Math.max(...data.map((d) => d.total), 1)
  // Scale ceiling with headroom (e.g. at least 5)
  const chartCeiling = Math.max(Math.ceil(maxTotal * 1.2), 5)

  const activeItem = data.find(
    (d) =>
      d.banjarId ===
      (activeBanjarId ||
        (selectedBanjarId !== 'ALL' ? selectedBanjarId : null)),
  )

  const svgWidth = 560
  const chartLeft = 50
  const chartRight = 530
  const chartWidth = chartRight - chartLeft
  const slotCount = Math.max(data.length, 1)
  const slotWidth = chartWidth / slotCount
  const gridStartX = 40
  const gridEndX = 545
  const yBase = 190

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="m-0 text-sm font-bold text-slate-900 dark:text-slate-100">
              Distribusi Pengaduan per Wilayah Banjar
            </h3>
            <p className="m-0 text-xs text-slate-500 dark:text-slate-400">
              Perbandingan beban aduan dan status penanganan pada {data.length} banjar dinas
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-blue-600" />
            <span className="text-slate-600 dark:text-slate-300">
              Selesai
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-amber-500" />
            <span className="text-slate-600 dark:text-slate-300">
              Proses
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-rose-500" />
            <span className="text-slate-600 dark:text-slate-300">
              Terbuka
            </span>
          </div>
        </div>
      </div>

      {/* SVG Chart Area */}
      <div className="mt-6">
        <div className="relative w-full">
          <svg
            viewBox={`0 0 ${svgWidth} 240`}
            className="w-full h-auto overflow-visible"
            role="img"
            aria-label="Grafik batang distribusi pengaduan per wilayah Banjar"
          >
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
              const y = yBase - pct * 150
              const value = Math.round(chartCeiling * pct)
              return (
                <g key={idx}>
                  <line
                    x1={gridStartX}
                    y1={y}
                    x2={gridEndX}
                    y2={y}
                    stroke="currentColor"
                    strokeDasharray="3 3"
                    className="text-slate-200 dark:text-slate-800"
                  />
                  <text
                    x={gridStartX - 8}
                    y={y + 3}
                    textAnchor="end"
                    fontSize="10"
                    fill="currentColor"
                    className="font-mono text-slate-400 dark:text-slate-500"
                  >
                    {value}
                  </text>
                </g>
              )
            })}

            {/* Bars for each Banjar */}
            {data.map((item, index) => {
              const xCenter = chartLeft + (index + 0.5) * slotWidth
              const barWidth = Math.min(Math.max(slotWidth - 36, 36), 48)
              const barX = xCenter - barWidth / 2
              const highlightWidth = Math.min(slotWidth - 8, 84)
              const highlightX = xCenter - highlightWidth / 2

              const isSelected =
                selectedBanjarId === item.banjarId ||
                activeBanjarId === item.banjarId

              const resolvedHeight = Math.max((item.resolved / chartCeiling) * 150, 0)
              const inProgressHeight = Math.max((item.inProgress / chartCeiling) * 150, 0)
              const openHeight = Math.max((item.open / chartCeiling) * 150, 0)

              const resolvedY = yBase - resolvedHeight
              const inProgressY = resolvedY - inProgressHeight
              const openY = inProgressY - openHeight

              const totalStackHeight = resolvedHeight + inProgressHeight + openHeight
              const topOfStackY = yBase - totalStackHeight

              return (
                <g
                  key={item.banjarId}
                  className="cursor-pointer transition-opacity"
                  onClick={() => onSelectBanjar?.(item.banjarId)}
                  onMouseEnter={() => setActiveBanjarId(item.banjarId)}
                  onMouseLeave={() => setActiveBanjarId(null)}
                  onFocus={() => setActiveBanjarId(item.banjarId)}
                  onBlur={() => setActiveBanjarId(null)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${item.banjarName}: ${item.total} aduan (${item.resolved} selesai, ${item.inProgress} proses, ${item.open} terbuka)`}
                >
                  {/* Highlight backdrop */}
                  {isSelected && (
                    <rect
                      x={highlightX}
                      y={20}
                      width={highlightWidth}
                      height={180}
                      rx={6}
                      fill="currentColor"
                      className="text-blue-500/10 dark:text-blue-400/10"
                    />
                  )}

                  {/* Empty state bar outline if 0 */}
                  {item.total === 0 && (
                    <rect
                      x={barX}
                      y={yBase - 10}
                      width={barWidth}
                      height={10}
                      rx={3}
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="2 2"
                      className="text-slate-300 dark:text-slate-700"
                    />
                  )}

                  {/* Stacked Bars with solid continuous baseline resting */}
                  {/* 1. Resolved (bottom - Blue 600) */}
                  {resolvedHeight > 0 && (
                    inProgressHeight === 0 && openHeight === 0 ? (
                      <path
                        d={getTopRoundedRectPath(barX, resolvedY, barWidth, resolvedHeight, 4)}
                        fill="#2563eb"
                        className="transition-all hover:brightness-110"
                      />
                    ) : (
                      <rect
                        x={barX}
                        y={resolvedY}
                        width={barWidth}
                        height={resolvedHeight}
                        fill="#2563eb"
                        className="transition-all hover:brightness-110"
                      />
                    )
                  )}

                  {/* 2. In Progress (middle - Amber 500) */}
                  {inProgressHeight > 0 && (
                    openHeight === 0 ? (
                      <path
                        d={getTopRoundedRectPath(barX, inProgressY, barWidth, inProgressHeight, 4)}
                        fill="#f59e0b"
                        className="transition-all hover:brightness-110"
                      />
                    ) : (
                      <rect
                        x={barX}
                        y={inProgressY}
                        width={barWidth}
                        height={inProgressHeight}
                        fill="#f59e0b"
                        className="transition-all hover:brightness-110"
                      />
                    )
                  )}

                  {/* 3. Open (top - Rose 500) */}
                  {openHeight > 0 && (
                    <path
                      d={getTopRoundedRectPath(barX, openY, barWidth, openHeight, 4)}
                      fill="#f43f5e"
                      className="transition-all hover:brightness-110"
                    />
                  )}

                  {/* Total Value on Top of Bar */}
                  {item.total > 0 && (
                    <text
                      x={xCenter}
                      y={topOfStackY - 6}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="bold"
                      fill="currentColor"
                      className="font-mono text-slate-800 dark:text-slate-200"
                    >
                      {item.total}
                    </text>
                  )}

                  {/* X Axis Label */}
                  <text
                    x={xCenter}
                    y={210}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight={isSelected ? 'bold' : '600'}
                    fill="currentColor"
                    className="text-slate-900 dark:text-slate-200"
                  >
                    {item.banjarName}
                  </text>
                  <text
                    x={xCenter}
                    y={225}
                    textAnchor="middle"
                    fontSize="9"
                    fill="currentColor"
                    className="text-slate-500 dark:text-slate-400"
                  >
                    {item.dusun}
                  </text>
                </g>
              )
            })}

            {/* Baseline spanning all banjars */}
            <line
              x1={gridStartX}
              y1={yBase}
              x2={gridEndX}
              y2={yBase}
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-slate-300 dark:text-slate-700"
            />
          </svg>
        </div>
      </div>

      {/* Active Bar Detail Box */}
      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-900/50">
        {activeItem ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {activeItem.banjarName} ({activeItem.dusun})
                </span>
                <span className="ml-2 text-slate-500 dark:text-slate-400">
                  Topik Utama: {activeItem.topCategory || 'Belum Ada Aduan'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {activeItem.resolved} Selesai
              </span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">
                {activeItem.inProgress} Proses
              </span>
              <span className="font-semibold text-rose-600 dark:text-rose-400">
                {activeItem.open} Terbuka
              </span>
              <span className="rounded bg-slate-200/60 px-2 py-0.5 font-mono font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                ATTR: {activeItem.avgResolutionHours} Jam
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <AlertCircle className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>
              Arahkan kursor atau klik pada salah satu batang banjar untuk
              melihat rincian penyelesaian masalah.
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
