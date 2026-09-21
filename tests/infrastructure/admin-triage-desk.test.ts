import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import {
  triageFilterSchema,
  updateTriageStatusSchema,
} from '../../src/application/dtos/triage-desk.dto.js'
import {
  fetchTriageDeskData,
  updateTriageComplaintStatus,
} from '../../src/application/server-functions/admin-triage.fn.js'
import { prisma } from '../../src/infrastructure/db/prisma.js'

describe('Admin Triage Desk (AI-Assisted Triage Workspace)', () => {
  const rootDir = process.cwd()
  const triageComponentsDir = path.join(
    rootDir,
    'src',
    'components',
    'admin',
    'triage',
  )
  const routePath = path.join(rootDir, 'src', 'routes', 'admin', 'pengaduan.tsx')
  const serverFnPath = path.join(
    rootDir,
    'src',
    'application',
    'server-functions',
    'admin-triage.fn.ts',
  )

  it('validates triageFilterSchema defaults and parsing', () => {
    const emptyParsed = triageFilterSchema.parse({})
    assert.equal(emptyParsed.status, 'ALL')
    assert.equal(emptyParsed.priority, 'ALL')
    assert.equal(emptyParsed.category, 'ALL')
    assert.equal(emptyParsed.banjarId, 'ALL')
    assert.equal(emptyParsed.search, '')

    const customParsed = triageFilterSchema.parse({
      status: 'OPEN',
      priority: 'EMERGENCY',
      category: 'INFRASTRUKTUR',
      banjarId: 'banjar-1',
      search: 'lampu jalan',
    })
    assert.equal(customParsed.status, 'OPEN')
    assert.equal(customParsed.priority, 'EMERGENCY')
    assert.equal(customParsed.category, 'INFRASTRUKTUR')
    assert.equal(customParsed.search, 'lampu jalan')
  })

  it('validates updateTriageStatusSchema constraints', () => {
    // Should fail when notes are too short (< 3 chars)
    assert.throws(
      () =>
        updateTriageStatusSchema.parse({
          complaintId: 'cmp-123',
          status: 'IN_PROGRESS',
          notes: 'ok',
        }),
      /Catatan/,
    )

    // Should fail when complaintId is empty
    assert.throws(
      () =>
        updateTriageStatusSchema.parse({
          complaintId: '',
          status: 'IN_PROGRESS',
          notes: 'Sedang ditindaklanjuti oleh satgas',
        }),
      /ID pengaduan/,
    )

    // Valid payload
    const valid = updateTriageStatusSchema.parse({
      complaintId: 'cmp-valid-1',
      status: 'RESOLVED',
      notes: 'Lampu penerangan jalan telah diganti dan menyala normal',
      proofPhotoUrl: 'https://example.com/proof.jpg',
    })
    assert.equal(valid.status, 'RESOLVED')
    assert.equal(valid.proofPhotoUrl, 'https://example.com/proof.jpg')
  })

  it('validates fetchTriageDeskData returns expected structure and metrics', async () => {
    const data = await fetchTriageDeskData()
    assert.ok(Array.isArray(data.complaints), 'complaints must be an array')
    assert.ok(Array.isArray(data.banjars), 'banjars must be an array')
    assert.ok(data.counters, 'counters must be defined')
    assert.equal(typeof data.counters.totalCount, 'number')
    assert.equal(typeof data.counters.emergencyCount, 'number')
    assert.equal(typeof data.counters.openCount, 'number')
    assert.equal(typeof data.counters.inProgressCount, 'number')
    assert.equal(typeof data.counters.resolvedCount, 'number')
    assert.equal(typeof data.counters.rejectedCount, 'number')
  })

  it('validates updateTriageComplaintStatus transitions status and writes audit log', async () => {
    // 1. Ambil atau buat data pengaduan untuk pengujian
    const existing = await prisma.complaint.findFirst({
      select: { id: true, status: true },
    })

    if (existing) {
      const targetStatus =
        existing.status === 'IN_PROGRESS' ? 'RESOLVED' : 'IN_PROGRESS'
      const testNote = 'Pengujian transisi status otomatis meja kerja triage'

      const result = await updateTriageComplaintStatus({
        complaintId: existing.id,
        status: targetStatus,
        notes: testNote,
      })

      assert.equal(result.success, true)
      assert.equal(result.complaintId, existing.id)
      assert.equal(result.newStatus, targetStatus)

      // Verifikasi statusLog tercipta
      const latestLog = await prisma.complaintLog.findFirst({
        where: { complaintId: existing.id },
        orderBy: { createdAt: 'desc' },
      })
      assert.ok(latestLog, 'status log must be created')
      assert.equal(latestLog.newStatus, targetStatus)
      assert.equal(latestLog.actionNote, testNote)
    }
  })

  it('validates triage UI component files exist and export required components', () => {
    const toolbarPath = path.join(triageComponentsDir, 'TriageFilterToolbar.tsx')
    const tablePath = path.join(triageComponentsDir, 'TriageComplaintTable.tsx')
    const modalPath = path.join(triageComponentsDir, 'TriageDetailModal.tsx')

    assert.ok(fs.existsSync(toolbarPath), 'TriageFilterToolbar.tsx must exist')
    assert.ok(fs.existsSync(tablePath), 'TriageComplaintTable.tsx must exist')
    assert.ok(fs.existsSync(modalPath), 'TriageDetailModal.tsx must exist')
    assert.ok(fs.existsSync(routePath), 'pengaduan.tsx route must exist')
    assert.ok(fs.existsSync(serverFnPath), 'admin-triage.fn.ts must exist')

    const toolbarContent = fs.readFileSync(toolbarPath, 'utf-8')
    assert.ok(toolbarContent.includes('export function TriageFilterToolbar'))

    const tableContent = fs.readFileSync(tablePath, 'utf-8')
    assert.ok(tableContent.includes('export function TriageComplaintTable'))

    const modalContent = fs.readFileSync(modalPath, 'utf-8')
    assert.ok(modalContent.includes('export function TriageDetailModal'))
  })

  it('validates antislop compliance (no em dash characters in triage desk files)', () => {
    const filesToCheck = [
      serverFnPath,
      path.join(triageComponentsDir, 'TriageFilterToolbar.tsx'),
      path.join(triageComponentsDir, 'TriageComplaintTable.tsx'),
      path.join(triageComponentsDir, 'TriageDetailModal.tsx'),
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
