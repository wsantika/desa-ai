import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import {
  serviceVerificationFilterSchema,
  updateServiceVerificationStatusSchema,
} from '../../src/application/dtos/service-verification.dto.js'
import {
  fetchServiceVerificationData,
  updateServiceRequestStatus,
} from '../../src/application/server-functions/admin-service-verification.fn.js'
import { prisma } from '../../src/infrastructure/db/prisma.js'

async function isDatabaseReachable(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch {
    return false
  }
}

describe('Admin Service Request Verification Desk (Issue #17)', () => {
  const rootDir = process.cwd()
  const verificationComponentsDir = path.join(
    rootDir,
    'src',
    'components',
    'admin',
    'service-verification',
  )
  const routePath = path.join(rootDir, 'src', 'routes', 'admin', 'layanan.tsx')
  const serverFnPath = path.join(
    rootDir,
    'src',
    'application',
    'server-functions',
    'admin-service-verification.fn.ts',
  )
  const dtoPath = path.join(
    rootDir,
    'src',
    'application',
    'dtos',
    'service-verification.dto.ts',
  )

  it('validates serviceVerificationFilterSchema defaults and parsing', () => {
    const emptyParsed = serviceVerificationFilterSchema.parse({})
    assert.equal(emptyParsed.status, 'ALL')
    assert.equal(emptyParsed.serviceCode, 'ALL')
    assert.equal(emptyParsed.search, '')

    const customParsed = serviceVerificationFilterSchema.parse({
      status: 'PENDING',
      serviceCode: 'DOMISILI',
      search: 'REQ-2026',
    })
    assert.equal(customParsed.status, 'PENDING')
    assert.equal(customParsed.serviceCode, 'DOMISILI')
    assert.equal(customParsed.search, 'REQ-2026')
  })

  it('validates updateServiceVerificationStatusSchema constraints', () => {
    // Missing requestId should throw
    assert.throws(
      () =>
        updateServiceVerificationStatusSchema.parse({
          requestId: '',
          status: 'APPROVED',
          notes: 'Dokumen lengkap',
        }),
      /ID permohonan/,
    )

    // Valid approve payload
    const validApprove = updateServiceVerificationStatusSchema.parse({
      requestId: 'req-test-123',
      status: 'APPROVED',
      notes: 'Dokumen lengkap dan valid',
    })
    assert.equal(validApprove.status, 'APPROVED')
    assert.equal(validApprove.requestId, 'req-test-123')

    // Valid revision payload
    const validRevision = updateServiceVerificationStatusSchema.parse({
      requestId: 'req-test-123',
      status: 'REVISION',
      notes: 'KTP buram mohon unggah ulang',
    })
    assert.equal(validRevision.status, 'REVISION')

    // Valid rejection payload
    const validRejection = updateServiceVerificationStatusSchema.parse({
      requestId: 'req-test-123',
      status: 'REJECTED',
      notes: 'Pemohon bukan penduduk Desa Tegal Tugu',
    })
    assert.equal(validRejection.status, 'REJECTED')
  })

  it('validates fetchServiceVerificationData returns expected structure and counters', async () => {
    const isDbConnected = await isDatabaseReachable()
    if (!isDbConnected) {
      console.log('Skipping live database query in offline test environment')
      return
    }

    const data = await fetchServiceVerificationData()
    assert.ok(Array.isArray(data.requests), 'requests must be an array')
    assert.ok(Array.isArray(data.serviceTypes), 'serviceTypes must be an array')
    assert.ok(data.counters, 'counters must be defined')
    assert.equal(typeof data.counters.totalCount, 'number')
    assert.equal(typeof data.counters.pendingCount, 'number')
    assert.equal(typeof data.counters.inReviewCount, 'number')
    assert.equal(typeof data.counters.revisionCount, 'number')
    assert.equal(typeof data.counters.approvedCount, 'number')
    assert.equal(typeof data.counters.rejectedCount, 'number')
  })

  it('validates updateServiceRequestStatus transitions status and logs audit entry', async () => {
    const isDbConnected = await isDatabaseReachable()
    if (!isDbConnected) {
      console.log('Skipping live database mutation in offline test environment')
      return
    }

    const existing = await prisma.serviceRequest.findFirst({
      select: { id: true, status: true },
    })

    if (existing) {
      const targetStatus = existing.status === 'PENDING' ? 'IN_REVIEW' : 'PENDING'
      const testNote = 'Pengujian transisi status verifikasi berkas layanan desa'

      const result = await updateServiceRequestStatus({
        requestId: existing.id,
        status: targetStatus,
        notes: testNote,
      })

      assert.equal(result.success, true)
      assert.equal(result.requestId, existing.id)
      assert.equal(result.newStatus, targetStatus)

      // Verifikasi catatan audit log di tabel ServiceStatusLog
      const latestLog = await prisma.serviceStatusLog.findFirst({
        where: { requestId: existing.id },
        orderBy: { createdAt: 'desc' },
      })
      assert.ok(latestLog, 'ServiceStatusLog must be created')
      assert.equal(latestLog.newStatus, targetStatus)
      assert.equal(latestLog.notes, testNote)
    }
  })

  it('validates verification UI component files exist and export required components', () => {
    const toolbarPath = path.join(
      verificationComponentsDir,
      'ServiceVerificationFilterToolbar.tsx',
    )
    const tablePath = path.join(
      verificationComponentsDir,
      'ServiceVerificationTable.tsx',
    )
    const modalPath = path.join(
      verificationComponentsDir,
      'ServiceVerificationDetailModal.tsx',
    )

    assert.ok(fs.existsSync(toolbarPath), 'ServiceVerificationFilterToolbar.tsx must exist')
    assert.ok(fs.existsSync(tablePath), 'ServiceVerificationTable.tsx must exist')
    assert.ok(fs.existsSync(modalPath), 'ServiceVerificationDetailModal.tsx must exist')
    assert.ok(fs.existsSync(routePath), 'admin/layanan.tsx route must exist')
    assert.ok(fs.existsSync(serverFnPath), 'admin-service-verification.fn.ts must exist')
    assert.ok(fs.existsSync(dtoPath), 'service-verification.dto.ts must exist')

    const toolbarContent = fs.readFileSync(toolbarPath, 'utf-8')
    assert.ok(toolbarContent.includes('export function ServiceVerificationFilterToolbar'))

    const tableContent = fs.readFileSync(tablePath, 'utf-8')
    assert.ok(tableContent.includes('export function ServiceVerificationTable'))

    const modalContent = fs.readFileSync(modalPath, 'utf-8')
    assert.ok(modalContent.includes('export function ServiceVerificationDetailModal'))
  })

  it('validates official letter draft sheet branding and structure in detail modal', () => {
    const modalPath = path.join(
      verificationComponentsDir,
      'ServiceVerificationDetailModal.tsx',
    )
    const content = fs.readFileSync(modalPath, 'utf-8')

    // Verifikasi Kop Surat resmi Desa Tegal Tugu
    assert.ok(content.includes('Pemerintah Kabupaten Gianyar'))
    assert.ok(content.includes('Kecamatan Gianyar'))
    assert.ok(content.includes('Kantor Perbekel Desa Tegal Tugu'))
    assert.ok(content.includes('I NYOMAN SUARDANA'))
    assert.ok(content.includes('TERVERIFIKASI DIGITAL'))
    assert.ok(content.includes('printable-certificate-area'))
  })

  it('validates antislop compliance (zero em dash characters in all verification files)', () => {
    const filesToCheck = [
      serverFnPath,
      dtoPath,
      path.join(verificationComponentsDir, 'ServiceVerificationFilterToolbar.tsx'),
      path.join(verificationComponentsDir, 'ServiceVerificationTable.tsx'),
      path.join(verificationComponentsDir, 'ServiceVerificationDetailModal.tsx'),
      routePath,
    ]

    for (const filePath of filesToCheck) {
      const content = fs.readFileSync(filePath, 'utf-8')
      assert.ok(
        !content.includes('—'),
        `Antislop R-02 violation: em dash found in ${path.basename(filePath)}`,
      )
    }
  })
})
