import { useState, useMemo } from 'react'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { ArrowLeft, FileCheck, RefreshCw, AlertCircle } from 'lucide-react'
import {
  fetchServiceVerificationDataServerFn,
  updateServiceRequestStatusServerFn,
} from '../../application/server-functions/admin-service-verification.fn.js'
import type {
  ServiceVerificationDeskData,
  ServiceVerificationItem,
} from '../../application/server-functions/admin-service-verification.fn.js'
import type { ServiceVerificationFilterDTO } from '../../application/dtos/service-verification.dto.js'
import type { ServiceRequestStatus } from '../../domain/entities/service-request.entity.js'
import { ServiceVerificationFilterToolbar } from '../../components/admin/service-verification/ServiceVerificationFilterToolbar.js'
import { ServiceVerificationTable } from '../../components/admin/service-verification/ServiceVerificationTable.js'
import { ServiceVerificationDetailModal } from '../../components/admin/service-verification/ServiceVerificationDetailModal.js'

export const Route = createFileRoute('/admin/layanan')({
  loader: async (): Promise<ServiceVerificationDeskData> => {
    return fetchServiceVerificationDataServerFn()
  },
  component: AdminLayananDeskPage,
})

const defaultFilter: ServiceVerificationFilterDTO = {
  status: 'ALL',
  serviceCode: 'ALL',
  search: '',
}

function AdminLayananDeskPage() {
  const initialData = Route.useLoaderData()
  const router = useRouter()

  const [filter, setFilter] = useState<ServiceVerificationFilterDTO>(defaultFilter)
  const [selectedRequest, setSelectedRequest] = useState<ServiceVerificationItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Reaktif client-side filter di atas data loader untuk penelusuran instan
  const filteredRequests = useMemo(() => {
    return initialData.requests.filter((item) => {
      // 1. Status Filter
      if (filter.status !== 'ALL' && item.status !== filter.status) {
        return false
      }

      // 2. Service Code Filter
      if (filter.serviceCode !== 'ALL' && item.serviceTypeCode !== filter.serviceCode) {
        return false
      }

      // 3. Search Query Filter
      if (filter.search && filter.search.trim().length > 0) {
        const q = filter.search.toLowerCase().trim()
        const matchTracking = item.trackingCode.toLowerCase().includes(q)
        const matchName = item.applicantName.toLowerCase().includes(q)
        const matchNik = item.applicantNik.toLowerCase().includes(q)
        const matchPurpose = item.purpose.toLowerCase().includes(q)
        const matchType = item.serviceTypeTitle.toLowerCase().includes(q)

        if (!matchTracking && !matchName && !matchNik && !matchPurpose && !matchType) {
          return false
        }
      }

      return true
    })
  }, [initialData.requests, filter])

  const handleFilterChange = (updates: Partial<ServiceVerificationFilterDTO>) => {
    setFilter((prev) => ({ ...prev, ...updates }))
  }

  const handleResetFilter = () => {
    setFilter(defaultFilter)
  }

  const handleOpenDetail = (request: ServiceVerificationItem) => {
    setSelectedRequest(request)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedRequest(null)
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
    requestId: string
    status: ServiceRequestStatus
    notes?: string
  }) => {
    await updateServiceRequestStatusServerFn({
      data: {
        requestId: params.requestId,
        status: params.status,
        notes: params.notes,
      },
    })
    // Segarkan data antrean setelah mutasi sukses
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
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 dark:text-emerald-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke Ringkasan Eksekutif</span>
            </Link>
          </div>

          <div className="mt-1 flex items-center gap-2">
            <h2 className="m-0 text-xl font-bold tracking-tight text-[var(--sea-ink,#1b2a26)] dark:text-stone-100">
              Meja Kerja Verifikasi dan Persetujuan Surat Layanan
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
              <FileCheck className="h-3 w-3" />
              <span>Layanan Terpadu</span>
            </span>
          </div>

          <p className="mt-1 mb-0 text-xs text-[var(--sea-ink-soft,#576c64)] dark:text-stone-400">
            Pemeriksaan dokumen persyaratan, verifikasi berkas pemohon, dan penerbitan draf surat resmi warga Desa Tegal Tugu.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--line,#d5ded9)] bg-[var(--surface-primary,#ffffff)] px-3 py-2 text-xs font-semibold text-[var(--sea-ink,#1b2a26)] shadow-xs hover:bg-black/5 disabled:opacity-50 dark:border-[#22352f] dark:bg-[#182622] dark:text-stone-200"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Perbarui Data</span>
          </button>
        </div>
      </div>

      {/* Alert banner jika ada permohonan baru yang butuh verifikasi */}
      {initialData.counters.pendingCount > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-amber-900/60 dark:bg-amber-950/30">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-600 text-white shadow-xs dark:bg-amber-700">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-amber-950 dark:text-amber-200">
                Pemberitahuan: {initialData.counters.pendingCount} Permohonan Surat Menunggu Verifikasi
              </div>
              <p className="mt-0.5 mb-0 text-xs text-amber-900/80 dark:text-amber-300">
                Segera periksa kelengkapan lampiran persyaratan pemohon untuk menjaga kepatuhan standar pelayanan.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleFilterChange({ status: 'PENDING', serviceCode: 'ALL' })}
            className="shrink-0 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800"
          >
            Tampilkan Menunggu Saja
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <ServiceVerificationFilterToolbar
        filter={filter}
        counters={initialData.counters}
        serviceTypes={initialData.serviceTypes}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilter}
      />

      {/* Requests Table and Mobile Cards */}
      <ServiceVerificationTable
        requests={filteredRequests}
        onSelectRequest={handleOpenDetail}
      />

      {/* Detail, Action, and Printable Draft Modal */}
      <ServiceVerificationDetailModal
        request={selectedRequest}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  )
}
