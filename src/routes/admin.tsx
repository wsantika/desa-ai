import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useState } from 'react'
import AdminSidebar from '../components/admin/AdminSidebar'
import AdminHeader from '../components/admin/AdminHeader'
import { getAdminDashboardSummaryServerFn } from '../application/server-functions/admin-dashboard.fn'
import type { AdminDashboardSummaryData } from '../application/server-functions/admin-dashboard.fn'

export const Route = createFileRoute('/admin')({
  loader: async (): Promise<AdminDashboardSummaryData> => {
    return getAdminDashboardSummaryServerFn()
  },
  component: AdminLayout,
})

function AdminLayout() {
  const data = Route.useLoaderData()
  const [isOpenMobile, setIsOpenMobile] = useState(false)

  const urgentCount =
    (data?.metrics?.emergencyComplaintsCount || 0) +
    (data?.metrics?.highPriorityComplaintsCount || 0)

  const pendingRequestsCount = data?.metrics?.pendingServiceRequests || 0

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Sidebar Navigation */}
      <AdminSidebar
        urgentComplaintsCount={urgentCount}
        pendingRequestsCount={pendingRequestsCount}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
      />

      {/* Main Content Area */}
      <div className="flex min-h-screen flex-col md:pl-64">
        <AdminHeader
          title="Meja Kerja Terpadu Perangkat Desa"
          subtitle="Desa Tegal Tugu, Kec. Gianyar"
          urgentCount={urgentCount}
          onToggleMobileSidebar={() => setIsOpenMobile((prev) => !prev)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
