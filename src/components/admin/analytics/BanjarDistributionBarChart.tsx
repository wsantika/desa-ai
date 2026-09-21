import { useState } from 'react'
import { BarChart3, MapPin, AlertCircle } from 'lucide-react'
import type { BanjarDistributionItem } from '../../application/dtos/analytics.dto.js'

interface BanjarDistributionBarChartProps {
  data: BanjarDistributionItem[]
  onSelectBanjar?: (banjarId: string) => void
  selectedBanjarId?: string
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

  return (
    <div className="flex flex-col justify-between rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] p-5 shadow-xs dark:border-[#22352f] dark:bg-[#121c19]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line,#d5ded9)] pb-4 dark:border-[#22352f]">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="m-0 text-sm font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-100">
              Distribusi Pengaduan per Wilayah Banjar
            </h3>
            <p className="m-0 text-xs text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
              Perbandingan beban aduan dan status penanganan pada 4 banjar dinas
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-emerald-600" />
            <span className="text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
              Selesai
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-amber-500" />
            <span className="text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
              Proses
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-rose-500" />
            <span className="text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
              Terbuka
            </span>
          </div>
        </div>
      </div>

      {/* SVG Chart Area */}
      <div className="mt-6">
        <div className="relative w-full">
          <svg
            viewBox="0 0 500 240"
            className="w-full h-auto overflow-visible"
            role="img"
            aria-label="Grafik batang distribusi pengaduan per wilayah Banjar"
          >
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
              const y = 190 - pct * 150
              const value = Math.round(chartCeiling * pct)
              return (
                <g key={idx}>
                  <line
                    x1="45"
                    y1={y}
                    x2="480"
                    y2={y}
                    stroke="currentColor"
                    strokeDasharray="3 3"
                    className="text-[var(--line,#d5ded9)] opacity-60 dark:text-[#22352f]"
                  />
                  <text
                    x="35"
                    y={y + 3}
                    textAnchor="end"
                    fontSize="10"
                    fill="currentColor"
                    className="font-mono text-[var(--sea-ink-soft,#576c64)] opacity-70 dark:text-stone-400"
                  >
                    {value}
                  </text>
                </g>
              )
            })}

            {/* Bars for each Banjar */}
            {data.map((item, index) => {
              const groupWidth = 80
              const xStart = 70 + index * 105
              const isSelected =
                selectedBanjarId === item.banjarId ||
                activeBanjarId === item.banjarId

              const totalHeight = (item.total / chartCeiling) * 150
              const resolvedHeight = (item.resolved / chartCeiling) * 150
              const inProgressHeight = (item.inProgress / chartCeiling) * 150
              const openHeight = (item.open / chartCeiling) * 150

              const yBase = 190

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
                      x={xStart - 10}
                      y={20}
                      width={groupWidth + 20}
                      height={180}
                      rx={6}
                      fill="currentColor"
                      className="text-emerald-500/10 dark:text-emerald-400/10"
                    />
                  )}

                  {/* Empty state bar outline if 0 */}
                  {item.total === 0 && (
                    <rect
                      x={xStart + 15}
                      y={yBase - 10}
                      width={50}
                      height={10}
                      rx={3}
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="2 2"
                      className="text-stone-300 dark:text-stone-700"
                    />
                  )}

                  {/* Stacked Bars */}
                  {/* 1. Resolved (bottom) */}
                  {resolvedHeight > 0 && (
                    <rect
                      x={xStart + 15}
                      y={yBase - resolvedHeight}
                      width={50}
                      height={resolvedHeight}
                      rx={inProgressHeight === 0 && openHeight === 0 ? 4 : 0}
                      fill="#15803d" // Emerald 700
                      className="transition-all hover:brightness-110"
                    />
                  )}

                  {/* 2. In Progress (middle) */}
                  {inProgressHeight > 0 && (
                    <rect
                      x={xStart + 15}
                      y={yBase - resolvedHeight - inProgressHeight}
                      width={50}
                      height={inProgressHeight}
                      rx={openHeight === 0 ? 4 : 0}
                      fill="#d97706" // Amber 600
                      className="transition-all hover:brightness-110"
                    />
                  )}

                  {/* 3. Open (top) */}
                  {openHeight > 0 && (
                    <rect
                      x={xStart + 15}
                      y={yBase - totalHeight}
                      width={50}
                      height={openHeight}
                      rx={4}
                      fill="#e11d48" // Rose 600
                      className="transition-all hover:brightness-110"
                    />
                  )}

                  {/* Total Value on Top of Bar */}
                  {item.total > 0 && (
                    <text
                      x={xStart + 40}
                      y={yBase - totalHeight - 6}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="bold"
                      fill="currentColor"
                      className="font-mono text-[var(--sea-ink,#1b2a26)] dark:text-stone-200"
                    >
                      {item.total}
                    </text>
                  )}

                  {/* X Axis Label */}
                  <text
                    x={xStart + 40}
                    y={210}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight={isSelected ? 'bold' : '600'}
                    fill="currentColor"
                    className="text-[var(--sea-ink,#1b2a26)] dark:text-stone-300"
                  >
                    {item.banjarName}
                  </text>
                  <text
                    x={xStart + 40}
                    y={225}
                    textAnchor="middle"
                    fontSize="9"
                    fill="currentColor"
                    className="text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400"
                  >
                    {item.dusun}
                  </text>
                </g>
              )
            })}

            {/* Baseline */}
            <line
              x1="45"
              y1="190"
              x2="480"
              y2="190"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-[var(--sea-ink,#1b2a26)] opacity-40 dark:text-stone-400"
            />
          </svg>
        </div>
      </div>

      {/* Active Bar Detail Box */}
      <div className="mt-4 rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f8faf9)] p-3 text-xs dark:border-[#22352f] dark:bg-[#182522]">
        {activeItem ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-800 dark:text-emerald-400" />
              <div>
                <span className="font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-100">
                  {activeItem.banjarName} ({activeItem.dusun})
                </span>
                <span className="ml-2 text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                  Topik Utama: {activeItem.topCategory || 'Belum Ada Aduan'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                {activeItem.resolved} Selesai
              </span>
              <span className="font-semibold text-amber-700 dark:text-amber-400">
                {activeItem.inProgress} Proses
              </span>
              <span className="font-semibold text-rose-700 dark:text-rose-400">
                {activeItem.open} Terbuka
              </span>
              <span className="rounded bg-black/5 px-2 py-0.5 font-mono font-bold dark:bg-white/10">
                ATTR: {activeItem.avgResolutionHours} Jam
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
            <AlertCircle className="h-3.5 w-3.5 text-emerald-800 dark:text-emerald-400" />
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
