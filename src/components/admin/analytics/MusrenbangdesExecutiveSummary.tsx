import {
  FileText,
  MapPin,
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
      className="printable-musrenbangdes-area flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 print:p-0 print:border-none print:shadow-none print:bg-white print:text-slate-900"
    >
      {/* Official Header Kop */}
      <div className="border-b-2 border-slate-900 pb-4 text-center dark:border-slate-700 print:border-b-2 print:border-black print:pb-3">
        <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 print:text-blue-800">
          <Building2 className="h-4 w-4" />
          <span>Pemerintah Kabupaten Gianyar • Kecamatan Gianyar</span>
        </div>
        <h2 className="mt-1 mb-0 font-sans text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 print:text-black">
          PEMERINTAH DESA TEGAL TUGU
        </h2>
        <p className="mt-0.5 mb-2 text-xs font-medium text-slate-500 dark:text-slate-400 print:text-slate-600">
          Jalan Raya Tegal Tugu No. 1, Kecamatan Gianyar, Kabupaten Gianyar,
          Bali 80515
        </p>
        <div className="mx-auto inline-block rounded-md bg-blue-50 px-3 py-1 text-xs font-bold text-blue-900 dark:bg-blue-950/60 dark:text-blue-200 print:bg-blue-100 print:text-blue-950 print:border print:border-blue-300">
          LEMBAR RINGKASAN EKSEKUTIF ANALITIK MUSRENBANGDES (RKPDES 2027)
        </div>
      </div>

      {/* Meta Evaluation Info */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-900/50 print:mt-3 print:grid-cols-3 print:gap-2 print:border-slate-300 print:bg-slate-50/70 print:p-2.5 print:text-[11px]">
        <div>
          <span className="text-slate-500 dark:text-slate-400 print:text-slate-600">
            Periode Data:
          </span>
          <p className="m-0 font-semibold text-slate-900 dark:text-slate-200 print:text-black">
            {summary.evaluationPeriod}
          </p>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 print:text-slate-600">
            Wilayah Fokus Utama:
          </span>
          <p className="m-0 font-semibold text-blue-700 dark:text-blue-400 print:text-blue-800">
            {summary.topConcernBanjar.name} (
            {summary.topConcernBanjar.issueCount} Laporan)
          </p>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 print:text-slate-600">
            Isu Sektor Dominan:
          </span>
          <p className="m-0 font-semibold text-slate-900 dark:text-slate-200 print:text-black">
            {summary.dominantProblemCategory.label} (
            {summary.dominantProblemCategory.percentage}%)
          </p>
        </div>
      </div>

      {/* Rationale & Executive Note */}
      <div className="mt-4 rounded-lg border-l-4 border-blue-600 bg-blue-50/60 p-3.5 text-xs text-blue-950 dark:border-blue-400 dark:bg-blue-950/30 dark:text-blue-200 print:mt-3 print:border-l-4 print:border-blue-700 print:bg-blue-50/50 print:p-2.5 print:text-[11px] print:text-blue-950">
        <div className="flex items-start gap-2">
          <FileText className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5 print:text-blue-700" />
          <div>
            <span className="font-bold">
              Pengantar Hasil Penjaringan Aspirasi Digital:
            </span>
            <p className="mt-1 mb-0 leading-relaxed text-xs opacity-90 print:text-[11px]">
              {summary.executiveNotes}
            </p>
          </div>
        </div>
      </div>

      {/* Strategic Recommendations for Musrenbangdes */}
      <div className="mt-6 space-y-4 print:mt-4 print:space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-800 print:border-slate-300 print:pb-1.5">
          <h3 className="m-0 text-sm font-bold text-slate-900 dark:text-slate-100 print:text-xs print:text-black">
            Rekomendasi Prioritas Anggaran & Program Kerja Fisik/Non-Fisik
          </h3>
          <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 print:text-blue-800 print:text-[11px]">
            Sumber: Agregasi Keluhan Riil Warga
          </span>
        </div>

        <div className="space-y-3 print:space-y-2.5">
          {summary.recommendations.map((rec, index) => {
            const urgencyBadge =
              rec.urgency === 'MENDESAK'
                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 print:bg-rose-100 print:text-rose-900 print:border print:border-rose-300'
                : rec.urgency === 'TINGGI'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 print:bg-amber-100 print:text-amber-900 print:border print:border-amber-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 print:bg-blue-100 print:text-blue-900 print:border print:border-blue-300'

            return (
              <div
                key={rec.id}
                className="print-avoid-break rounded-lg border border-slate-200 p-4 text-xs transition-shadow hover:shadow-xs dark:border-slate-800 print:border-slate-300 print:p-3 print:text-[11px] print:shadow-none"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white dark:bg-blue-700 print:bg-blue-800 print:text-white">
                      {index + 1}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-200 print:text-black">
                      {rec.pillar}
                    </span>
                    <span className="flex items-center gap-1 rounded-sm bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400 print:bg-slate-100 print:text-slate-700">
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

                <h4 className="mt-2 mb-1 text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 print:text-xs print:text-black">
                  {rec.title}
                </h4>

                <div className="mt-2 space-y-1.5 text-xs text-slate-600 dark:text-slate-400 print:space-y-1 print:text-[11px] print:text-slate-700">
                  <p className="m-0">
                    <strong className="text-slate-900 dark:text-slate-300 print:text-black">
                      Justifikasi Masalah:
                    </strong>{' '}
                    {rec.justification}
                  </p>
                  <p className="m-0">
                    <strong className="text-slate-900 dark:text-slate-300 print:text-black">
                      Rencana Tindakan:
                    </strong>{' '}
                    {rec.proposedAction}
                  </p>
                  <p className="m-0 text-blue-700 dark:text-blue-400 print:text-blue-900">
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
      <div className="print-signature-block print-avoid-break mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 print:border-slate-300 print:mt-4 print:pt-4">
        <div className="flex flex-col sm:flex-row items-end justify-between gap-6 text-xs print:flex-row print:text-[11px]">
          <div className="space-y-1 text-slate-500 dark:text-slate-400 print:text-slate-600">
            <p className="m-0 font-medium">
              Dokumen ini disahkan sebagai lampiran kerja Musyawarah Perencanaan
              Pembangunan Desa (Musrenbangdes).
            </p>
            <p className="m-0 font-mono text-[11px] print:text-[10px]">
              Dicetak otomatis melalui DesaAI Governance Engine pada:{' '}
              {summary.generatedAt}
            </p>
          </div>

          <div className="w-full sm:w-56 text-center print:w-56 print:shrink-0">
            <p className="m-0 text-slate-600 print:text-slate-700">
              Perbekel Desa Tegal Tugu,
            </p>
            <div className="my-5 flex justify-center print:my-3">
              <div className="flex h-12 w-28 items-center justify-center rounded-sm border border-dashed border-blue-600/40 text-[9px] font-semibold text-blue-700/60 dark:border-blue-400/40 dark:text-blue-300/60 print:border-slate-400 print:text-slate-400">
                [ Tanda Tangan & Cap ]
              </div>
            </div>
            <p className="m-0 font-bold text-slate-900 underline dark:text-slate-100 print:text-black">
              {summary.perbekelName}
            </p>
            <p className="m-0 text-[11px] text-slate-500 dark:text-slate-400 print:text-[10px] print:text-slate-600">
              NIP. 19780512 200501 1 008
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
