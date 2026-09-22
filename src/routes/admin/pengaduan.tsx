import { useState, useMemo } from 'react'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { ArrowLeft, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react'
import {
  fetchTriageDeskDataServerFn,
  updateTriageComplaintStatusServerFn,
} from '../../application/server-functions/admin-triage.fn.js'
import type {
  TriageComplaintItem,
  TriageDeskData,
} from '../../application/server-functions/admin-triage.fn.js'
import type { TriageFilterDTO } from '../../application/dtos/triage-desk.dto.js'
import type { ComplaintStatus } from '../../domain/entities/complaint.entity.js'
import { TriageFilterToolbar } from '../../components/admin/triage/TriageFilterToolbar.js'
import { TriageComplaintTable } from '../../components/admin/triage/TriageComplaintTable.js'
import { TriageDetailModal } from '../../components/admin/triage/TriageDetailModal.js'

export const Route = createFileRoute('/admin/pengaduan')({
  loader: async (): Promise<TriageDeskData> => {
    return fetchTriageDeskDataServerFn()
  },
  component: AdminPengaduanDeskPage,
})

const defaultFilter: TriageFilterDTO = {
  status: 'ALL',
  priority: 'ALL',
  category: 'ALL',
  banjarId: 'ALL',
  search: '',
}

function AdminPengaduanDeskPage() {
  const initialData = Route.useLoaderData()
  const router = useRouter()

  const [filter, setFilter] = useState<TriageFilterDTO>(defaultFilter)
  const [selectedComplaint, setSelectedComplaint] =
    useState<TriageComplaintItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Client-side instant filter on loader data for smooth, reactive UX
  const filteredComplaints = useMemo(() => {
    return initialData.complaints.filter((item) => {
      // 1. Filter Status
      if (filter.status !== 'ALL' && item.status !== filter.status) {
        return false
      }

      // 2. Filter Priority
      if (filter.priority !== 'ALL' && item.priority !== filter.priority) {
        return false
      }

      // 3. Filter Category
      if (filter.category !== 'ALL' && item.category !== filter.category) {
        return false
      }

      // 4. Filter Banjar
      if (filter.banjarId !== 'ALL' && item.banjarId !== filter.banjarId) {
        return false
      }

      // 5. Search query
      if (filter.search.trim().length > 0) {
        const q = filter.search.toLowerCase().trim()
        const matchTicket = item.ticketCode.toLowerCase().includes(q)
        const matchTitle = item.title.toLowerCase().includes(q)
        const matchDesc = item.description.toLowerCase().includes(q)
        const matchReporter = item.reporterName.toLowerCase().includes(q)
        const matchLoc = item.specificLocation.toLowerCase().includes(q)
        const matchBanjar = item.banjarName.toLowerCase().includes(q)

        if (
          !matchTicket &&
          !matchTitle &&
          !matchDesc &&
          !matchReporter &&
          !matchLoc &&
          !matchBanjar
        ) {
          return false
        }
      }

      return true
    })
  }, [initialData.complaints, filter])

  const handleFilterChange = (updates: Partial<TriageFilterDTO>) => {
    setFilter((prev) => ({ ...prev, ...updates }))
  }

  const handleResetFilter = () => {
    setFilter(defaultFilter)
  }

  const handleOpenDetail = (complaint: TriageComplaintItem) => {
    setSelectedComplaint(complaint)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedComplaint(null)
  }

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true)
      await router.invalidate()
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleStatusUpdate = async (params: {
    complaintId: string
    status: ComplaintStatus
    notes: string
    proofPhotoUrl?: string | null
  }) => {
    await updateTriageComplaintStatusServerFn({
      data: {
        complaintId: params.complaintId,
        status: params.status,
        notes: params.notes,
        proofPhotoUrl: params.proofPhotoUrl,
      },
    })
    // Invalidate route to refresh dataset with new audit trail
    await router.invalidate()
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke Ringkasan Eksekutif</span>
            </Link>
          </div>

          <div className="mt-1 flex items-center gap-2">
            <h2 className="m-0 text-xl font-bold tracking-tight text-[var(--sea-ink,#1b2a26)] dark:text-stone-100">
              Meja Kerja Triage Pengaduan Warga
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
              <Sparkles className="h-3 w-3" />
              <span>AI Assisted</span>
            </span>
          </div>

          <p className="mt-1 mb-0 text-xs text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
            Pemilahan terintegrasi keluhan masyarakat berbasis analisis skor urgensi dan rekomendasi tindakan cerdas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] px-3 py-2 text-xs font-semibold text-[var(--sea-ink,#1b2a26)] shadow-xs hover:bg-black/5 disabled:opacity-50 dark:border-[#22352f] dark:bg-[#182622] dark:text-stone-200"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            <span>Perbarui Data</span>
          </button>
        </div>
      </div>

      {/* Emergency Attention Alert if Any Unhandled Emergencies */}
      {initialData.counters.emergencyCount > 0 && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-red-300 bg-red-50 p-4 dark:border-red-900/60 dark:bg-red-950/30">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-600 text-white shadow-xs dark:bg-red-700">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-red-950 dark:text-red-200">
                Perhatian: {initialData.counters.emergencyCount} Pengaduan Darurat Memerlukan Respon Segera
              </div>
              <p className="mt-0.5 mb-0 text-xs text-red-900/80 dark:text-red-300">
                Kecerdasan buatan mendeteksi risiko keselamatan publik atau kerusakan infrastruktur vital.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              handleFilterChange({ priority: 'EMERGENCY', status: 'ALL' })
            }
            className="shrink-0 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
          >
            Tampilkan Darurat Saja
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <TriageFilterToolbar
        filter={filter}
        counters={initialData.counters}
        banjars={initialData.banjars}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilter}
      />

      {/* Complaints Table & Mobile Cards */}
      <TriageComplaintTable
        complaints={filteredComplaints}
        onSelectComplaint={handleOpenDetail}
        onResetFilter={handleResetFilter}
      />

      {/* Detail & Action Modal */}
      <TriageDetailModal
        complaint={selectedComplaint}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  )
}
