import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

describe('Issue #15: Government Dashboard Integrated Layout & Workspace', () => {
  const rootDir = process.cwd()
  const routesDir = path.join(rootDir, 'src', 'routes')
  const componentsDir = path.join(rootDir, 'src', 'components', 'admin')
  const serverFnPath = path.join(
    rootDir,
    'src',
    'application',
    'server-functions',
    'admin-dashboard.fn.ts',
  )
  const routeTreePath = path.join(rootDir, 'src', 'routeTree.gen.ts')

  it('validates server function for government dashboard metrics exists and exports handler', () => {
    assert.ok(fs.existsSync(serverFnPath), 'admin-dashboard.fn.ts must exist')
    const content = fs.readFileSync(serverFnPath, 'utf-8')

    assert.ok(
      content.includes('export const getAdminDashboardSummaryServerFn'),
      'must export getAdminDashboardSummaryServerFn',
    )
    assert.ok(
      content.includes('emergencyComplaintsCount'),
      'must calculate emergency complaints count',
    )
    assert.ok(
      content.includes('pendingServiceRequests'),
      'must calculate pending service requests count',
    )
    assert.ok(
      content.includes('averageResponseHours'),
      'must include average response hours index',
    )
  })

  it('validates AdminSidebar component structure, accessibility, and emergency badges', () => {
    const sidebarPath = path.join(componentsDir, 'AdminSidebar.tsx')
    assert.ok(fs.existsSync(sidebarPath), 'AdminSidebar.tsx must exist')
    const content = fs.readFileSync(sidebarPath, 'utf-8')

    // Navigation items
    assert.ok(content.includes("to: '/admin'"), 'must link to executive overview')
    assert.ok(
      content.includes("to: '/admin/pengaduan'"),
      'must link to complaint triage desk',
    )
    assert.ok(
      content.includes("to: '/admin/layanan'"),
      'must link to service request verification desk',
    )
    assert.ok(
      content.includes("to: '/admin/analitik'"),
      'must link to village analytics desk',
    )
    assert.ok(
      content.includes("to: '/admin/knowledge'"),
      'must link to village knowledge base desk',
    )

    // Urgency badges & Tone
    assert.ok(content.includes('urgentComplaintsCount'), 'must accept urgent complaints count')
    assert.ok(content.includes('pendingRequestsCount'), 'must accept pending requests count')
    assert.ok(content.includes('bg-red-600'), 'must render red badge for emergency triage')
    assert.ok(content.includes('bg-amber-600'), 'must render amber badge for pending requests')

    // Accessibility and mobile drawer
    assert.ok(content.includes('isOpenMobile'), 'must support responsive mobile drawer')
    assert.ok(content.includes('aria-label='), 'must provide aria-label for accessibility')
  })

  it('validates AdminHeader component with AI intelligence status and live WITA clock', () => {
    const headerPath = path.join(componentsDir, 'AdminHeader.tsx')
    assert.ok(fs.existsSync(headerPath), 'AdminHeader.tsx must exist')
    const content = fs.readFileSync(headerPath, 'utf-8')

    assert.ok(content.includes('AI Triage Aktif'), 'must show real-time AI triage status indicator')
    assert.ok(content.includes('Asia/Makassar'), 'must format clock in WITA (Bali) time zone')
    assert.ok(content.includes('onToggleMobileSidebar'), 'must provide mobile drawer toggle')
  })

  it('validates MetricCard, UrgentComplaintList, and PendingServiceRequestList components', () => {
    const metricCardPath = path.join(componentsDir, 'MetricCard.tsx')
    const urgentListPath = path.join(componentsDir, 'UrgentComplaintList.tsx')
    const pendingListPath = path.join(componentsDir, 'PendingServiceRequestList.tsx')

    assert.ok(fs.existsSync(metricCardPath), 'MetricCard.tsx must exist')
    assert.ok(fs.existsSync(urgentListPath), 'UrgentComplaintList.tsx must exist')
    assert.ok(fs.existsSync(pendingListPath), 'PendingServiceRequestList.tsx must exist')

    const urgentContent = fs.readFileSync(urgentListPath, 'utf-8')
    assert.ok(
      urgentContent.includes('Antrean Triage Pengaduan Kritis'),
      'UrgentComplaintList must show proper title',
    )
    assert.ok(
      urgentContent.includes('DARURAT') && urgentContent.includes('TINGGI'),
      'UrgentComplaintList must render priority badges',
    )

    const pendingContent = fs.readFileSync(pendingListPath, 'utf-8')
    assert.ok(
      pendingContent.includes('Antrean Verifikasi Surat Layanan'),
      'PendingServiceRequestList must show proper title',
    )
  })

  it('validates TanStack router registration for all admin routes in routeTree.gen.ts', () => {
    assert.ok(fs.existsSync(routeTreePath), 'routeTree.gen.ts must exist')
    const content = fs.readFileSync(routeTreePath, 'utf-8')

    assert.ok(content.includes('/admin'), 'routeTree must register /admin layout')
    assert.ok(content.includes('/admin/'), 'routeTree must register /admin/ index route')
    assert.ok(
      content.includes('/admin/pengaduan'),
      'routeTree must register /admin/pengaduan route',
    )
    assert.ok(
      content.includes('/admin/layanan'),
      'routeTree must register /admin/layanan route',
    )
    assert.ok(
      content.includes('/admin/analitik'),
      'routeTree must register /admin/analitik route',
    )
    assert.ok(
      content.includes('/admin/knowledge'),
      'routeTree must register /admin/knowledge route',
    )
  })

  it('validates antislop compliance (no em dash character in dashboard files)', () => {
    const filesToCheck = [
      path.join(componentsDir, 'AdminSidebar.tsx'),
      path.join(componentsDir, 'AdminHeader.tsx'),
      path.join(componentsDir, 'MetricCard.tsx'),
      path.join(componentsDir, 'UrgentComplaintList.tsx'),
      path.join(componentsDir, 'PendingServiceRequestList.tsx'),
      path.join(routesDir, 'admin.tsx'),
      path.join(routesDir, 'admin', 'index.tsx'),
    ]

    for (const filePath of filesToCheck) {
      assert.ok(fs.existsSync(filePath), `${filePath} must exist`)
      const content = fs.readFileSync(filePath, 'utf-8')
      assert.ok(
        !content.includes('—'),
        `File ${path.basename(filePath)} must not contain forbidden em dash (—) per antislop rule R-02`,
      )
    }
  })
})
