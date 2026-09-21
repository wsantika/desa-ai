import { useState } from 'react'
import { PieChart, Info } from 'lucide-react'
import type { CategoryDistributionItem } from '../../application/dtos/analytics.dto.js'

interface CategoryDonutChartProps {
  data: CategoryDistributionItem[]
}

export function CategoryDonutChart({ data }: CategoryDonutChartProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  const totalCount = data.reduce((acc, curr) => acc + curr.count, 0)
  const activeItem = data.find((d) => d.category === hoveredCategory)

  // Calculate SVG arc paths for the donut
  const cx = 120
  const cy = 120
  const outerR = 90
  const innerR = 56

  let currentAngle = -Math.PI / 2 // Start at top (12 o'clock)

  const slices = data
    .filter((d) => d.count > 0)
    .map((item) => {
      const sliceAngle =
        totalCount > 0 ? (item.count / totalCount) * 2 * Math.PI : 0
      const startAngle = currentAngle
      const endAngle = currentAngle + sliceAngle
      currentAngle = endAngle

      const isLargeArc = sliceAngle > Math.PI ? 1 : 0

      const x1 = cx + outerR * Math.cos(startAngle)
      const y1 = cy + outerR * Math.sin(startAngle)
      const x2 = cx + outerR * Math.cos(endAngle)
      const y2 = cy + outerR * Math.sin(endAngle)

      const x3 = cx + innerR * Math.cos(endAngle)
      const y3 = cy + innerR * Math.sin(endAngle)
      const x4 = cx + innerR * Math.cos(startAngle)
      const y4 = cy + innerR * Math.sin(startAngle)

      const pathData =
        sliceAngle >= 2 * Math.PI - 0.001
          ? `M ${cx} ${cy - outerR} A ${outerR} ${outerR} 0 1 1 ${cx - 0.01} ${cy - outerR} L ${cx - 0.01} ${cy - innerR} A ${innerR} ${innerR} 0 1 0 ${cx} ${cy - innerR} Z`
          : `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${isLargeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${isLargeArc} 0 ${x4} ${y4} Z`

      return {
        ...item,
        pathData,
        startAngle,
        endAngle,
      }
    })

  return (
    <div className="flex flex-col justify-between rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] p-5 shadow-xs dark:border-[#22352f] dark:bg-[#121c19]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--line,#d5ded9)] pb-4 dark:border-[#22352f]">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
            <PieChart className="h-4 w-4" />
          </div>
          <div>
            <h3 className="m-0 text-sm font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-100">
              Sebaran Kategori Masalah
            </h3>
            <p className="m-0 text-xs text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
              Komposisi keluhan berdasarkan sektor pelayanan desa
            </p>
          </div>
        </div>
      </div>

      {/* Donut & Legend Container */}
      <div className="mt-6 grid grid-cols-1 items-center gap-6 md:grid-cols-12">
        {/* Donut Chart SVG */}
        <div className="flex justify-center md:col-span-5">
          <div className="relative h-[240px] w-[240px]">
            <svg
              viewBox="0 0 240 240"
              className="h-full w-full overflow-visible"
              role="img"
              aria-label="Diagram donat sebaran kategori masalah desa"
            >
              {totalCount === 0 ? (
                // Empty state ring
                <circle
                  cx={cx}
                  cy={cy}
                  r={(outerR + innerR) / 2}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={outerR - innerR}
                  strokeDasharray="4 4"
                  className="text-stone-200 dark:text-stone-800"
                />
              ) : (
                slices.map((slice) => {
                  const isHovered = hoveredCategory === slice.category
                  return (
                    <path
                      key={slice.category}
                      d={slice.pathData}
                      fill={slice.color}
                      className={`cursor-pointer transition-all duration-200 focus:outline-none ${
                        isHovered
                          ? 'scale-105 opacity-100 drop-shadow-md'
                          : 'opacity-95 hover:opacity-100'
                      }`}
                      style={{
                        transformOrigin: `${cx}px ${cy}px`,
                      }}
                      onMouseEnter={() => setHoveredCategory(slice.category)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      onFocus={() => setHoveredCategory(slice.category)}
                      onBlur={() => setHoveredCategory(null)}
                      tabIndex={0}
                      role="button"
                      aria-label={`${slice.label}: ${slice.count} laporan (${slice.percentage}%)`}
                    />
                  )
                })
              )}

              {/* Center Donut Hole Content */}
              <circle
                cx={cx}
                cy={cy}
                r={innerR - 2}
                fill="currentColor"
                className="text-[var(--surface-primary,#ffffff)] dark:text-[#121c19]"
              />
              <text
                x={cx}
                y={cy - 6}
                textAnchor="middle"
                fontSize="22"
                fontWeight="bold"
                fill="currentColor"
                className="font-mono text-[var(--sea-ink,#1b2a26)] dark:text-stone-100"
              >
                {activeItem ? activeItem.count : totalCount}
              </text>
              <text
                x={cx}
                y={cy + 12}
                textAnchor="middle"
                fontSize="10"
                fontWeight="semibold"
                fill="currentColor"
                className="text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400"
              >
                {activeItem
                  ? `${activeItem.percentage}% Bagian`
                  : 'Total Laporan'}
              </text>
            </svg>
          </div>
        </div>

        {/* Legend & Breakdown List */}
        <div className="space-y-2.5 md:col-span-7">
          {data.map((item) => {
            const isHovered = hoveredCategory === item.category
            return (
              <div
                key={item.category}
                onMouseEnter={() => setHoveredCategory(item.category)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`flex flex-col gap-1 rounded-lg p-2 transition-colors cursor-pointer ${
                  isHovered
                    ? 'bg-black/5 dark:bg-white/10'
                    : 'hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 shrink-0 rounded-xs"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-semibold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                      {item.count} lap
                    </span>
                    <span className="w-9 text-right font-mono text-xs font-semibold text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress bar representing category weight */}
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 flex items-center gap-1.5 rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f8faf9)] p-2.5 text-xs text-[var(--sea-ink-soft,#576c64)] dark:border-[#22352f] dark:bg-[#182522] dark:text-stone-400">
        <Info className="h-3.5 w-3.5 shrink-0 text-emerald-800 dark:text-emerald-400" />
        <span>
          Aduan kategori Infrastruktur dan Kebersihan Lingkungan menjadi
          prioritas utama pada pemetaan usulan Musrenbangdes.
        </span>
      </div>
    </div>
  )
}
