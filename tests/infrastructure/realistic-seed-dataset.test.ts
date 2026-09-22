import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { banjarsSeedData } from '../../prisma/seed-data/banjars.data.js'
import { serviceTypesSeedData } from '../../prisma/seed-data/service-types.data.js'
import { usersSeedData } from '../../prisma/seed-data/users.data.js'
import { complaintsSeedData } from '../../prisma/seed-data/complaints.data.js'
import { serviceRequestsSeedData } from '../../prisma/seed-data/service-requests.data.js'
import { knowledgeSeedData } from '../../prisma/seed-data/knowledge.data.js'

describe('Realistic Seed Dataset Validation (Desa Tegal Tugu, Bali)', () => {
  describe('1. Banjar Adat & Dinas Dataset (Bali Context)', () => {
    it('contains all 5 designated local banjars of Desa Tegal Tugu', () => {
      assert.equal(banjarsSeedData.length, 5, 'Must contain exactly 5 banjars')

      const expectedBanjars = [
        { id: 'banjar-kaja', name: 'Banjar Kaja' },
        { id: 'banjar-kelod', name: 'Banjar Kelod' },
        { id: 'banjar-tengah', name: 'Banjar Tengah' },
        { id: 'banjar-kangin', name: 'Banjar Kangin' },
        { id: 'banjar-kauh', name: 'Banjar Kauh' },
      ]

      for (const expected of expectedBanjars) {
        const found = banjarsSeedData.find((b) => b.id === expected.id)
        assert.ok(found, `Missing banjar with id ${expected.id}`)
        assert.equal(found.name, expected.name)
        assert.ok(found.dusun, `Banjar ${expected.name} must have a dusun`)
        assert.ok(
          found.leaderName.length > 5,
          `Banjar ${expected.name} must have a realistic leader name`,
        )
        assert.ok(
          /^08\d{8,11}$/.test(found.leaderPhone),
          `Banjar ${expected.name} must have a valid phone number`,
        )
      }
    })
  })

  describe('2. Citizen & User Profiles Distribution', () => {
    it('has citizens representing all 5 banjars with valid identity data', () => {
      const citizens = usersSeedData.filter((u) => u.role === 'CITIZEN')
      assert.ok(
        citizens.length >= 5,
        `Must have at least 5 citizens, found ${citizens.length}`,
      )

      const citizenBanjarIds = new Set(citizens.map((c) => c.profile.banjarId))
      for (const b of banjarsSeedData) {
        assert.ok(
          citizenBanjarIds.has(b.id),
          `Banjar ${b.id} must be represented by at least one citizen`,
        )
      }

      for (const c of citizens) {
        assert.match(
          c.profile.nik,
          /^51\d{14}$/,
          `Citizen ${c.profile.fullName} must have a valid 16-digit Bali NIK starting with 51`,
        )
        assert.ok(
          c.profile.occupation.length > 3,
          `Citizen ${c.profile.fullName} must have a realistic occupation`,
        )
      }
    })
  })

  describe('3. Service Requests Dataset (10+ Requests with All Statuses)', () => {
    it('meets minimum count of 10+ service requests', () => {
      assert.ok(
        serviceRequestsSeedData.length >= 10,
        `Must have at least 10 service requests, found ${serviceRequestsSeedData.length}`,
      )
    })

    it('covers all 4 service types in catalog', () => {
      const validServiceTypeIds = new Set(
        serviceTypesSeedData.map((st) => st.id),
      )
      const usedServiceTypeIds = new Set(
        serviceRequestsSeedData.map((r) => r.serviceTypeId),
      )

      for (const stId of validServiceTypeIds) {
        assert.ok(
          usedServiceTypeIds.has(stId),
          `Service type ${stId} must be present in seeded requests`,
        )
      }
    })

    it('covers all 5 service request statuses', () => {
      const allStatuses = [
        'PENDING',
        'IN_REVIEW',
        'REVISION',
        'APPROVED',
        'REJECTED',
      ] as const
      const usedStatuses = new Set(serviceRequestsSeedData.map((r) => r.status))

      for (const st of allStatuses) {
        assert.ok(
          usedStatuses.has(st),
          `Status ${st} must be present in seeded service requests`,
        )
      }
    })

    it('validates tracking code format, attachments, and audit logs', () => {
      const userIds = new Set(usersSeedData.map((u) => u.id))
      const trackingCodes = new Set<string>()

      for (const req of serviceRequestsSeedData) {
        assert.match(
          req.trackingCode,
          /^REQ-\d{6}-\d{4}$/,
          `Tracking code format must match REQ-YYYYMM-XXXX: ${req.trackingCode}`,
        )
        assert.ok(
          !trackingCodes.has(req.trackingCode),
          `Duplicate tracking code: ${req.trackingCode}`,
        )
        trackingCodes.add(req.trackingCode)

        assert.ok(
          userIds.has(req.userId),
          `Request ${req.trackingCode} references nonexistent userId: ${req.userId}`,
        )
        assert.ok(
          req.applicantName.length > 2,
          'Applicant name must be present',
        )
        assert.match(req.applicantNik, /^51\d{14}$/, 'Applicant NIK must be valid')
        assert.ok(req.purpose.length > 10, 'Request purpose must be descriptive')

        // Attachments
        assert.ok(
          req.attachments.length > 0,
          `Request ${req.trackingCode} must have at least one attachment`,
        )
        for (const att of req.attachments) {
          assert.ok(att.fileName, 'Attachment must have fileName')
          assert.ok(att.fileUrl.startsWith('https://'), 'fileUrl must be HTTPS')
          assert.ok(att.fileType, 'Attachment must have fileType')
        }

        // Status logs
        assert.ok(
          req.statusLogs.length > 0,
          `Request ${req.trackingCode} must have status transition logs`,
        )
        for (const log of req.statusLogs) {
          assert.ok(log.newStatus, 'Log must have newStatus')
          assert.ok(log.createdAt, 'Log must have createdAt date')
        }

        if (req.status === 'APPROVED') {
          assert.ok(
            req.completedAt,
            `Approved request ${req.trackingCode} must have completedAt`,
          )
          assert.ok(
            req.completedAt.getTime() >= req.createdAt.getTime(),
            'completedAt must be after createdAt',
          )
          assert.ok(
            req.officerNotes,
            `Approved request ${req.trackingCode} must have officerNotes`,
          )
        }
      }
    })
  })

  describe('4. Complaints Dataset (15+ Real Bali Village Cases)', () => {
    it('meets minimum count of 15+ complaints', () => {
      assert.ok(
        complaintsSeedData.length >= 15,
        `Must have at least 15 complaints, found ${complaintsSeedData.length}`,
      )
    })

    it('covers all 5 banjars including Banjar Kauh', () => {
      const banjarIdsWithComplaints = new Set(
        complaintsSeedData.map((c) => c.banjarId),
      )
      for (const b of banjarsSeedData) {
        assert.ok(
          banjarIdsWithComplaints.has(b.id),
          `Banjar ${b.id} must have at least one complaint`,
        )
      }
    })

    it('covers all complaint categories and statuses', () => {
      const allCategories = [
        'INFRASTRUKTUR',
        'KEBERSIHAN_LINGKUNGAN',
        'KEAMANAN_KETERTIBAN',
        'PELAYANAN_PUBLIK',
        'BANTUAN_SOSIAL',
        'LAINNYA',
      ]
      const allStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED']
      const allPriorities = ['EMERGENCY', 'HIGH', 'MEDIUM', 'LOW']

      const usedCategories = new Set(complaintsSeedData.map((c) => c.category))
      const usedStatuses = new Set(complaintsSeedData.map((c) => c.status))
      const usedPriorities = new Set(complaintsSeedData.map((c) => c.priority))

      for (const cat of allCategories) {
        assert.ok(usedCategories.has(cat as never), `Category ${cat} must be used`)
      }
      for (const st of allStatuses) {
        assert.ok(usedStatuses.has(st as never), `Status ${st} must be used`)
      }
      for (const p of allPriorities) {
        assert.ok(usedPriorities.has(p as never), `Priority ${p} must be used`)
      }
    })

    it('includes specific real-world Bali issues from requirements', () => {
      const descriptions = complaintsSeedData
        .map((c) => `${c.title} ${c.description}`.toLowerCase())
        .join(' ')

      // Lampu penerangan mati
      assert.ok(
        descriptions.includes('lampu') && descriptions.includes('padam') || descriptions.includes('mati'),
        'Must contain street light complaints',
      )

      // Jalan berlubang / rusak / amblas
      assert.ok(
        descriptions.includes('jalan'),
        'Must contain damaged road complaints',
      )

      // Pohon tumbang / dahan
      assert.ok(
        descriptions.includes('pohon') && (descriptions.includes('tumbang') || descriptions.includes('lapuk') || descriptions.includes('dahan')),
        'Must contain falling tree complaints',
      )

      // Sampah di irigasi subak
      assert.ok(
        descriptions.includes('subak') && descriptions.includes('sampah'),
        'Must contain subak irrigation waste complaints',
      )
    })
  })

  describe('5. Village Knowledge Base & SOPs (Desa Tegal Tugu Branding)', () => {
    it('standardizes branding to Desa Tegal Tugu and reflects 5 banjars', () => {
      assert.ok(
        knowledgeSeedData.length >= 4,
        `Must have at least 4 knowledge docs, found ${knowledgeSeedData.length}`,
      )

      const profileDoc = knowledgeSeedData.find(
        (d) => d.category === 'PROFIL_DESA',
      )
      assert.ok(profileDoc, 'Must contain PROFIL_DESA document')
      assert.ok(
        profileDoc.contentText.includes('Tegal Tugu'),
        'Profile must mention Desa Tegal Tugu',
      )
      assert.ok(
        profileDoc.contentText.includes('5 Banjar'),
        'Profile must mention 5 banjars',
      )

      const sopDocs = knowledgeSeedData.filter(
        (d) => d.category === 'SOP_LAYANAN',
      )
      assert.ok(
        sopDocs.length >= 1,
        'Must contain real village SOP documents for RAG',
      )
      for (const sop of sopDocs) {
        assert.ok(sop.chunks.length > 0, 'SOP must have chunked text for RAG embeddings')
      }
    })
  })
})
