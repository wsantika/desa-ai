import { createFileRoute, getRouteApi, Link } from '@tanstack/react-router'
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Clock,
  ShieldCheck,
  Building2,
  BookOpen,
  ArrowRight,
} from 'lucide-react'
import MetricCard from '../../components/admin/MetricCard'
import UrgentComplaintList from '../../components/admin/UrgentComplaintList'
import PendingServiceRequestList from '../../components/admin/PendingServiceRequestList'

const adminRouteApi = getRouteApi('/admin')

export const Route = createFileRoute('/admin/')({
  component: AdminDashboardOverviewPage,
})

function AdminDashboardOverviewPage() {
  const data = adminRouteApi.useLoaderData()
  const { metrics, urgentComplaints, recentServiceRequests } = data

  const totalUrgent =
    metrics.emergencyComplaintsCount + metrics.highPriorityComplaintsCount

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Welcome & Status Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-700 text-white text-xs font-bold dark:bg-blue-600">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              </span>
              <h2 className="m-0 text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Pusat Kendali Administrasi Desa Tegal Tugu
              </h2>
            </div>
            <p className="m-0 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Integrasi layanan persuratan warga, triage keluhan fasilitas cerdas, dan analitik banjar tertutup.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/admin/pengaduan"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              <span>Meja Triage</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <Link
              to="/admin/layanan"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <span>Verifikasi Surat</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Executive Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Laporan Warga"
          value={metrics.totalComplaints}
          description={`${metrics.openComplaints} baru, ${metrics.inProgressComplaints} ditindaklanjuti`}
          icon={AlertCircle}
          tone={totalUrgent > 0 ? 'emergency' : 'default'}
          actionTo="/admin/pengaduan"
          actionLabel="Buka Meja Triage"
        />

        <MetricCard
          title="Tingkat Penyelesaian"
          value={`${metrics.completionRatePercent}%`}
          description={`${metrics.resolvedComplaints} dari ${metrics.totalComplaints} keluhan selesai`}
          icon={CheckCircle2}
          tone="success"
          actionTo="/admin/pengaduan"
          actionLabel="Lihat Arsip Selesai"
        />

        <MetricCard
          title="Permohonan Surat Pending"
          value={metrics.pendingServiceRequests}
          description="Menunggu verifikasi berkas oleh petugas"
          icon={FileText}
          tone={metrics.pendingServiceRequests > 0 ? 'warning' : 'default'}
          actionTo="/admin/layanan"
          actionLabel="Periksa Berkas"
        />

        <MetricCard
          title="Indeks Respons Rata-Rata"
          value={`${metrics.averageResponseHours} Jam`}
          description="Standar layanan respon prima desa < 24 jam"
          icon={Clock}
          tone="default"
          actionTo="/admin/analitik"
          actionLabel="Analisis SLA"
        />
      </div>

      {/* Two-Column Operational Desk */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UrgentComplaintList complaints={urgentComplaints} />
        <PendingServiceRequestList requests={recentServiceRequests} />
      </div>

      {/* Secondary Information & Knowledge Stats */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
              <BookOpen className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="m-0 text-sm font-bold text-slate-900 dark:text-white">
                Pusat Regulasi dan Basis Pengetahuan Desa
              </p>
              <p className="m-0 text-xs text-slate-500 dark:text-slate-400">
                Tersedia {metrics.totalKnowledgeDocs} dokumen resmi terindeks oleh asisten AI desa.
              </p>
            </div>
          </div>

          <Link
            to="/admin/knowledge"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Kelola Basis Pengetahuan</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  )
}
