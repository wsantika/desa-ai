import {
  FileText,
  Award,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Building2,
} from 'lucide-react'
import type { MusrenbangdesExecutiveSummary as MusrenbangdesSummaryType } from '../../application/dtos/analytics.dto.js'

interface MusrenbangdesExecutiveSummaryProps {
  summary: MusrenbangdesSummaryType
}

export function MusrenbangdesExecutiveSummary({
  summary,
}: MusrenbangdesExecutiveSummaryProps) {
  return (
    <div
      id="musrenbangdes-briefing-sheet"
      className="printable-musrenbangdes-area flex flex-col justify-between rounded-xl border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] p-6 shadow-xs dark:border-[#22352f] dark:bg-[#121c19]"
    >
      {/* Official Header Kop */}
      <div className="border-b-2 border-[var(--sea-ink,#1b2a26)] pb-4 text-center dark:border-stone-600">
        <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
          <Building2 className="h-4 w-4" />
          <span>Pemerintah Kabupaten Gianyar • Kecamatan Gianyar</span>
        </div>
        <h2 className="mt-1 mb-0 font-serif text-lg sm:text-xl font-bold tracking-tight text-[var(--sea-ink,#1b2a26)] dark:text-stone-100">
          PEMERINTAH DESA TEGAL TUGU
        </h2>
        <p className="mt-0.5 mb-2 text-xs font-medium text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
          Jalan Raya Tegal Tugu No. 1, Kecamatan Gianyar, Kabupaten Gianyar,
          Bali 80515
        </p>
        <div className="mx-auto inline-block rounded-md bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200">
          LEMBAR RINGKASAN EKSEKUTIF ANALITIK MUSRENBANGDES (RKPDES 2027)
        </div>
      </div>

      {/* Meta Evaluation Info */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-secondary,#f8faf9)] p-3.5 text-xs dark:border-[#22352f] dark:bg-[#182522]">
        <div>
          <span className="text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
            Periode Data:
          </span>
          <p className="m-0 font-semibold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
            {summary.evaluationPeriod}
          </p>
        </div>
        <div>
          <span className="text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
            Wilayah Fokus Utama:
          </span>
          <p className="m-0 font-semibold text-emerald-800 dark:text-emerald-300">
            {summary.topConcernBanjar.name} (
            {summary.topConcernBanjar.issueCount} Laporan)
          </p>
        </div>
        <div>
          <span className="text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
            Isu Sektor Dominan:
          </span>
          <p className="m-0 font-semibold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
            {summary.dominantProblemCategory.label} (
            {summary.dominantProblemCategory.percentage}%)
          </p>
        </div>
      </div>

      {/* Rationale & Executive Note */}
      <div className="mt-4 rounded-lg border-l-4 border-emerald-800 bg-emerald-50/60 p-3.5 text-xs text-emerald-950 dark:border-emerald-400 dark:bg-emerald-950/30 dark:text-emerald-200">
        <div className="flex items-start gap-2">
          <FileText className="h-4 w-4 shrink-0 text-emerald-800 dark:text-emerald-400 mt-0.5" />
          <div>
            <span className="font-bold">
              Pengantar Hasil Penjaringan Aspirasi Digital:
            </span>
            <p className="mt-1 mb-0 leading-relaxed text-xs opacity-90">
              {summary.executiveNotes}
            </p>
          </div>
        </div>
      </div>

      {/* Strategic Recommendations for Musrenbangdes */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--line,#d5ded9)] pb-2 dark:border-[#22352f]">
          <h3 className="m-0 text-sm font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-100">
            Rekomendasi Prioritas Anggaran & Program Kerja Fisik/Non-Fisik
          </h3>
          <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">
            Sumber: Agregasi Keluhan Riil Warga
          </span>
        </div>

        <div className="space-y-3">
          {summary.recommendations.map((rec, index) => {
            const urgencyBadge =
              rec.urgency === 'MENDESAK'
                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                : rec.urgency === 'TINGGI'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'

            return (
              <div
                key={rec.id}
                className="rounded-lg border border-[var(--line,#d5ded9)] p-4 text-xs transition-shadow hover:shadow-xs dark:border-[#22352f]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-800 text-[10px] font-bold text-white dark:bg-emerald-700">
                      {index + 1}
                    </span>
                    <span className="font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-200">
                      {rec.pillar}
                    </span>
                    <span className="flex items-center gap-1 rounded-sm bg-black/5 px-2 py-0.5 text-[11px] font-medium text-[var(--sea-ink-soft,#576c64)] dark:bg-white/5 dark:text-stone-400">
                      <MapPin className="h-3 w-3" />
                      Lokasi Sasaran: {rec.targetBanjar}
                    </span>
                  </div>
                  <span
                    className={`rounded-md px-2 py-0.5 font-bold ${urgencyBadge}`}
                  >
                    Prioritas {rec.urgency}
                  </span>
                </div>

                <h4 className="mt-2 mb-1 text-xs sm:text-sm font-bold text-[var(--sea-ink,#1b2a26)] dark:text-stone-100">
                  {rec.title}
                </h4>

                <div className="mt-2 space-y-1.5 text-xs text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
                  <p className="m-0">
                    <strong className="text-[var(--sea-ink,#1b2a26)] dark:text-stone-300">
                      Justifikasi Masalah:
                    </strong>{' '}
                    {rec.justification}
                  </p>
                  <p className="m-0">
                    <strong className="text-[var(--sea-ink,#1b2a26)] dark:text-stone-300">
                      Rencana Tindakan:
                    </strong>{' '}
                    {rec.proposedAction}
                  </p>
                  <p className="m-0 text-emerald-800 dark:text-emerald-400">
                    <strong>Estimasi Sumber Pendanaan:</strong>{' '}
                    {rec.estimatedFundingSource}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Official Validation & Signature Footer */}
      <div className="mt-8 pt-6 border-t border-[var(--line,#d5ded9)] dark:border-[#22352f]">
        <div className="flex flex-col sm:flex-row items-end justify-between gap-6 text-xs">
          <div className="space-y-1 text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
            <p className="m-0 font-medium">
              Dokumen ini disahkan sebagai lampiran kerja Musyawarah Perencanaan
              Pembangunan Desa (Musrenbangdes).
            </p>
            <p className="m-0 font-mono text-[11px]">
              Dicetak otomatis melalui DesaAI Governance Engine pada:{' '}
              {summary.generatedAt}
            </p>
          </div>

          <div className="w-full sm:w-56 text-center">
            <p className="m-0 text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
              Perbekel Desa Tegal Tugu,
            </p>
            <div className="my-6 flex justify-center">
              <div className="flex h-14 w-28 items-center justify-center rounded-sm border border-dashed border-emerald-800/40 text-[10px] font-semibold text-emerald-800/60 dark:border-emerald-400/40 dark:text-emerald-300/60">
                [ Tanda Tangan & Cap ]
              </div>
            </div>
            <p className="m-0 font-bold text-[var(--sea-ink,#1b2a26)] underline dark:text-stone-100">
              {summary.perbekelName}
            </p>
            <p className="m-0 text-[11px] text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
              NIP. 19780512 200501 1 008
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
